import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const ticketCollection = 'tickets';


const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => uuidv4()
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        index: true
    },
    purchaser: {
        type: String,
        required: true 
    }
})


const ticketModel = mongoose.model(ticketCollection, ticketsSchema);

export default ticketModel;