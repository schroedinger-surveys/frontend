
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
        default:
            return state
    }
}

export default SurveyCountReducer;