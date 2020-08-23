import axios from "axios";

import storageManager from "../../storage/LocalStorageManager";
import log from "../../log/Logger";

const privateSurveyCount = async () => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/secured/count",
        headers: {
            "Authorization": jwt
        }
    });
    log.debug("Count response for private surveys:", response.data);
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
    log.debug("Count response for public surveys:", response.data);
    return response.data[0].count;
}

export {privateSurveyCount, publicSurveyCount};