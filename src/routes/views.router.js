import { Router } from 'express';
import { productModel } from '../dao/models/products.models.js';
import userModel from '../dao/models/user.model.js';
import { cartsModel } from '../dao/models/carts.models.js';
const router = Router();
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { fork } from 'child_process';

router.use(cookieParser('CoderS3cr3tC0d3'))

//Con child process - Fork
router.get("/suma", (req, res) => {
    const child = fork("./src/forks/operations.js");
    child.send("Iniciar calculo");
    child.on("message", result => {
        res.send(`El resultado de la operacion es ${result}`)
    })
})

router.get('/setCookie', (req, res) => {
    //sin firma
    // res.cookie("CoderCookie", "Eso es una cookie de prueba - Cookie set", {maxAge: 50000}).send('Cookie asignada con exito')

    //con firma
    res.cookie("CoderCookie", "Eso es una cookie de prueba - Cookie set", { maxAge: 50000, signed: true }).send('Cookie asignada con exito')
});


router.get('/getCookie', (req, res) => {
    // res.send(req.cookies)

    res.send(req.signedCookies)
});


router.get('/deleteCookie', (req, res) => {
    res.clearCookie('CoderCookie').send('Cookie borrada')
});


//session
router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido")
    }
});

router.get('/logout', async (req, res) => {
    try {

        if (req.user && req.user._id) {
            await cartsModel.deleteOne({ user: req.user._id });
        }

        // Destruir la sesión
        req.session.destroy(error => {
            if (error) {
                console.error("Error al cerrar la sesión:", error);
                return res.status(500).json({ error: "Error logout", mensaje: "Error al cerrar la sesion" });
            }
            res.send("Sesion cerrada correctamente");
        });
    } catch (error) {
        console.error("Error al eliminar el carrito o al cerrar sesión:", error);
        res.status(500).json({ error: "Error interno del servidor", mensaje: "No se pudo cerrar la sesión correctamente" });
    }
});


router.get('/login', (req, res) => {
    const { email, password } = req.query;
    if (email !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
        return res.status(401).send("Error de logueo, verifique los datos")
    } else {
        req.session.user = username;
        req.session.admin = true;
        res.send('Login success')
    }
});

function auth(req, res, next) {
    if (req.session.user === 'pepe' && req.session.admin) {
        return next()
    } else {
        return res.status(403).send("Usuario no autorizado")
    }
}

router.get('/private', auth, (req, res) => {
    res.send("Si estas viendo esto sos administrador")
});






router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
});

router.get('/message', (req, res) => {
    res.render("messages");
});

router.get('/products', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let sortPrice = req.query.sortPrice || 'asc';
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let match = req.query.match

    const cart = await cartsModel.findOne(req.user.cartId).populate('products.product').exec();

    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }

    if(cart){
       return res.status(201).send({status: "success", payload: cart})
    }


    if (sortPrice !== 'asc' && sortPrice !== 'desc') {
        return res.status(400).send('El parámetro "sortPrice" debe ser "asc" o "desc".');
    }

    let sortOptions = {};
    sortOptions['price'] = sortPrice === 'asc' ? 1 : -1;

    if (!page) page = 1;
    if (!limit) limit = 10;

    let query = {};
    if (match) {
        query = { $text: { $search: match } };
    } else {
        match = ''
    }

    let result = await productModel.paginate(query, { page, limit, sort: sortOptions, lean: true })
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${result.limit}&match=${match}&sortPrice=${sortPrice}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${result.limit}&match=${match}&sortPrice=${sortPrice}` : '';

    result.isValid = !(page < 1 || page > result.totalPages)
    console.log(result);
    console.log(cart._id)
    res.render("products", {
        result: result,
        user: req.user,
        CartId: cart._id.toString(),
    });

});
router.get('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const carrito = await cartsModel.findById(cid).populate('products.product').lean();

        if (carrito) {
            res.render("carts", { carrito });
        } else {
            res.send({ msg: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});




export default router;