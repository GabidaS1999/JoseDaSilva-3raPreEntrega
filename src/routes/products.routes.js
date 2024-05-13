import ProductManager from '../dao/ManagerFS/Product-Manager.js';
import ProductsService from '../dao/Db/products.service.js';
import { Router } from "express"
import {getProducts} from '../controllers/product.Controller.js';
import errorHandler from '../service/errors/middlewares/index.js'


let productManager = new ProductManager();

let productService = new ProductsService();


const router = Router();

import {getDatosControllers, postDatosControllers, deleteDatosControllers} from "../controllers/product.Controller.js"

//GET
router.get('/mockingproducts', getProducts);
router.get('/productController', getDatosControllers)

//POST
router.post('/', postDatosControllers)

//DELETE
router.delete('/:id', deleteDatosControllers)


router.use(errorHandler)







router.get('/', async (req, res) => {
    const socket = req.io;
    let todosLosProductos = await productService.getAll();

    let limit = parseInt(req.query.limit);
    if (!isNaN(limit) && limit > 0) {
        let productosLimitados = todosLosProductos.slice(0, limit);
        res.send(productosLimitados);
    } else {
        res.json(todosLosProductos);
        socket.emit('products', todosLosProductos);
    }
})

router.get('/:pid', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send('El ID del producto no es válido.');
    }
    try {
        const productId = req.params.pid;
        const product = await productService.getPorductById(productId);
     
        res.send({ status: "success", msg: `Producto encontrado: ${product.title}`});
        
    } catch (error) {
        console.error(`Error al eliminar producto: ${error}`);
        res.status(500).send({ status: "error", error: "Error al eliminar el producto" });
    }

})


router.post('/', async (req, res) => {
    const socket = req.io;
    try {
        const product = req.body;
     

        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnails) {
            return res.status(400).send({ status: 'error', msg: 'Valores incompletos, revisar datos' });
        }
        await productManager.addProduct(product.title, product.description, product.price, product.thumbnails, product.code, product.stock)
        await productService.save({title: product.title,description: product.description, price: product.price, category: product.category, thumbnails: product.thumbnails, code: product.code, stock: product.stock});
        socket.emit('newProduct', product);
        res.send({ status: 'success', msg: `Producto creado` });

    } catch (error) {
        console.error(`Error al agregar un nuevo producto: ${error}`);
        res.status(500).send({ status: 'error', error: 'Error al agregar un nuevo producto' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        let updateUser = req.body;
        let user = await productService.updateProduct({_id: req.params.id}, updateUser);
        res.send({ result: "success", payload: user })
    } catch (error) {
        console.log("No se pudo actualizar ususarios con moongose: " + error);
        res.status(500).send({ error: "No se pudo actualizar usuarios con moongose", message: error });
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const products = await productService.getAll();

        const productPosition = products.findIndex((p) => p._id === productId);

   

        
        products.splice(productPosition, 1);

        await productService.deleteProduct(productId);

        res.send({ status: "success", msg: "Producto eliminado" });
    } catch (error) {
        console.error(`Error al eliminar producto: ${error}`);
        res.status(500).send({ status: "error", error: "Error al eliminar el producto" });
    }
});



export default router;