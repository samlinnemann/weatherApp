const apiKey = "5BUP9BVLNS4KSTHFXQLP7F6DL";
let unit = "imperial"; // Defaulting to Fahrenheit
let userLocation = ""; // Renaming to avoid conflict with the built-in 'location' object

// Fetch 7-day forecast data
function fetchForecast() {
    if (!userLocation) {
        console.error("No location provided!");
        return;
    }

    const unitGroup = unit === "imperial" ? "us" : "metric"; // Mapping 'imperial' to 'us' and 'metric' to 'metric'
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(userLocation)}?unitGroup=${unitGroup}&include=days&key=${apiKey}&contentType=json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(err => {
            console.error("Error fetching forecast data:", err);
        });
}

// Display 7-day forecast data
function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast");
    const { days } = data;
    const tempUnit = unit === "imperial" ? "°F" : "°C";

    // Function to format the date as "Day, Month Day"
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', month: 'short', day: 'numeric' }; // Format as "Day, Month Day"
        return date.toLocaleDateString('en-US', options); // Format date with weekday and date
    }

    let forecastHTML = `<h3>7-Day Forecast</h3>`;
    days.forEach(day => {
        const formattedDate = formatDate(day.datetime); // Get formatted date for each forecast day
        forecastHTML += `
            <p><strong>${formattedDate}</strong>: ${day.temp}${tempUnit}, ${day.conditions}</p>
        `;
    });

    forecastContainer.innerHTML = forecastHTML;
}



// Get device location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                userLocation = `${latitude},${longitude}`; // Use lat/long for the location
                fetchForecast(); // Fetch the forecast based on device location
            },
            error => {
                console.error("Geolocation error:", error);
                userLocation = "Virginia"; // Fallback location if geolocation fails
                fetchForecast();
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        userLocation = "Virginia"; // Fallback location if geolocation is unavailable
        fetchForecast();
    }
}

// Change temperature unit
function changeUnit(newUnit) {
    unit = newUnit;
    fetchForecast(); // Re-fetch with new unit
}

// Fetch initial forecast data on page load
getLocation(); // Now it fetches based on the device's location
