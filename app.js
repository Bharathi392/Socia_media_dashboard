/**
 * OmniAnalytics - Social Media Dashboard Analytics Logic
 * Features: Multi-platform Filtering, Chart.js Visualizations, ROI Calculator, Search & Sort
 */

// ==========================================
// APPLICATION STATE
// ==========================================
const state = {
    currentTab: 'overview',
    currentPlatform: 'all',
    currentDateRange: '30d',
    searchQuery: '',
    sortBy: 'date-desc',
    isSyncing: false,
    
    // Campaign ROI calculator variables
    calc: {
        spend: 5000,
        ctr: 2.5,
        cvr: 3.0,
        value: 150
    }
};

// ==========================================
// ANALYTICS DATASET (MOCK METRICS)
// ==========================================
const database = {
    platforms: {
        all: {
            followers: 248900,
            followersChange: 12.4,
            engagement: 4.8,
            engagementChange: 2.1,
            reach: 1250000,
            reachChange: 8.7,
            conversions: 42800,
            conversionsChange: 14.2,
            
            // Age segment distribution (for demographics chart)
            demographics: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                male: [42, 58, 31, 15, 8],
                female: [52, 64, 45, 22, 12]
            },
            
            // Geo split
            geo: [
                { location: 'United States', percentage: 42, count: '104.5K' },
                { location: 'United Kingdom', percentage: 18, count: '44.8K' },
                { location: 'Germany', percentage: 12, count: '29.8K' },
                { location: 'Canada', percentage: 9, count: '22.4K' },
                { location: 'India', percentage: 7, count: '17.4K' }
            ],
            
            // Timeline metrics (Last 7, 30, 90 days representation)
            timeline: {
                '7d': {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    followers: [248200, 248310, 248450, 248510, 248690, 248800, 248900],
                    engagement: [3.8, 4.1, 4.0, 4.5, 5.2, 4.9, 4.8]
                },
                '30d': {
                    labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
                    followers: Array.from({length: 30}, (_, i) => 240000 + (Math.sin(i * 0.3) * 1200) + (i * 300)),
                    engagement: Array.from({length: 30}, (_, i) => 3.5 + (Math.cos(i * 0.4) * 0.8) + (i * 0.03))
                },
                '90d': {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
                    followers: [220000, 222500, 224800, 227000, 230100, 233200, 235900, 238000, 240900, 243500, 246000, 248900],
                    engagement: [3.2, 3.5, 3.4, 3.9, 4.1, 4.0, 4.3, 4.5, 4.2, 4.7, 4.6, 4.8]
                }
            }
        },
        twitter: {
            followers: 68400,
            followersChange: 8.2,
            engagement: 2.9,
            engagementChange: -0.4,
            reach: 380000,
            reachChange: 5.1,
            conversions: 8400,
            conversionsChange: 9.3,
            
            demographics: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                male: [18, 30, 20, 10, 5],
                female: [15, 24, 14, 8, 3]
            },
            geo: [
                { location: 'United States', percentage: 55, count: '37.6K' },
                { location: 'United Kingdom', percentage: 15, count: '10.2K' },
                { location: 'Japan', percentage: 10, count: '6.8K' },
                { location: 'Canada', percentage: 8, count: '5.4K' },
                { location: 'Brazil', percentage: 5, count: '3.4K' }
            ],
            timeline: {
                '7d': {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    followers: [68100, 68150, 68200, 68250, 68300, 68350, 68400],
                    engagement: [2.5, 2.7, 2.6, 3.1, 2.9, 3.0, 2.9]
                },
                '30d': {
                    labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
                    followers: Array.from({length: 30}, (_, i) => 66000 + (Math.sin(i * 0.2) * 400) + (i * 80)),
                    engagement: Array.from({length: 30}, (_, i) => 2.4 + (Math.cos(i * 0.5) * 0.4) + (i * 0.01))
                },
                '90d': {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
                    followers: [61000, 61800, 62400, 63000, 63800, 64500, 65200, 65900, 66500, 67200, 67800, 68400],
                    engagement: [2.1, 2.3, 2.2, 2.5, 2.6, 2.4, 2.7, 2.8, 2.6, 2.9, 2.8, 2.9]
                }
            }
        },
        instagram: {
            followers: 114500,
            followersChange: 18.9,
            engagement: 6.2,
            engagementChange: 4.8,
            reach: 520000,
            reachChange: 14.5,
            conversions: 21500,
            conversionsChange: 21.0,
            
            demographics: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                male: [15, 18, 6, 2, 1],
                female: [28, 32, 18, 6, 2]
            },
            geo: [
                { location: 'United States', percentage: 38, count: '43.5K' },
                { location: 'Canada', percentage: 14, count: '16.0K' },
                { location: 'United Kingdom', percentage: 12, count: '13.7K' },
                { location: 'Australia', percentage: 10, count: '11.4K' },
                { location: 'France', percentage: 8, count: '9.1K' }
            ],
            timeline: {
                '7d': {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    followers: [113800, 113950, 114100, 114250, 114380, 114420, 114500],
                    engagement: [5.6, 5.9, 5.8, 6.4, 6.9, 6.5, 6.2]
                },
                '30d': {
                    labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
                    followers: Array.from({length: 30}, (_, i) => 108000 + (Math.sin(i * 0.4) * 600) + (i * 220)),
                    engagement: Array.from({length: 30}, (_, i) => 5.2 + (Math.cos(i * 0.3) * 0.7) + (i * 0.02))
                },
                '90d': {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
                    followers: [95000, 97000, 98800, 100500, 102500, 104800, 106900, 108500, 110200, 112000, 113500, 114500],
                    engagement: [4.5, 4.9, 4.8, 5.2, 5.4, 5.3, 5.7, 5.9, 5.6, 6.1, 6.0, 6.2]
                }
            }
        },
        youtube: {
            followers: 42000,
            followersChange: 6.5,
            engagement: 8.4,
            engagementChange: 3.2,
            reach: 240000,
            reachChange: 4.8,
            conversions: 9400,
            conversionsChange: 11.2,
            
            demographics: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                male: [8, 9, 4, 2, 1],
                female: [7, 8, 4, 2, 1]
            },
            geo: [
                { location: 'United States', percentage: 40, count: '16.8K' },
                { location: 'India', percentage: 22, count: '9.2K' },
                { location: 'United Kingdom', percentage: 10, count: '4.2K' },
                { location: 'Germany', percentage: 8, count: '3.3K' },
                { location: 'Canada', percentage: 5, count: '2.1K' }
            ],
            timeline: {
                '7d': {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    followers: [41850, 41880, 41910, 41940, 41960, 41980, 42000],
                    engagement: [7.8, 8.0, 7.9, 8.5, 9.2, 8.8, 8.4]
                },
                '30d': {
                    labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
                    followers: Array.from({length: 30}, (_, i) => 40500 + (Math.sin(i * 0.15) * 150) + (i * 50)),
                    engagement: Array.from({length: 30}, (_, i) => 7.5 + (Math.cos(i * 0.25) * 0.6) + (i * 0.02))
                },
                '90d': {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
                    followers: [38000, 38500, 39000, 39400, 39800, 40200, 40600, 41000, 41300, 41600, 41800, 42000],
                    engagement: [6.8, 7.2, 7.0, 7.5, 7.8, 7.6, 8.0, 8.2, 7.9, 8.4, 8.3, 8.4]
                }
            }
        },
        linkedin: {
            followers: 24000,
            followersChange: 15.2,
            engagement: 3.5,
            engagementChange: 1.2,
            reach: 110000,
            reachChange: 12.0,
            conversions: 3500,
            conversionsChange: 18.5,
            
            demographics: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                male: [1, 12, 10, 6, 2],
                female: [2, 10, 8, 4, 1]
            },
            geo: [
                { location: 'United States', percentage: 48, count: '11.5K' },
                { location: 'United Kingdom', percentage: 16, count: '3.8K' },
                { location: 'Germany', percentage: 10, count: '2.4K' },
                { location: 'Canada', percentage: 8, count: '1.9K' },
                { location: 'Netherlands', percentage: 5, count: '1.2K' }
            ],
            timeline: {
                '7d': {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    followers: [23880, 23900, 23920, 23940, 23960, 23980, 24000],
                    engagement: [3.1, 3.3, 3.2, 3.6, 3.8, 3.5, 3.5]
                },
                '30d': {
                    labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
                    followers: Array.from({length: 30}, (_, i) => 22800 + (Math.sin(i * 0.2) * 100) + (i * 40)),
                    engagement: Array.from({length: 30}, (_, i) => 3.0 + (Math.cos(i * 0.2) * 0.3) + (i * 0.01))
                },
                '90d': {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
                    followers: [20500, 20800, 21100, 21400, 21800, 22100, 22400, 22800, 23100, 23400, 23700, 24000],
                    engagement: [2.8, 3.0, 2.9, 3.1, 3.3, 3.1, 3.4, 3.5, 3.3, 3.6, 3.5, 3.5]
                }
            }
        }
    },
    
    // Post Database
    posts: [
        {
            id: 1,
            caption: 'Excited to announce the public beta of our futuristic analytics platform! 🚀 Grab your early slots now.',
            tags: '#analytics #saas #beta',
            platform: 'twitter',
            date: '2026-06-28',
            reach: 48500,
            likes: 1240,
            comments: 182,
            shares: 420,
            engagementRate: 3.8,
            img: 'assets/dashboard_card_graphic.png'
        },
        {
            id: 2,
            caption: 'Designing UI layouts that wow at first glance. What do you prefer: clean light glassmorphism or deep cyber neon dark mode? Let us know in comments.',
            tags: '#design #uxui #darkmode',
            platform: 'instagram',
            date: '2026-06-25',
            reach: 84000,
            likes: 5820,
            comments: 940,
            shares: 1100,
            engagementRate: 9.3,
            img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: 3,
            caption: 'Complete walkthrough: How to automate social media campaigns with Node.js and AI APIs. Full code snippet included.',
            tags: '#programming #nodejs #javascript #automation',
            platform: 'linkedin',
            date: '2026-06-27',
            reach: 32000,
            likes: 1840,
            comments: 342,
            shares: 215,
            engagementRate: 7.5,
            img: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: 4,
            caption: 'Why Vanilla CSS is the ultimate superpower for modern web developers in 2026. 🚀',
            tags: '#css #webdev #frontend',
            platform: 'youtube',
            date: '2026-06-20',
            reach: 125000,
            likes: 9200,
            comments: 1450,
            shares: 2800,
            engagementRate: 10.7,
            img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: 5,
            caption: 'Scaling your growth metrics without breaking the bank. Simple framework you can use.',
            tags: '#marketing #strategy #startups',
            platform: 'linkedin',
            date: '2026-06-18',
            reach: 18500,
            likes: 620,
            comments: 88,
            shares: 45,
            engagementRate: 4.1,
            img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: 6,
            caption: 'Behind the scenes: Crafting pixel-perfect designs under a 48h deadline. Sleep is optional, coffee is mandatory.',
            tags: '#designerlife #studio #vlog',
            platform: 'instagram',
            date: '2026-06-15',
            reach: 42000,
            likes: 2180,
            comments: 194,
            shares: 110,
            engagementRate: 5.9,
            img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: 7,
            caption: 'Quick Update: We just hit 200k users across platforms! A huge thanks to the community. Here are some interesting usage stats.',
            tags: '#milestone #community #stats',
            platform: 'twitter',
            date: '2026-06-10',
            reach: 35000,
            likes: 950,
            comments: 82,
            shares: 140,
            engagementRate: 3.3,
            img: 'assets/dashboard_card_graphic.png'
        }
    ]
};

