import axios from "axios";
import storageManager from "../storage/LocalStorageManager";

/**
 * Used in:
 * - Submissions
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
        } catch{
            return {
                log: "Failed axios request was caught: submissionCount"
            };
        }
    }
}

export default SubmissionAPIHandler;