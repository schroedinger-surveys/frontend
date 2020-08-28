import storageManager from "../../storage/LocalStorageManager";
import axios from "axios";
import log from "../../log/Logger";

const getPrivateSurveys = async () => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/secured",
        headers: {
            "Authorization": jwt
        }
    });
    log.debug("fetched private surveys:", response);
    return response.data;
}

const getPublicSurveys = async () => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/public",
        headers: {
            "Authorization": jwt
        }
    });
    log.debug("fetched public surveys:", response);
    return response.data;
}

export {
    getPrivateSurveys,
    getPublicSurveys
}