import axios from "axios";
import log from "../log/Logger";
import storageManager from "../storage/LocalStorageManager";

export const userRegistration = async (username, email, password) => {
    log.debug("Someone wants to register a user account");
    try {
        const apiResponse = await axios({
            method: "POST",
            url: "/api/v1/user",
            headers: {
                "content-type": "application/json"
            },
            data: {
                username,
                email,
                password
            }
        });
        return apiResponse;
    } catch {
        return {
            message: "Something went wrong. Please try again.",
            log: "Failed axios request was caught: userRegistration"
        };
    }
}

export const userLogin = async (username, password) => {
    try{
        const apiResponse = await axios({
            method: "POST",
            url: "/api/v1/user/login",
            headers: {
                "content-type": "application/json"
            },
            data: {
                username,
                password
            }
        });
        return apiResponse;
    } catch {
        return {
            message: "Something went wrong. Please try again.",
            log: "Failed axios request was caught: userLogin"
        };
    }
}

export const userLogout = async () => {
    try {
        const apiResponse = await axios({
            method: "POST",
            url: "/api/v1/user/logout",
            headers: {
                "Authorization": storageManager.getJWTToken()
            }
        });
    } catch {
        log.debug("User token could not be banned: userLogout")
    }
}