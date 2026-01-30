document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchForm = document.getElementById('searchForm');
    const cityInput = document.getElementById('cityInput');
    const clearBtn = document.getElementById('clearBtn');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const goBackBtn = document.getElementById('goBackBtn');
    const weatherContent = document.getElementById('weatherContent');

    // UI Elements for Data
    const cityNameEl = document.getElementById('cityName');
    const dateTextEl = document.getElementById('dateText');
    const weatherIconContainer = document.getElementById('weatherIconContainer');
    const conditionTextEl = document.getElementById('conditionText');
    const tempValueEl = document.getElementById('tempValue');
    const feelsLikeTextEl = document.getElementById('feelsLikeText');
    const windSpeedEl = document.getElementById('windSpeed');
    const humidityEl = document.getElementById('humidity');
    const pressureEl = document.getElementById('pressure');
    const visibilityEl = document.getElementById('visibility');

    // Icons Mapping (using Lucide names)
    const getIconName = (condition) => {
        switch (condition.toLowerCase()) {
            case 'clear': return 'sun';
            case 'clouds': return 'cloud';
            case 'rain': return 'cloud-rain';
            case 'snow': return 'snowflake';
            case 'thunderstorm': return 'cloud-lightning';
            case 'fog': return 'cloud-fog';
            default: return 'cloud';
        }
    };

    const getIconColorClass = (condition) => {
        switch (condition.toLowerCase()) {
            case 'clear': return 'text-yellow-400';
            case 'rain': return 'text-blue-400';
            case 'thunderstorm': return 'text-purple-400';
            case 'snow': return 'text-cyan-200';
            default: return 'text-slate-400';
        }
    };

    // Helper: Get Weather Condition
    const getWeatherCondition = (code) => {
        if (code === 0) return 'Clear';
        if (code >= 1 && code <= 3) return 'Clouds';
        if (code >= 45 && code <= 48) return 'Fog';
        if (code >= 51 && code <= 67) return 'Rain';
        if (code >= 71 && code <= 77) return 'Snow';
        if (code >= 80 && code <= 82) return 'Rain';
        if (code >= 85 && code <= 86) return 'Snow';
        if (code >= 95) return 'Thunderstorm';
        return 'Clouds';
    };

    // Fetch Weather Data
    const fetchWeather = async (city) => {
        showLoading();
        try {
            // 1. Geocoding
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error(`Could not find "${city}"`);
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // 2. Weather Data
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,visibility&timezone=auto`);
            const weatherData = await weatherRes.json();

            const current = weatherData.current;
            const weather = {
                city: `${name}, ${country}`,
                temp: current.temperature_2m,
                condition: getWeatherCondition(current.weather_code),
                feelsLike: current.apparent_temperature,
                humidity: current.relative_humidity_2m,
                windSpeed: current.wind_speed_10m,
                pressure: current.surface_pressure,
                visibility: current.visibility / 1000,
            };

            updateUI(weather);
        } catch (err) {
            showError(err.message);
        }
    };

    // Update UI
    const updateUI = (data) => {
        hideLoading();
        errorDiv.classList.add('hidden');
        weatherContent.classList.remove('hidden');

        // Text Data
        cityNameEl.textContent = data.city;
        dateTextEl.textContent = `Tomorrow, ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
        
        conditionTextEl.textContent = data.condition;
        tempValueEl.textContent = `${Math.round(data.temp)}°`;
        feelsLikeTextEl.textContent = `Feels like ${Math.round(data.feelsLike)}°`;
        
        windSpeedEl.textContent = data.windSpeed;
        humidityEl.textContent = data.humidity;
        pressureEl.textContent = data.pressure;
        visibilityEl.textContent = data.visibility;

        // Icon
        const iconName = getIconName(data.condition);
        const colorClass = getIconColorClass(data.condition);
        
   
        weatherIconContainer.innerHTML = `<i data-lucide="${iconName}" class="${colorClass}" style="width: 84px; height: 84px;"></i>`;
        
      
        lucide.createIcons();
    };

    const showLoading = () => {
        loadingDiv.classList.remove('hidden');
        weatherContent.classList.add('hidden');
        errorDiv.classList.add('hidden');
    };

    const hideLoading = () => {
        loadingDiv.classList.add('hidden');
    };

    // Error State
    const showError = (msg) => {
        hideLoading();
        weatherContent.classList.add('hidden');
        errorDiv.classList.remove('hidden');
        errorMessage.textContent = msg;
    };

    // Event Listeners
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });

    cityInput.addEventListener('input', () => {
        if (cityInput.value.trim()) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    });

    clearBtn.addEventListener('click', () => {
        cityInput.value = '';
        clearBtn.classList.add('hidden');
        cityInput.focus();
    });

    goBackBtn.addEventListener('click', () => {
        cityInput.value = '';
        fetchWeather('Dhaka');
    });

    // Initial Load
    lucide.createIcons();
    fetchWeather('Dhaka');
});
