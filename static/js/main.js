let mapInitialized = false;
let map;

function toggleMap(cityLocations) {
    const container = document.getElementById('map-container');
    
    if (container.style.height === '' || container.style.height === '0px') {
        container.style.height = '300px'; 
        
        if (!mapInitialized) {
            setTimeout(() => initMap(cityLocations), 400); 
        }
    } else {
        container.style.height = '0px'; 
    }
}

function initMap(cityLocations) {
    map = L.map('map').setView([39.0, 35.0], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    cityLocations.forEach(city => {
        L.marker([city.lat, city.lon])
        .addTo(map)
        .bindPopup(`<b>${city.name}</b><br>${city.temp}°C, ${city.desc}`);
    });
    
    mapInitialized = true;
}

function getLocation() {
    const status = document.getElementById("geo-status");
    const btn = document.getElementById("loc-btn");
    const icon = document.getElementById("loc-icon");
    const spinner = document.getElementById("loc-spinner");

    btn.disabled = true;
    icon.style.display = "none";
    spinner.style.display = "block";
    
    status.innerHTML = "Konum alınıyor...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        status.innerHTML = "Tarayıcınız konum özelliğini desteklemiyor.";
        resetBtn();
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    window.location.href = `/?lat=${lat}&lon=${lon}`;
}

function showError(error) {
    const status = document.getElementById("geo-status");
    switch(error.code) {
        case error.PERMISSION_DENIED:
            status.innerHTML = "Lütfen konum izni verin.";
            break;
        case error.POSITION_UNAVAILABLE:
            status.innerHTML = "Konum bilgisi bulunamadı.";
            break;
        case error.TIMEOUT:
            status.innerHTML = "İstek zaman aşımına uğradı.";
            break;
        default:
            status.innerHTML = "Bilinmeyen bir hata oluştu.";
    }
    resetBtn();
}

function resetBtn() {
    const btn = document.getElementById("loc-btn");
    const icon = document.getElementById("loc-icon");
    const spinner = document.getElementById("loc-spinner");

    btn.disabled = false;
    icon.style.display = "block";
    spinner.style.display = "none";
}


document.addEventListener('DOMContentLoaded', function() {
    
    const cityInput = document.getElementById('city-input');
    const suggestionsList = document.getElementById('suggestions-list');
    let debounceTimer;

    if (cityInput) {
        console.log("Autocomplete sistemi başlatıldı.");

        cityInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            clearTimeout(debounceTimer);

            if (query.length < 2) {
                suggestionsList.style.display = 'none';
                return;
            }

            debounceTimer = setTimeout(() => {
                fetchCities(query);
            }, 300);
        });

        document.addEventListener('click', function(e) {
            if (e.target !== cityInput && e.target !== suggestionsList) {
                suggestionsList.style.display = 'none';
            }
        });
    }

    function fetchCities(query) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=tr&format=json`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.results) {
                    showSuggestions(data.results);
                } else {
                    suggestionsList.style.display = 'none';
                }
            })
            .catch(err => console.error("API Bağlantı Hatası:", err));
    }

    function showSuggestions(cities) {
        suggestionsList.innerHTML = ''; 

        if (cities.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }

        cities.forEach(city => {
            const li = document.createElement('li');
            
            const country = city.country ? `, ${city.country}` : '';
            li.textContent = `${city.name}${country}`;
            
            li.addEventListener('click', function() {
                cityInput.value = city.name;
                suggestionsList.style.display = 'none';
            });

            suggestionsList.appendChild(li);
        });

        suggestionsList.style.display = 'block';
    }
});

function confirmDelete(e, url, cityName) {
    e.preventDefault(); // Linkin hemen çalışmasını durdur
    
    // SweetAlert2 Penceresi
    Swal.fire({
        title: 'Emin misiniz?',
        text: `${cityName} şehrini silmek istiyor musunuz?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Kırmızı
        cancelButtonColor: '#334155', // Gri
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'Vazgeç',
        background: '#1e293b', // Senin koyu panel rengin
        color: '#f1f5f9'       // Senin yazı rengin
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = url; 
        }
    });
}