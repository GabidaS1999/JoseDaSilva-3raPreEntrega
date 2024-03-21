import { Router } from "express";
import userModel from "../dao/models/user.model.js";


const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body
    console.log("Registrando usuario");
    console.log(req.body);

    const exist = await userModel.findOne({ email })
    if (exist) {
        return res.status(402).send({ status: "error", message: "Usuario ya existe" })
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password,
        role
    }

    const result = await userModel.create(user)
    res.send({status: "success", message:"Usuario creado con exito con ID:" + result.id});
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });

    if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
        req.session.admin = true;
    }
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