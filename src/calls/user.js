import axios from "axios";
import log from "../log/Logger";
import storageManager from "../storage/LocalStorageManager";

/**
 * Used in:
 * - Register
 * - Login
 * - NavbarMenu
 * - SideMenu
 * - ChangeUserData
 * - ResetPassword
 */
class UserAPIHandler {
    static async userRegistration(username, email, password) {
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
                log: "Failed axios request was caught: userRegistration"
            };
        }
    }

    static async userLogin(username, password) {
        try {
            return await axios({
                method: "POST",
                url: "/api/v1/user/login",
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    username,
                    password
                }
            });
        } catch {
            return {
                log: "Failed axios request was caught: userLogin"
            };
        }
    }

    static async userLogout() {
        try {
            const apiResponse = await axios({
                method: "POST",
                url: "/api/v1/user/logout",
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            log.debug("User token was banned, user logged out", apiResponse.status);
        } catch {
            log.debug("User token could not be banned: userLogout")
        }
    }

    static async changeUserPassword(username, email, oldPassword, password) {
        try {
            return await axios({
                method: "PUT",
                url: "/api/v1/user",
                headers: {
                    "Authorization": storageManager.getJWTToken()
                },
                data: {
                    username: username !== "" ? username : null,
                    email: email !== "" ? email : null,
                    old_password: oldPassword,
                    new_password: password
                }
            });
        } catch {
            return {
                log: "Failed axios request was caught: changeUserPassword"
            }
        }
    }

    static async changeUserData(username, email, oldPassword) {
        try {
            return await axios({
                method: "PUT",
                url: "/api/v1/user",
                headers: {
                    "Authorization": storageManager.getJWTToken()
                },
                data: {
                    username: username !== "" ? username : null,
                    email: email !== "" ? email : null,
                    old_password: oldPassword
                }
            });
        } catch {
            return {
                log: "Failed axios request was caught: changeUserData"
            }
        }
    }

    static async getUserInfo() {
        try {
            return await axios({
                method: "POST",
                url: "/api/v1/user/info",
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
        } catch {
            return {
                log: "Failed axios request was caught: getUserInfo"
            }
        }
    }

    static async userDelete(confirmDeletePassword) {
        try {
            return await axios({
                method: "DELETE",
                url: "/api/v1/user",
                headers: {
                    "Authorization": storageManager.getJWTToken()
                },
                data: {
                    password: confirmDeletePassword
                }
            });
        } catch {
            return {
                log: "Failed axios request was caught: userDelete"
            }
        }
    }

    static async userResetPassword(resetToken, password) {
        try {
            return await axios({
                method: "PUT",
                url: "/api/v1/user/password/reset",
                data: {
                    reset_password_token: resetToken,
                    new_password: password
                }
            });
        } catch {
            return {
                log: "Failed axios request was caught: userResetPassword"
            }
        }
    }

    static async userRequestPasswordReset(username, email) {
        try {
            if (username !== "") {
                return await axios({
                    method: "POST",
                    url: "/api/v1/user/password/reset",
                    data: {
                        username,
                        email
                    }
                })
            } else {
                return await axios({
                    method: "POST",
                    url: "/api/v1/user/password/reset",
                    data: {
                        email
                    }
                })
            }
        } catch {
            return {
                log: "Failed axios request was caught: userRequestPasswordReset"
            }
        }
    }
}

export default UserAPIHandler;