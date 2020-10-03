export const loginValidator = (username: string, password: string) => {
    if (username === "") {
        return {status: false, type: "warning", text: "Please insert your username."};
    } else if (password === "") {
        return {status: false, type: "warning", text: "Please insert your password."};
    }
    return {status: true};
}

export const registrationValidator = (username, email, password) => {
    if (username === ""){
        return {status: false, type: "warning", text: "Please insert your username."};
    } else if (email === ""){
        return {status: false, type: "warning", text: "Please insert your email."};
    }else if (password === ""){
        return {status: false, type: "warning", text: "Please insert your password."};
    }
    return {status: true};
}