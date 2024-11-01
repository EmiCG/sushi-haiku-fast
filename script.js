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