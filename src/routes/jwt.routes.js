import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { cartsModel } from "../dao/models/carts.models.js";
import { isValidPassword, generateJWTOKEN } from "../utils.js";

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        req.logger.info(`Usuario encontrado: ${user}`);
        if (!user) {
            req.logger.error("Usuario no encontrado");
            return res.status(401).send({ error: "Not Found", message: "Usuario no encontrado" });
        }
        if (!isValidPassword(user, password)) {
            req.logger.error("Credenciales inválidas");
            return res.status(401).send({ error: "Unauthorized", message: "Usuario y contraseña no coinciden" });
        }

        let cart = await cartsModel.findOne({ user: user._id });
        if (!cart) {
            cart = new cartsModel({ user: user._id });
            await cart.save();
        }
        console.log("Cart ID:", cart._id);

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
        };

        const accessToken = generateJWTOKEN(tokenUser);
        console.log("Token generado:", accessToken);
        res.cookie('jwtCookieToken', accessToken, {
            maxAge: 86400000, 
            httpOnly: false    
        });
        
        res.status(200).send({ message: "Login successful", token: accessToken, cartId: cart._id.toString() });
    } catch (error) {
        req.logger.error("Error interno del servidor:", error);
        return res.status(500).send({ error: "Internal Server Error", message: "Error interno de la aplicación" });
    }
});

export default router;
