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