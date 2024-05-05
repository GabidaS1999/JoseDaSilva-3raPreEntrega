import MongoSingleton from '../config/mongodb-singleton.js';
import config from '../config/config.js';



let productService

async function initializeMongoService(){
    console.log("Iniciando servicio de mongoDB");
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        console.error("Error al iniciar MongoDb:" * error)
        process.exit(1);
    }
}



switch (config.persistence) {
    case 'mongodb':
        initializeMongoService();
        const { default: ProductServiceMongo } = await import('../dao/Db/products.service.js')

        productService = new ProductServiceMongo()

        console.log("Servicio de productos cargados");
        console.log(productService);
        break;

    case 'files':
        const { default: ProductServiceFileSystem } = await import('../dao/ManagerFS/Product-Manager.js')

        productService = new ProductServiceFileSystem()

        console.log("Servicio de productos cargadoos");
        console.log(productService);
        break;


    default:
        break;
}

export { productService }