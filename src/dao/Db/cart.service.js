import { cartsModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

export default class CartService {
    getAll = async () => {
        try {
            let cart = await cartsModel.find();
            return cart;
        } catch (error) {
            console.error("Error al obtener carrito:", error);
            throw error;
        }
    }
    save = async (cart) => {
        let newCart = await cartsModel.create(cart);
        return newCart
    }
    addProductToCart = async (cartId, productId) => {
        try {
        
            let cart = await cartsModel.findById(cartId);
    
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
 
            const product = await productModel.findById(productId);
    
            if (!product) {
                throw new Error("Producto no encontrado");
            }
    
            const existingProductIndex = cart.products.findIndex(product => product._id.toString() === productId.toString());
    
            if (existingProductIndex !== -1) {
      
                cart.products[existingProductIndex].quantity += 1;
            } else {

                cart.products.push({
                    _id: productId,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    quantity: 1
                });
            }
    
            // Guardar el carrito actualizado
            await cart.save();
    
            return { success: true, cart };
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return { success: false, error: error.message };
        }
    }
    
    deleteProductFromCart = async (cartId, productId) => {
        try {
       
            let cart = await cartsModel.findById(cartId);
    
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
         
            const productIndex = cart.products.findIndex(product => product._id.toString() === productId.toString());
    
      
            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }
    
           
            cart.products.splice(productIndex, 1);
    
          
            await cart.save();
    
            return { success: true, message: "Producto eliminado del carrito", cart };
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            return { success: false, error: error.message };
        }
    }

    deleteAllProductsFromCart = async (cartId) => {
        try {
            
            let cart = await cartsModel.findById(cartId);
    
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
           
            cart.products = [];
    
          
            await cart.save();
    
            return { success: true, message: "Todos los productos eliminados del carrito", cart };
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito:", error);
            return { success: false, error: error.message };
        }
    }


    updateProductQuantityInCart = async (cartId, productId, newQuantity) => {
        try {
            // Encuentra el carrito por su ID
            let cart = await cartsModel.findById(cartId);
    
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
         
            const product = cart.products.find(product => product._id.toString() === productId.toString());
    
  
            if (!product) {
                throw new Error("Producto no encontrado en el carrito");
            }
    

            product.quantity = newQuantity;
    
         
            await cart.save();
    
            return { success: true, message: "Cantidad del producto actualizada", cart };
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            return { success: false, error: error.message };
        }
    }

    update = async (cid, newProductsArray) => {
    try {
        
        let existingCart = await cartsModel.findById(cid);
        if (!existingCart) {
            return { success: false, message: "El carrito no fue encontrado." };
        }

    
        existingCart.products = newProductsArray;

     
        let updatedCart = await existingCart.save();

        return { success: true, cart: updatedCart };
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        throw error; 
    }
};

    

}