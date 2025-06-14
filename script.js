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
    // Función para cargar las promociones en los contenedores HTML
    function cargarPromociones(containerId, promociones) {
        const promocionesContainer = document.getElementById(containerId);
        if (!promocionesContainer) {
            console.error(`Contenedor con ID "${containerId}" no encontrado.`);
            return;
        }
        promocionesContainer.innerHTML = ""; // Limpiar el contenido existente

        promociones.forEach(promocion => {
            const promoDiv = document.createElement("div");
            promoDiv.classList.add("promocion");

            // Aquí construimos correctamente la URL de la imagen
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
    }

    // URL de la funcion de netlify
    const netlifyFunctionUrl = '/.netlify/functions/getPromocionesData'; 

    fetch(netlifyFunctionUrl)
        .then(response => {
            // Manejar errores de la respuesta HTTP de la función Netlify
            if (!response.ok) {
                // Si la respuesta no es OK (ej. 4xx, 5xx), lanzamos un error
                // para que sea capturado por el bloque .catch
                return response.json().then(errorData => {
                    throw new Error(`Error HTTP ${response.status}: ${errorData.error || 'Mensaje desconocido'}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos de la función Netlify:", data);

            if (!data.values || !Array.isArray(data.values)) {
                throw new Error("Formato de datos inesperado de la función Netlify. Se esperaba 'values'.");
            }

            const rows = data.values;
            const promocionesFijas = [];
            const promocionesTemporales = [];

            for (let i = 1; i < rows.length; i++) {
                const [titulo, descripcion, imagen, tipo] = rows[i];
                // Asegurarse de que todas las variables existan antes de usarlas
                if (titulo && descripcion && imagen && tipo) {
                    const promocion = { titulo, descripcion, imagen };

                    if (tipo.toLowerCase() === "fija") { // Usar toLowerCase para mayor robustez
                        promocionesFijas.push(promocion);
                    } else if (tipo.toLowerCase() === "temporal") {
                        promocionesTemporales.push(promocion);
                    }
                } else {
                    console.warn(`Fila incompleta o mal formada en Google Sheet (fila ${i + 1}):`, rows[i]);
                }
            }

            // Cargar las promociones en los contenedores respectivos
            cargarPromociones("containerBodyPromocionesFijas", promocionesFijas);
            cargarPromociones("containerBodyPromocionesTemporales", promocionesTemporales);
        })
        .catch(error => {
            console.error('Error al cargar las promociones:', error);
        });
});