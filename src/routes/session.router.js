import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import { generateJWTOKEN, authToken } from "../utils.js";
import cookieParser from 'cookie-parser';
import  {cartsModel}  from "../dao/models/carts.models.js";
const router = Router();
router.use(cookieParser('CoderS3cr3tC0d3'))




router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res)=>{

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/github/error'}),async(req, res)=>{
    req.session.admin = true;
    const user = req.user
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: req.session.admin ? 'admin' : 'user',
        logedBy: 'GitHub'
    }

    

    res.redirect("/products")
})

router.post("/register", passport.authenticate('register', {failureRedirect:'/api/session/fail-register' }), async(req, res)=>{
    req.logger.info("Registrando usuario");
    res.status(201).send({status: 'succes', message: "Usuario creado de forma existosa"})
});

router.get("/fail-register", (req, res) => {
    res.status(401).send({error:"Error en el registro"})
})

router.post("/login", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user;
    
    
    if (!user) {

        return res.status(401).send({ status: "error", message: "Credenciales incorrectas" });
    }else{
        req.logger.info(`Usuario encontrado: ${user}` );
    }

    const accessToken = generateJWTOKEN(user);
    console.log(accessToken);

   
    res.send({
        status: "success",
        token: accessToken,
        message: "Primer logueo realizado"
    });
});




router.delete("/logout", passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "not_authenticated", message: "Usuario no autenticado." });
    }

    try {
  
        await cartsModel.deleteOne(req.user._id);

        req.session.destroy(error => {
            if (error) {
                res.status(500).json({ error: "error_logout", message: "Error al cerrar la sesión" });
            } else {
                res.status(200).json({ redirectTo: "/users/login" }); 
            }
        });
    } catch (error) {
        console.error("Error al eliminar el carrito:", error);
        res.status(500).json({ error: "error_deleting_cart", message: "Error al eliminar el carrito" });
    }
});


router.get('/current',passport.authenticate('jwt', {session: false}), (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "not_authenticated", message: "Usuario no autenticado." });
    }else{
        req.logger.info(`Usuario encontrado: ${req.user}` );
        return res.send({status: "success", payload:req.user })
        
    }
    res.render('profile2', {
        user: req.user
    });


});







export default router;