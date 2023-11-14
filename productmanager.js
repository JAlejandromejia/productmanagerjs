// Importa el módulo 'fs' para realizar operaciones en el sistema de archivos
const fs = require('fs');

class ProductManager {
    constructor(path) {
        // Inicializa el gestor de productos con la ruta del archivo y un array vacío para almacenar productos
        this.path = path;
        this.products = [];
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

// Agrega un producto al gestor
productManager.addProduct({
    nombreDelProducto: 'DRIIPP NEGRO',
    marca: 'GOORIN BROS',
    descripcion: 'Goorin Bros, la gorra del momento. Este modelo es trucker, cuenta con una malla en la parte de atrás, cuenta con un broche ajustable, que se adapta perfectamente a la medida, y en el frente un parche con un increíble animal salvaje.',
    precio: 'MXN$1,449.00',
    urlImagen: 'https://2cap.com.mx/pub/media/catalog/product/cache/2325c4080d5d7fd8ee1e3c621132bc99/g/o/gorra_goorin_bros_101-0792_driipp_negro_upc_090625664510-1.jpg',
    id: '1234',
    stock: '100',
});

// Obtiene todos los productos del gestor
const products = productManager.getProducts();
console.log(products);

// Obtiene un producto específico por ID
const product = productManager.getProductById(1);
console.log(product);