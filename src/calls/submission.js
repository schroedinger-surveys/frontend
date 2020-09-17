import axios from "axios";
import storageManager from "../storage/LocalStorageManager";
import log from "../log/Logger";

/**
 * Used in:
 * - Submissions
 * - SurveyOverview
 */
class SubmissionAPIHandler {

    static async submissionCount(id){
        try{
            return await axios({
                method: "GET",
                url: "/api/v1/submission/count?survey_id=" + id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
        } catch (e){
            log.error("Error in submissionCount:",e);
            return {
                log: "Failed axios request was caught: submissionCount"
            };
        }
    }
}

export default SubmissionAPIHandler;