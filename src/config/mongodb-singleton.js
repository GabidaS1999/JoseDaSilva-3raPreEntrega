import mongoose from "mongoose";
import config from "./config.js";


export default class MongoSingleton {
    static #instance;

    constructor(){
        this.#connectMongoDB()
    }


    static getInstance(){
        if (this.#instance) {
            console.log("Ya se ha abierto una conexion a MongoDB")
        } else {
            this.#instance = new MongoSingleton()
        }

        return this.#instance
    }
    
    #connectMongoDB = async ()=>{
        try {
            mongoose.connect(config.mongoUrl)
            console.log("Conectadi con exito a MongoDB usando mongoose")
        } catch (error) {
            consol.error("No se puede conectar a la base de datos de Mongo" + error);
            process.exit();
        }
    }


}