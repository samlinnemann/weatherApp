const apiKey = "5BUP9BVLNS4KSTHFXQLP7F6DL";
let unit = "imperial"; // Default to Fahrenheit
let userLocation = "";

// Fetch weather, alerts, and forecasts
function fetchWeatherAndAlerts() {
    if (!userLocation) {
        console.error("No location provided!");
        return;
    }

    const unitGroup = unit === "imperial" ? "us" : "metric";
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(userLocation)}?unitGroup=${unitGroup}&include=events,current,hours,days&key=${apiKey}&contentType=json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            displayHourlyForecast(data);
            displayWeatherAlerts(data);
            display14DayForecast(data);
        })
        .catch(err => {
            console.error("Error fetching weather data:", err);
        });
}

// Display current weather
function displayWeather(data) {
    const weatherContainer = document.getElementById("weather");
    const { address, currentConditions } = data;

    if (!currentConditions) {
        weatherContainer.innerHTML = "<p>Error: No weather data available.</p>";
        return;
    }

    const tempUnit = unit === "imperial" ? "°F" : "°C";
    const windUnit = unit === "imperial" ? "mph" : "km/h";

    weatherContainer.innerHTML = `
        <h2>Weather in ${address}</h2>
        <p><strong>Temperature:</strong> ${currentConditions.temp}${tempUnit}</p>
        <p><strong>Condition:</strong> ${currentConditions.conditions}</p>
        <p><strong>Humidity:</strong> ${currentConditions.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${currentConditions.windspeed} ${windUnit}</p>
        <hr>
    `;
}

// Display hourly forecast
function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById("hourly-weather");
    const { days } = data;
    const tempUnit = unit === "imperial" ? "°F" : "°C";

    const currentHour = new Date().getHours();
    const todayHours = days[0].hours;

    const startIndex = todayHours.findIndex(hour => {
        return parseInt(hour.datetime.split(":")[0]) >= currentHour;
    });

    let hourlyHTML = `<h3>Hourly Forecast</h3>`;

    for (let i = startIndex; i < startIndex + 7 && i < todayHours.length; i++) {
        const hour = todayHours[i];
        const time24 = parseInt(hour.datetime.split(":")[0]);

        const period = time24 >= 12 ? "PM" : "AM";
        const time12 = time24 % 12 || 12;

        hourlyHTML += `
            <p><strong>${time12}:00 ${period}</strong>: ${hour.temp}${tempUnit}, ${hour.conditions} <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${hour.icon}.png" alt="Weather icon"></p>
        `;
    }

    hourlyContainer.innerHTML = hourlyHTML;
}

// Display weather alerts
function displayWeatherAlerts(data) {
    const alertsContainer = document.getElementById("alerts");
    const { events } = data;

    if (events && events.length > 0) {
        const alertsHTML = events.map(event => `
            <p><strong>Weather Alert:</strong> ${event.eventType}</p>
            <p>${event.description}</p>
        `).join('');
        alertsContainer.innerHTML = alertsHTML;
    } else {
        alertsContainer.innerHTML = "<p>No active weather alerts.</p>";
    }
}

// Display 14-day forecast
function display14DayForecast(data) {
    const forecastContainer = document.getElementById("forecast-14day");
    const { days } = data;
    const tempUnit = unit === "imperial" ? "°F" : "°C";

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    let forecastHTML = `<h3>14-Day Forecast</h3>`;
    days.slice(0, 14).forEach(day => {
        const formattedDate = formatDate(day.datetime);
        forecastHTML += `
            <p><strong>${formattedDate}</strong>: ${day.temp}${tempUnit}, ${day.conditions} <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${day.icon}.png" alt="Weather icon"></p>
        `;
    });

    forecastContainer.innerHTML = forecastHTML;
}

// Get user location automatically
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                userLocation = `${latitude},${longitude}`;
                fetchWeatherAndAlerts();
            },
            error => {
                console.error("Geolocation error:", error);
                userLocation = "Virginia";
                fetchWeatherAndAlerts();
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        userLocation = "Virginia";
        fetchWeatherAndAlerts();
    }
}

// Change unit and refresh data
function changeUnit(newUnit) {
    unit = newUnit;
    fetchWeatherAndAlerts();
}

// Fetch initial data on page load
getLocation();
