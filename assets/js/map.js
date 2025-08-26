// Inicializar el mapa
function initMap(lat = 40.4168, lng = -3.7038) {
    if (typeof google === 'undefined') {
        console.error('Google Maps API no se ha cargado correctamente');
        return;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
            {
                featureType: "poi",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    clearMarkers();
    
    therapists.forEach(therapist => {
        const marker = new google.maps.Marker({
            position: { lat: therapist.lat, lng: therapist.lng },
            map,
            title: therapist.name,
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            }
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="p-2">
                    <h3 class="font-bold">${therapist.name}</h3>
                    <p class="text-green-600">${therapist.specialty}</p>
                    <p class="text-sm">${therapist.address}</p>
                    <div class="flex items-center mt-1">
                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                        <span>${therapist.rating}</span>
                    </div>
                    <button class="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm" 
                            onclick="bookTherapist('${therapist.name}')">
                        Reservar cita
                    </button>
                </div>
            `
        });
        
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
        
        markers.push(marker);
    });
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function geocodeAddress(address, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            callback(location.lat(), location.lng());
        } else {
            alert("No se pudo encontrar la ubicación: " + status);
        }
    });
}

// Inicializar el mapa cuando se carga la API de Google Maps
window.initMap = initMap;