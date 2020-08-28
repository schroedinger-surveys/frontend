import axios from "axios";

import storageManager from "../../storage/LocalStorageManager";
import {useSelector} from "react-redux";
import {UnixToHumanTime} from "./TimeConverter";
import log from "../../log/Logger";

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

const setAllSurveyCounts = (privateSurveys, publicSurveys) => {
    const allSurveys = [...privateSurveys, ...publicSurveys];

    let active = 0;
    let pending = 0;
    let closed = 0;

    const today = Date.now();

    for (let i = 0; i < allSurveys.length; i++){
        const startDate = new Date(allSurveys[i].start_date).getTime();
        const endDate = new Date(allSurveys[i].end_date).getTime();
        if(startDate > today){
            pending++;
        } else if(endDate < today){
            closed++
        } else if (startDate <= today && endDate >= today){
            active++;
        }
    }

    return[active, pending, closed];
}

export {
    privateSurveyCount,
    publicSurveyCount,
    setAllSurveyCounts
};