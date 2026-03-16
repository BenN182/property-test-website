// Store all properties globally for filtering
let allProperties = [];

// Load and display properties on the main page
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('property-listings');
    
    console.log('Attempting to load properties...'); // Debug log
    
    fetch(`myProperties.json?v=${Date.now()}`)
        .then(response => {
            console.log('Response status:', response.status); // Debug log
            console.log('Response headers:', response.headers.get('content-type')); // Debug log
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            return response.text(); // Get as text first to see what's being returned
        })
        .then(text => {
            console.log('Raw response:', text.substring(0, 200) + '...'); // Log first 200 chars
            
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('JSON parse error:', e);
                throw new Error('Invalid JSON response from server');
            }
        })
        .then(properties => {
            console.log('Properties loaded successfully:', properties.length, 'properties');
            console.log('First property:', properties[0]); // Log first property to see structure
            
            allProperties = properties;
            
            // Check if filter elements exist before populating
            if (document.getElementById('filter-town')) {
                populateFilterOptions(properties);
                setupFilterListeners();
                updatePropertyCount(properties.length);
            }
            
            displayProperties(properties);
        })
        .catch(error => {
            console.error('Error loading properties:', error);
            
            // More user-friendly error message
            let errorMessage = 'Error loading properties. ';
            
            if (error.message.includes('404')) {
                errorMessage += 'The properties file could not be found. ';
            } else if (error.message.includes('JSON')) {
                errorMessage += 'The data format is invalid. ';
            } else {
                errorMessage += 'Please try again later. ';
            }
            
            container.innerHTML = `
                <div class="error-container">
                    <h2>😕 Unable to Load Properties</h2>
                    <p>${errorMessage}</p>
                    <p class="error-details">Technical details: ${error.message}</p>
                    <button onclick="location.reload()" class="button">Refresh Page</button>
                </div>
            `;
        });
});

// Populate filter dropdowns with unique values from properties
function populateFilterOptions(properties) {
    try {
        // Get unique towns
        const towns = [...new Set(properties.map(p => p.Town).filter(Boolean))].sort();
        const townSelect = document.getElementById('filter-town');
        if (townSelect) {
            // Clear existing options except the first one
            while (townSelect.options.length > 1) {
                townSelect.remove(1);
            }
            
            towns.forEach(town => {
                const option = document.createElement('option');
                option.value = town;
                option.textContent = town;
                townSelect.appendChild(option);
            });
        }

        // Get unique suburbs
        const suburbs = [...new Set(properties.map(p => p.Suburb).filter(Boolean))].sort();
        const suburbSelect = document.getElementById('filter-suburb');
        if (suburbSelect) {
            // Clear existing options except the first one
            while (suburbSelect.options.length > 1) {
                suburbSelect.remove(1);
            }
            
            suburbs.forEach(suburb => {
                const option = document.createElement('option');
                option.value = suburb;
                option.textContent = suburb;
                suburbSelect.appendChild(option);
            });
        }
        
        // Get unique property types
        const types = [...new Set(properties.map(p => p['Property Type']).filter(Boolean))].sort();
        const typeSelect = document.getElementById('filter-type');
        if (typeSelect) {
            while (typeSelect.options.length > 1) {
                typeSelect.remove(1);
            }
            
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelect.appendChild(option);
            });
        }
        
        console.log('Filter options populated successfully'); // Debug log
        
    } catch (error) {
        console.error('Error populating filter options:', error);
    }
}

// Setup filter event listeners
function setupFilterListeners() {
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
    
    console.log('Filter listeners setup complete'); // Debug log
}

