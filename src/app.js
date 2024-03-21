import express from "express";
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import exphbs from 'express-handlebars';
import __dirname from './utils.js';
import Handlebars from 'handlebars';
import MessagesService from "./dao/Db/messagesService.js";
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import viewsRoutes from './routes/views.router.js';
import ProductsService from "./dao/Db/products.service.js";
import ProductManager from './dao/ManagerFS/Product-Manager.js';
import session from "express-session";
import  FileStore  from "session-file-store";
import MongoStore from "connect-mongo";
import userRoutes from './routes/users.views.router.js';
import sessionRoutes from './routes/session.router.js';


let fileStore =  FileStore(session);
let productService = new ProductsService();
let productManager = new ProductManager();
let messageService = new MessagesService();
const app = express();
const PORT = process.env.PORT || 8080;


const hbs = exphbs.create({
    handlebars: Handlebars,
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
    },
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const URL_MONGO = 'mongodb+srv://josedasilva1999:Olivia2024@cluster0.elp8ja0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';
const connectMongo = async () => {
    try {
        mongoose.connect(URL_MONGO)
        console.log("Conectado con exito a MongoDB");
        

    } catch (error) {
        console.error("No se pudo conectar la BD con Moongose" + error);
        process.exit()
    }
}
connectMongo();

//session
app.use(session({
    store:MongoStore.create({
        mongoUrl:URL_MONGO,
        mongoOptions:{useNewUrlParser:true, useUnifiedTopology: true},
        ttl: 10 * 60 ,
    }),
    secret:'cod3rS3cr3t',
    resave: true,
    saveUninitialized: true
}))



app.use(express.json())
app.use(express.urlencoded({ extended: true }))



//app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
    req.io = socketServer;
    next();
});


app.use(express.static(__dirname + '/public/'))


//router
app.use('/api/session', sessionRoutes);
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/', viewsRoutes)













const httpServer = app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
});
const socketServer = new Server(httpServer);
const messages = [];
const productos = await productService.getAll();
socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    
    socket.on('products', async () => {
        const products = await productService.getAll();
        socketServer.emit('products', products);
    });
    

    socket.on("newProduct", async (product) => {
        await productService.save(product);
    
        const products = await productService.getAll() ;
        socketServer.emit("products", products);
    });
    socketServer.emit('products', productos)
    
    
   socketServer.emit('messageLogs', messages)
    socket.on('message', data=>{
        messages.push(data)
        socketServer.emit('messageLogs', messages);
        messageService.save(data)
    })
    
    socket.on('userConnected', data=>{
        socketServer.emit('userConnected', data)
    })
    
    socket.on('closeChat', data=>{
        if (data.close === "close") {
            socket.disconnect()
        }
    })

});




