import axios, {AxiosResponse} from "axios";
import storageManager from "../storage/StorageManager";
import Logger from "../utils/Logger";
const log = Logger("src/calls/user.js");

const InitialCache = {
    userData: {}
}

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

    static cacheMiddleware(func: function, name: string){
        let Cache = sessionStorage.getItem("USER_CACHE");
        if(Cache === null || JSON.parse(Cache)[name] === null){
            return func();
        } else {
            Cache = JSON.parse(Cache);
            return Cache[name]
        }
    }

    static setStorage(name: string, data: any){
        let Cache = sessionStorage.getItem("USER_CACHE");
        if(Cache === null){
            InitialCache[name] = data;
            sessionStorage.setItem("USER_CACHE", JSON.stringify(InitialCache));
        } else {
            const CacheObject = JSON.parse(Cache);
            CacheObject[name] = data;
            sessionStorage.setItem("USER_CACHE", JSON.stringify(CacheObject));
        }
    }

    static async userRegistration(username: string, email: string, password: string) {
        log.debug("Someone wants to register a user account");
        try {
            return await axios({
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
        } catch (e){
            log.error("Error in userRegistration:",e.response);
            log.debug(e.response);
            return {
                log: "Failed axios request was caught: userRegistration",
                backend: e.response
            };
        }
    }

    static async userLogin(username: string, password: string) {
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
        } catch (e){
            log.error("Error in userLogin:",e.response);
            return {
                log: "Failed axios request was caught: userLogin",
                backend: e.response
            };
        }
    }

    static async userLogout(): AxiosResponse{
        try {
            const apiResponse = await axios({
                method: "POST",
                url: "/api/v1/user/logout",
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            log.debug("User token was banned, user logged out", apiResponse.status);
        } catch (e){
            log.error("Error in userLogout:",e.response);
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
        } catch (e){
            log.error("Error in changeUserPassword:",e.response);
            return {
                log: "Failed axios request was caught: changeUserPassword",
                backend: e.response
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
        } catch (e){
            log.debug("Fail", e.response);
            log.error("Error in changeUserData:",e.response);
            return {
                log: "Failed axios request was caught: changeUserData",
                backend: e.response
            }
        }
    }

    static async getUserInfo() {
        log.debug("FETCH USER INFO");
        try {
            const response =  await axios({
                method: "POST",
                url: "/api/v1/user/info",
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            if (response.status === 200){
                UserAPIHandler.setStorage("userData", response.data);
                return response.data;
            }
        } catch (e){
            log.error("Error in getUserInfo:",e.response);
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
        } catch (e){
            log.error("Error in userDelete:",e.response);
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
        } catch (e){
            log.error("Error in userResetPassword:",e.response);
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
        } catch (e){
            log.error("Error in userRequestPasswordReset:",e.response);
            return {
                log: "Failed axios request was caught: userRequestPasswordReset"
            }
        }
    }
}

export default UserAPIHandler;