// Apply all active filters
function applyFilters() {
    try {
        const filters = {
            price: document.getElementById('filter-price')?.value || '',
            type: document.getElementById('filter-type')?.value || '',
            town: document.getElementById('filter-town')?.value || '',
            suburb: document.getElementById('filter-suburb')?.value || '',
            bedrooms: document.getElementById('filter-bedrooms')?.value || '',
            bathrooms: document.getElementById('filter-bathrooms')?.value || ''
        };
        
        console.log('Applying filters:', filters); // Debug log
        
        const filteredProperties = allProperties.filter(property => {
            // Price filter (max price)
            if (filters.price && property.Price > parseInt(filters.price)) {
                return false;
            }
            
            // Property type filter
            if (filters.type && property['Property Type'] !== filters.type) {
                return false;
            }
            
            // Town filter
            if (filters.town && property.Town !== filters.town) {
                return false;
            }
            
            // Suburb filter
            if (filters.suburb && property.Suburb !== filters.suburb) {
                return false;
            }
            
            // Bedrooms filter (minimum)
            if (filters.bedrooms && property.Bedrooms < parseInt(filters.bedrooms)) {
                return false;
            }
            
            // Bathrooms filter (minimum)
            if (filters.bathrooms && property.Bathrooms < parseInt(filters.bathrooms)) {
                return false;
            }
            
            return true;
        });
        
        console.log('Filtered properties count:', filteredProperties.length); // Debug log
        
        displayProperties(filteredProperties);
        updatePropertyCount(filteredProperties.length);
        
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

// Clear all filters
function clearFilters() {
    try {
        document.getElementById('filter-price').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-town').value = '';
        document.getElementById('filter-suburb').value = '';
        document.getElementById('filter-bedrooms').value = '';
        document.getElementById('filter-bathrooms').value = '';
        
        // Display all properties
        displayProperties(allProperties);
        updatePropertyCount(allProperties.length);
        
        console.log('Filters cleared'); // Debug log
        
    } catch (error) {
        console.error('Error clearing filters:', error);
    }
}

// Update property count display
function updatePropertyCount(count) {
    const countElement = document.getElementById('property-count');
    if (countElement) {
        if (count === 1) {
            countElement.textContent = '1 property found';
        } else {
            countElement.textContent = `${count} properties found`;
        }
    }
}

function displayProperties(properties) {
    const container = document.getElementById('property-listings');
    if (!container) {
        console.error('Property listings container not found');
        return;
    }
    
    container.innerHTML = ''; // Clear loading message
    
    if (!properties || properties.length === 0) {
        container.innerHTML = '<div class="no-results">No properties match your filters.</div>';
        return;
    }
    
    properties.forEach(property => {
        try {
            // Get the first picture from the comma-separated string
            const pictures = property.Pictures ? property.Pictures.split(',').map(url => url.trim()) : [];
            const firstPicture = pictures.length > 0 ? pictures[0] : 'https://via.placeholder.com/400x300?text=No+Image';
            
            // Format price with spaces
            const formattedPrice = 'R ' + property.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            
            // Create property card
            const card = document.createElement('div');
            card.className = 'property-card';
            card.setAttribute('data-property-id', property.ID);
            
            // Create clickable image link
            const imageLink = document.createElement('a');
            imageLink.href = `gallery.html?id=${property.ID}`;
            imageLink.innerHTML = `<img src="${firstPicture}" alt="${property.Description || 'Property image'}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">`;
            
            // Create description paragraph
            const description = document.createElement('p');
            description.textContent = `${property.Bedrooms || 0} Bedroom ${property['Property Type'] || 'Property'} in ${property.Suburb || 'Unknown'}, ${property.Town || 'Unknown'}, ${formattedPrice}`;
            
            // Add quick specs
            const specs = document.createElement('div');
            specs.className = 'property-card-specs';
            specs.innerHTML = `
                <span>🛏️ ${property.Bedrooms || 0}</span>
                <span>🛁 ${property.Bathrooms || 0}</span>
                <span>🚗 ${property.Garages || 0}</span>
                ${property.Pool ? '<span>🏊 Pool</span>' : ''}
            `;
            
            card.appendChild(imageLink);
            card.appendChild(description);
            card.appendChild(specs);
            container.appendChild(card);
        } catch (error) {
            console.error('Error displaying property:', property.ID, error);
        }
    });
    
    console.log('Displayed', properties.length, 'properties'); // Debug log
}