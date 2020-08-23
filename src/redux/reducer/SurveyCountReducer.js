const initialState = {
    overallSurveys: 0
}

const SurveyCountReducer = (state = initialState, action) => {
    switch (action.type){
        case "SET_OVERALL_COUNT":
            return {
                ...state,
                overallSurveys: action.payload
            }
        default:
            return state
    }
}

export default SurveyCountReducer;