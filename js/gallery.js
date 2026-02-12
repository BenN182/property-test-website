// Get property ID from URL
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', function() {
    if (!propertyId) {
        showError('No property selected');
        return;
    }
    
    fetch('../myProperties.json') // Adjust path if needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(properties => {
            const property = properties.find(p => p.ID == propertyId);
            if (property) {
                displayGallery(property);
            } else {
                showError('Property not found');
            }
        })
        .catch(error => {
            console.error('Error loading property:', error);
            showError('Error loading property details');
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
                        <img src="${pic}" alt="Property photo ${index + 1}" onclick="openFullscreen(this)" loading="lazy">
                    </div>
                `).join('')}
            </div>
            
            <div class="property-actions">
                <a href="https://wa.me/27696466635?text=I'm interested in: ${encodeURIComponent(property.Description)}" 
                   class="button" target="_blank">📱 Inquire on WhatsApp</a>
            </div>
        </div>
    `;
    
    container.innerHTML = galleryHTML;
}

function showError(message) {
    const container = document.getElementById('gallery-container');
    container.innerHTML = `
        <div class="error-container">
            <h2>${message}</h2>
            <a href="myproperties.html" class="button">Back to Properties</a>
        </div>
    `;
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
    
    // Close fullscreen when clicking close button or outside the image
    fullscreenDiv.addEventListener('click', function(e) {
        if (e.target === fullscreenDiv || e.target.className === 'close-fullscreen') {
            fullscreenDiv.remove();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.contains(fullscreenDiv)) {
            fullscreenDiv.remove();
        }
    });
}

// Make openFullscreen globally available
window.openFullscreen = openFullscreen;
