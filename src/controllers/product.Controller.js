import { productService } from "../service/factory.js";
import { generateProduct } from "../utils.js";
import __dirname from "../utils.js";
import CustomError from "../service/errors/CustomError.js";
import { generateProductErrorInfo } from "../service/errors/messages/product-creation-error-info.js";
import EErrors from "../service/errors/errors-enum.js";

export const getProducts = async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct())
        }
        res.send({ status: "success", payload: products });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los productos" })
    }
}



const getDatosControllers = async (req, res) => {
    //Una logica para ir a buscar la info
    let datos = await productService.getAll();


    res.json(datos)
}

const postDatosWithImage = async (req, res) => {
    const { title, description, price, thumbnails, category, code, stock } = req.body
    const files = req.file
    if (!title || !price || !stock){
        return res.status(400).send({status: "error", error: "error"})
    } else{
        const dato = {
            title,
            description,
            price,
            thumbnails: `${__dirname}/../public/images/${files.name}`.
            category,
            code,
            stock
        }
        let datos = await productService.save(dato);
        res.status(201).send({status: "success", payload: datos})
    }
    
}


const postDatosControllers = async (req, res) => {
    const { title, description, price, thumbnails, category, code, stock } = req.body
    if (!title || !price || !stock){
        return res.status(400).send({status: "error", error: "error"})
    } else{
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
        res.status(201).send({status: "success", payload: datos})
    }
    
}


const deleteDatosControllers = async (req, res) => {

    let { id } = req.params
    await productService.deleteProduct(id)
    res.json({ msg: "Delete product" })
}



export { getDatosControllers, postDatosControllers, deleteDatosControllers, postDatosWithImage }