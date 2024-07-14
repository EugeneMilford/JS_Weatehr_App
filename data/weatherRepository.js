// weatherRepository.js
class WeatherRepository {
    constructor() {
        this.storageKey = 'weatherHistory';
    }

    getHistory() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    saveHistory(history) {
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }
}

// Export instance for singleton pattern
const weatherRepository = new WeatherRepository();

