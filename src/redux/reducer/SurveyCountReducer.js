import * as types from "../types/SurveyCount";

const initialState = {
    overallSurveys: 0,
    publicSurveys: 0,
    privateSurveys: 0,
    activeSurveys: 0,
    pendingSurveys: 0,
    closedSurveys: 0
}

const SurveyCountReducer = (state = initialState, action) => {
    switch (action.type){
        case types.SET_OVERALL_COUNT:
            return {
                ...state,
                overallSurveys: action.payload
            }
        case types.SET_PRIVATE_COUNT:
            return {
                ...state,
                privateSurveys: action.payload
            }
        case types.SET_PUBLIC_COUNT:
            return {
                ...state,
                publicSurveys: action.payload
            }
        case types.SET_ACTIVE_COUNT:
            return {
                ...state,
                activeSurveys: action.payload
            }
        case types.SET_PENDING_COUNT:
            return {
                ...state,
                pendingSurveys: action.payload
            }
        case types.SET_CLOSED_COUNT:
            return {
                ...state,
                closedSurveys: action.payload
            }
        default:
            return state
    }
}

export default SurveyCountReducer;