import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js';



//Configuracion de transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user:config.gmailAccount,
        pass:config.gmailAppPassword
    },
    tls: {
        rejectUnauthorized: false // Esto desactiva la verificación de certificado
    }
    
})

//Verificamos que los datos que estoy pasando a nodemailer estan ok
transporter.verify(function(error, success){
    if (error) {
        console.log(error)
    }else{
        console.log('Server is ready to take our messages')
    }
})

// Configuracion del mensaje
const mailOptions = {
    from:"Coder test " + config.gmailAccount,
    to:config.gmailAccount,
    subject:'Correo de prueba Coderhouse',
    html:`<div> <h3>Esto es un test </h3> </div>`,
    attachments: []
}

const mailOptionsWhithAttachments = {
    from:"Coder test " + config.gmailAccount,
    to:config.gmailAccount,
    subject:'Correo de prueba Coderhouse',
    html:`<div> 
    <h3>Esto es un test </h3>
    <p>Ahora usando imagenes</p>
    <img src="cid:perrito"/>
    
    </div>`,
    attachments: [
       {
        filename: "Meme de perrito",
        path: __dirname + '/public/images/perrito.jpg',
        cid: 'perrito'
       }
    ]
}


// Armamos la Api

export const sendEmail = (req, res)=>{
    try {
        transporter.sendMail(mailOptions, (error, info)=>{
            if (error) {
                console.log(error)
                res.status(400).send({message:"Error", payload: error});
            }
            console.log('Message send: %s', info.messageId)
            res.send({message:"Success", payload: info});
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount});
    }
}

export const sendEmailWithAttachments = (req, res)=>{
    try {
        transporter.sendMail(mailOptionsWhithAttachments, (error, info)=>{
            if (error) {
                console.log(error)
                res.status(400).send({message:"Error", payload: error});
            }
            console.log('Message send: %s', info.messageId)
            res.send({message:"Success", payload: info});
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount});
    }
}