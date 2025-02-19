const apiKey = "5462213d7eb72ccb030a840d435b574e";
let unit = "imperial"; // Default to Fahrenheit
let userLocation = "";

// Fetch weather, alerts, and forecasts
function fetchWeatherAndAlerts() {
    if (!userLocation) {
        console.error("No location provided!");
        return;
    }

    const unitParam = unit === "imperial" ? "imperial" : "metric";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(userLocation)}&units=${unitParam}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(err => {
            console.error("Error fetching weather data:", err);
        });
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(userLocation)}&units=${unitParam}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data);
            display14DayForecast(data);
        })
        .catch(err => console.error("Error fetching forecast data:", err));
}

// Display current weather
function displayWeather(data) {
    const weatherContainer = document.getElementById("weather");
    if (!data.main) {
        weatherContainer.innerHTML = "<p>Error: No weather data available.</p>";
        return;
    }

    const tempUnit = unit === "imperial" ? "°F" : "°C";
    const windUnit = unit === "imperial" ? "mph" : "km/h";
    const description = data.weather[0].description;
    const customIcon = getWeatherIcon(description); // Get custom icon based on description

    weatherContainer.innerHTML = `
        <h1>Weather in ${data.name}</h1>
        <img id="topIcon" src="${customIcon}" alt="${description}" />
        <div>
            <h1>${data.main.temp}${tempUnit}</h1>
            <h2>${description}</h2>
        </div>
        <div class="rmiddle">
            <h3><strong>Humidity:</strong> ${data.main.humidity}%</h3>
            <h3><strong>Wind Speed:</strong> ${data.wind.speed} ${windUnit}</h3>
        </div>
    `;
}

function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById("hourly-weather");
    const tempUnit = unit === "imperial" ? "°F" : "°C";
    const windUnit = unit === "imperial" ? "mph" : "km/h";
    let hourlyHTML = `<h1>Hourly Forecast</h1>`;

    for (let i = 0; i < 9; i++) {
        const hour = data.list[i];
        const date = new Date(hour.dt_txt);
        const time12 = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const description = hour.weather[0].description;
        const customIcon = getWeatherIcon(description);  // Get custom icon
        const percipitationIcon = getPrecipitationIcon(hour.main.temp);
        const precipitation = hour.pop ? Math.round(hour.pop * 100) : 0;
        const wind = hour.wind ? hour.wind.speed : 0;

        hourlyHTML += `
        <div id="hourly" class="left">
            <div>
                <p><strong>${time12}</strong>: ${hour.main.temp}${tempUnit}, ${description}</p>
                <div class="left">
                    <p class="left" id="precipitation"><strong><img id="precipIcon" src="${percipitationIcon}"></strong> ${precipitation}%</p>
                    <p2><strong>Wind:</strong> ${wind} ${windUnit}</p2>
                </div>
            </div>
            <img id="hourIcon" src="${customIcon}" alt="${description}" />
        </div>
        `;
    }

    hourlyContainer.innerHTML = hourlyHTML;
}


function display14DayForecast(data) {
    const forecastContainer = document.getElementById("forecast-14day");
    const tempUnit = unit === "imperial" ? "°F" : "°C";
    const windUnit = unit === "imperial" ? "mph" : "km/h"; // Define wind unit

    let forecastHTML = `<h1>5-Day Forecast</h1>`;
    
    // Loop through data in 9-hour intervals (typically for every 3-hour forecast)
    for (let i = 0; i < data.list.length; i += 9) {
        const day = data.list[i];
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        const description = day.weather[0].description;
        const customIcon = getWeatherIcon(description);

        // Get precipitation percentage (default to 0 if undefined)
        const precipitation = day.pop ? Math.round(day.pop * 100) : 0;

        // Get wind speed (default to 0 if undefined)
        const wind = day.wind ? day.wind.speed : 0;

        // Get precipitation icon (based on temperature)
        const percipitationIcon = getPrecipitationIcon(day.main.temp); 

        forecastHTML += `
        <div id="daily" class="left">
            <div>
                <p><strong>${date}</strong>: ${day.main.temp}${tempUnit}, ${description}</p>
                <div class="left">
                    <p class="left" id="precipitation"><strong><img id="precipIcon" src="${percipitationIcon}"></strong> ${precipitation}%</p>
                    <p2><strong>Wind:</strong> ${wind} ${windUnit}</p2>
                </div>
            </div>
            <img id="dayIcon" src="${customIcon}" alt="${description}" />
        </div>
        `;
    }

    forecastContainer.innerHTML = forecastHTML;
}




// Change unit and refresh data
function changeUnit(newUnit) {
    unit = newUnit;
    fetchWeatherAndAlerts();
}

function getCityName(latitude, longitude) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            userLocation = data.address.city || data.address.town || data.address.village || "Unknown location";
            fetchWeatherAndAlerts();
        })
        .catch(error => {
            console.error("Error getting city name:", error);
            userLocation = "Virginia";
            fetchWeatherAndAlerts();
        });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                getCityName(position.coords.latitude, position.coords.longitude);
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

function getWeatherIcon(description) {
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes("thunderstorm")) return "animated/thunder.svg";
    if (lowerDesc.includes("snow")) return "animated/snowy-6.svg";
    if (lowerDesc.includes("drizzle")) return "animated/rainy-2.svg";
    if (lowerDesc.includes("clear")) return "animated/day.svg";
    if (lowerDesc.includes("clouds")) return "animated/cloudy.svg";
    if (lowerDesc.includes("light rain")) return "animated/rainy-2.svg";
    if (lowerDesc.includes("moderate rain")) return "animated/rainy-3.svg";
    if (lowerDesc.includes("heavy intensity rain") || lowerDesc.includes("very heavy rain") || lowerDesc.includes("extreme rain")) return "animated/rainy-6.svg";
    if (lowerDesc.includes("shower rain")) return "animated/rainy-7.svg";
    if (lowerDesc.includes("freezing rain")) return "animated/snowy-6.svg";

    return "animated/weather.svg"; // Fallback icon
}

function getPrecipitationIcon(temp) {
    const freezingPoint = unit === "imperial" ? 32 : 0; // 32°F or 0°C

    if (temp <= freezingPoint) {
        return "animated/snowy-6.svg";
    } else {
        return "animated/rainy-5.svg";
    }
}

function switchTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.style.display = 'none');

    // Show the selected tab content
    document.getElementById(tabId).style.display = 'block';

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.bottom-tab button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Add active class to the clicked button
    event.target.classList.add('active');
}

function toggleFullscreen() {
    if (!document.fullscreenElement &&    // Check if not in fullscreen mode
        !document.mozFullScreenElement && // For Firefox
        !document.webkitFullscreenElement && // For Chrome, Safari and Opera
        !document.msFullscreenElement) { // For IE/Edge
        // Request fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
}


window.onload = () => {
    toggleFullscreen(); // Automatically trigger fullscreen
};


getLocation();
