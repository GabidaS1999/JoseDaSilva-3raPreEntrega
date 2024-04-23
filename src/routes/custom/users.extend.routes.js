import CustomRouter from "./custom.routes.js";
import userModel from "../../dao/models/user.model.js";
import { createHash, isValidPassword, generateJWTOKEN } from "../../utils.js";


export default class UsersExtendRouter extends CustomRouter {
    init(){
        //Todas las req/res van dentro de este init()

        this.get("/",["PUBLIC"], (req, res)=>{
            res.sendSuccess("Hola coders")
        })

        this.get("/currentUser", ["USER", "USER_PREMIUM"], (req,res) =>{
            res.sendSuccess(req.user)
        })

        this.get("/premiumUser", ["USER_PREMIUM"], (req,res)=>{
            res.sendSuccess(req.user);
        });
        this.get("/adminUser", ["ADMIN"], (req, res)=>{
            res.sendSuccess(req.user);
        });

        this.post("/login", ["PUBLIC"] ,async (req, res)=>{
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
                
                res.send({message: "Login successful", access_token:access_token, id: user._id});
            } catch (error) {
                console.log(error)
                return res.status(500).send({error:"error", message:"Error interno de la aplicacion"});
            }
        
        });
        this.post("/register", ["PUBLIC"], async (req, res)=>{
            const { first_name, last_name, email, age, password } = req.body;
            console.log("Registrando usuario:");
            console.log(req.body);

            const exist = await userModel.findOne({ email })
            if (exist) {
                return res.status(400).send({status: "error", message: "Usuario ya existente"})
            };
            const user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            const result = await userModel.create(user);
            res.status(201).send({Status: "success", message:"Usuario creado con exito con ID: " + result.id});


        })




    }

}