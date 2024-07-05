$(document).ready(function () {
    let searchHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    $('#weather-form').on('submit', function (e) {
        e.preventDefault(); // Prevent the form from submitting the traditional way

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
            console.log(response);

            // Extract relevant data from the response
            const location = response.location.name;
            const region = response.location.region;
            const country = response.location.country;
            const tempC = response.current.temp_c;
            const condition = response.current.condition.text;

            // Create HTML content with the extracted data
            const weatherHTML = `
                <p>Location: ${location}, ${region}, ${country}</p>
                <p>Temperature: ${tempC}°C</p>
                <p>Condition: ${condition}</p>
            `;

            // Insert the content into the HTML element
            $('#weatherInfo').html(weatherHTML);

            // Add the search to the history
            const historyEntry = {
                location: `${location}, ${region}, ${country}`,
                temperature: `${tempC}°C`,
                condition: condition,
                date: new Date().toLocaleString()
            };
            searchHistory.push(historyEntry);

            // Save the history to localStorage
            localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
        }).fail(function () {
            $('#weatherInfo').html('<p>Error fetching data. Please try again.</p>');
        });
    });

    // Load history on history page
    if (window.location.pathname.includes('history.html')) {
        const historyList = $('#historyList');
        const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

        if (history.length > 0) {
            history.forEach(entry => {
                const historyHTML = `
                    <p>${entry.date} - ${entry.location}: ${entry.temperature}, ${entry.condition}</p>
                `;
                historyList.append(historyHTML);
            });
        } else {
            historyList.html('<p>No history available.</p>');
        }

        // Clear history button handler
        $('#clearHistory').on('click', function () {
            localStorage.removeItem('weatherHistory');
            historyList.html('<p>No history available.</p>');
        });
    }

    // Autocomplete functionality
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


