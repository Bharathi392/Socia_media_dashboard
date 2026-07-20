# OmniAnalytics // Social Media Analytics Dashboard

OmniAnalytics is a premium, glassmorphic, and high-fidelity social media analytics dashboard built using standard web technologies. It allows digital creators and growth marketers to track follower growth, analyze post engagement, evaluate campaign return on ad spend (ROAS), and review demographic splits across multiple social platforms (Twitter/X, Instagram, YouTube, and LinkedIn).

---

## 🌟 Key Features

*   **Multi-Platform Switcher**: Toggle metrics globally or drill down specifically into platform stats. The dashboard theme dynamically changes its accent styling to match each platform's branding colors.
*   **Interactive ROI & Conversion Calculator**: Adjust sliders for campaign spend, CTR (Click-Through Rate), CVR (Conversion Rate), and average sale value to compute CAC, revenue, profit, and visualize the conversion funnel drop-off.
*   **Rich Interactive Visualizations**: Features line area charts for follower growth, donut charts for audience distribution, and demographic bar/radar graphs powered by Chart.js.
*   **Content Analyzer**: A sortable and searchable post performance feed. Filter posts by platform or search by caption/tags.
*   **Live Data Sync Simulation**: Synchronizes data with a simulated server latency (1.5s), triggering random data changes and showing an emerald success notification toast.

---

## 🛠️ Technology Stack

*   **Frontend Core**: HTML5 (Semantic tags, SEO-optimized meta tags)
*   **Styling**: Vanilla CSS3 (Custom properties, CSS grid, flexbox, glassmorphic filters, keyframe animations, custom scrollbars)
*   **Scripting**: Vanilla JavaScript (State management, interactive calculator, search/sorting, Chart.js integrations)
*   **Icons**: Lucide Icons CDN
*   **Charts**: Chart.js CDN

---

## 🚀 Running the Project Locally

Since the project uses absolute pathways and standard asset imports, it is best run on a local HTTP server.

We have included a custom, lightweight PowerShell static server script (`server.ps1`) designed specifically to serve the dashboard without requiring Node.js or Python.

### How to Run:
1. Open terminal or command prompt in the project root directory:
   ```bash
   cd "C:\Users\VSB_AIDS_C118\.gemini\antigravity\scratch\social-media-analytics-dashboard"
   ```
2. Launch the PowerShell web server:
   ```bash
   powershell -ExecutionPolicy Bypass -File server.ps1
   ```
3. Open your browser and navigate to:
   **[http://localhost:8080](http://localhost:8080)**

To stop the web server, press `Ctrl+C` in your terminal window.

---

## 📂 Project Directory Structure

```text
social-media-analytics-dashboard/
├── assets/
│   ├── profile_avatar.png            # Creator profile avatar asset
│   └── dashboard_card_graphic.png    # Campaign Spotlight graphic asset
├── index.html                        # Main dashboard layout
├── style.css                         # UI Design System & glassmorphic styles
├── app.js                            # Core application logic & state managers
├── server.ps1                        # PowerShell local static web server
└── README.md                         # Project documentation (this file)
```
