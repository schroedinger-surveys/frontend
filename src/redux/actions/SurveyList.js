const setPrivateSurveys = (surveys) => {
    console.log("Motherfuckers",surveys);
    return {
        type: "SET_PRIVATE_SURVEYS",
        payload: [...surveys]
    }
}

const setPublicSurveys = (surveys) => {
    return {
        type: "SET_PUBLIC_SURVEYS",
        payload: [...surveys]
    }
}

export {
    setPrivateSurveys,
    setPublicSurveys
}