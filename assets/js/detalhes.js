// Criar modal no HTML se ainda não existir
document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("countryModal")) {
        document.body.insertAdjacentHTML("beforeend", `
            <div id="countryModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="closeModal()">&times;</span>
                    <div id="countryDetails"></div>
                </div>
            </div>
        `);
    }
});

// Função para abrir o modal com detalhes do país
async function openModal(code) {
    try {
        let reply = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        let data = await reply.json();

        if (!data || data.length === 0) {
            throw new Error("País não encontrado");
        }

        const country = data[0];
        document.getElementById("countryDetails").innerHTML = `
            <h2>${country.name.official}</h2>
            <img src="${country.flags.png}" alt="Bandeira de ${country.name.common}" width="200" />
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Língua(s):</strong> ${Object.values(country.languages).join(', ')}</p>
            <p><strong>Moeda:</strong> ${Object.values(country.currencies)[0].name}</p>
            <p><strong>Continente:</strong> ${country.region}</p>
            <p><strong>População:</strong> ${country.population}</p>
            <p><strong>Área geográfica:</strong> ${country.area} km²</p>
            <p><a href="https://www.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}" target="_blank">Ver no Google Maps</a></p>
        `;

        document.getElementById("countryModal").style.display = "flex";
    } catch (error) {
        document.getElementById("countryDetails").innerHTML = `<p>Erro ao carregar detalhes do país.</p>`;
        console.error("Erro ao buscar detalhes do país:", error);
    }
}

// Função para fechar o modal
function closeModal() {
    document.getElementById("countryModal").style.display = "none";
}
