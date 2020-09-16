import axios from "axios";
import storageManager from "../storage/LocalStorageManager";

export const createToken = async (id, amount) => {
    try {
        return await axios({
            method: "POST",
            url: "/api/v1/token",
            headers: {
                "Authorization": storageManager.getJWTToken()
            },
            data: {
                "survey_id": id,
                amount
            }
        });
    } catch {
        return {
            log: "Failed axios request was caught: createToken"
        };
    }
}

export const sendLinkPerMail = async (id, mails) => {
    try{
        return await axios({
            method: "POST",
            url: "/api/v1/token/email",
            headers: {
                "Authorization": storageManager.getJWTToken()
            },
            data: {
                survey_id: id,
                emails: mails
            }
        });
    } catch {
        return {
            log: "Failed axios request was caught: sendLinkPerMail"
        };
    }
}