mapboxgl.accessToken = 'pk.eyJ1IjoiaGFycnkxMjM0OTgiLCJhIjoiY2s4OXh1c3BqMGFsZzNvbXA3YmYyaGFhYSJ9.wmVMiMxlSqpzJPsj-UXr3Q';

let map;
let markers = [];
let currentCountry = null;

// Botão "Explorar Mundo"
document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('welcome-screen').classList.add('animate__animated', 'animate__fadeOut');
    setTimeout(() => {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        
        if (!map) {
            initializeMap();
        }
        addSearchBar();
    }, 500);
});

// Adicionar barra de pesquisa dinamicamente
function addSearchBar() {
    const header = document.createElement('div');
    header.className = 'map-header';
    header.innerHTML = `
        <div class="search-container">
            <input type="text" id="country-search" placeholder="Buscar país..." />
            <button id="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button id="reset-button" title="Mostrar todos os países">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14 16L18 12M18 12L14 8M18 12H6M6 3H8M16 3H18M6 21H8M16 21H18M12 3H14M12 21H14M19 3H20V5M19 21H20V19M5 21H4V19M5 3H4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div id="country-info" class="country-info"></div>
    `;
    document.body.insertBefore(header, document.getElementById('map'));

    document.getElementById('country-search').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchCountriesByName(this.value);
        }
    });

    document.getElementById('search-button').addEventListener('click', function() {
        const searchValue = document.getElementById('country-search').value;
        searchCountriesByName(searchValue);
    });

    document.getElementById('reset-button').addEventListener('click', function() {
        document.getElementById('country-search').value = '';
        searchCountries("all");
        document.getElementById('country-info').innerHTML = '';
        if (currentCountry) {
            map.flyTo({
                center: [0, 20],
                zoom: 1
            });
            currentCountry = null;
        }
    });
}

// Inicializar o mapa
function initializeMap() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        zoom: 1,
        center: [0, 20]
    });

    map.on('load', function() {
        searchCountries("all");
        // Controles 
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.FullscreenControl());
        // Geolocalização
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        }));
    });
    
    // Clique no mapa para limpar seleção
    map.on('click', function() {
        if (currentCountry) {
            document.getElementById('country-info').innerHTML = '';
            currentCountry = null;
        }
    });
}

// Função para buscar países por nome
async function searchCountriesByName(name) {
    if (name.trim().length > 0) {
        searchCountries(`name/${name}`);
    } else {
        searchCountries("all");
    }
}

// Função principal para buscar países
async function searchCountries(value) {
    try {
        document.getElementById('country-info').innerHTML = '<div class="loading">Carregando...</div>';
        
        let reply = await fetch(`https://restcountries.com/v3.1/${value}`);
        
        if (!reply.ok) {
            throw new Error('País não encontrado');
        }
        
        let data = await reply.json();
        
        // Se for busca por nome e encontrar apenas 1 país, voa até ele
        if (value.includes('name/') && data.length === 1) {
            showCountryOnMap(data[0]);
        } else {
            renderMapMarkers(data);
        }
        
        document.getElementById('country-info').innerHTML = '';
    } catch (error) {
        console.error("Erro ao buscar países:", error);
        document.getElementById('country-info').innerHTML = `
            <div class="error">País não encontrado. Tente outro nome.</div>
        `;
    }
}

// Função para mostrar um país específico no mapa
function showCountryOnMap(country) {
    currentCountry = country;
    const coords = country.latlng;
    
    // Voa até o país
    map.flyTo({
        center: [coords[1], coords[0]],
        zoom: 5
    });
    
    // Mostra informações básicas
    document.getElementById('country-info').innerHTML = `
        <div class="country-card">
            <img src="${country.flags.png}" alt="${country.name.common}" />
            <div>
                <h3>${country.name.common}</h3>
                <p>${country.region} • ${country.subregion || ''}</p>
                <button onclick="openModal('${country.cca2.toLowerCase()}')">Ver detalhes</button>
            </div>
        </div>
    `;
}

// Marcadores do mapa
function renderMapMarkers(countries) {
    clearMarkers();
    // Adiciona um marcador para cada país
    countries.forEach(country => {
        const coords = country.latlng;
        if (coords) {
            const el = document.createElement('div');
            el.className = 'country-marker';
            el.innerHTML = `
                <div class="marker-pin"></div>
                <div class="marker-label">${country.name.common}</div>
            `;

            const marker = new mapboxgl.Marker({
                element: el
            })
            .setLngLat([coords[1], coords[0]])
            .addTo(map);
         
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                showCountryOnMap(country);
                openModal(country.cca2.toLowerCase());
            });
            
            markers.push(marker);
        }
    });
}

// Função para limpar todos os marcadores
function clearMarkers() {
    markers.forEach(marker => marker.remove());
    markers = [];
}

// Fechar modal apertando ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});