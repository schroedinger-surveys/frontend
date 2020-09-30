import React from "react";
import {EuropeanTime} from "../../utils/TimeConverter";

export const ClosedSurvey = (survey) => {
    return (
        <div id={"app_page_body"}>
            <div style={{textAlign: "center", marginTop: "20px"}}>
                <h2 style={{color: "darkred", fontSize: "50px"}}>Closed Survey</h2>
                <p>This survey is already closed, you can therefore not see the survey or submit your answers.</p>
                <p>Survey was closed <span style={{fontWeight: "bolder"}}>{EuropeanTime(survey.end_date)}!</span></p>
            </div>
        </div>
    )
}