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
            log: "Failed axios request was caught: userRegistration"
        };
    }
}

export const userLogin = async (username, password) => {
    try{
        return await axios({
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
    } catch {
        return {
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
        log.debug("User token was banned, user logged out", apiResponse.status);
    } catch {
        log.debug("User token could not be banned: userLogout")
    }
}

export const changeUserPassword = async (username, email, oldPassword, password) => {
    try {
        return await axios({
            method: "PUT",
            url: "/api/v1/user",
            headers: {
                "Authorization": storageManager.getJWTToken()
            },
            data: {
                username: username !== "" ? username : null,
                email: email !== "" ? email : null,
                old_password: oldPassword,
                new_password: password
            }
        });
    } catch {
        return {
            log: "Failed axios request was caught: changeUserPassword"
        }
    }
}

export const changeUserData = async (username, email, oldPassword) => {
    try {
        return await axios({
            method: "PUT",
            url: "/api/v1/user",
            headers: {
                "Authorization": storageManager.getJWTToken()
            },
            data: {
                username: username !== "" ? username : null,
                email: email !== "" ? email : null,
                old_password: oldPassword
            }
        });
    } catch {
        return {
            log: "Failed axios request was caught: changeUserData"
        }
    }
}

export const getUserInfo = async () => {
    try{
        return await axios({
            method: "POST",
            url: "/api/v1/user/info",
            headers: {
                "Authorization": storageManager.getJWTToken()
            }
        });
    } catch {
        return {
            log: "Failed axios request was caught: getUserInfo"
        }
    }
}