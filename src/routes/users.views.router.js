import { Router } from "express";
import passport from "passport";
import { authToken } from "../utils.js";

const router = Router();

router.get("/login", (req,res)=>{
    res.render('login')
});

router.get("/register", (req,res)=>{
    res.render('register')
});


router.get("/",  passport.authenticate('jwt', {session: true}), (req,res)=>{
    res.render('profile', {
        user: req.user
    })
});


export default router;

