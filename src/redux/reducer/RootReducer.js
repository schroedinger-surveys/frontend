import {combineReducers} from "redux";

import SurveyCountReducer from "./SurveyCountReducer";
import SurveyListReducer from "./SurveyListReducer";
import {SurveySpotlightReducer} from "./SurveySpotlightReducer";

export default combineReducers({
    surveyCounts: SurveyCountReducer,
    surveyLists: SurveyListReducer,
    selectedSpotlight: SurveySpotlightReducer
})