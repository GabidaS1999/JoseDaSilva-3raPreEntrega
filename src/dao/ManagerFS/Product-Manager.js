import { promises as fsPromises } from 'fs';
import { fsync } from 'fs';

class Product {
    constructor(id, title, description, price, thumbnails, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnails = thumbnails;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    #products;
    #productDirPath;
    #productsFilePath;
    #fileSystem;

    constructor() {
        this.#products = [];
        this.#productDirPath = "./src/files";
        this.#productsFilePath = `${this.#productDirPath}/Productos.json`;
        this.#fileSystem = fsPromises;
    }

    addProduct = async (title, description, price, thumbnails, status, code, stock) => {
        let newProductId = Math.floor(Math.random() * 100 + 1);
        let newProduct = new Product(newProductId, title, description, price, thumbnails, status, code, stock);
        console.log("Porducto nuevo:");
        console.log(newProduct);
        try {
            await fsPromises.mkdir(this.#productDirPath, { recursive: true });
            let productsFile;
            try {
                productsFile = await fsPromises.readFile(this.#productsFilePath, "utf-8");
            } catch (readError) {
                productsFile = "[]";
            }

            this.#products = JSON.parse(productsFile);

            this.#products.push(newProduct);

            await fsPromises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));
        } catch (error) {
            console.error(`Error agregando el producto nuevo: ${JSON.stringify(newProduct)}, error: ${error}`);
            throw Error(`Error agregando el producto nuevo: ${JSON.stringify(newProduct)}, error: ${error}`);
        }
    }
    

    getProducts = async()=>{
        try {
            await fsPromises.mkdir(this.#productDirPath, { recursive: true });
            let productsFile;
            try {
                productsFile = await fsPromises.readFile(this.#productsFilePath, "utf-8");
            } catch (readError) {
                
                productsFile = "[]";
            }
            this.#products = JSON.parse(productsFile);
            console.log("Productos: ");
            console.log(this.#products);

            return this.#products;

        } catch (error) {
            console.error(`Error buscando los productos, verifique la direccion: ${this.#productDirPath}, 
            detalle del error: ${error}`);
        throw Error(`Error buscando los productos, verifique la direccion: ${this.#productDirPath},
         detalle del error: ${error}`);
        }
    }

    getProductById = async (productId) => {
        try {
            await fsPromises.mkdir(this.#productDirPath, { recursive: true });
            if (!fsPromises.access(this.#productsFilePath)) {
                await fsPromises.writeFile(this.#productsFilePath, "[]");
            }

            let productsFile = await fsPromises.readFile(this.#productsFilePath, "utf-8");

            this.#products = JSON.parse(productsFile);

            const foundProduct = this.#products.find(product => product.id === productId);

            if (foundProduct) {
                console.log("Producto encontrado:");
                console.log(foundProduct);
                return foundProduct;
            } else {
                console.log(`No se encontró ningún producto con el ID: ${productId}`);
                return null;
            }
        } catch (error) {
            console.error(`Error buscando el producto por ID: ${productId}, detalle del error: ${error}`);
            throw Error(`Error buscando el producto por ID: ${productId}, detalle del error: ${error}`);
        }
    }
    getProductByCode = async (productCode) => {
        try {
            await fsPromises.mkdir(this.#productDirPath, { recursive: true });
            if (!fsPromises.access(this.#productsFilePath)) {
                await fsPromises.writeFile(this.#productsFilePath, "[]");
            }

            let productsFile = await fsPromises.readFile(this.#productsFilePath, "utf-8");

            this.#products = JSON.parse(productsFile);

            const foundProduct = this.#products.find(product => product.code === productCode);

            if (foundProduct) {
                console.log("Producto encontrado:");
                console.log(foundProduct);
                return foundProduct;
            } else {
                console.log(`No se encontró ningún producto con el ID: ${productCode}`);
                return null;
            }
        } catch (error) {
            console.error(`Error buscando el producto por ID: ${productCode}, detalle del error: ${error}`);
            throw Error(`Error buscando el producto por ID: ${productCode}, detalle del error: ${error}`);
        }
    }
    

    updateProduct = async (productId, updatedAttributes)=>{
        try {
            await fsPromises.mkdir(this.#productDirPath, { recursive: true });
    
            if (!fsPromises.access(this.#productsFilePath)) {
                await fsPromises.writeFile(this.#productsFilePath, "[]");
            }
    
            let productsFile = await fsPromises.readFile(this.#productsFilePath, "utf-8");
    
            this.#products = JSON.parse(productsFile);
            const index = this.#products.findIndex(product => product.id === productId);

            if (index !== -1) {
                this.#products[index] = { ...this.#products[index], ...updatedAttributes };
    
                await fsPromises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));
    
                console.log(`Producto con ID ${productId} actualizado correctamente.`);
            } else {
                console.log(`No se encontró ningún producto con el ID: ${productId}`);
            }
            
        } catch (error) {
            
        }
    }


    deleteProduct = async (productId) => {
        try {
            await fsPromises.mkdir(this.#productDirPath, { recursive: true });
    
            if (!fsPromises.access(this.#productsFilePath)) {
                await fsPromises.writeFile(this.#productsFilePath, "[]");
            }
    
            let productsFile = await fsPromises.readFile(this.#productsFilePath, "utf-8");
    
            this.#products = JSON.parse(productsFile);
    
            const index = this.#products.findIndex(product => product.id === productId);
    
            if (index !== -1) {
                this.#products.splice(index, 1);
    
                await fsPromises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));
    
                console.log(`Producto con ID ${productId} eliminado correctamente.`);
            } else {
                console.log(`No se encontró ningún producto con el ID: ${productId}`);
            }
        } catch (error) {
            console.error(`Error eliminando el producto por ID: ${productId}, detalle del error: ${error}`);
            throw Error(`Error eliminando el producto por ID: ${productId}, detalle del error: ${error}`);
        }
    }
}

export default ProductManager;