import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                title: String,
                description: String,
                price: Number,
                quantity: {
                    type: Number,
                    default: 0
                }
            }
        ]
    }
});





export const cartsModel = mongoose.model(cartsCollection, cartsSchema);



