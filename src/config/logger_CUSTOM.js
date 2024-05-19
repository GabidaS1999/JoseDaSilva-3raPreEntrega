import winston from "winston";
import config from "./config.js";

//Custom logger options

const customLevelOptions = {
    levels: {
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'magenta',
        error: 'yellow',
        fatal: 'red'
    }
}

winston.addColors(customLevelOptions.colors)

//logger dev
const devLogger = winston.createLogger({
    //levels
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            filename: './errors.log',
            level: "error",
            format: (
                winston.format.simple()
            )
        })
    ]
})


//logger prod
const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        //definimos el transport de consola
        new winston.transports.Console({ level: "info" }),

        new winston.transports.File({ filename: './errors.log', level: "error" })
    ]
})

export const addLogger = (req, res, next) => {


    if (config.environment === 'production') {
        req.logger = prodLogger;
        req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`);

        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`);

        req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`);

        req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`);
    } else {
        req.logger = devLogger;
        req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`);

        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`);

        req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`);

        req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()}- ${new Date().toLocaleTimeString()}`);

    }

    next()
}