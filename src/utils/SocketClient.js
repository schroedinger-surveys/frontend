import io from 'socket.io-client';
import Logger from "./Logger";
const log = new Logger("src/socket/SocketClient.js");

class SocketAPI {
    socket;

    connect(jwtToken) {
        if(!this.socket) {
            this.socket = io("https://schroedinger-survey.de/", {
                path: "/api/v2",
                query: {authorization: jwtToken},
                transports: ['websocket']
            });

            return new Promise((resolve, reject) => {
                this.socket.on('connect', () => resolve());
                this.socket.on('connect_error', (error) => reject(error));
            });
        }
        return new Promise((resolve) => {
            resolve();
        });
    }

    disconnect() {
        return new Promise((resolve) => {
            this.socket.disconnect(() => {
                this.socket = null;
                resolve();
            });
        });
    }

    subscribe(event, fun) {
        log.info(`Socket subscribed channel "${event}"`)
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject('No socket connection.');
            }
            this.socket.on(event, fun);
            resolve();
        });
    }
}

const socketAPI = new SocketAPI();
export default socketAPI;