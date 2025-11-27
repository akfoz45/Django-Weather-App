function initChart(labels, temps) {
    const ctx = document.getElementById('tempChart').getContext('2d');
    
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(255, 235, 59, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 235, 59, 0.0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sıcaklık',
                data: temps,
                borderColor: '#FFEB3B',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHitRadius: 20,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            layout: { padding: { top: 10, left: 10, right: 10, bottom: 0 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#333',
                    titleFont: { size: 13 },
                    bodyFont: { size: 14, weight: 'bold' },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) { return context.parsed.y + ' °C'; }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: 'rgba(255,255,255,0.7)', maxTicksLimit: 6, font: { size: 11 } } 
                },
                y: {
                    display: true,
                    position: 'left',
                    min: Math.min(...temps) - 5,
                    grid: { color: 'rgba(255,255,255,0.1)', drawBorder: false },
                    ticks: { color: 'rgba(255,255,255,0.9)', font: { size: 12 }, stepSize: 5 }
                }
            }
        }
    });
}