// ==========================================
// CHART INSTANCES MANAGER
// ==========================================
let growthChartInstance = null;
let shareChartInstance = null;
let radarChartInstance = null;
let demographicsChartInstance = null;

// ==========================================
// CORE FUNCTIONS
// ==========================================

// Utility to format numbers (e.g. 104500 -> 104.5K)
function formatMetric(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Update KPI UI Elements
function updateKpiCards() {
    const data = database.platforms[state.currentPlatform];
    
    // Followers
    document.getElementById('val-followers').innerText = formatMetric(data.followers);
    const badgeF = document.getElementById('badge-followers');
    badgeF.innerText = `${data.followersChange >= 0 ? '+' : ''}${data.followersChange}%`;
    badgeF.className = `kpi-badge ${data.followersChange >= 0 ? 'positive' : 'negative'}`;
    
    // Engagement
    document.getElementById('val-engagement').innerText = `${data.engagement.toFixed(1)}%`;
    const badgeE = document.getElementById('badge-engagement');
    badgeE.innerText = `${data.engagementChange >= 0 ? '+' : ''}${data.engagementChange}%`;
    badgeE.className = `kpi-badge ${data.engagementChange >= 0 ? 'positive' : 'negative'}`;
    
    // Reach
    document.getElementById('val-reach').innerText = formatMetric(data.reach);
    const badgeR = document.getElementById('badge-reach');
    badgeR.innerText = `${data.reachChange >= 0 ? '+' : ''}${data.reachChange}%`;
    badgeR.className = `kpi-badge ${data.reachChange >= 0 ? 'positive' : 'negative'}`;
    
    // Conversions (Revenue Estimate)
    const revVal = data.conversions * 1.5; // Mock logic converting volume to dollars
    document.getElementById('val-conversions').innerText = `$${formatMetric(revVal)}`;
    const badgeC = document.getElementById('badge-conversions');
    badgeC.innerText = `${data.conversionsChange >= 0 ? '+' : ''}${data.conversionsChange}%`;
    badgeC.className = `kpi-badge ${data.conversionsChange >= 0 ? 'positive' : 'negative'}`;
}

// Update Spotlight Campaign Panel
function updateCampaignSpotlight() {
    const data = database.platforms[state.currentPlatform];
    
    // Live update calculations on the spotlight card
    const spotConv = Math.floor(data.conversions * 0.04);
    const spotRoi = Math.floor(data.conversionsChange * 12 + 100);
    
    document.getElementById('spotlight-conversions').innerText = spotConv;
    document.getElementById('spotlight-roi').innerText = `+${spotRoi}%`;
}

// Update demographics geo list bar
function updateGeoList() {
    const geoContainer = document.getElementById('geo-list-container');
    if (!geoContainer) return;
    
    const list = database.platforms[state.currentPlatform].geo;
    
    let html = '';
    list.forEach(item => {
        html += `
            <li class="geo-item">
                <div class="geo-info-row">
                    <span class="geo-location">${item.location}</span>
                    <span class="geo-value">${item.count} (${item.percentage}%)</span>
                </div>
                <div class="geo-bar-container">
                    <div class="geo-bar" style="width: ${item.percentage}%"></div>
                </div>
            </li>
        `;
    });
    geoContainer.innerHTML = html;
}

// Render dynamic content performance table
function renderPostList() {
    const tbody = document.getElementById('posts-tbody');
    if (!tbody) return;
    
    // Filter by platform and search query
    let filteredPosts = database.posts.filter(post => {
        const matchesPlatform = (state.currentPlatform === 'all' || post.platform === state.currentPlatform);
        const matchesSearch = post.caption.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                             post.tags.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesPlatform && matchesSearch;
    });
    
    // Sort
    filteredPosts.sort((a, b) => {
        if (state.sortBy === 'date-desc') {
            return new Date(b.date) - new Date(a.date);
        } else if (state.sortBy === 'reach-desc') {
            return b.reach - a.reach;
        } else if (state.sortBy === 'likes-desc') {
            return b.likes - a.likes;
        } else if (state.sortBy === 'engagement-desc') {
            return b.engagementRate - a.engagementRate;
        }
        return 0;
    });
    
    if (filteredPosts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="text-align: center; padding: 40px; color: var(--text-muted);">No posts found matching current filters.</td></tr>`;
        return;
    }
    
    let html = '';
    filteredPosts.forEach(post => {
        // Rating tag logic
        let ratingClass = 'average';
        let ratingText = 'Average';
        if (post.engagementRate >= 8.0) {
            ratingClass = 'excellent';
            ratingText = 'Excellent';
        } else if (post.engagementRate >= 5.0) {
            ratingClass = 'good';
            ratingText = 'Good';
        }
        
        // Capitalize Platform
        const platformLabel = post.platform.charAt(0).toUpperCase() + post.platform.slice(1);
        const platformIcon = post.platform === 'twitter' ? 'twitter' : 
                             post.platform === 'instagram' ? 'instagram' : 
                             post.platform === 'youtube' ? 'youtube' : 'linkedin';
                             
        html += `
            <tr>
                <td>
                    <div class="table-post-cell">
                        <img src="${post.img}" alt="Thumbnail" class="table-post-img" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'">
                        <div class="table-post-details">
                            <span class="table-post-caption" title="${post.caption}">${post.caption}</span>
                            <span class="table-post-tags">${post.tags}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="table-platform-badge ${post.platform}">
                        <i data-lucide="${platformIcon}"></i>
                        <span>${platformLabel}</span>
                    </span>
                </td>
                <td>${post.date}</td>
                <td class="text-right font-semibold">${formatMetric(post.reach)}</td>
                <td class="text-right">${formatMetric(post.likes)}</td>
                <td class="text-right">${formatMetric(post.comments)}</td>
                <td class="text-right font-semibold">${post.engagementRate}%</td>
                <td>
                    <span class="rating-tag ${ratingClass}">${ratingText}</span>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    
    // Re-initialize Lucide Icons for table cells
    lucide.createIcons();
}

// Live Update ROI Calculator metrics and visual Funnel
function updateROICalculator() {
    const spend = parseFloat(state.calc.spend);
    const ctr = parseFloat(state.calc.ctr) / 100;
    const cvr = parseFloat(state.calc.cvr) / 100;
    const value = parseFloat(state.calc.value);
    
    // Mock base reach/impressions
    const reach = 250000;
    
    // Calculations
    const clicks = Math.floor(reach * ctr);
    const conversions = Math.floor(clicks * cvr);
    const revenue = conversions * value;
    const profit = revenue - spend;
    const cac = conversions > 0 ? (spend / conversions) : 0;
    
    // ROI Percentage calculation
    let roiPct = 0;
    if (spend > 0) {
        roiPct = ((revenue - spend) / spend) * 100;
    }
    
    // Update Text displays
    document.getElementById('calc-roi-pct').innerText = `${roiPct >= 0 ? '+' : ''}${roiPct.toFixed(0)}%`;
    document.getElementById('calc-roi-pct').className = `roi-value-large ${roiPct >= 0 ? 'text-emerald' : 'text-danger'}`;
    
    document.getElementById('calc-revenue').innerText = `$${revenue.toLocaleString()}`;
    document.getElementById('calc-profit').innerText = `$${profit.toLocaleString()}`;
    document.getElementById('calc-conversions').innerText = conversions.toLocaleString();
    document.getElementById('calc-cac').innerText = `$${cac.toFixed(2)}`;
    
    // Update Slider value text tags
    document.getElementById('val-spend-display').innerText = `$${spend.toLocaleString()}`;
    document.getElementById('val-ctr-display').innerText = `${(ctr * 100).toFixed(1)}%`;
    document.getElementById('val-cvr-display').innerText = `${(cvr * 100).toFixed(1)}%`;
    document.getElementById('val-val-display').innerText = `$${value}`;
    
    // Funnel stage width sizing
    const clicksWidth = Math.max(30, Math.min(100, (clicks / reach) * 800)); // normalized scale
    const convWidth = Math.max(15, Math.min(100, (conversions / clicks) * 150));
    
    document.getElementById('funnel-clicks-width').style.width = `${clicksWidth}%`;
    document.getElementById('funnel-conv-width').style.width = `${convWidth}%`;
    
    document.getElementById('funnel-clicks-label').innerText = `Clicks: ${clicks.toLocaleString()}`;
    document.getElementById('funnel-conv-label').innerText = `Conversions: ${conversions.toLocaleString()}`;
}

// ==========================================
// CHART.JS INTEGRATION & BUILDERS
// ==========================================

// Color variables mapped to current body themes
function getPlatformColor() {
    const style = getComputedStyle(document.body);
    return style.getPropertyValue('--platform-accent').trim() || '#f2a93b';
}

function getPlatformColorGlow() {
    const style = getComputedStyle(document.body);
    return style.getPropertyValue('--platform-accent-glow').trim() || 'rgba(242, 169, 59, 0.22)';
}

// 1. Line Area Chart (Growth vs Engagement)
function buildGrowthChart() {
    const ctx = document.getElementById('growthChart');
    if (!ctx) return;
    
    const platformData = database.platforms[state.currentPlatform];
    const timeline = platformData.timeline[state.currentDateRange];
    
    const color = getPlatformColor();
    const glow = getPlatformColorGlow();
    
    if (growthChartInstance) {
        growthChartInstance.destroy();
    }
    
    growthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeline.labels,
            datasets: [
                {
                    label: 'Followers Growth',
                    data: timeline.followers,
                    borderColor: color,
                    backgroundColor: 'rgba(255, 255, 255, 0)', // Translucent fill
                    borderWidth: 3,
                    pointBackgroundColor: color,
                    pointHoverRadius: 7,
                    tension: 0.35,
                    yAxisID: 'y'
                },
                {
                    label: 'Post Engagements',
                    data: timeline.engagement,
                    borderColor: '#37b6ab',
                    backgroundColor: 'rgba(55, 182, 171, 0.05)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#37b6ab',
                    tension: 0.2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#a89c88',
                        font: { family: 'Inter', weight: 'bold' }
                    }
                },
                tooltip: {
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: '#6f6655' }
                },
                y: {
                    position: 'left',
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#a89c88',
                        callback: function(value) { return formatMetric(value); }
                    }
                },
                y1: {
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: {
                        color: '#37b6ab',
                        callback: function(value) { return value.toFixed(1) + '%'; }
                    }
                }
            }
        }
    });
}

