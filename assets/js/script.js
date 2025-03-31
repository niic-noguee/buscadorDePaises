mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycnkxMjM0OTgiLCJhIjoiY2s4OXh1c3BqMGFsZzNvbXA3YmYyaGFhYSJ9.wmVMiMxlSqpzJPsj-UXr3Q';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 1,
    center: [0, 20]
});

async function searchCountries(value) {
    let reply = await fetch("https://restcountries.com/v3.1/" + value);
    let data = await reply.json();
    renderMapMarkers(data);
}

function renderMapMarkers(countries) {
    for (let country of countries) {
        let coords = country.latlng;
        if (coords) {
            let marker = new mapboxgl.Marker()
                .setLngLat([coords[1], coords[0]])
                .addTo(map);

            marker.getElement().addEventListener('click', function (event) {
                event.stopPropagation(); // Evita conflitos de clique
                openModal(country.cca2.toLowerCase()); // Abre o modal ao invés de redirecionar
            });
        }
    }
}

searchCountries("all");
