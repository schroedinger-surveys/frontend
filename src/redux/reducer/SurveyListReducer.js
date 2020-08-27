const initialState = {
    publicSurveys: [],
    privateSurveys: []
}

const SurveyListReducer = (state = initialState, action) => {
    switch (action.type){
        case "SET_PRIVATE_SURVEYS":
            console.log("FUUUUCKER", action.payload);
            return {
                ...state,
                privateSurveys: action.payload
            }
        case "SET_PUBLIC_SURVEYS":
            return {
                ...state,
                publicSurveys: action.payload
            }
        default:
            return state
    }
}

export default SurveyListReducer;