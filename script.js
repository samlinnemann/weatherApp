const apiKey = "5BUP9BVLNS4KSTHFXQLP7F6DL";
let unit = "imperial"; // Default unit (Fahrenheit)
let userLocation = "";

// Automatically get user location
function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                userLocation = `${latitude},${longitude}`;
                fetchWeather();
            },
            error => {
                console.warn("Geolocation error:", error.message);
                userLocation = "New York"; // Fallback location
                fetchWeather();
            }
        );
    } else {
        console.warn("Geolocation not supported.");
        userLocation = "New York"; // Default location
        fetchWeather();
    }
}

// Fetch weather data
function fetchWeather() {
    const unitGroup = unit === "imperial" ? "us" : "metric";
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(userLocation)}?unitGroup=${unitGroup}&include=current,hours,days&key=${apiKey}&contentType=json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            displayHourlyForecast(data);
            displayDailyForecast(data);
        })
        .catch(err => {
            console.error("Error fetching weather data:", err);
            document.getElementById("weather").innerHTML = "<p>Failed to load weather data.</p>";
        });
}

// Display current weather
function displayCurrentWeather(data) {
    const { address, currentConditions } = data;
    const tempUnit = unit === "imperial" ? "°F" : "°C";

    document.getElementById("weather").innerHTML = `
        <h2>Weather in ${address}</h2>
        <img class="weather-icon" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/${currentConditions.icon}.png" alt="${currentConditions.conditions}">
        <p><strong>Temperature:</strong> ${currentConditions.temp}${tempUnit}</p>
        <p><strong>Condition:</strong> ${currentConditions.conditions}</p>
        <p><strong>Humidity:</strong> ${currentConditions.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${currentConditions.windspeed} ${unit === "imperial" ? "mph" : "km/h"}</p>
    `;
}

// Display hourly forecast
function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById("hourly-weather");
    const { days } = data;
    const tempUnit = unit === "imperial" ? "°F" : "°C";
    const todayHours = days[0].hours;
    const currentHour = new Date().getHours();

    let hourlyHTML = `<h3>Hourly Forecast</h3>`;
    
    // Get the next 7 hours from the current time
    todayHours.slice(currentHour, currentHour + 7).forEach(hour => {
        const hourTime = parseInt(hour.datetime.split(":")[0]);
        const period = hourTime >= 12 ? "PM" : "AM";
        const formattedHour = hourTime % 12 || 12;

        hourlyHTML += `
            <div class="hourly-item">
                <span><strong>${formattedHour}:00 ${period}</strong></span>
                <img class="weather-icon" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/${hour.icon}.png" alt="${hour.conditions}">
                <span>${hour.temp}${tempUnit} - ${hour.conditions}</span>
            </div>
        `;
    });

    hourlyContainer.innerHTML = hourlyHTML;
}

// Display daily forecast
function displayDailyForecast(data) {
    const forecastContainer = document.getElementById("forecast");
    const { days } = data;
    const tempUnit = unit === "imperial" ? "°F" : "°C";

    let forecastHTML = `<h3>7-Day Forecast</h3>`;

    days.forEach(day => {
        forecastHTML += `
            <div class="daily-item">
                <span><strong>${new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'long' })}</strong></span>
                <img class="weather-icon" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/3rd%20Set%20-%20Color/${day.icon}.png" alt="${day.conditions}">
                <span>${day.temp}${tempUnit} - ${day.conditions}</span>
            </div>
        `;
    });

    forecastContainer.innerHTML = forecastHTML;
}

// Change temperature unit
function changeUnit(newUnit) {
    unit = newUnit;
    fetchWeather();
}

// Fetch weather on page load
getUserLocation();
