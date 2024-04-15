import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password)
};

export const PRIVATE_KEY = "CoderhouseBackendJdS";

export const generateJWTOKEN = (user) =>{
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '60s'});
}

export  const authToken = (req, res, next) =>{
    const authHeader = req.headers.authorization
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send({error:"User not authenticated or missing token."})
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        if(error) return res.status(403).send({error:"Token invalid"});
        

        req.user = credentials.userconsole.log(req.user);
        next()
    })
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;