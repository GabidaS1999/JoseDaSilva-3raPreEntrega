import { productService } from "../service/factory.js";
import { generateProduct } from "../utils.js";
import CustomError from "../service/errors/CustomError.js";
import { generateProductErrorInfo } from "../service/errors/messages/product-creation-error-info.js";
import EErrors from "../service/errors/errors-enum.js";

export const getProducts = async (req, res)=>{
    try {
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct())
        }
        res.send({status: "success", payload: products});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error, message: "No se pudo obtener los productos"})
    }
}



const getDatosControllers = async (req, res)=>{
    //Una logica para ir a buscar la info
    let datos = await productService.getAll();


    res.json(datos)
}



const postDatosControllers = async (req,res)=>{
    const {title, description, price, thumbnails, category, code, stock} = req.body
    if (!title || !price || !stock) {
        CustomError.createError({
            name: "Product creation error",
            cause: generateProductErrorInfo({title, price, stock}),
            message: "Error tratando de crear el producto",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    const dato = {
        title, 
        description, 
        price, 
        thumbnails, 
        category, 
        code, 
        stock
    }
    let datos = await productService.save(dato);
    res.json(datos)
}


const deleteDatosControllers = async(req, res)=>{

    let {id} = req.params
    await productService.deleteProduct(id)
    res.json({msg:"Delete product"})
}



export {getDatosControllers, postDatosControllers, deleteDatosControllers }