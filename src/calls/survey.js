import axios from "axios";
import storageManager from "../storage/LocalStorageManager";
import log from "../log/Logger";

/**
 * Used in:
 * - Submissions
 */
class SurveyAPIHandler {

    /**
     * Fetched the count of private (secured = true) surveys
     * scenario: Dashboard displays the number of surveys belonging to the user
     * @returns {Promise<*>}
     */
    static async privateSurveyCount() {
        try{
            const jwt = storageManager.getJWTToken();
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/secured/count",
                headers: {
                    "Authorization": jwt
                }
            });
            return response.data.count;
        } catch{
            log.debug("Failed axios request was caught: privateSurveyCount");
        }
    }

    /**
     * Fetched the count of public (secured = false) surveys
     * scenario: Dashboard displays the number of surveys belonging to the user
     * @returns {Promise<*>}
     */
    static async publicSurveyCount() {
        const jwt = storageManager.getJWTToken();
        const userData = storageManager.getUserData();
        try{
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/public/count?user_id=" + userData.id,
                headers: {
                    "Authorization": jwt
                }
            });
            return response.data.count;
        } catch {
            log.debug("Failed axios request was caught: publicSurveyCount");
        }
    }

}

export default SurveyAPIHandler;