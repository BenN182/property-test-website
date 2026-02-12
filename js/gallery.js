// Get property ID from URL
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('id');

console.log('Raw property ID from URL:', propertyId);
console.log('Type of property ID:', typeof propertyId);

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('gallery-container');
    
    if (!propertyId) {
        container.innerHTML = `
            <div class="error-container">
                <h2>No property selected</h2>
                <p>URL parameter 'id' is missing</p>
                <a href="myproperties.html" class="button">Back to Properties</a>
            </div>
        `;
        return;
    }
    
    // Show loading message
    container.innerHTML = '<div class="loading">Loading property details...</div>';
    
    fetch('myProperties.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(properties => {
            console.log('All properties loaded:', properties);
            console.log('Looking for property with ID:', propertyId);
            console.log('Property ID type:', typeof propertyId);
            console.log('First property ID type:', typeof properties[0].ID);
            
            // Try different comparison methods
            const property1 = properties.find(p => p.ID == propertyId);  // Loose comparison
            const property2 = properties.find(p => p.ID === parseInt(propertyId));  // Strict with parseInt
            const property3 = properties.find(p => String(p.ID) === propertyId);  // String comparison
            
            console.log('Loose comparison (==) result:', property1);
            console.log('Strict with parseInt result:', property2);
            console.log('String comparison result:', property3);
            
            // Use the one that works
            const property = property1 || property2 || property3;
            
            if (property) {
                console.log('Property found:', property);
                displayGallery(property);
            } else {
                container.innerHTML = `
                    <div class="error-container">
                        <h2>Property not found</h2>
                        <p>Property ID: ${propertyId}</p>
                        <p>Available IDs: ${properties.map(p => p.ID).join(', ')}</p>
                        <a href="myproperties.html" class="button">Back to Properties</a>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading property:', error);
            container.innerHTML = `
                <div class="error-container">
                    <h2>Error Loading Property Details</h2>
                    <p>${error.message}</p>
                    <a href="myproperties.html" class="button">Back to Properties</a>
                </div>
            `;
        });
});

function displayGallery(property) {
    const container = document.getElementById('gallery-container');
    
    // Parse picture URLs
    const pictures = property.Pictures.split(',').map(url => url.trim());
    
    // Format price
    const formattedPrice = 'R ' + property.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    // Create gallery HTML
    const galleryHTML = `
        <div class="property-details">
            <a href="myproperties.html" class="back-button">← Back to Properties</a>
            
            <div class="property-header">
                <h1>${property.Bedrooms} Bedroom ${property['Property Type']} in ${property.Suburb}</h1>
                <p class="property-location">${property.Town} - ${property.Suburb}</p>
                <p class="property-price">${formattedPrice}</p>
            </div>
            
            <div class="property-specs">
                <div class="spec-item">🛏️ ${property.Bedrooms} Bedrooms</div>
                <div class="spec-item">🛁 ${property.Bathrooms} Bathrooms</div>
                <div class="spec-item">🚗 ${property.Garages > 0 ? property.Garages + ' Garages' : 'No Garage'}</div>
                <div class="spec-item">🅿️ ${property.Carports > 0 ? property.Carports + ' Carports' : 'No Carport'}</div>
                ${property.Pool ? '<div class="spec-item">🏊 Pool</div>' : ''}
                ${property['Stand size'] ? `<div class="spec-item">📏 Stand: ${property['Stand size']} m²</div>` : ''}
                ${property['Floor size'] ? `<div class="spec-item">📐 Floor: ${property['Floor size']} m²</div>` : ''}
            </div>
            
            <div class="property-description">
                <h3>Description</h3>
                <p>${property.Description}</p>
            </div>
            
            <div class="gallery-header">
                <h3>Property Gallery (${pictures.length} photos)</h3>
            </div>
            
            <div class="image-gallery">
                ${pictures.map((pic, index) => `
                    <div class="gallery-item">
                        <img src="${pic}" alt="Property photo ${index + 1}" onclick="openFullscreen(this)" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                    </div>
                `).join('')}
            </div>
            
            <div class="property-actions">
                <a href="https://wa.me/27696466635?text=I'm interested in: ${encodeURIComponent(property.Description)} (ID: ${property.ID})" 
                   class="button" target="_blank">📱 Inquire on WhatsApp</a>
            </div>
        </div>
    `;
    
    container.innerHTML = galleryHTML;
}

// Fullscreen image viewer
function openFullscreen(img) {
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.className = 'fullscreen-viewer';
    fullscreenDiv.innerHTML = `
        <span class="close-fullscreen">&times;</span>
        <img src="${img.src}" alt="${img.alt}">
    `;
    
    document.body.appendChild(fullscreenDiv);
    
    fullscreenDiv.addEventListener('click', function(e) {
        if (e.target === fullscreenDiv || e.target.className === 'close-fullscreen') {
            fullscreenDiv.remove();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.contains(fullscreenDiv)) {
            fullscreenDiv.remove();
        }
    });
}

window.openFullscreen = openFullscreen;
