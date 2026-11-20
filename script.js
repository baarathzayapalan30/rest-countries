
/* ==============================
   ELEMENTS
============================== */

const countriesGrid = document.getElementById("countriesGrid");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");

const homePage = document.getElementById("homePage");
const detailPage = document.getElementById("detailPage");

const countryDetails = document.getElementById("countryDetails");
const backButton = document.getElementById("backButton");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

const loadingMessage = document.getElementById("loadingMessage");


/* ==============================
   VARIABLES
============================== */

let allCountries = [];
let filteredCountries = [];


/* ==============================
   FETCH COUNTRY DATA
============================== */

async function fetchCountries() {

    try {

        loadingMessage.hidden = false;

        const response = await fetch("./data.json");

        if (!response.ok) {
            throw new Error("Unable to load country data");
        }

        allCountries = await response.json();

        filteredCountries = allCountries;

        loadingMessage.hidden = true;

        // Check if a country is selected in the URL
        const params = new URLSearchParams(window.location.search);
        const countryName = params.get("country");

        if (countryName) {
            showCountryDetails(countryName);
        } else {
            displayCountries(allCountries);
        }

    } catch (error) {

        loadingMessage.textContent =
            "Something went wrong while loading countries.";

        console.error(error);

    }

}


/* ==============================
   DISPLAY COUNTRY CARDS
============================== */

function displayCountries(countries) {

    countriesGrid.innerHTML = "";

    if (countries.length === 0) {

        countriesGrid.innerHTML =
            `<p class="message">No countries found!</p>`;

        return;

    }

    countries.forEach(country => {

        const card = document.createElement("article");

        card.className = "country-card";

        card.innerHTML = `

            <img
                src="${country.flags?.svg || country.flags?.png || ""}"
                alt="Flag of ${country.name}"
                loading="lazy"
            >

            <div class="country-info">

                <h2>${country.name}</h2>

                <p>
                    <strong>Population:</strong>
                    ${Number(country.population || 0).toLocaleString("en-US")}
                </p>

                <p>
                    <strong>Region:</strong>
                    ${country.region || "N/A"}
                </p>

                <p>
                    <strong>Capital:</strong>
                    ${country.capital || "N/A"}
                </p>

            </div>

        `;

        card.addEventListener("click", () => {

            openCountry(country.name);

        });

        countriesGrid.appendChild(card);

    });

}


/* ==============================
   SEARCH COUNTRIES
============================== */

searchInput.addEventListener("input", () => {

    filterCountries();

});


/* ==============================
   FILTER BY REGION
============================== */

regionFilter.addEventListener("change", () => {

    filterCountries();

});


/* ==============================
   SEARCH + REGION FILTER
============================== */

function filterCountries() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const selectedRegion = regionFilter.value;

    filteredCountries = allCountries.filter(country => {

        const matchesName = country.name
            .toLowerCase()
            .includes(searchValue);

        const matchesRegion =
            selectedRegion === "" ||
            country.region === selectedRegion;

        return matchesName && matchesRegion;

    });

    displayCountries(filteredCountries);

}


/* ==============================
   OPEN COUNTRY DETAILS
============================== */

function openCountry(countryName) {

    window.location.href =
        `index.html?country=${encodeURIComponent(countryName)}`;

}


/* ==============================
   SHOW COUNTRY DETAILS
============================== */

function showCountryDetails(countryName) {

    const country = allCountries.find(item =>
        item.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) {

        countryDetails.innerHTML =
            "<p class='message'>Country not found!</p>";

        homePage.hidden = true;
        detailPage.hidden = false;

        return;

    }

    homePage.hidden = true;
    detailPage.hidden = false;

    const currencies = country.currencies?.length
        ? country.currencies.map(currency => currency.name).join(", ")
        : "N/A";

    const languages = country.languages?.length
        ? country.languages.map(language => language.name).join(", ")
        : "N/A";

    const domains = country.topLevelDomain?.length
        ? country.topLevelDomain.join(", ")
        : "N/A";

    const nativeName = country.nativeName || "N/A";

    const capital = country.capital || "N/A";

    const subregion = country.subregion || "N/A";

    countryDetails.innerHTML = `

        <div class="detail-container">

            <img
                class="detail-flag"
                src="${country.flags?.svg || country.flags?.png || ""}"
                alt="Flag of ${country.name}"
            >

            <div class="detail-info">

                <h1>${country.name}</h1>

                <div class="detail-columns">

                    <div>

                        <p>
                            <strong>Native Name:</strong>
                            ${nativeName}
                        </p>

                        <p>
                            <strong>Population:</strong>
                            ${Number(country.population || 0).toLocaleString("en-US")}
                        </p>

                        <p>
                            <strong>Region:</strong>
                            ${country.region || "N/A"}
                        </p>

                        <p>
                            <strong>Sub Region:</strong>
                            ${subregion}
                        </p>

                        <p>
                            <strong>Capital:</strong>
                            ${capital}
                        </p>

                    </div>

                    <div>

                        <p>
                            <strong>Top Level Domain:</strong>
                            ${domains}
                        </p>

                        <p>
                            <strong>Currencies:</strong>
                            ${currencies}
                        </p>

                        <p>
                            <strong>Languages:</strong>
                            ${languages}
                        </p>

                    </div>

                </div>

                <div class="border-countries">

                    <h3>Border Countries:</h3>

                    <div id="borderButtons"></div>

                </div>

            </div>

        </div>

    `;

    displayBorders(country);

}


/* ==============================
   DISPLAY BORDER COUNTRIES
============================== */

function displayBorders(country) {

    const borderButtons = document.getElementById("borderButtons");

    if (!borderButtons) return;

    borderButtons.innerHTML = "";

    if (!country.borders || country.borders.length === 0) {

        borderButtons.textContent = "No bordering countries";

        return;

    }

    country.borders.forEach(borderCode => {

        const borderCountry = allCountries.find(item =>
            item.alpha3Code === borderCode
        );

        if (!borderCountry) return;

        const button = document.createElement("button");

        button.className = "border-button";

        button.textContent = borderCountry.name;

        button.addEventListener("click", () => {

            openCountry(borderCountry.name);

        });

        borderButtons.appendChild(button);

    });

}


/* ==============================
   BACK BUTTON
============================== */

backButton.addEventListener("click", () => {

    window.location.href = "index.html";

});


/* ==============================
   DARK / LIGHT MODE
============================== */

function updateTheme(isDark) {

    document.body.classList.toggle("dark", isDark);

    themeIcon.textContent = isDark ? "☀" : "☾";

    themeText.textContent = isDark
        ? "Light Mode"
        : "Dark Mode";

    localStorage.setItem("countryTheme", isDark ? "dark" : "light");

}


themeToggle.addEventListener("click", () => {

    const isDark = !document.body.classList.contains("dark");

    updateTheme(isDark);

});


/* ==============================
   LOAD SAVED THEME
============================== */

const savedTheme = localStorage.getItem("countryTheme");

updateTheme(savedTheme === "dark");


/* ==============================
   INITIALIZE APPLICATION
============================== */

fetchCountries();
