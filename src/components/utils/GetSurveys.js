import storageManager from "../../storage/LocalStorageManager";
import axios from "axios";
import log from "../../log/Logger";

const getPrivateSurveys = async (page_number = 0, page_size = 3) => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/secured" + "?page_number=" + page_number + "&page_size=" + page_size,
        headers: {
            "Authorization": jwt
        }
    });
    log.debug("fetched private surveys:", response);
    return response.data;
}

const getPublicSurveys = async (page_number = 0, page_size = 3) => {
    const jwt = storageManager.getJWTToken();
    const userData = storageManager.getUserData();
    log.debug(userData);
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/public" + "?page_number=" + page_number + "&page_size=" + page_size + "&user_id=" + userData.id,
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