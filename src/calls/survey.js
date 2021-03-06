import axios, {AxiosResponse} from "axios";
import storageManager from "../storage/StorageManager";
import Logger from "../utils/Logger";
const log = new Logger("src/calls/survey.js");
const InitialCache = {
    privateSurveyCount: null,
    publicSurveyCount: null,
    privateSurveys: null,
    publicSurveys: null,
    closedSurveys: null
}

/**
 * Used in:
 * - Submissions
 * - SurveyOverview
 */
class SurveyAPIHandler {

    static cacheMiddleware(func: function, name: string) {
        let Cache = sessionStorage.getItem("SURVEY_CACHE");
        if (Cache === null || JSON.parse(Cache)[name] === null) {
            return func();
        } else {
            Cache = JSON.parse(Cache);
            return Cache[name]
        }
    }

    static setStorage(name: string, data: any) {
        let Cache = sessionStorage.getItem("SURVEY_CACHE");
        if (Cache === null) {
            InitialCache[name] = data;
            sessionStorage.setItem("SURVEY_CACHE", JSON.stringify(InitialCache));
        } else {
            const CacheObject = JSON.parse(Cache);
            CacheObject[name] = data;
            sessionStorage.setItem("SURVEY_CACHE", JSON.stringify(CacheObject));
        }
    }

