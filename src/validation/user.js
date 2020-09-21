export const loginValidator = (username, password) => {
    if(username === ""){
        return {status: false, type: "warning", text : "Please insert your username."};
    } else if (password === ""){
        return {status: false, type: "warning", text: "Please insert your password."};
    }
    return {status: true};
}