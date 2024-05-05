import dotenv from 'dotenv';
import program from "../process.js";

// program
//     .option('-d', 'Variable para debug', false)
//     .option('--persist <mode>', 'Modo de persistencia', "mongodb")
//     .option('--mode <mode>', 'Modo de trabajo', 'dev')
// program.parse();




const environment = program.opts().mode;


console.log(process.env.SERVER_PORT)
console.log(process.env.MONGO_URL)

dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});


export default {
    port: process.env.SERVER_PORT,
    mongoUrl: process.env.MONGO_URL,
    persistence: program.opts().persist,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSMSNumber: process.env.TWILIO_SMS_NUMBER,
    twilioToSMSNumber: process.env.TWILIO_TO_SMS_NUMBER

};