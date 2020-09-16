import axios from "axios";
import log from "../../log/Logger";

export const userRegistration = async (username, email, password) => {
    log.debug("Someone wants to register a user account");
    try {
        const apiResponse = await axios({
            method: "POST",
            url: "/api/v1/user",
            headers: {
                "content-type": "application/json"
            },
            data: {
                username,
                email,
                password
            }
        });
        return apiResponse;
    } catch {
        return {
            message: "Something went wrong. Please try again.",
            log: "Failed axios request was catched: registerNewUser"
        };
    }
}