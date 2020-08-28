export const SurveySpotlightReducer = (selectedSurveySpotlight = null, action) => {
    if (action.type === "SET_SPOTLIGHT"){
        return action.payload
    }

    return selectedSurveySpotlight
}