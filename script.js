// Use the saved API keys for execution
const weatherApiKey = '8884e1c68d878cb2cf288659918e0edf';
const mapboxApiKey = 'pk.eyJ1IjoiYWF5dXNoc2hhcm1hMjAwMCIsImEiOiJjbHg3ZjBuc20wMDFhMmtyNG9lMGttZTdwIn0.BDurfkqDZbJXAK819kFI1g';

document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    getWeather(city);
});

document.getElementById('refresh').addEventListener('click', function () {
    location.reload();
});

function getWeather(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            displayMap(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('Error fetching weather data:', error));

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

function displayWeather(data) {
    const weatherIcon = getWeatherIcon(data.weather[0].main);
    const weatherInfo = `
        <h2>${data.name}</h2>
        <img id="weatherIcon" src="icons/${weatherIcon}" alt="${data.weather[0].main}">
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
    document.getElementById('weatherInfo').innerHTML = weatherInfo;
}

function displayForecast(data) {
    const forecastData = [];
    const today = new Date();
    const dates = [];

    for (let i = 0; i < data.list.length; i++) {
        const forecastDate = new Date(data.list[i].dt * 1000);
        const dateStr = forecastDate.toLocaleDateString();

        if (!dates.includes(dateStr)) {
            dates.push(dateStr);
            forecastData.push(data.list[i]);
        }

        if (forecastData.length === 5) {
            break;
        }
    }

    const forecastHTML = forecastData.map(forecast => {
        const weatherIcon = getWeatherIcon(forecast.weather[0].main);
        return `
            <div class="forecastItem">
                <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
                <img src="icons/${weatherIcon}" alt="${forecast.weather[0].main}">
                <p>Temp: ${forecast.main.temp} °C</p>
                <p>${forecast.weather[0].description}</p>
            </div>
        `;
    }).join('');
    document.getElementById('forecastData').innerHTML = forecastHTML;
}

function getWeatherIcon(weather) {
    switch (weather.toLowerCase()) {
        case 'clear':
            return 'clear.png';
        case 'clouds':
            return 'cloudy.png';
        case 'rain':
            return 'rain.png';
        case 'snow':
            return 'snow.png';
        case 'thunderstorm':
            return 'thunderstorm.png';
        default:
            return 'clear.png';
    }
}

function displayMap(lat, lon) {
    mapboxgl.accessToken = mapboxApiKey;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lon, lat],
        zoom: 10
    });

    new mapboxgl.Marker()
        .setLngLat([lon, lat])
        .addTo(map);
}
