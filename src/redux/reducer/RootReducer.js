import {combineReducers} from "redux";

import SurveyCountReducer from "./SurveyCountReducer";
import SurveyListReducer from "./SurveyListReducer";

export default combineReducers({
    surveyCounts: SurveyCountReducer,
    surveyLists: SurveyListReducer
})