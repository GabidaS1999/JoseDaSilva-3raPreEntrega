import ProductsService from "../dao/Db/products.service.js";



const productService = new ProductsService();


const getDatosControllers = async (req, res)=>{
    //Una logica para ir a buscar la info
    let datos = await productService.getAll();


    res.json(datos)
}



const postDatosControllers = async (req,res)=>{
    let dato = req.body
    let datos = await productService.save(dato);
    res.json(datos)
}


const deleteDatosControllers = async(req, res)=>{

    let {id} = req.params
    await productService.deleteProduct(id)
    res.json({msg:"Delete product"})
}



export {getDatosControllers, postDatosControllers, deleteDatosControllers }