const radarApiKey = 'e74e899759224c2cef19d9c382e6fa7d';

// Function to get the user's location and display radar
function initializeRadar() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Initialize the Leaflet map centered on the user's location
            const map = L.map('map').setView([latitude, longitude], 7);

            // Add OpenStreetMap base layer (required for proper map display)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Add OpenWeatherMap Radar Layer (Updated API)
            const radarLayer = L.tileLayer(
                `https://maps.openweathermap.org/maps/2.0/weather/RADAR/{z}/{x}/{y}?appid=${radarApiKey}`,
                {
                    opacity: 0.7,  // Adjust opacity if needed
                    attribution: 'Weather data by OpenWeatherMap'
                }
            );

            radarLayer.addTo(map);

        }, function (error) {
            console.error("Error getting location: ", error);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Call the function to initialize the radar
initializeRadar();
