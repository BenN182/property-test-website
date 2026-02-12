// Load and display properties on the main page
document.addEventListener('DOMContentLoaded', function() {
    fetch('myProperties.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(properties => {
            displayProperties(properties);
        })
        .catch(error => {
            console.error('Error loading properties:', error);
            document.getElementById('property-listings').innerHTML = 
                '<div class="error">Error loading properties. Please try again later.</div>';
        });
});

function displayProperties(properties) {
    const container = document.getElementById('property-listings');
    container.innerHTML = ''; // Clear loading message
    
    properties.forEach(property => {
        // Get the first picture from the comma-separated string
        const firstPicture = property.Pictures.split(',')[0].trim();
        
        // Format price with spaces
        const formattedPrice = 'R ' + property.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        
        // Create property card
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-property-id', property.ID);
        
        // Create clickable image link
        const imageLink = document.createElement('a');
        imageLink.href = `gallery.html?id=${property.ID}`;
        imageLink.innerHTML = `<img src="${firstPicture}" alt="${property.Description}" loading="lazy">`;
        
        // Create description paragraph
        const description = document.createElement('p');
        description.textContent = `${property.Bedrooms} Bedroom ${property['Property Type']} in ${property.Suburb}, ${property.Town}, ${formattedPrice}`;
        
        card.appendChild(imageLink);
        card.appendChild(description);
        container.appendChild(card);
    });
}
