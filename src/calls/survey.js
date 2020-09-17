import axios from "axios";
import storageManager from "../storage/LocalStorageManager";
import log from "../log/Logger";

/**
 * Used in:
 * - Submissions
 * - SurveyOverview
 */
class SurveyAPIHandler {

    /**
     * Fetched the count of private (secured = true) surveys
     * scenario: Dashboard displays the number of surveys belonging to the user
     * @returns {Promise<*>}
     */
    static async privateSurveyCount() {
        try {
            const jwt = storageManager.getJWTToken();
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/secured/count",
                headers: {
                    "Authorization": jwt
                }
            });
            return response.data.count;
        } catch (e) {
            log.error("Error in privateSurveyCount:", e);
            log.debug("Failed axios request was caught: privateSurveyCount");
            return 0;
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
        try {
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/public/count?user_id=" + userData.id,
                headers: {
                    "Authorization": jwt
                }
            });
            return response.data.count;
        } catch (e) {
            log.error("Error in publicSurveyCount:", e);
            log.debug("Failed axios request was caught: publicSurveyCount");
            return 0;
        }
    }

    static async surveyCreate(title, description, start_date, end_date, securedInput, constrainedQuestions, freestyleQuestions) {
        try {
            return await axios({
                method: "POST",
                url: "/api/v1/survey",
                headers: {
                    "content-type": "application/json",
                    "Authorization": storageManager.getJWTToken()
                },
                data: {
                    title,
                    description,
                    start_date,
                    end_date,
                    secured: securedInput,
                    constrained_questions: constrainedQuestions,
                    freestyle_questions: freestyleQuestions
                }
            });
        } catch (e) {
            log.error("Error in createSurvey:", e)
            return {
                log: "Failed axios request was caught: createSurvey"
            }
        }
    }

    static async surveyDelete(id) {
        try {
            return await axios({
                method: "DELETE",
                url: "/api/v1/survey/" + id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
        } catch (e) {
            log.error("Error in surveyDelete:", e);
            return {
                log: "Failed axios request was caught: surveyDelete"
            }
        }
    }

    static async surveyUpdate(id, title, description, start_date, end_date, secured, addedConstrainedQuestions, addedFreestyleQuestions, deletedConstrainedQuestions, deletedFreestyleQuestions) {
        try {
            return await axios({
                method: "PUT",
                url: "/api/v1/survey/" + id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                },
                data: {
                    title,
                    description,
                    start_date,
                    end_date,
                    secured,
                    added_constrained_questions: addedConstrainedQuestions,
                    added_freestyle_questions: addedFreestyleQuestions,
                    deleted_constrained_questions: deletedConstrainedQuestions,
                    deleted_freestyle_questions: deletedFreestyleQuestions
                }
            });
        } catch (e) {
            log.error("Error in surveyUpdate:", e);
            return {
                log: "Failed axios request was caught: surveyUpdate"
            }
        }
    }

    static async surveyPrivateGet(page_number = 0, page_size = 3) {
        try {
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/secured" + "?page_number=" + page_number + "&page_size=" + page_size,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            // TODO - remove after BUG is fixed
            if (response.status === 200) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].constrained_questions === null) {
                        response.data[i].constrained_questions = [];
                    }
                    if (response.data[i].freestyle_questions === null) {
                        response.data[i].freestyle_questions = [];
                    }
                }
                return response.data;
            } else {
                return [];
            }
        } catch (e) {
            log.error(e, "Failed axios request was caught: surveyPrivateGet");
            return [];
        }
    }

    static async surveyPublicGet(page_number = 0, page_size = 3) {
        try {
            const userData = storageManager.getUserData();
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/public" + "?page_number=" + page_number + "&page_size=" + page_size + "&user_id=" + userData.id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            // TODO - remove after BUG is fixed
            if (response.status === 200) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].constrained_questions === null) {
                        response.data[i].constrained_questions = [];
                    }
                    if (response.data[i].freestyle_questions === null) {
                        response.data[i].freestyle_questions = [];
                    }
                }
                return response.data;
            } else {
                return []
            }
        } catch (e) {
            log.error(e, "Failed axios request was caught: surveyPublicGet");
            return [];
        }
    }

    static async getSinglePrivateSurveyToken(id, token) {
        try {
            return await axios({
                method: "GET",
                url: "/api/v1/survey/secured/" + id + "?token=" + token
            })
        } catch (e) {
            log.error("Error in getSinglePrivateSurveyToken:", e);
            return {
                log: "Failed axios request was caught: getSinglePrivateSurveyToken"
            }
        }
    }

    static async getSinglePrivateSurveyJWT(id) {
        try {
            return await axios({
                method: "GET",
                url: "/api/v1/survey/secured/" + id,
                headers: {
                    "Authorization": storageManager.getJWTToken() // Only valid if the JWT belongs to the creator of the survey
                }
            })
        } catch (e) {
            log.error("Error in getSinglePrivateSurveyToken:", e);
            return {
                log: "Failed axios request was caught: getSinglePrivateSurveyToken"
            }
        }
    }

    static async getSinglePublicSurvey(id){
        try{
            return await axios({
                method: "GET",
                url: "/api/v1/survey/public/" + id
            });
        } catch (e) {
            log.error("Error in getSinglePublicSurvey:", e);
            return {
                log: "Failed axios request was caught: getSinglePublicSurvey"
            }
        }
    }

}

export default SurveyAPIHandler;