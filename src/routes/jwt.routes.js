import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { isValidPassword } from "../utils.js";
import { generateJWTOKEN } from "../utils.js";

const router = Router();

router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email:email});
        console.log(`Uusario encontrado: ${user}`);
        if (!user) {
            console.warn("Usuario no encontrado");
            return res.status(401).send({error:"Not Found", message:"Usuario no encontrado"})
        }
        if (!isValidPassword(user, password)) {
            console.warn("Credenciales invalidas");
            return res.status(401).send({error:"Not Found", message:"Usuario y contraseña no coinciden"})
        }

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        }

        const access_token = generateJWTOKEN(tokenUser);
        console.log(access_token)


        res.cookie('jwtCookieToken', access_token, {
            maxAge: 600000,
            httpOnly: false
        });
        
        res.send({message: "Login successful"});
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"error", message:"Error interno de la aplicacion"});
    }

})

export default router;