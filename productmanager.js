// Importa el módulo 'fs' para realizar operaciones en el sistema de archivos
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;

class ProductManager {
    constructor(path) {
        // Inicializa el gestor de productos con la ruta del archivo y un array vacío para almacenar productos
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    // Agrega un nuevo producto al gestor de productos
    addProduct(product) {
        // Verifica si ya existe un producto con el mismo código
        const productExists = this.products.find((p) => p.code === product.code);

        if (productExists) {
            throw new Error('El código del producto ya existe');
        }

        // Verifica que todas las propiedades del producto tengan un valor definido
        for (const key in product) {
            if (product[key] === undefined || product[key] === '') {
                throw new Error(`La ${key} del producto es obligatoria`);
            }
        }

        // Asigna un ID al producto y lo agrega al array de productos
        product.id = this.products.length + 1;
        this.products.push(product);

        // Guarda los productos en el archivo
        this.saveProducts(this.products);
    }

    // Elimina un producto del gestor por su ID
    deleteProduct(id) {
        const products = this.products;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products.splice(i, 1);

                // Guarda los productos actualizados en el archivo
                this.saveProducts(products);

                return true;
            }
        }

        return false;
    }

    // Actualiza un producto en el gestor por su ID
    updateProduct(id, updatedProduct) {
        const products = this.products;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products[i] = updatedProduct;

                // Guarda los productos actualizados en el archivo
                this.saveProducts(products);

                return updatedProduct;
            }
        }

        return null;
    }

    // Obtiene todos los productos almacenados
    getProducts() {
        return this.products;
    }

    // Obtiene un producto específico por su ID
    getProductById(id) {
        const product = this.products.find((p) => p.id === id);

        if (!product) {
            console.log('No se encontró el producto');
            return;
        }

        return product;
    }

    // Guarda los productos en el archivo especificado
    saveProducts(products) {
        // Implementa operaciones en el sistema de archivos para guardar los productos en la ruta especificada
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf8');
    }
}

// Crea una instancia de ProductManager con la ruta de archivo especificada
const productManager = new ProductManager('products.json');

app.use(express.json());

// Ruta para obtener todos los productos o limitarlos según el query param
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = productManager.getProducts();

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
app.get('/products/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId);

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

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

// Agrega un producto al gestor
productManager.addProduct({
    nombreDelProducto: 'SOIREES FOR DAYS GRIS TORNASOL ',
    marca: 'GOORIN BROS',
    descripcion: 'Goorin Bros, la gorra del momento. Este modelo es trucker, cuenta con una malla en la parte de atrás, cuenta con un broche ajustable, que se adapta perfectamente a la medida, y en el frente un parche con un increíble animal salvaje.',
    precio: 'MXN$1,449.00',
    urlImagen: 'https://2cap.com.mx/pub/media/catalog/product/cache/2325c4080d5d7fd8ee1e3c621132bc99/g/o/gorra_goorin_bros_101-0865_soirees_for_days_gris_tornasol_upc_090625532130-1.jpg',
    id: '2',
    stock: '100',
});

// Obtiene todos los productos del gestor
const products = productManager.getProducts();
console.log(products);

// Obtiene un producto específico por ID
const product = productManager.getProductById(1);
console.log(product);