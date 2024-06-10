import express from 'express';
import productsRoutes from './routes/products.routes.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import path from 'path';
import MongoSingleton from "./config/mongodb-singleton.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cartRoutes from './routes/cart.routes.js';

const app = express();
const PORT = 3000;
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
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartRoutes);


const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación API",
            description: "Documentación para uso de swagger",
            version: "1.0.0"
        }
    },
    apis: [path.join('./src/docs/**/*.yaml')]
};

const specs = swaggerJSDoc(swaggerOptions);

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.get('/api/products', (req, res) => {
    res.json([{ title: 'Producto prueba' }]);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
