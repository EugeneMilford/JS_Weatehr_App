$(document).ready(function () {
    let searchHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    $('#weather-form').on('submit', function (e) {
        e.preventDefault();

        const city = $('#city-input').val();

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
            const location = response.location.name;
            const region = response.location.region;
            const country = response.location.country;
            const tempC = response.current.temp_c;
            const condition = response.current.condition.text;
            const windKPH = response.current.wind_kph;

            const weatherHTML = `
                <p>Location: ${location}, ${region}, ${country}</p>
                <p>Temperature: ${tempC}°C</p>
                <p>Condition: ${condition}</p>
                <p>Wind Speed(km/h): ${windKPH}</p>
            `;

            $('#weatherInfo').html(weatherHTML);

            const historyEntry = {
                location: `${location}, ${region}, ${country}`,
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
    });

    if (window.location.pathname.includes('history.html')) {
        const historyList = $('#historyList');
        const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

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

        $('#clearHistory').on('click', function () {
            localStorage.removeItem('weatherHistory');
            historyList.html('<p>No history available.</p>');
        });

        historyList.on('click', '.delete-button', function () {
            const index = $(this).data('index');
            searchHistory.splice(index, 1);
            localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
            $(this).parent().remove();
        });

        historyList.on('click', '.details-button', function () {
            const index = $(this).data('index');
            localStorage.setItem('selectedCityIndex', index);
            window.location.href = 'details.html';
        });
    }

    $('#city-input').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: `https://weatherapi-com.p.rapidapi.com/search.json?q=${request.term}`,
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '2dbc831825msh84a073d47a621bap17f4cfjsn8a5f2a3cea0d',
                    'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
                },
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            label: item.name,
                            value: item.name
                        };
                    }));
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            $('#city-input').val(ui.item.value);
            return false;
        }
    });
});



