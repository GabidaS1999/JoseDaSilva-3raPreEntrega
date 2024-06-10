import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express';
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
import emailRouter from './routes/email.router.js';
import smsRouter from './routes/sms.router.js';
import githubLoginViewRouter from './routes/github-login.views.router.js'
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import jwtRouter from "./routes/jwt.routes.js";
import cookieParser from "cookie-parser";
import UsersExtendRouter from "./routes/custom/users.extend.routes.js";
import config from "./config/config.js";
import MongoSingleton from "./config/mongodb-singleton.js";
import cors from 'cors';
import { addLogger } from "./config/logger_CUSTOM.js";

import path from 'path'


//SWAGGER
const swaggerOptions = {
    definition:{
        openai: "3.0.1",
        info: {
            title: "Documentación API",
            description: "Documentacion para uso de swagger",
            version: "1.0.0"
        }
    },
    apis: ['./src/docs/**/*.yaml']

}
const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs))





let fileStore =  FileStore(session);
let productService = new ProductsService();
let productManager = new ProductManager();
let messageService = new MessagesService();
const app = express();
const SERVER_PORT = config.port;
console.log(SERVER_PORT)


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
        await MongoSingleton.getInstance()
        console.log("Conectado con exito a MongoDB");
    } catch (error) {
        console.error("No se pudo conectar la BD con Moongose" + error);
        process.exit()
    }
}
connectMongo();

app.use(addLogger)

//cors
const corsOptions = {
    credentials: true, // Permitir cookies
  };
app.use(cors(corsOptions));



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






//passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


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
app.use('/', viewsRoutes);
app.use('/github', githubLoginViewRouter)
app.use('/api/jwt', jwtRouter);
app.use('/api/email', emailRouter)
app.use('/api/sms', smsRouter)

const usersExtendRouter = new UsersExtendRouter();
app.use("/api/extend/users", usersExtendRouter.getRouter());




//LOGGER
app.get("/loggerTest", (req, res)=>{
    // Determinada logica de la ruta
    req.logger.warning("Mensaje de prueba de warning en un endpoint: /loggerTest")
    req.logger.debug("Mensaje de prueba de debug en un endpoint: /loggerTest")
    req.logger.info("Mensaje de prueba de info en un endpoint: /loggerTest")
    req.logger.error("Mensaje de prueba de error en un endpoint: /loggerTest")
    req.logger.fatal("Mensaje de prueba de fatal en un endpoint: /loggerTest")
    res.send("Prueba logger")
})

//cookie
app.use(cookieParser("Cod3rS3cr3tC0d3"));









const httpServer = app.listen(SERVER_PORT, () => {
    console.log(`Server run on port: ${SERVER_PORT}`);

    //console.log(process.argv.slice(2));

    // process.exit(5)

    //Esta excepcion no fue capturada
    //console()


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





