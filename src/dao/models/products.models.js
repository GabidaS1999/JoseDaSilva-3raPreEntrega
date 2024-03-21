import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';


const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    category: {
        type: String,
        index: true
    },
    code: {
        type: String,
        unique: true
    },
    stock: {
        type: Number,
        index: true
    }
});
productsSchema.index({ category: 'text', stock: 'text' });

productsSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productsCollection, productsSchema);