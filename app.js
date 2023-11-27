const express = require('express');
const app = express();
const productManager = require('./productmanager'); // Importa el módulo productManager
const PORT = 3000;

app.use(express.json());

// Ruta para obtener todos los productos o limitarlos según el query param
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(); // Usa await para getProducts

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId); // Usa await para getProductById

        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

async function startServer() {
    app.listen(PORT, () => {
        console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });

    // Agrega un producto al gestor
    await productManager.addProduct({
        nombreDelProducto: 'SOIREES FOR DAYS GRIS TORNASOL ',
        marca: 'GOORIN BROS',
        descripcion: 'Goorin Bros, la gorra del momento. Este modelo es trucker, cuenta con una malla en la parte de atrás, cuenta con un broche ajustable, que se adapta perfectamente a la medida, y en el frente un parche con un increíble animal salvaje.',
        precio: 'MXN$1,449.00',
        urlImagen: 'https://2cap.com.mx/pub/media/catalog/product/cache/2325c4080d5d7fd8ee1e3c621132bc99/g/o/gorra_goorin_bros_101-0865_soirees_for_days_gris_tornasol_upc_090625532130-1.jpg',
        id: '2',
        stock: '100',
    });

    // Obtiene todos los productos del gestor
    const products = await productManager.getProducts(); // Usa await para getProducts
    console.log(products);

    // Obtiene un producto específico por ID
    const product = await productManager.getProductById(1); // Usa await para getProductById
    console.log(product);
}

startServer();