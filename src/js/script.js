let allCountries = [];

async function searchCountries(value) {
  //https://restcountries.com/v3.1/region/europe
  let reply = await fetch("https://restcountries.com/v3.1/" + value);

  let data = await reply.json();
  allCountries = data;
  renderCountries(allCountries);
}

function renderCountries(allCountries) {
  document.querySelector(".allCountries").innerHTML = "";
  document.querySelector("#qt").innerHTML = allCountries.length;

  for (let county of allCountries) {
    let card = document.createElement("div");
    card.classList.add("country");

    card.innerHTML = `
      <img
        width="200"
        src="${county.flags.png}"
        alt="${county.flags.alt}"
      />
      <span>${county.name.common}</span>
    `;

    document.querySelector(".allCountries").appendChild(card);
  }
}

function filterCountries(input) {
  console.log(input.value);
  searchCountries(input.value);
}

function localSearch(input) {
  const searchedCountries = [];
  const name = input.value.toLowerCase();

  for (let country of allCountries) {
    let c = country.translations.por.common.toLowerCase();
    if (c.startsWith(name)) {
      searchedCountries.push(country);
    }
  }

  renderCountries(searchedCountries);
}

searchCountries("all");
