// Compliance Buddy Dashboard - Main Application Logic
// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// Global state
let dashboardData = {
    controls: [],
    emissions: {},
    donutChart: null,
    lineChart: null
};

// Mock data for demo/fallback
const MOCK_DATA = {
    controls: [
        {
            control: "Data Encryption Policy",
            verdict: "Pass",
            score: 92,
            explanation: "AES-256 encryption verified with proper key management",
            recommendation: "Rotate encryption keys every 6 months",
            emissions: 0.0021
        },
        {
            control: "Access Control Policy",
            verdict: "Pass",
            score: 88,
            explanation: "Role-based access control properly implemented",
            recommendation: "Maintain current standards and review quarterly",
            emissions: 0.0019
        },
        {
            control: "Data Retention Policy",
            verdict: "Partial",
            score: 67,
            explanation: "Missing retention duration clause for archived data",
            recommendation: "Add specific retention timeline for all data categories",
            emissions: 0.0012
        },
        {
            control: "Incident Response Plan",
            verdict: "Pass",
            score: 95,
            explanation: "Comprehensive incident response procedures documented",
            recommendation: "Continue regular drills and updates",
            emissions: 0.0018
        },
        {
            control: "Regular Security Audits",
            verdict: "Fail",
            score: 45,
            explanation: "Missing evidence of regular security audits",
            recommendation: "Upload audit reports from the past 12 months",
            emissions: 0.0015
        }
    ],
    emissions: {
        total_emissions: 0.0085,
        energy_saved: 18,
        avg_per_run: 0.0017,
        history: [
            { timestamp: "Run 1", emissions: 0.0021 },
            { timestamp: "Run 2", emissions: 0.0019 },
            { timestamp: "Run 3", emissions: 0.0012 },
            { timestamp: "Run 4", emissions: 0.0018 },
            { timestamp: "Run 5", emissions: 0.0015 }
        ]
    }
};

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Compliance Buddy Dashboard Initializing...');
    
    // Set initial time for chat
    document.getElementById('initialTime').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize dark mode
    initializeDarkMode();
});

// Setup all event listeners
function setupEventListeners() {
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    
    // Download report button
    document.getElementById('downloadReport').addEventListener('click', downloadReport);
}

// Initialize dark mode based on user preference
function initializeDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDark) {
        document.documentElement.classList.add('dark');
        document.getElementById('sunIcon').classList.remove('hidden');
        document.getElementById('moonIcon').classList.add('hidden');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    
    localStorage.setItem('darkMode', isDark);
    
    // Toggle icons
    document.getElementById('sunIcon').classList.toggle('hidden');
    document.getElementById('moonIcon').classList.toggle('hidden');
    
    // Update charts if they exist
    if (dashboardData.donutChart) {
        updateChartTheme(dashboardData.donutChart);
    }
    if (dashboardData.lineChart) {
        updateChartTheme(dashboardData.lineChart);
    }
}

// Update chart theme colors
function updateChartTheme(chart) {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    chart.options.plugins.legend.labels.color = textColor;
    chart.options.scales?.x && (chart.options.scales.x.ticks.color = textColor);
    chart.options.scales?.y && (chart.options.scales.y.ticks.color = textColor);
    chart.options.scales?.x && (chart.options.scales.x.grid.color = gridColor);
    chart.options.scales?.y && (chart.options.scales.y.grid.color = gridColor);
    
    chart.update();
}

