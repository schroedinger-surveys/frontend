import axios from "axios";

import storageManager from "../../storage/LocalStorageManager";

const privateSurveyCount = async () => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/secured/count",
        headers: {
            "Authorization": jwt
        }
    });
    return response.data[0].count;
}

const publicSurveyCount = async () => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/public/count",
        headers: {
            "Authorization": jwt
        }
    });
    return response.data[0].count;
}

export {privateSurveyCount, publicSurveyCount};