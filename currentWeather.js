const apiKey = "5BUP9BVLNS4KSTHFXQLP7F6DL";
let unit = "imperial"; // Defaulting to Fahrenheit
let userLocation = "Virginia"; // Defaulting to Virginia

// Fetch current weather and hourly forecast data
function fetchWeather() {
    if (!userLocation) {
        console.error("No location provided!");
        return;
    }

    console.log("Unit:", unit); // Debugging log to ensure it's 'imperial' or 'metric'
    console.log("Location:", userLocation); // Debugging log for location

    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(userLocation)}?unitGroup=${unit}&include=events,current,hours&key=${apiKey}&contentType=json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            displayHourlyForecast(data);
        })
        .catch(err => {
            console.error("Error fetching weather data:", err);
        });
}

// Display current weather data
function displayWeather(data) {
    const weatherContainer = document.getElementById("weather");
    const { address, currentConditions } = data;
    const tempUnit = unit === "imperial" ? "°F" : "°C";
    const windUnit = unit === "imperial" ? "mph" : "km/h";

    const currentWeatherHTML = `
        <h2>Weather in ${address}</h2>
        <p><strong>Temperature:</strong> ${currentConditions.temp}${tempUnit}</p>
        <p><strong>Condition:</strong> ${currentConditions.conditions}</p>
        <p><strong>Humidity:</strong> ${currentConditions.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${currentConditions.windspeed} ${windUnit}</p>
        <hr>
    `;

    weatherContainer.innerHTML = currentWeatherHTML;
}

// Display hourly forecast for today
function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById("hourly-weather");
    const { days } = data;
    const tempUnit = unit === "imperial" ? "°F" : "°C";

    let hourlyHTML = `<h3>Hourly Forecast for Today</h3>`;
    for (let i = 0; i < 7; i++) { // Show the next 7 hours
        const hour = days[0].hours[i];
        hourlyHTML += `
            <p><strong>${hour.datetime}</strong>: ${hour.temp}${tempUnit}, ${hour.conditions}</p>
        `;
    }

    hourlyContainer.innerHTML = hourlyHTML;
}

// Search for new location
function searchWeather() {
    const userInput = document.getElementById("Location").value.trim();
    console.log("Search triggered with input:", userInput); // Debugging log
    if (userInput) {
        userLocation = userInput; // Update location
        fetchWeather(); // Fetch weather for new location
    }
}

// Change temperature unit
function changeUnit() {
    unit = document.getElementById("unit").value; // Get selected unit from dropdown
    fetchWeather(); // Re-fetch with new unit
}

// Listen for changes in unit dropdown
document.getElementById("unit").addEventListener("change", changeUnit);

// Listen for click on search button
document.getElementById("searchButton").addEventListener("click", searchWeather);

// Fetch initial weather data on page load
fetchWeather();
