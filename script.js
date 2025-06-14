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

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Promociones_Haiku_Fast_Sushi?key=${apiKey}`)
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
