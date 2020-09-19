/**
 * Manages access to local and session storage
 * handles JWT-token coming from the backend after user login
 * saves, lookes up, validates and removes the token
 */
class LocalStorageManager {
    constructor() {
        this.JWT_STORAGE_KEY = "JWT";
    }

    /**
     * Save the jwt token coming as a response from the backend after user login
     * to LOCAL STORAGE
     * scenario: user wants to be remembered at next session (checked remember me checkbox)
     * @param token as in jwt token
     */
    saveJWTTokenLocal(token) {
        localStorage.setItem(this.JWT_STORAGE_KEY, JSON.stringify(token));
    }

    /**
     * Save the jwt token coming as a response from the backend after user login
     * to SESSION STORAGE
     * scenario: user does NOT want to be remembered at next session (did NOT check remember me checkbox)
     * @param token as in jwt token
     */
    saveJWTTokenSession(token) {
        sessionStorage.setItem(this.JWT_STORAGE_KEY, JSON.stringify(token));
    }

    /**
     * Returns the jwt token, either from local or session storage
     * scenario: http request demand an Authorization header containing the jwt token
     * @returns {string} as in the jwt token as a string
     */
    getJWTToken() {
        const tokenLocal = localStorage.getItem(this.JWT_STORAGE_KEY);
        const tokenSession = sessionStorage.getItem(this.JWT_STORAGE_KEY);
        if (tokenLocal !== null && this.validateToken(tokenLocal)) {
            return JSON.parse(tokenLocal);
        } else if (tokenSession !== null && this.validateToken(tokenSession)) {
            return JSON.parse(tokenSession);
        } else if (tokenLocal === null && tokenSession === null){
            return "";
        }
    }

    /**
     * Get the user data from the jwt body
     * like id and username
     * @returns {any}
     */
    getUserData() {
        const tokenLocal = localStorage.getItem(this.JWT_STORAGE_KEY);
        const tokenSession = sessionStorage.getItem(this.JWT_STORAGE_KEY);
        let token;
        if (tokenLocal !== null) {
            token = tokenLocal;
        } else if (tokenSession !== null) {
            token = tokenSession;
        } else {
            return null;
        }
        const tokenParts = token.split(".");
        const tokenBody = tokenParts[1];
        const decodedTokenBody = atob(tokenBody);
        return JSON.parse(decodedTokenBody)
    }

    /**
     * Searches for JWT token in Local and Session Storage
     * if found validate it with func validateToken
     * scenario: App renders, then checks if token exists,
     * if yes it redirects to user dashboard instead of rendering home
     * @returns {boolean} token was found - true || false
     */
    searchForJWTToken() {
        const tokenLocal = localStorage.getItem(this.JWT_STORAGE_KEY);
        const tokenSession = sessionStorage.getItem(this.JWT_STORAGE_KEY);
        let valid = false;
        if (tokenLocal !== null) {
            valid = this.validateToken(tokenLocal);
        } else if (tokenSession !== null) {
            valid = this.validateToken(tokenSession);
        }
        return valid;
    }

    /**
     * Validates a given token based on the property "exp" that is saved in the body of the jwt token
     * @param token as in jwt token - as a string
     * @returns {boolean} token is valid (expiration date is bigger than current date) - true || false
     */
    validateToken(token) {
        const tokenParts = token.split(".");
        const tokenBody = tokenParts[1];
        const decodedTokenBody = atob(tokenBody);
        const expirationDate = JSON.parse(decodedTokenBody).exp;
        return expirationDate > Math.floor(Date.now() / 1000);
    }

    /**
     * Clears the local and session storage of the item that holds user jwt token
     * scenario: User logout
     */
    clearToken() {
        sessionStorage.removeItem("USER_CACHE");
        sessionStorage.removeItem("SURVEY_CACHE");
        sessionStorage.removeItem("SUBMISSION_CACHE");
        sessionStorage.clear();
        localStorage.removeItem(this.JWT_STORAGE_KEY);
        sessionStorage.removeItem(this.JWT_STORAGE_KEY);
    }

}

const storageManager = new LocalStorageManager(); // Create a Singleton object and export it
export default storageManager;