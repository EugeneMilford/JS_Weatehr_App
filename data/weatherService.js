// weatherService.js
class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://weatherapi-com.p.rapidapi.com';
    }

    async getCurrentWeather(city) {
        const url = `${this.baseUrl}/current.json?q=${city}`;
        return this._fetchWeather(url);
    }

    async searchCities(query) {
        const url = `${this.baseUrl}/search.json?q=${query}`;
        return this._fetchWeather(url);
    }

    async _fetchWeather(url) {
        const settings = {
            async: true,
            crossDomain: true,
            url: url,
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        try {
            const response = await $.ajax(settings);
            return response;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }
}

// Export instance for singleton pattern
const weatherService = new WeatherService('2dbc831825msh84a073d47a621bap17f4cfjsn8a5f2a3cea0d');
