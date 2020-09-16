import axios from "axios";
import storageManager from "../storage/LocalStorageManager";

export const createToken = async (id, amount) => {
    try{
        return await axios({
            method: "POST",
            url: "/api/v1/token",
            headers: {
                "Authorization": storageManager.getJWTToken()
            },
            data: {
                "survey_id": id,
                amount
            }
    } catch {

    }
}