# Simple PowerShell Static File Web Server
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "OmniAnalytics Web Server running at http://localhost:$port/"
Write-Host "Press Ctrl+C to stop the server."

$currentDir = Get-Location

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $url = $request.Url.LocalPath
        # Prevent path traversal attacks
        if ($url.Contains("..")) {
            $response.StatusCode = 400
            $response.Close()
            continue
        }

        if ($url -eq "/") { 
            $url = "/index.html" 
        }

        # Handle subdirectories correctly
        $cleanedUrl = $url.TrimStart('/')
        $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($currentDir, $cleanedUrl))

        # Check if file exists and is within current directory
        if ($filePath.StartsWith($currentDir) -and (Test-Path $filePath -PathType Leaf)) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            
            if ($ext -eq ".html" -or $ext -eq ".htm") { 
                $contentType = "text/html; charset=utf-8" 
            }
            elseif ($ext -eq ".css") { 
                $contentType = "text/css; charset=utf-8" 
            }
            elseif ($ext -eq ".js") { 
                $contentType = "application/javascript; charset=utf-8" 
            }
            elseif ($ext -eq ".png") { 
                $contentType = "image/png" 
            }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { 
                $contentType = "image/jpeg" 
            }
            elseif ($ext -eq ".svg") { 
                $contentType = "image/svg+xml" 
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1><p>File not found: $url</p>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Error in web server: $_"
} finally {
    $listener.Stop()
    Write-Host "Server stopped."
}
