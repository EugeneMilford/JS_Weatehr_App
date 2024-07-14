$(document).ready(function () {
    let searchHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    $('#weather-form').on('submit', function (e) {
        e.preventDefault();

        const city = $('#city-input').val();

        // Perform search only when city is provided
        if (city) {
            fetchWeatherData(city);
        }
    });

    function fetchWeatherData(city) {
        const settings = {
            async: true,
            crossDomain: true,
            url: `https://weatherapi-com.p.rapidapi.com/current.json?q=${city}`,
            method: 'GET',
            headers: {
                'x-rapidapi-key': '2dbc831825msh84a073d47a621bap17f4cfjsn8a5f2a3cea0d',
                'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        $.ajax(settings).done(function (response) {
            const location = `${response.location.name}, ${response.location.region}, ${response.location.country}`;
            const tempC = response.current.temp_c;
            const condition = response.current.condition.text;
            const windKPH = response.current.wind_kph;

            const weatherHTML = `
                <p>Location: ${location}</p>
                <p>Temperature: ${tempC}°C</p>
                <p>Condition: ${condition}</p>
                <p>Wind Speed(km/h): ${windKPH}</p>
            `;

            $('#weatherInfo').html(weatherHTML);

            const historyEntry = {
                location: location,
                temperature: `${tempC}°C`,
                condition: condition,
                windkph: windKPH,
                date: new Date().toLocaleString()
            };
            searchHistory.push(historyEntry);

            localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
        }).fail(function () {
            $('#weatherInfo').html('<p>Error fetching data. Please try again.</p>');
        });
    }

    // Initialize autocomplete
    $('#city-input').autocomplete({
        source: async function (request, response) {
            try {
                const data = await weatherService.fetchCities(request.term);
                response(data.map(city => city.name));
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        },
        minLength: 2,
        select: function (event, ui) {
            $('#city-input').val(ui.item.value);
            fetchWeatherData(ui.item.value);
            return false;
        }
    });
});
