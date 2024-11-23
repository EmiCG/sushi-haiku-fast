window.addEventListener('load', () => {
    document.body.classList.add('visible');
});


// Configuración del Intersection Observer
const opciones = {
    root: null, // Usar el viewport del navegador como raíz
    threshold: 0.1 // 10% del elemento visible
};

// Crear el observer
const observer = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible'); // Añadir clase para la animación
            observer.unobserve(entrada.target); // Dejar de observar el elemento
        }
    });
}, opciones);

// Seleccionar todos los elementos con la clase fade-in
const elementosFadeIn = document.querySelectorAll('.fade-in');

// Iniciar la observación en cada elemento
elementosFadeIn.forEach(elemento => {
    observer.observe(elemento);
});

/*
document.addEventListener("DOMContentLoaded", function () {
    function cargarPromociones(containerId, jsonFile) {
        const promocionesContainer = document.getElementById(containerId);

        fetch(jsonFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo cargar el archivo de promociones.");
                }
                return response.json();
            })
            .then(data => {
                promocionesContainer.innerHTML = ""; // Limpiar el texto de carga

                data.forEach(promocion => {
                    const promoDiv = document.createElement("div");
                    promoDiv.classList.add("promocion");

                    // Construir la ruta de la imagen
                    const rutaImagen = `src/promociones/${promocion.imagen}`;

                    promoDiv.innerHTML = `
                        <a href="entregas.html">
                            <img src="${rutaImagen}" alt="${promocion.titulo}" />
                            <h3>${promocion.titulo}</h3>
                            <p>${promocion.descripcion}</p>
                        </a>
                    `;
                    promocionesContainer.appendChild(promoDiv);
                });
            })
            .catch(error => {
                promocionesContainer.innerHTML = "<p>Error al cargar las promociones.</p>";
                console.error("Error:", error);
            });
    }

    // Llamadas a la función para cargar diferentes tipos de promociones
    cargarPromociones("containerBodyPromocionesFijas", "promocionesFijas.json");
    cargarPromociones("containerBodyPromocionesTemporales", "promocionesTemporales.json");
});

const sheetId = '1vTlMeaeFiqCvLyrkLJgCBHw-LTF2mTq9mYaJmBAYKMt2sXGPseaKgwqiidEtqvuRKbGkXFi9Nqv3xA9';
const apiKey = 'AIzaSyDsPbURzpo3Te1e_QzZrw5n-YY8kNjg6Bw';

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/NombreDeHoja?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Aquí puedes manipular `data` para mostrar las promociones en tu web.
    })
    .catch(error => console.error('Error al acceder a Google Sheets:', error));
*/


document.addEventListener("DOMContentLoaded", function () {
    function cargarPromociones(containerId, promociones) {
        const promocionesContainer = document.getElementById(containerId);
        promocionesContainer.innerHTML = ""; // Limpiar el contenido existente

        promociones.forEach(promocion => {
            const promoDiv = document.createElement("div");
            promoDiv.classList.add("promocion");

            promoDiv.innerHTML = `
                <a href="entregas.html">
                    <img src="${promocion.imagen}" alt="${promocion.titulo}" />
                    <h3>${promocion.titulo}</h3>
                    <p>${promocion.descripcion}</p>
                </a>
            `;
            promocionesContainer.appendChild(promoDiv);
        });
    }

    const sheetId = '16IPSBvan4QeserKoVITGaa69PlB1kEruJIBhSI7eIY0';
    const apiKey = 'AIzaSyDsPbURzpo3Te1e_QzZrw5n-YY8kNjg6Bw';

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/tablaPromociones?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const promocionesFijas = [];
            const promocionesTemporales = [];

            // Saltar la primera fila (encabezados) y procesar los datos
            for (let i = 1; i < rows.length; i++) {
                const [titulo, descripcion, imagen, tipo] = rows[i];
                const promocion = { titulo, descripcion, imagen };

                if (tipo === "fija") {
                    promocionesFijas.push(promocion);
                } else if (tipo === "temporal") {
                    promocionesTemporales.push(promocion);
                }
            }

            // Cargar las promociones en los contenedores respectivos
            cargarPromociones("containerBodyPromocionesFijas", promocionesFijas);
            cargarPromociones("containerBodyPromocionesTemporales", promocionesTemporales);
        })
        .catch(error => console.error('Error al acceder a Google Sheets:', error));
});