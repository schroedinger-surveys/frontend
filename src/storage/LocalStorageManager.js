

class LocalStorageManager {
    constructor() {
        this.JWT_STORAGE_KEY = "JWT";
    }

    saveJWTToken(token) {
        localStorage.setItem(this.JWT_STORAGE_KEY, JSON.stringify(token));
    }

    searchForJWTToken(){
        const token = localStorage.getItem(this.JWT_STORAGE_KEY);
    }

}

const storageManager = new LocalStorageManager();
export default storageManager;