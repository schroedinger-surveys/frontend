import axios from "axios";
import log from "../../log/Logger";
import storageManager from "../../storage/LocalStorageManager";

const getPrivateSurveys = async () => {
    const jwt = storageManager.getJWTToken();
    const response = await axios({
        method: "GET",
        url: "/api/v1/survey/secured",
        headers: {
            "Authorization": jwt
        }
    });
    log.debug("fetched private surveys:",response);
    if(response.status === 200){
        return{
            type: "GET_PRIVATE_SURVEYS",
            payload: response.data
        }
    } else {
        return{
            type: "GET_PRIVATE_SURVEYS",
            payload: []
        }
    }
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
    log.debug("fetched public surveys:",response);
    if(response.status === 200){
        return{
            type: "GET_PRIVATE_SURVEYS",
            payload: response.data
        }
    } else {
        return{
            type: "GET_PRIVATE_SURVEYS",
            payload: []
        }
    }
}

export {
    getPrivateSurveys,
    getPublicSurveys
}