$(document).ready(function () {
    // Retrieve the selected city index from localStorage
    const selectedCityIndex = localStorage.getItem('selectedCityIndex');
    // Get weather history from localStorage
    const weatherHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    // Check if selected index and history exists
    if (selectedCityIndex !== null && weatherHistory[selectedCityIndex]) {
        const detail = weatherHistory[selectedCityIndex];

        // Build HTML to display the weather details
        const detailsHTML = `
            <p>Location: ${detail.location}</p>
            <p>Temperature: ${detail.temperature}</p>
            <p>Condition: ${detail.condition}</p>
            <p>Wind Speed (km/h): ${detail.windkph}</p>
            <p>Date: ${detail.date}</p>
        `;
        // Populate the details info div
        $('#detailsInfo').html(detailsHTML);
    } else {
        $('#detailsInfo').html('<p>No details available.</p>');
    }

    // Clear the selected index after use (optional)
    localStorage.removeItem('selectedCityIndex');
});

