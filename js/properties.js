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
    container.innerHTML = '';
    
    properties.forEach(property => {
        const firstPicture = property.Pictures.split(',')[0].trim();
        const formattedPrice = 'R ' + property.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        
        const card = document.createElement('div');
        card.className = 'property-card';
        
        // Create clickable link with ID parameter - FIXED
        const imageLink = document.createElement('a');
        imageLink.href = `gallery.html?id=${property.ID}`;
        console.log(`Creating link for property ${property.ID}: ${imageLink.href}`); // Debug log
        
        const img = document.createElement('img');
        img.src = firstPicture;
        img.alt = property.Description;
        img.loading = 'lazy';
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/300x200?text=Property+Image';
        };
        
        imageLink.appendChild(img);
        
        const description = document.createElement('p');
        description.textContent = `${property.Bedrooms} Bedroom ${property['Property Type']} in ${property.Suburb}, ${property.Town}, ${formattedPrice}`;
        
        card.appendChild(imageLink);
        card.appendChild(description);
        container.appendChild(card);
    });
}
