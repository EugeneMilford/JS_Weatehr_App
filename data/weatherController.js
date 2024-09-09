// weatherController.js
$(document).ready(function () {
    const historyList = $('#historyList');
    const cityInput = $('#city-input');

    $('#weather-form').on('submit', async function (e) {
        e.preventDefault();
        const city = cityInput.val();

        try {
            const response = await weatherService.getCurrentWeather(city);

            // Process weather data
            const weatherInfo = response.current;
            const location = response.location;

            const weatherHTML = `
                <p>Location: ${location.name}, ${location.region}, ${location.country}</p>
                <p>Temperature: ${weatherInfo.temp_c}°C</p>
                <p>Condition: ${weatherInfo.condition.text}</p>
                <p>Wind Speed(km/h): ${weatherInfo.wind_kph}</p>
            `;
            $('#weatherInfo').html(weatherHTML);

            // Save to history
            const historyEntry = {
                location: `${location.name}, ${location.region}, ${location.country}`,
                temperature: `${weatherInfo.temp_c}°C`,
                condition: weatherInfo.condition.text,
                windkph: weatherInfo.wind_kph,
                date: new Date().toLocaleString()
            };
            const searchHistory = weatherRepository.getHistory();
            searchHistory.push(historyEntry);
            weatherRepository.saveHistory(searchHistory);
        } catch (error) {
            $('#weatherInfo').html('<p>Error fetching data. Please try again.</p>');
        }
    });

    $('#clearHistoryButton').on('click', function () {
    weatherRepository.clearHistory(); // Clear history from the repository
    $('#historyList').html('<p>No history available.</p>'); // Update the UI to reflect the cleared history
});

    historyList.on('click', '.delete-button', function () {
        const index = $(this).data('index');
        const searchHistory = weatherRepository.getHistory();
        searchHistory.splice(index, 1);
        weatherRepository.saveHistory(searchHistory);
        $(this).parent().remove();
    });

    historyList.on('click', '.details-button', function () {
        const index = $(this).data('index');
        localStorage.setItem('selectedCityIndex', index);
        window.location.href = 'details.html';
    });

    cityInput.autocomplete({
        source: function (request, response) {
            weatherService.searchCities(request.term)
                .then(data => {
                    response($.map(data, item => ({
                        label: item.name,
                        value: item.name
                    })));
                })
                .catch(error => {
                    console.error('Error fetching cities:', error);
                    response([]);
                });
        },
        minLength: 2,
        select: function (event, ui) {
            cityInput.val(ui.item.value);
            return false;
        }
    });

    // Populate history on history.html
    if (window.location.pathname.includes('history.html')) {
        const history = weatherRepository.getHistory();
        if (history.length > 0) {
            history.forEach((entry, index) => {
                const historyHTML = `
                    <div class="history-entry" data-index="${index}">
                        <p>${entry.date} - ${entry.location}: ${entry.temperature}, ${entry.condition}</p>
                        <button class="details-button btn btn-info" data-index="${index}">Details</button>
                        <button class="delete-button btn btn-danger" data-index="${index}">Delete</button>
                    </div>
                `;
                historyList.append(historyHTML);
            });
        } else {
            historyList.html('<p>No history available.</p>');
        }
    }
});