// 2. Share Donut Chart (Total Follower Distribution)
function buildShareChart() {
    const ctx = document.getElementById('shareChart');
    if (!ctx) return;
    
    if (shareChartInstance) {
        shareChartInstance.destroy();
    }
    
    // Fixed platform shares
    const platforms = ['Twitter / X', 'Instagram', 'YouTube', 'LinkedIn'];
    const followerData = [68400, 114500, 42000, 24000];
    const colors = ['#4aa9e0', '#e0568c', '#e2493a', '#4a90c2'];
    
    shareChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: platforms,
            datasets: [{
                data: followerData,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a89c88',
                        padding: 20,
                        font: { family: 'Inter', size: 12 }
                    }
                }
            }
        }
    });
}

// 3. Radar Chart (Engagement quality metrics per platform)
function buildRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;
    
    if (radarChartInstance) {
        radarChartInstance.destroy();
    }
    
    // Custom metrics radar split per platform (Likes, Shares, Comments, Link Clicks, Conversions)
    const metrics = ['Likes Weight', 'Shares Weight', 'Comments Weight', 'Clicks Weight', 'Conversions Weight'];
    
    let dataset = [];
    
    if (state.currentPlatform === 'all') {
        dataset = [
            {
                label: 'Instagram',
                data: [90, 70, 85, 60, 50],
                borderColor: '#e0568c',
                backgroundColor: 'rgba(224, 86, 140, 0.05)',
                borderWidth: 2
            },
            {
                label: 'Twitter / X',
                data: [60, 95, 55, 80, 45],
                borderColor: '#4aa9e0',
                backgroundColor: 'rgba(74, 169, 224, 0.05)',
                borderWidth: 2
            },
            {
                label: 'YouTube',
                data: [95, 65, 90, 45, 60],
                borderColor: '#e2493a',
                backgroundColor: 'rgba(226, 73, 58, 0.05)',
                borderWidth: 2
            },
            {
                label: 'LinkedIn',
                data: [75, 80, 70, 90, 80],
                borderColor: '#4a90c2',
                backgroundColor: 'rgba(74, 144, 194, 0.05)',
                borderWidth: 2
            }
        ];
    } else {
        const color = getPlatformColor();
        const label = state.currentPlatform.toUpperCase();
        
        let pData = [70, 70, 70, 70, 70]; // Fallback
        if (state.currentPlatform === 'twitter') pData = [65, 95, 50, 80, 45];
        if (state.currentPlatform === 'instagram') pData = [95, 65, 85, 50, 40];
        if (state.currentPlatform === 'youtube') pData = [90, 60, 95, 40, 55];
        if (state.currentPlatform === 'linkedin') pData = [70, 80, 75, 90, 85];
        
        dataset = [{
            label: `${label} engagement profile`,
            data: pData,
            borderColor: color,
            backgroundColor: getPlatformColorGlow(),
            borderWidth: 3,
            pointBackgroundColor: color
        }];
    }
    
    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: metrics,
            datasets: dataset
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#a89c88', font: { family: 'Inter' } }
                }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    pointLabels: { color: '#a89c88', font: { family: 'Inter', size: 10 } },
                    ticks: { display: false },
                    suggestedMin: 30,
                    suggestedMax: 100
                }
            }
        }
    });
}

