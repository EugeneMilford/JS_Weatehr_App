const settings = {
            async: true,
            crossDomain: true,
            url: 'https://weatherapi-com.p.rapidapi.com/current.json?q=london',
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
        });


