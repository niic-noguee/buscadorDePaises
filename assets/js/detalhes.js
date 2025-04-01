document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("countryModal")) {
        document.body.insertAdjacentHTML("beforeend", `
            <div id="countryModal" class="modal">
                <div class="modal-content">
                    <div id="countryDetails"></div>
                </div>
            </div>
        `);
    }
});

async function openModal(code) {
    try {
        document.getElementById("countryDetails").innerHTML = `
            <div class="modal-loading">
                <div class="loader"></div>
                <p>Carregando informações do país...</p>
            </div>
        `;
        
        document.getElementById("countryModal").style.display = "flex";
        
        let reply = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        let data = await reply.json();

        if (!data || data.length === 0) throw new Error("País não encontrado");

        const country = data[0];
        const currencies = country.currencies ? 
            Object.values(country.currencies).map(c => `${c.name} (${c.symbol || 'N/A'})`).join(', ') : 'N/A';
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
        const borders = country.borders ? `${country.borders.length} países` : 'Nenhuma';
        const timezones = country.timezones ? country.timezones.join(', ') : 'N/A';

        document.getElementById("countryDetails").innerHTML = `
            <div class="modal-header">
                <h2>${country.name.official}</h2>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            
            <div class="modal-body">
                <div class="modal-flag">
                    <img src="${country.flags.png}" alt="Bandeira de ${country.name.common}" />
                </div>
                
                <div class="info-item">
                    <strong>Capital</strong>
                    <p>${country.capital || 'N/A'}</p>
                </div>
                
                <div class="info-item">
                    <strong>Continente</strong>
                    <p>${country.region} ${country.subregion ? `(${country.subregion})` : ''}</p>
                </div>
                
                <div class="info-item">
                    <strong>População</strong>
                    <p>${country.population.toLocaleString()}</p>
                </div>
                
                <div class="info-item">
                    <strong>Área</strong>
                    <p>${country.area.toLocaleString()} km²</p>
                </div>
                
                <div class="info-item">
                    <strong>Língua(s)</strong>
                    <p>${languages}</p>
                </div>
                
                <div class="info-item">
                    <strong>Moeda(s)</strong>
                    <p>${currencies}</p>
                </div>
                
                <div class="info-item">
                    <strong>Fusos Horários</strong>
                    <p>${timezones}</p>
                </div>
                
                <div class="info-item">
                    <strong>Fronteiras com</strong>
                    <p>${borders}</p>
                </div>
            </div>
            
            <div class="modal-footer">
                <a href="https://www.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}" target="_blank" class="map-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Ver no Mapa
                </a>
                ${country.maps?.googleMaps ? `
                <a href="${country.maps.googleMaps}" target="_blank" class="map-button" style="margin-left: 10px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Google Maps
                </a>
                ` : ''}
            </div>
        `;
        
    } catch (error) {
        document.getElementById("countryDetails").innerHTML = `
            <div class="modal-error">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>Erro ao carregar detalhes</h3>
                <p>${error.message || 'Tente novamente mais tarde'}</p>
            </div>
        `;
        console.error("Erro ao buscar detalhes do país:", error);
    }
}

function closeModal() {
    document.getElementById("countryModal").style.display = "none";
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

document.getElementById('countryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});