const initialState = {
    overallSurveys: 0,
    privateCount: 0,
    publicCount: 0,
    activeCount: 0,
    pendingCount: 0,
    closedCount: 0
}

const SurveyCountReducer = (state = initialState, action) => {
    switch (action.type){
        case "SET_OVERALL_COUNT":
            return {
                ...state,
                overallSurveys: action.payload
            }
        case "SET_PRIVATE_COUNT":
            return {
                ...state,
                privateCount: action.payload
            }
        case "SET_PUBLIC_COUNT":
            return {
                ...state,
                publicCount: action.payload
            }
        case "SET_ACTIVE_COUNT":
            return {
                ...state,
                activeCount: action.payload
            }
        case "SET_PENDING_COUNT":
            return {
                ...state,
                pendingCount: action.payload
            }
        case "SET_CLOSED_COUNT":
            return {
                ...state,
                closedCount: action.payload
            }
        default:
            return state
    }
}

export default SurveyCountReducer;