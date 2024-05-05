import config from "../config/config.js";
import twilio from 'twilio'

const twilioClient = twilio(config.twilioAccountSID, config.twilioAuthToken);

const twilioOptions = {
    body: 'Esto es un mensaje SMS de test usando twilio desde CoderHouse',
    from: config.twilioSMSNumber,
    to: config.twilioToSMSNumber
}


//Metodo sendSMS
export const sendSMS = async (req, res)=>{
    try {
        console.log("Enviando SMS desde twilio")
        console.log(twilioClient)
        const result = await twilioClient.messages.create(twilioOptions)

        res.send({message:"Success", payload:result})
    } catch (error) {
        console.error("Hubo un probema enviando el Sms" + error);
        res.status(500).send({error:error});
    }
}