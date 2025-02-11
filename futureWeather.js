const apiKey = "5BUP9BVLNS4KSTHFXQLP7F6DL";
let unit = "imperial"; // Defaulting to Fahrenheit
let location = "Virginia"; // Defaulting to Virginia

// Fetch 7-day forecast data
function fetchForecast() {
    if (!location) {
        console.error("No location provided!");
        return;
    }

    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${unit}&include=days&key=${apiKey}&contentType=json`;

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

    let forecastHTML = `<h3>7-Day Forecast</h3>`;
    days.forEach(day => {
        forecastHTML += `
            <p><strong>${day.datetime}</strong>: ${day.temp}${tempUnit}, ${day.conditions}</p>
        `;
    });

    forecastContainer.innerHTML = forecastHTML;
}

// Search for new location
function searchWeather() {
    const userInput = document.getElementById("locationInput").value.trim();
    if (userInput) {
        location = userInput; // Update location
        fetchForecast(); // Fetch forecast for new location
    }
}

// Change temperature unit
function changeUnit(newUnit) {
    unit = newUnit;
    fetchForecast(); // Re-fetch with new unit
}

// Fetch initial forecast data on page load
fetchForecast();
