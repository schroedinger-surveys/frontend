const initialState = {
    publicSurveys: [],
    privateSurveys: []
}

const SurveyListReducer = (state = initialState, action) => {
    switch (action.type){
        case "GET_PRIVATE_SURVEYS":
            return {
                ...state,
                privateSurveys: action.payload
            }
        case "GET_PUBLIC_SURVEYS":
            return {
                ...state,
                publicSurveys: action.payload
            }
        default:
            return state
    }
}

export default SurveyListReducer;