const winston = require('winston');

const logFactory = (name: string) => {
    return winston.createLogger({
        level: 'debug',
        format: winston.format.combine(winston.format.json(), winston.format.prettyPrint()),
        defaultMeta: {service: name},
        transports: [
            new winston.transports.Console()
        ]
    });
}

export default logFactory;