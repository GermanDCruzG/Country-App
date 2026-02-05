const form = document.getElementById("searchForm");
const input = document.getElementById("countryInput");
const result = document.getElementById("result");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const countryName = input.value.trim();

    if (countryName === "") {
        alert("Escribe un país...");
        return;
    }
    buscarPais(countryName);
})

function buscarPais(nombre) {
    result.innerHTML = "<p>Cargando...</p>";
    fetch(`https://restcountries.com/v3.1/name/${nombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("País no encontrado.")
            };
            return response.json();
        })
        .then(data => {
            mostrarPais(data[0]);
        })
        .catch(error => {
            result.innerHTML = `<div class="alert alert-danger">${error.message}</div>
            `;
        });
}

function mostrarPais(pais) {

    // Idiomas
    let idiomas = "No disponible";
    if (pais.languages) {
        idiomas = Object.values(pais.languages).join(", ");
    }

    // Monedas
    let monedas = "No disponible";
    if (pais.currencies) {
        monedas = Object.values(pais.currencies)
            .map(moneda => moneda.name)
            .join(", ");
    }

    // Zonas horarias
    let zonas = pais.timezones ? pais.timezones.join(", ") : "No disponible";

    result.innerHTML = `
        <div class="container">
        <div class="row justify-content-center mt-4">
            <!-- COLUMNA BANDERA -->
            <div class="flag-container">
                <img src="${pais.flags.svg}" class="card-img-top" alt="Bandera">
            </div>
            <!-- COLUMNA DATOS -->
            <div class="col-md-4 mb-2">
                <div class="card h-100">  
                    <div class="card-body">
                        <h5 class="card-title">${pais.name.common}</h5>
                        <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : "No disponible"}</p>
                        <p><strong>Región:</strong> ${pais.region}</p>
                        <p><strong>Subregión:</strong> ${pais.subregion || "No disponible"}</p>
                        <p><strong>Población:</strong> ${pais.population.toLocaleString()}</p>
                        <p><strong>Idiomas:</strong> ${idiomas}</p>
                        <p><strong>Moneda:</strong> ${monedas}</p>
                        <p><strong>Zonas horarias:</strong> ${zonas}</p>
                    </div>
                </div>
            </div>    
            <!-- COLUMNA MAPA -->
            <div class="col-md-8 mb-2">
                <div id="map" style="width: 100% height: 300px"></div>
            </div>
        </div>
        </div>
        
    `;

    const lat = pais.latlng[0];
    const lng = pais.latlng[1];

    // Crear mapa
    const map = L.map('map').setView([lat, lng], 5);

    // Capa del mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    setTimeout(() => {
        map.invalidateSize();
    }, 200);

    // Marcador
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(pais.name.common)
        .openPopup();

}
