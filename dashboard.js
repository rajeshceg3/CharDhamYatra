document.addEventListener('DOMContentLoaded', () => {
    // SVG icons for weather conditions
    const weatherIcons = {
        "Partly Cloudy": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cloud"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
        "Sunny": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
        "Light Rain": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cloud-drizzle"><line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`,
        "Overcast": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cloud"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`
    };

    // Mock data for the dashboard.
    const dhamData = [
        {
            name: "Yamunotri",
            weather: { temp: "12°C", condition: "Partly Cloudy" },
            temple: { status: "Open", hours: "6:00 AM - 8:00 PM" },
            route: { status: "Clear", advisory: "None" }
        },
        {
            name: "Gangotri",
            weather: { temp: "11°C", condition: "Sunny" },
            temple: { status: "Open", hours: "6:30 AM - 8:30 PM" },
            route: { status: "Clear", advisory: "None" }
        },
        {
            name: "Kedarnath",
            weather: { temp: "5°C", condition: "Light Rain" },
            temple: { status: "Closed", hours: "5:00 AM - 9:00 PM" },
            route: { status: "Advisory", advisory: "Check for slippery conditions" }
        },
        {
            name: "Badrinath",
            weather: { temp: "8°C", condition: "Overcast" },
            temple: { status: "Open", hours: "4:30 AM - 9:00 PM" },
            route: { status: "Clear", advisory: "None" }
        }
    ];

    const dashboardGrid = document.querySelector('.dashboard-grid');

    if (dashboardGrid) {
        dashboardGrid.innerHTML = '';

        dhamData.forEach(dham => {
            const card = document.createElement('div');
            card.className = 'dashboard-card';

            const templeStatusClass = dham.temple.status === 'Open' ? 'status-open' : 'status-closed';
            const routeStatusClass = dham.route.status === 'Clear' ? 'route-clear' : 'route-advisory';
            const weatherIcon = weatherIcons[dham.weather.condition] || weatherIcons["Sunny"]; // Fallback to sunny icon

            card.innerHTML = `
                <h3 class="card-title">${dham.name}</h3>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label weather-icon">${weatherIcon}</span>
                        <span class="value">${dham.weather.temp}, ${dham.weather.condition}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Temple:</span>
                        <span class="value ${templeStatusClass}">${dham.temple.status}</span>
                        <span class="value">(${dham.temple.hours})</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Route:</span>
                        <span class="value ${routeStatusClass}">${dham.route.status}</span>
                    </div>
                </div>
            `;
            dashboardGrid.appendChild(card);
        });
    }
});