// Load dashboard data from API or use mock data
async function loadDashboardData() {
    try {
        console.log('📊 Fetching compliance results...');
        
        // Try to fetch from backend
        const resultsResponse = await fetch(`${API_BASE_URL}/results`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const emissionsResponse = await fetch(`${API_BASE_URL}/emissions`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (resultsResponse.ok && emissionsResponse.ok) {
            const resultsData = await resultsResponse.json();
            const emissionsData = await emissionsResponse.json();
            
            dashboardData.controls = resultsData.controls || [];
            dashboardData.emissions = emissionsData;
            
            console.log('✅ Data loaded from backend');
        } else {
            throw new Error('Backend not available');
        }
    } catch (error) {
        console.warn('⚠️ Backend not available, using mock data:', error.message);
        dashboardData.controls = MOCK_DATA.controls;
        dashboardData.emissions = MOCK_DATA.emissions;
    }
    
    // Update UI with loaded data
    updateDashboard();
}

// Update all dashboard components
function updateDashboard() {
    updateSummaryCards();
    updateResultsTable();
    createDonutChart();
    createLineChart();
    updateSustainabilityIndicator();
}

// Update summary cards
function updateSummaryCards() {
    const controls = dashboardData.controls;
    const emissions = dashboardData.emissions;
    
    // Calculate average score
    const avgScore = controls.length > 0
        ? Math.round(controls.reduce((sum, c) => sum + c.score, 0) / controls.length)
        : 0;
    
    // Update card values
    document.getElementById('avgScore').textContent = `${avgScore}%`;
    document.getElementById('totalControls').textContent = controls.length;
    
    // Format CO2 emissions
    const co2 = emissions.total_emissions || 0;
    const co2Text = co2 < 1 
        ? `${(co2 * 1000).toFixed(1)}g` 
        : `${co2.toFixed(2)}kg`;
    document.getElementById('co2Emissions').textContent = co2Text;
    
    // Energy saved
    document.getElementById('energySaved').textContent = `${emissions.energy_saved || 0}%`;
}

// Update results table
function updateResultsTable() {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    dashboardData.controls.forEach((control, index) => {
        const row = document.createElement('tr');
        
        // Determine row background color based on verdict
        let bgClass = '';
        if (control.verdict === 'Pass') bgClass = 'bg-green-50 dark:bg-green-900/20';
        else if (control.verdict === 'Partial') bgClass = 'bg-yellow-50 dark:bg-yellow-900/20';
        else if (control.verdict === 'Fail') bgClass = 'bg-red-50 dark:bg-red-900/20';
        
        row.className = `${bgClass} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`;
        row.style.animationDelay = `${index * 0.05}s`;
        row.classList.add('animate-fade-in');
        
        // Verdict badge
        let verdictBadge = '';
        if (control.verdict === 'Pass') {
            verdictBadge = '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-600 dark:text-green-400">✅ Pass</span>';
        } else if (control.verdict === 'Partial') {
            verdictBadge = '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">⚠️ Partial</span>';
        } else if (control.verdict === 'Fail') {
            verdictBadge = '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-600 dark:text-red-400">❌ Fail</span>';
        } else {
            verdictBadge = '<span class="text-xs text-gray-500">Pending</span>';
        }
        
        // Score progress bar
        const scoreColor = control.score >= 80 ? 'bg-green-400' : 
                          control.score >= 60 ? 'bg-yellow-400' : 'bg-red-400';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">${control.control}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${verdictBadge}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                    <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16">
                        <div class="${scoreColor} h-2 rounded-full" style="width: ${control.score}%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">${control.score}%</span>
                </div>
            </td>
            <td class="px-6 py-4">
                <p class="text-sm text-gray-900 dark:text-white max-w-md">${control.explanation}</p>
            </td>
            <td class="px-6 py-4">
                <p class="text-sm text-gray-600 dark:text-gray-400 max-w-md">${control.recommendation}</p>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Create donut chart
function createDonutChart() {
    const ctx = document.getElementById('donutChart').getContext('2d');
    
    // Calculate distribution
    const pass = dashboardData.controls.filter(c => c.verdict === 'Pass').length;
    const partial = dashboardData.controls.filter(c => c.verdict === 'Partial').length;
    const fail = dashboardData.controls.filter(c => c.verdict === 'Fail').length;
    
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    
    // Destroy existing chart if it exists
    if (dashboardData.donutChart) {
        dashboardData.donutChart.destroy();
    }
    
    dashboardData.donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pass', 'Partial', 'Fail'],
            datasets: [{
                data: [pass, partial, fail],
                backgroundColor: [
                    '#22c55e',  // Green
                    '#eab308',  // Yellow
                    '#ef4444'   // Red
                ],
                borderWidth: 2,
                borderColor: isDark ? '#1f2937' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value} control${value !== 1 ? 's' : ''}`;
                        }
                    }
                }
            }
        }
    });
}

// Create line chart
function createLineChart() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    
    const history = dashboardData.emissions.history || [];
    const labels = history.map(h => h.timestamp);
    const data = history.map(h => h.emissions * 1000); // Convert to grams
    
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    // Destroy existing chart if it exists
    if (dashboardData.lineChart) {
        dashboardData.lineChart.destroy();
    }
    
    dashboardData.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CO₂ Emissions (g)',
                data: data,
                borderColor: '#00A676',
                backgroundColor: 'rgba(0, 166, 118, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#00A676',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(2)}g CO₂`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                y: {
                    ticks: { 
                        color: textColor,
                        callback: function(value) {
                            return value.toFixed(1) + 'g';
                        }
                    },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

// Update sustainability indicator
function updateSustainabilityIndicator() {
    const emissions = dashboardData.emissions;
    const co2 = emissions.total_emissions || 0;
    const energySaved = emissions.energy_saved || 0;
    
    const co2Text = co2 < 1 
        ? `${(co2 * 1000).toFixed(1)}g` 
        : `${co2.toFixed(2)}kg`;
    
    document.getElementById('sustainabilityText').textContent = 
        `Powered by Llama 3-8B • ${energySaved}% energy efficiency • ${co2Text} CO₂ total`;
}

// Download compliance report
async function downloadReport() {
    try {
        console.log('📥 Downloading compliance report...');
        
        const response = await fetch(`${API_BASE_URL}/report/download`, {
            method: 'GET'
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            console.log('✅ Report downloaded successfully');
            showNotification('Report downloaded successfully!', 'success');
        } else {
            throw new Error('Download failed');
        }
    } catch (error) {
        console.error('❌ Error downloading report:', error);
        showNotification('Backend not available. Please ensure the API is running.', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export for use in other modules
window.dashboardApp = {
    data: dashboardData,
    reload: loadDashboardData,
    showNotification
};
