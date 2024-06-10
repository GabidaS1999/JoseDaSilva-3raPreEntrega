import mongoose from "mongoose";
import { productModel } from "../models/products.models.js";

const ObjectId = mongoose.Types.ObjectId;

export default class ProductsService {

    getAll = async () => {
        try {

            let products = await productModel.find();

            return products;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw error;
        }
    };

    save = async (product) => {
        let newProduct = await productModel.create(product);
        return newProduct
    }

   getProductById(productId) {
        if (!ObjectId.isValid(productId)) {
            throw new Error("El ID del producto no es válido");
        }
        return productModel.findById(productId);
    }
    getProductByCode = async () => {
        try {
            let product = await productModel.findOne({ code: code });
            return product ? product.toObject() : null;
        } catch (error) {
            console.error("Error al obtener producto por código:", error);
            throw error;
        }
    }
    updateProduct = async (id, update) => {
        try {

            let product = await productModel.findById(id);


            if (!product) {
                return { status: 'error', msg: 'Producto no encontrado' };
            }

            let updatedProduct = await productModel.updateOne({ _id: id }, update);
            product.stock += update;  
            await product.save();
            return updatedProduct
        } catch (error) {
            console.error(`Error al actualizar producto: ${error}`);
            throw error;
        }
    };
    deleteProduct = async (id) => {
        console.log("Eliminando producto con ID:", id);
        try {
            let productDelete = await productModel.deleteOne({ _id: id });
            return productDelete;
        } catch (error) {
            console.error(`Error al eliminar producto en la base de datos: ${error}`);
            throw error;
        }
    };

}