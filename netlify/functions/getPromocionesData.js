exports.handler = async (event, context) => {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

    // Validación básica: Asegurarse de que las variables de entorno existan
    if (!SHEET_ID || !API_KEY) {
        console.error('ERROR: GOOGLE_SHEET_ID o GOOGLE_SHEETS_API_KEY no están configuradas en Netlify Environment Variables.');
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Error de configuración: Claves de API de Google Sheets no encontradas.',
                // No expongas detalles sensibles en producción
                details: 'Asegúrate de que GOOGLE_SHEET_ID y GOOGLE_SHEETS_API_KEY estén configuradas en las variables de entorno de Netlify.'
            }),
        };
    }

    try {
        // Realiza la solicitud a la API de Google Sheets usando la clave segura
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/tablaPromociones?key=${API_KEY}`);
        
        // Maneja la respuesta de la API de Google Sheets
        if (!response.ok) {
            // Si la API de Google Sheets devuelve un error, lo pasamos al frontend
            const errorData = await response.json(); // Intentar obtener el cuerpo del error
            console.error('Error de Google Sheets API:', response.status, errorData);
            return {
                statusCode: response.status, // Usa el mismo código de estado de Google Sheets
                body: JSON.stringify({ 
                    error: 'Error al acceder a Google Sheets', 
                    details: errorData.error ? errorData.error.message : 'Error desconocido de Google Sheets API' 
                }),
            };
        }

        const data = await response.json(); // Los datos de tu Google Sheet

        // Devuelve los datos al frontend
        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*', 
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        // Captura cualquier error de red o de ejecución de la función
        console.error('Error al ejecutar la función Netlify:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor', details: error.message }),
        };
    }
};