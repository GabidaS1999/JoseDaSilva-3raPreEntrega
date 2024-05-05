import {Command} from 'commander';

const program = new Command(); //Crea la instancia de comandos de commander

program
    .option('-d', "Variable para debug", false)
    .option('-p <port>', "Puerto del server", 8080)
    .option('--persist <mode>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', "Modo de trabajo del server", 'development')

    console.log('Option', program.opts());
    console.log('Option mode', program.opts().mode);
    console.log('Option port', program.opts().p);


program.parse();//Parsea los comandos y verifica que esten correctos


//Listeners

process.on('exit', code => {
    console.log("Este codigo se ejecuta antes de salir del proceso")
    console.log("Codigo de salida del process", code);
})
process.on('uncaughtException', exception => {
    console.log("Esta exepcion no fue capturada o controlada")
    console.log("Exepcion no capturada:", exception);
})
process.on('message', message => {
    console.log("Mensaje recibido:", message);
})



export default program;