import { Router } from "express";
import CartManager from "../dao/ManagerFS/Cart-Manager.js";
import ProductManager from "../dao/ManagerFS/Product-Manager.js";
import CartService from "../dao/Db/cart.service.js";
import ProductsService from "../dao/Db/products.service.js";
import ticketModel from "../dao/models/ticket.model.js";
import passport from "passport";
import cookieParser from 'cookie-parser';
import CustomError from "../service/errors/CustomError.js";
import { addProductErrorInfo } from "../service/errors/messages/addProductErrorInfo.js";
import EErrors from "../service/errors/errors-enum.js";
import errorHandler from '../service/errors/middlewares/index.js'

const router = Router();
router.use(cookieParser('CoderS3cr3tC0d3'));


let cartService = new CartService();



let cartManager = new CartManager();
let productManager = new ProductManager();




let carts = [];

router.get('/', async (req, res) => {
    let todosLosCarritos = await cartService.getAll()

    res.send(todosLosCarritos)
})



router.get('/:cid', async (req, res) => {
    const result = await cartService.getAll()
    let cid = req.params.cid;

    const carrito = result.find(c => c.id == cid)
    if (carrito) {
        res.json(carrito)
    } else {
        res.send({ msg: "Carrito no encontrado" })
    }

})

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const result = await cartService.getAll();

        const carrito = result.find(c => c.id == cartId);

        if (carrito) {
            await cartService.deleteAllProductsFromCart(carrito.id);
            res.send("Carrito vaciado");
        } else {
            res.status(404).send({ msg: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al intentar vaciar el carrito:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});


router.post('/', async (req, res) => {
    let cart = await cartService.save()
    carts.push(cart)
    res.send({ status: "success", msg: "Carrito creado" })
})

router.post('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid
    const result = await cartService.addProductToCart(cid, pid);
    result.success ? res.status(200).json(result.cart) : res.status(400).json(result)
})


router.delete('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid
    const result = await cartService.deleteProductFromCart(cid, pid);
    result.success ? res.status(200).json(result.cart) : res.status(400).json(result)
})
router.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    let newQuantity = parseInt(req.body.quantity);
    const result = await cartService.updateProductQuantityInCart(cid, pid, newQuantity);
    result.success ? res.status(200).json(result.cart) : res.status(400).json(result)
})
router.put('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const newProductsArray = req.body.products;
        if (!Array.isArray(newProductsArray)) {
            return res.status(400).json({ success: false, message: "El cuerpo de la solicitud debe contener un array de productos." });
        }



        const result = await cartService.update(cid, newProductsArray);
        if (result.success) {
            return res.status(200).json(result.cart);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {

        console.error("Error al procesar la solicitud:", error);
        return res.status(500).json({ success: false, message: "Ocurrió un error al procesar la solicitud." });
    }
});

const productService = new ProductsService()

router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const cartId = req.params.cid;
    const result = await cartService.getAll();
    const cart = result.find(c => c.id == cartId);


    if (!cart) {
        return res.status(404).send({ msg: "Carrito no encontrado" });
    }

    let totalAmount = 0;
    let updatedProducts = [];


        for (let item of cart.products) {
            const product = await productService.getProductById(item._id);
            
            if (product.stock >= item.quantity) {
                totalAmount += product.price * item.quantity;
                

                await productService.updateProduct(item._id, -item.quantity);
            } else {
                let productStock = product.stock
                CustomError.createError({
                    name: "Product add error",
                    cause: addProductErrorInfo({productStock}),
                    message: "Error tratando de comprar el producto seleccionado",
                    code: EErrors.INVALID_TYPES_ERROR
                })
                updatedProducts.push(item); // Agregar a la lista de productos con stock insuficiente
            }
        }

        // Generar un ticket de compra
        const newTicket = new ticketModel({
            amount: totalAmount,
            purchaser: req.user.email
        });
        await newTicket.save();
        
        
        if (updatedProducts.length === 0) {
            const emptyCartResult = await cartService.deleteAllProductsFromCart(cartId);
            if (!emptyCartResult.success) {
                throw new Error(emptyCartResult.error);
            }
        } else {

            await cartService.update(cartId, updatedProducts);
        }

        res.send({ status: "success", msg: "Compra realizada con éxito y carrito actualizado", ticketId: newTicket._id });
   
});

router.use(errorHandler)





export default router;