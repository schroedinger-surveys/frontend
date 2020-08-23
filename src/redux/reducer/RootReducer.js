import {combineReducers} from "redux";

import SurveyCountReducer from "./SurveyCountReducer";

export default combineReducers({
    surveyCount: SurveyCountReducer
})