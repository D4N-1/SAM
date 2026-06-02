import winston from 'winston'
import 'winston-daily-rotate-file'


const transportOptions = new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d'
})


const logRegister = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(
        //winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.DailyRotateFile({
            ...transportOptions,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),

        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
})

export default logRegister