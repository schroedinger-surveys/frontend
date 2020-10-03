export default class Logger {
    constructor(name: string) {
        this.name = name;
    }

    debug = (message: string) => {
        /*eslint no-console: 0*/
        console.log(JSON.stringify({
            "class": this.name,
            message,
            "level": "level"
        }, null, 2));
    }

    info = (message: string) => {
        /*eslint no-console: 0*/
        console.log(JSON.stringify({
            "class": this.name,
            message,
            "level": "info"
        }, null, 2));
    }

    warn = (message: string) => {
        /*eslint no-console: 0*/
        console.log(JSON.stringify({
            "class": this.name,
            message,
            "level": "warn"
        }, null, 2));
    }

    error = (message: string) => {
        /*eslint no-console: 0*/
        console.log(JSON.stringify({
            "class": this.name,
            message,
            "level": "error"
        }, null, 2));
    }
}
