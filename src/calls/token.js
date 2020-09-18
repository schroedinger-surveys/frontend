import axios from "axios";
import storageManager from "../storage/LocalStorageManager";
import log from "../log/Logger";

/**
 * used in:
 * - ShareLinks
 */
class TokenAPIHandler {
    static async createToken(id, amount) {
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
        } catch (e){
            log.error("Error in createToken:",e.response);
            return {
                log: "Failed axios request was caught: createToken"
            };
        }
    }

    static async sendLinkPerMail(id, mails) {
        try {
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
        } catch (e){
            log.error("Error in sendLinkPerMail:",e.response);
            return {
                log: "Failed axios request was caught: sendLinkPerMail"
            };
        }
    }

    static async getSurveyToken(id, used = null, page_number = 0, page_size = 5) {
        try {
            if (used !== null) {
                return await axios({
                    method: "GET",
                    url: "/api/v1/token?survey_id=" + id + "&used=" + used + "&page_number=" + page_number + "&page_size=" + page_size,
                    headers: {
                        "Authorization": storageManager.getJWTToken()
                    }
                })
            } else {
                return await axios({
                    method: "GET",
                    url: "/api/v1/token?survey_id=" + id + "&page_number=" + page_number + "&page_size=" + page_size,
                    headers: {
                        "Authorization": storageManager.getJWTToken()
                    }
                })
            }
        } catch (e){
            log.error("Error in getSurveyToken:",e.response);
            return {
                log: "Failed axios request was caught: getSurveyToken"
            };
        }
    }

    static async tokenDelete(id) {
        try {
            return await axios({
                method: "DELETE",
                url: "/api/v1/token/" + id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
        } catch (e) {
            log.error("Error in tokenDelete:",e.response);
            return {
                log: "Failed axios request was caught: tokenDelete"
            };
        }
    }

    static async tokenCount(id, used = null) {
        try {
            if (used !== null) {
                return await axios({
                    method: "GET",
                    url: "/api/v1/token/count?survey_id=" + id + "&used=" + used,
                    headers: {
                        "Authorization": storageManager.getJWTToken()
                    }
                });
            } else {
                return await axios({
                    method: "GET",
                    url: "/api/v1/token/count?survey_id=" + id,
                    headers: {
                        "Authorization": storageManager.getJWTToken()
                    }
                });
            }
        } catch (e){
            log.error("Error in tokenCount:",e.response);
            return {
                log: "Failed axios request was caught: tokenCount"
            };
        }
    }
}

export default TokenAPIHandler;

