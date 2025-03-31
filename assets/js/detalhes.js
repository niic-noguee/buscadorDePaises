async function fetchCountryDetails() {
   const params = new URLSearchParams(window.location.search);
   const countryCode = params.get("code");
   
   if (!countryCode) {
       document.getElementById("country-details").innerHTML = "País não encontrado.";
       return;
   }
   
   try {
       let response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
       let data = await response.json();
       let country = data[0];
       
       document.getElementById("country-details").innerHTML = `
           <h2>${country.name.official}</h2>
           <img 
            src="${country.flags.png}" 
            alt="Bandeira de ${country.name.official}" 
            width="200"
            />
           <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
           <p><strong>Língua:</strong> ${Object.values(country.languages || {}).join(", ")}</p>
           <p><strong>Moeda:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(", ")}</p>
           <p><strong>Continente:</strong> ${country.continents.join(", ")}</p>
           <p><strong>População:</strong> ${country.population.toLocaleString()}</p>
           <p><strong>Área geográfica:</strong> ${country.area.toLocaleString()} km²</p>
           <p><a href="${country.maps.googleMaps}" target="_blank">Ver no Google Maps</a></p>
       `;
   } catch (error) {
       document.getElementById("country-details").innerHTML = "Erro ao carregar os detalhes do país.";
   }
}

fetchCountryDetails();
