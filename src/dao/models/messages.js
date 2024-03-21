import mongoose from "mongoose";

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true
    }, 
    message: String
});

export const messageModel = mongoose.model(messagesCollection, messagesSchema);