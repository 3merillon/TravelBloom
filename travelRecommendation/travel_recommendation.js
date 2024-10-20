document.addEventListener('DOMContentLoaded', function() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    const searchButton = document.querySelector('.search-bar button');
    const clearButton = document.getElementById('clear-button');
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    let travelData;

    // Time zone mapping for countries
    const timeZoneMapping = {
        "Australia": "Australia/Sydney",
        "Japan": "Asia/Tokyo",
        "Brazil": "America/Sao_Paulo",
        "Cambodia": "Asia/Phnom_Penh",
        "India": "Asia/Kolkata",
        "French Polynesia": "Pacific/Tahiti"
    };

    // Fetch data from the JSON file
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Check if data is fetched correctly
            travelData = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Function to display recommendations
    function displayRecommendations(recommendations) {
        recommendationsContainer.innerHTML = ''; // Clear previous results
        recommendations.forEach(recommendation => {
            const recommendationCard = document.createElement('div');
            recommendationCard.classList.add('recommendation-card');

            const img = document.createElement('img');
            img.src = `img/${recommendation.imageUrl}`; // Updated path for images
            img.alt = recommendation.name;

            const name = document.createElement('h3');
            name.textContent = recommendation.name;

            const description = document.createElement('p');
            description.textContent = recommendation.description;

            const time = document.createElement('div');
            time.classList.add('time');
            const countryName = getCountryName(recommendation.name);
            const timeZone = timeZoneMapping[countryName];
            if (timeZone) {
                updateTime(time, timeZone);
            } else {
                time.textContent = "Time zone not available";
            }

            const visitButton = document.createElement('button');
            visitButton.textContent = 'Visit';
            visitButton.addEventListener('click', function() {
                alert('Booking functionality coming soon!');
            });

            recommendationCard.appendChild(img);
            recommendationCard.appendChild(name);
            recommendationCard.appendChild(description);
            recommendationCard.appendChild(time);
            recommendationCard.appendChild(visitButton);
            recommendationsContainer.appendChild(recommendationCard);
        });
    }

    // Function to get country name from location name
    function getCountryName(locationName) {
        const parts = locationName.split(', ');
        return parts[parts.length - 1];
    }

    // Function to update time
    function updateTime(element, timeZone) {
        const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        setInterval(() => {
            const currentTime = new Date().toLocaleTimeString('en-US', options);
            element.textContent = `Current time: ${currentTime}`;
        }, 1000);
    }

    // Function to handle search
    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        let results = [];

        if (query.includes('beach') || query.includes('beaches')) {
            results = results.concat(travelData.beaches);
        }
        if (query.includes('temple') || query.includes('temples')) {
            results = results.concat(travelData.temples);
        }
        if (query.includes('country') || query.includes('countries')) {
            travelData.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        }

        displayRecommendations(results);
    }

    // Function to clear search results
    function clearResults() {
        recommendationsContainer.innerHTML = ''; // Clear displayed search results
        searchInput.value = ''; // Clear the search input field
    }

    // Add event listener to the search button
    searchButton.addEventListener('click', handleSearch);

    // Add event listener for the "Enter" key in the search input field
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Add event listener to the clear button
    clearButton.addEventListener('click', clearResults);
});