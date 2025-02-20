const radarApiKey = 'e74e899759224c2cef19d9c382e6fa7d';

// Function to get the user's location and display radar
function initializeRadar() {
    // Check if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Get the latitude and longitude from the user's device
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Initialize the Leaflet map with user's location
            const map = L.map('radar-container').setView([latitude, longitude], 10);  // Changed 'map' to 'radar-container'

            // Add the OpenWeatherMap radar layer to the map
            const radarLayer = L.tileLayer(
                `https://tile.openweathermap.org/map/radar/{z}/{x}/{y}.png?appid=${radarApiKey}`,
                { attribution: 'Weather data by OpenWeatherMap' }
            );

            // Add the radar layer to the map
            radarLayer.addTo(map);

        }, function(error) {
            console.error("Error getting location: ", error);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Call the function to initialize the radar
initializeRadar();
