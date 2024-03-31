import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();


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
    console.log("Registrando usuario");
    res.status(201).send({status: 'succes', message: "Usuario creado de forma existosa"})
});

router.get("/fail-register", (req, res) => {
    res.status(401).send({error:"Error en el registro"})
})

router.post("/login", passport.authenticate('login', {failureRedirect:'/api/session/fail-login' }), async (req, res) => {
    console.log("Usuario encontrado: ");
    const user = req.user;
    console.log(user);
    

    if (!user) {
        return res.status(401).send({ status: "error", error: "Credenciales incorrectas" });
    }


    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: req.session.admin ? 'admin' : 'user'
    };

   

    res.send({ status: "success", payload: req.session.user, message: "Primer logueo realizado" });
});

router.delete("/logout", (req, res) => {
  req.session.destroy(error => {
        if (error) {
            res.status(500).json({ error: "error_logout", message: "Error al cerrar la sesión" });
        } else {
            res.status(200).json({ redirectTo: "/users/login" }); // Enviar la ruta de redirección
        }
    });
});







export default router;