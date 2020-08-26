import axios from "axios";

import storageManager from "../../storage/LocalStorageManager";

/**
 * Fetched the count of private (secured = true) surveys
 * scenario: Dashboard displays the number of surveys belonging to the user
 * @returns {Promise<*>}
 */
const privateSurveyCount = async () => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/secured/count",
        headers: {
            "Authorization": jwt
        }
    });
    return response.data.count;
}

/**
 * Fetched the count of public (secured = false) surveys
 * scenario: Dashboard displays the number of surveys belonging to the user
 * @returns {Promise<*>}
 */
const publicSurveyCount = async () => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/public/count",
        headers: {
            "Authorization": jwt
        }
    });
    return response.data.count;
}

export {privateSurveyCount, publicSurveyCount};