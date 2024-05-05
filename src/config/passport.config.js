import passport from "passport";
import passportLocal from 'passport-local';
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2';
import jwtStrategy from 'passport-jwt';
import { PRIVATE_KEY } from '../utils.js';

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJwt = jwtStrategy.ExtractJwt;
const localStrategy = passportLocal.Strategy;



const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.3ddafcc84484a67e',
        clientSecret: 'af84a2e0915756830b1a6fdf2a516a3341d0bbb5',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            const user = await userModel.findOne({ email: profile._json.email });
            console.log("Usuario encontrado")
            console.log(user);
            if (!user) {
                console.warn("Usuario no existe con el username: " + profile._json.email);
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: '',
                    email: profile._json.email,
                    password: '',
                    logedBy: 'GitHub'
                }
                const result = await userModel.create(newUser)
                return done(null, result)
            } else {
                return done(null, user)
            }



        } catch (error) {
            return done(error)
        }


    }))

    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY

        }, async (jwt_payload, done) => {
            console.log(`Entrando a passpord strategy con jwt`)
            try {

                console.log(`JWT obtenido del PayLoad` + jwt_payload);
                return done(null, jwt_payload.user);


            } catch (error) {
                console.log(error)
                return done(error)
            }
        }
    ))

    passport.use('register', new localStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {

            const { first_name, last_name, email, age } = req.body;

            try {
                const exist = await userModel.findOne({ email: req.body.email });
                if (exist) {
                    const payload = { id: exist._id };
                    const token = jwt.sign(payload, 'CoderS3cr3tC0d3', { expiresIn: '1d' });

                    res.json({ token: token });
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userModel.create(user);


                return done(null, result)
            } catch (error) {
                return done("Error registrando el usuario " + error)
            }
        }
    ))


    passport.use('login', new localStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })
                console.log("Usuario encontrado: ");
                console.log(user);

                if (!user) {
                    console.warn("Credenciales invalidas para: " + username);
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.warn("Credenciales invalidas para: " + username);
                    return done(null, false)
                };
                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }))




    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user)
        } catch (error) {
            console.error("Error deserealizando el usuario " + error);
        }
    })

};

const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) {
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken'];
        console.log("Token obtenido desde Cookie")
        console.log(token)
    }
    return token;
}


export default initializePassport;