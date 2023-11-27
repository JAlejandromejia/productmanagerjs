const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.data = { contadorId: 0, products: [] }; // Objeto para almacenar información
        this.loadProducts();
    }

    async loadProducts() {
        try {
            // Verifica si el archivo existe antes de leerlo
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.data = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    addProduct(product) {
        // Verifica si ya existe un producto con el mismo código
        const productExists = this.data.products.find((p) => p.code === product.code);

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
        product.id = this.data.contadorId++;
        this.data.products.push(product);

        // Guarda los productos en el archivo
        this.saveProducts();
    }

    deleteProduct(id) {
        const index = this.data.products.findIndex((p) => p.id === id);

        if (index !== -1) {
            this.data.products.splice(index, 1);
            this.saveProducts();
            return true;
        }

        return false;
    }

    updateProduct(id, updatedProduct) {
        const index = this.data.products.findIndex((p) => p.id === id);

        if (index !== -1) {
            this.data.products[index] = { ...updatedProduct, id };
            this.saveProducts();
            return this.data.products[index];
        }

        return null;
    }

    getProducts() {
        return this.data.products;
    }

    getProductById(id) {
        const product = this.data.products.find((p) => p.id === id);

        if (!product) {
            console.log('No se encontró el producto');
            return;
        }

        return product;
    }

    async saveProducts() {
        // Guarda los productos en el archivo especificado
        await fs.writeFile(this.path, JSON.stringify(this.data, null, 2), 'utf8');
    }
}

module.exports = new ProductManager('products.json');