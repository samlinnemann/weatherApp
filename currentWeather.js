const apiKey = "5BUP9BVLNS4KSTHFXQLP7F6DL";
let unit = "imperial"; // Default to Fahrenheit
let userLocation = "Virginia"; // Default to Virginia

const unitMap = {
    "imperial": "us",
    "metric": "metric"
};

// Function to fetch weather
function fetchWeather() {
    if (!userLocation) {
        console.error("No location provided!");
        return;
    }

    const apiUnit = unitMap[unit] || "us";
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(userLocation)}?unitGroup=${apiUnit}&include=events,current,hours&key=${apiKey}&contentType=json`;

    console.log(`Fetching weather for: ${userLocation} | Unit: ${apiUnit}`);
    
    // Show loading message
    document.getElementById("weather").innerHTML = "<p>Loading weather...</p>";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Weather data received:", data);
            displayWeather(data);
            displayHourlyForecast(data);
        })
        .catch(err => {
            console.error("Error fetching weather data:", err);
            document.getElementById("weather").innerHTML = "<p> Failed to load weather data.</p>";
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

    const currentHour = new Date().getHours(); // Get current hour (0-23)
    const todayHours = days[0].hours; // Get today's hourly data

    // Find the first hour that is equal to or after the current hour
    const startIndex = todayHours.findIndex(hour => {
        return parseInt(hour.datetime.split(":")[0]) >= currentHour;
    });

    let hourlyHTML = `<h3>Hourly Forecast</h3>`;
    
    // Display the next 7 hours starting from the current hour
    for (let i = startIndex; i < startIndex + 7 && i < todayHours.length; i++) {
        const hour = todayHours[i];
        const time24 = parseInt(hour.datetime.split(":")[0]); // Extract hour (0-23)
        
        // Convert to 12-hour format
        const period = time24 >= 12 ? "PM" : "AM";
        const time12 = time24 % 12 || 12; // Convert 0 to 12 and keep other values

        hourlyHTML += `
            <p><strong>${time12}:00 ${period}</strong>: ${hour.temp}${tempUnit}, ${hour.conditions}</p>
        `;
    }

    hourlyContainer.innerHTML = hourlyHTML;
}



// Search for a new location
function searchWeather() {
    const userInput = document.getElementById("locationInput").value.trim();
    if (userInput) {
        userLocation = userInput;
        fetchWeather();
    } else {
        console.warn("No location entered.");
    }
}

// Change unit
function changeUnit() {
    unit = document.getElementById("unit").value;
    fetchWeather();
}

// Get user’s device location
function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                userLocation = `${latitude},${longitude}`;
                console.log("Using device location:", userLocation);
                fetchWeather();
            },
            error => {
                console.warn("Geolocation error:", error.message);
                fetchWeather(); // Fetch default location if denied
            }
        );
    } else {
        console.warn("Geolocation not supported by this browser.");
        fetchWeather();
    }
}

// Event listeners
document.getElementById("unit").addEventListener("change", changeUnit);
document.getElementById("searchButton").addEventListener("click", searchWeather);

// Get location and fetch weather on page load
getUserLocation();