    /**
     * Fetched the count of private (secured = true) surveys
     * scenario: Dashboard displays the number of surveys belonging to the user
     * @returns {Promise<*>}
     */
    static async privateSurveyCount() {
        log.debug("FETCH PRIVATE SURVEY COUNT");
        try {
            const jwt = storageManager.getJWTToken();
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/secured/count",
                headers: {
                    "Authorization": jwt
                }
            });
            SurveyAPIHandler.setStorage("privateSurveyCount", response.data.count);
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
    static async publicSurveyCount(): number{
        log.debug("FETCH PUBLIC SURVEY COUNT");
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
            SurveyAPIHandler.setStorage("publicSurveyCount", response.data.count);
            return response.data.count;
        } catch (e) {
            log.error("Error in publicSurveyCount:", e.response);
            log.debug("Failed axios request was caught: publicSurveyCount");
            return 0;
        }
    }

    /**
     * Sends a request to create a new Survey with all given Data from the user
     * @param title
     * @param description
     * @param start_date
     * @param end_date
     * @param securedInput
     * @param constrainedQuestions
     * @param freestyleQuestions
     * @returns {Promise<{log: string}|AxiosResponse<any>>}
     */
    static async surveyCreate(title: string, description: string, start_date, end_date, securedInput: boolean, constrainedQuestions: Array<Record<string, any>>, freestyleQuestions: Array<Record<string, any>>): AxiosResponse{
        const start = new Date(start_date).getUTCMilliseconds();
        const end = new Date(end_date).getUTCMilliseconds();
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
                    start_date: start,
                    end_date: end,
                    secured: securedInput,
                    constrained_questions: constrainedQuestions,
                    freestyle_questions: freestyleQuestions
                }
            });
        } catch (e) {
            log.error("Error in createSurvey:", e.response)
            return {
                log: "Failed axios request was caught: createSurvey"
            }
        }
    }

    static async surveyDelete(id: string) {
        try {
            return await axios({
                method: "DELETE",
                url: "/api/v1/survey/" + id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
        } catch (e) {
            log.error("Error in surveyDelete:", e.response);
            return {
                log: "Failed axios request was caught: surveyDelete"
            }
        }
    }

    static async surveyUpdate(id: string, title: string, description: string, start_date, end_date, secured: boolean, addedConstrainedQuestions: Array<Record<string, any>>, addedFreestyleQuestions: Array<Record<string, any>>, deletedConstrainedQuestions: Array<Record<string, any>>, deletedFreestyleQuestions: Array<Record<string, any>>): AxiosResponse {
        const start = new Date(start_date).getUTCMilliseconds();
        const end = new Date(end_date).getUTCMilliseconds();
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
                    start_date: start,
                    end_date: end,
                    secured,
                    added_constrained_questions: addedConstrainedQuestions,
                    added_freestyle_questions: addedFreestyleQuestions,
                    deleted_constrained_questions: deletedConstrainedQuestions,
                    deleted_freestyle_questions: deletedFreestyleQuestions
                }
            });
        } catch (e) {
            log.error("Error in surveyUpdate:", e.response);
            return {
                log: "Failed axios request was caught: surveyUpdate"
            }
        }
    }

    static async surveyPrivateGet(page_number = 0, page_size = 2) {
        try {
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/secured" + "?page_number=" + page_number + "&page_size=" + page_size,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            // remove after BUG is fixed
            if (response.status === 200) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].constrained_questions === null) {
                        response.data[i].constrained_questions = [];
                    }
                    if (response.data[i].freestyle_questions === null) {
                        response.data[i].freestyle_questions = [];
                    }
                }
                SurveyAPIHandler.setStorage("privateSurveys", response.data)
                return response.data;
            } else {
                return [];
            }
        } catch (e) {
            log.error(e.response, "Failed axios request was caught: surveyPrivateGet");
            log.debug("Hello", e.response);
        }
    }

    static async surveyPublicGet(page_number = 0, page_size = 2) {
        try {
            const userData = storageManager.getUserData();
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/public" + "?page_number=" + page_number + "&page_size=" + page_size + "&user_id=" + userData.id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            // remove after BUG is fixed
            if (response.status === 200) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].constrained_questions === null) {
                        response.data[i].constrained_questions = [];
                    }
                    if (response.data[i].freestyle_questions === null) {
                        response.data[i].freestyle_questions = [];
                    }
                }
                SurveyAPIHandler.setStorage("publicSurveys", response.data)
                return response.data;
            } else {
                return []
            }
        } catch (e) {
            log.error(e.response, "Failed axios request was caught: surveyPublicGet");
            return [];
        }
    }

    static async getSinglePrivateSurveyToken(id: string, token: string) {
        try {
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/secured/" + id + "?token=" + token
            });
            // remove after BUG is fixed
            if (response.status === 200) {
                if (response.data.constrained_questions === null) {
                    response.data.constrained_questions = [];
                }
                if (response.data.freestyle_questions === null) {
                    response.data.freestyle_questions = [];
                }
                return response;
            } else {
                return {}
            }
        } catch (e) {
            log.error("Error in getSinglePrivateSurveyToken:", e.response);
            return {
                log: "Failed axios request was caught: getSinglePrivateSurveyToken",
                backend: e.response
            }
        }
    }

    static async getSinglePrivateSurveyJWT(id: string) {
        try {
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/secured/" + id,
                headers: {
                    "Authorization": storageManager.getJWTToken() // Only valid if the JWT belongs to the creator of the survey
                }
            })
            // remove after BUG is fixed
            if (response.status === 200) {
                if (response.data.constrained_questions === null) {
                    response.data.constrained_questions = [];
                }
                if (response.data.freestyle_questions === null) {
                    response.data.freestyle_questions = [];
                }
                return response;
            } else {
                return {}
            }
        } catch (e) {
            log.error("Error in getSinglePrivateSurveyToken:", e.response);
            return {
                log: "Failed axios request was caught: getSinglePrivateSurveyToken",
                backend: e.response

            }
        }
    }

    static async getSinglePublicSurvey(id: string) {
        try {
            const response = await axios({
                method: "GET",
                url: "/api/v1/survey/public/" + id
            });
            // remove after BUG is fixed
            if (response.status === 200) {
                if (response.data.constrained_questions === null) {
                    response.data.constrained_questions = [];
                }
                if (response.data.freestyle_questions === null) {
                    response.data.freestyle_questions = [];
                }
                return response;
            } else {
                return {}
            }
        } catch (e) {
            log.error("Error in getSinglePublicSurvey:", e.response);
            return {
                log: "Failed axios request was caught: getSinglePublicSurvey",
                backend: e.response
            }
        }
    }
}

export default SurveyAPIHandler;