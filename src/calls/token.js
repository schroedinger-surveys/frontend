import axios from "axios";
import storageManager from "../storage/StorageManager";
import log from "../log/Logger";

/**
 * used in:
 * - ShareLinks
 */
class TokenAPIHandler {
    static async createToken(id: string, amount: number) {
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

    static async sendLinkPerMail(id: string, mails: Array<string>) {
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

    /**
     * Get the token belonging to a survey
     * @param id survey_id
     * @param used - null: fetches all token - true: fetches used tokens - false:
     * @param page_number
     * @param page_size
     * @returns {Promise<{log: string}|AxiosResponse<any>>}
     */
    static async getSurveyToken(id: string, used = null, page_number = 0, page_size = 5) {
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

    static async tokenDelete(id: string) {
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

    static async tokenCount(id: string, used = null) {
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

