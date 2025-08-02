document.addEventListener('DOMContentLoaded', () => {
    // Mock data for the dashboard. In a real application, this would be fetched from an API.
    const dhamData = [
        {
            name: "Yamunotri",
            weather: { temp: "12°C", condition: "Partly Cloudy", icon: "☁️" },
            temple: { status: "Open", hours: "6:00 AM - 8:00 PM" },
            route: { status: "Clear", advisory: "None" }
        },
        {
            name: "Gangotri",
            weather: { temp: "11°C", condition: "Sunny", icon: "☀️" },
            temple: { status: "Open", hours: "6:30 AM - 8:30 PM" },
            route: { status: "Clear", advisory: "None" }
        },
        {
            name: "Kedarnath",
            weather: { temp: "5°C", condition: "Light Rain", icon: "🌦️" },
            temple: { status: "Closed", hours: "5:00 AM - 9:00 PM" },
            route: { status: "Advisory", advisory: "Check for slippery conditions" }
        },
        {
            name: "Badrinath",
            weather: { temp: "8°C", condition: "Overcast", icon: "🌥️" },
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

            card.innerHTML = `
                <h3 class="card-title">${dham.name}</h3>
                <div class="card-content">
                    <div class="info-item">
                        <span class="label weather-icon">${dham.weather.icon}</span>
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
