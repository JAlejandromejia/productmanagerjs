class ProductManager {
    constructor(){
        this.products = []
    }
    addProduct(product) {
        if (this.products.find((p) => p.code === product.code)){
            throw new Error('El codigo del producto ya existe');
        }

        for (const key in product) {
            if (product[key] === undefined || product[key] === '') {
                throw new Error(`La ${key} del producto es obligatoria`);
            }
        }

        product.id = this.products.length + 1;
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.log('No se encontro el producto');
            return;
        }

        return product;
    }
}

const productManager = new ProductManager();

productManager.addProduct({
    nombreDelProducto:'DRIIPP NEGRO',
    marca:'GOORIN BROS',
    descripcion:'Goorin Bros, la gorra del momento. Este modelo es trucker, cuenta con una malla en la parte de atrás, cuenta con un broche ajustable, que se adapta perfectamente a la medida, y en el frente un parche con un increíble animal salvaje.',
    precio:'MXN$1,449.00',
    urlImagen:'https://2cap.com.mx/pub/media/catalog/product/cache/2325c4080d5d7fd8ee1e3c621132bc99/g/o/gorra_goorin_bros_101-0792_driipp_negro_upc_090625664510-1.jpg',
    id:'1234',
    stock:'100',
});

const products = productManager.getProducts();
console.log(products);

const product = productManager.getProductById(1)
console.log(product);