// 4. Demographics Age/Gender Bar Chart
function buildDemographicsChart() {
    const ctx = document.getElementById('demographicsChart');
    if (!ctx) return;
    
    if (demographicsChartInstance) {
        demographicsChartInstance.destroy();
    }
    
    const demo = database.platforms[state.currentPlatform].demographics;
    
    demographicsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: demo.labels,
            datasets: [
                {
                    label: 'Male %',
                    data: demo.male,
                    backgroundColor: 'rgba(55, 182, 171, 0.85)',
                    borderRadius: 6
                },
                {
                    label: 'Female %',
                    data: demo.female,
                    backgroundColor: 'rgba(224, 86, 140, 0.85)',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#a89c88', font: { family: 'Inter' } }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: '#a89c88' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#6f6655',
                        callback: function(value) { return value + '%'; }
                    }
                }
            }
        }
    });
}

// Build or Refresh All Dashboard Visualizations
function refreshAllCharts() {
    buildGrowthChart();
    buildShareChart();
    buildRadarChart();
    buildDemographicsChart();
}

// ==========================================
// APP INITIALIZATION & BINDERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial UI elements rendering
    updateKpiCards();
    updateCampaignSpotlight();
    updateGeoList();
    renderPostList();
    updateROICalculator();
    
    // Build Charts
    refreshAllCharts();
    
    // Lucide Icons initialization
    lucide.createIcons();
    
    // ------------------------------------------
    // SIDEBAR TAB NAVIGATION
    // ------------------------------------------
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active style from menu
            document.querySelectorAll('.sidebar-menu .menu-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            // Pane Switching
            const targetTab = item.getAttribute('data-tab');
            state.currentTab = targetTab;
            
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(`tab-${targetTab}`).classList.add('active');
            
            // Title Header synchronization
            const pageTitle = document.querySelector('.page-title');
            const pageSubtitle = document.querySelector('.page-subtitle');
            
            if (targetTab === 'overview') {
                pageTitle.innerText = 'Dashboard Overview';
                pageSubtitle.innerText = 'Track your multi-platform social media growth and conversion ROI.';
                // Re-render overview charts
                setTimeout(refreshAllCharts, 50);
            } else if (targetTab === 'content') {
                pageTitle.innerText = 'Content Hub';
                pageSubtitle.innerText = 'Analyze performance across individual campaigns and posts.';
                renderPostList();
            } else if (targetTab === 'calculator') {
                pageTitle.innerText = 'Campaign ROI Estimator';
                pageSubtitle.innerText = 'Run simulated returns based on ad clicks, value variables, and conversion rate.';
                updateROICalculator();
            } else if (targetTab === 'audience') {
                pageTitle.innerText = 'Audience Demographics';
                pageSubtitle.innerText = 'Analyze visitor splits, age segments, and geo distributions.';
                // Re-render audience charts
                setTimeout(refreshAllCharts, 50);
            }
        });
    });

    // ------------------------------------------
    // PLATFORM FILTERING SELECTOR
    // ------------------------------------------
    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Tab styling active toggle
            document.querySelectorAll('.platform-tab').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            
            // Set platform state
            const platform = tab.getAttribute('data-platform');
            state.currentPlatform = platform;
            
            // Apply body classes to change global dynamic theme accent colors
            document.body.className = `platform-${platform}`;
            
            // Refresh dashboard components with new platform analytics
            updateKpiCards();
            updateCampaignSpotlight();
            updateGeoList();
            renderPostList();
            
            // Refresh charts with custom platform scales and accent colors
            if (state.currentTab === 'overview' || state.currentTab === 'audience') {
                refreshAllCharts();
            }
        });
    });

    // ------------------------------------------
    // DATE FILTER SELECTOR
    // ------------------------------------------
    const dateSelect = document.getElementById('date-range');
    if (dateSelect) {
        dateSelect.addEventListener('change', (e) => {
            state.currentDateRange = e.target.value;
            // Update KPIs and Growth Charts based on date timeline slice
            updateKpiCards();
            if (state.currentTab === 'overview') {
                buildGrowthChart();
            }
        });
    }

    // ------------------------------------------
    // POST TABLE FILTERS (SEARCH & SORT)
    // ------------------------------------------
    const searchInput = document.getElementById('post-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderPostList();
        });
    }
    
    const sortSelect = document.getElementById('post-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderPostList();
        });
    }

    // ------------------------------------------
    // ROI CALCULATOR SLIDERS EVENT HANDLERS
    // ------------------------------------------
    const calculatorInputs = [
        { id: 'input-spend', key: 'spend' },
        { id: 'input-ctr', key: 'ctr' },
        { id: 'input-cvr', key: 'cvr' },
        { id: 'input-val', key: 'value' }
    ];
    
    calculatorInputs.forEach(inputObj => {
        const el = document.getElementById(inputObj.id);
        if (el) {
            el.addEventListener('input', (e) => {
                state.calc[inputObj.key] = e.target.value;
                updateROICalculator();
            });
        }
    });

    // ------------------------------------------
    // SYNC DATA BUTTON INTERACTION (LIVE MOCKING)
    // ------------------------------------------
    const btnSync = document.getElementById('btn-sync');
    const syncToast = document.getElementById('sync-toast');
    
    if (btnSync) {
        btnSync.addEventListener('click', () => {
            if (state.isSyncing) return;
            
            state.isSyncing = true;
            
            // Start spinning loader
            const syncIcon = btnSync.querySelector('i');
            syncIcon.classList.add('spinning');
            btnSync.querySelector('span').innerText = 'Syncing...';
            btnSync.style.opacity = '0.75';
            
            // Simulate API round-trip delay
            setTimeout(() => {
                // Generate random data adjustments (+/- 5%) to simulate a live database sync
                Object.keys(database.platforms).forEach(platformKey => {
                    const platform = database.platforms[platformKey];
                    
                    // Slightly adjust totals and growth percentages
                    const scale = 0.96 + Math.random() * 0.08; // scale between 0.96 and 1.04
                    platform.followers = Math.floor(platform.followers * scale);
                    platform.reach = Math.floor(platform.reach * scale);
                    platform.conversions = Math.floor(platform.conversions * scale);
                    
                    // Adjust timeline data points
                    Object.keys(platform.timeline).forEach(rangeKey => {
                        const timeline = platform.timeline[rangeKey];
                        timeline.followers = timeline.followers.map(val => Math.floor(val * scale));
                        timeline.engagement = timeline.engagement.map(val => Math.min(15, Math.max(0.5, val * (0.95 + Math.random() * 0.1))));
                    });
                });
                
                // End animations & update values
                state.isSyncing = false;
                syncIcon.classList.remove('spinning');
                btnSync.querySelector('span').innerText = 'Sync Data';
                btnSync.style.opacity = '1';
                
                // Refresh dashboard components with newly synchronized state
                updateKpiCards();
                updateCampaignSpotlight();
                updateGeoList();
                renderPostList();
                if (state.currentTab === 'overview' || state.currentTab === 'audience') {
                    refreshAllCharts();
                }
                
                // Show notification toast banner modal
                syncToast.classList.add('show');
                setTimeout(() => {
                    syncToast.classList.remove('show');
                }, 3000);
                
            }, 1500); // 1.5 seconds mock latency
        });
    }
});
