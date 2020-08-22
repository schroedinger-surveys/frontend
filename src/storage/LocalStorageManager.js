import log from "../log/Logger";

class LocalStorageManager {
    constructor() {
        this.JWT_STORAGE_KEY = "JWT";
    }

    saveJWTTokenLocal(token) {
        localStorage.setItem(this.JWT_STORAGE_KEY, JSON.stringify(token));
    }

    saveJWTTokenSession(token) {
        sessionStorage.setItem(this.JWT_STORAGE_KEY, JSON.stringify(token));
    }

    searchForJWTToken(){
        const tokenLocal = localStorage.getItem(this.JWT_STORAGE_KEY);
        const tokenSession = sessionStorage.getItem(this.JWT_STORAGE_KEY);
        let valid = false;
        if(tokenLocal !== null){
            valid = this.validateToken(tokenLocal);
        } else if (tokenSession !== null){
            valid = this.validateToken(tokenSession);
        }
        return valid;
    }

    validateToken(token){
        const tokenParts = token.split(".");
        const tokenBody = tokenParts[1];
        const decodedTokenBody = atob(tokenBody);
        const expirationDate = JSON.parse(decodedTokenBody).exp;
        return expirationDate > Math.floor(Date.now() / 1000);
    }

    clearToken() {
        localStorage.removeItem(this.JWT_STORAGE_KEY);
        sessionStorage.removeItem(this.JWT_STORAGE_KEY);
    }

}

const storageManager = new LocalStorageManager();
export default storageManager;