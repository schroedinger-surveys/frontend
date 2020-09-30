import React from "react";

import {EuropeanTime} from "../../utils/TimeConverter";

export const PendingSurvey = (survey) => {
    return (
        <div style={{textAlign: "center"}}>
            <h2 style={{color: "orange", fontSize: "50px", marginTop: "20px"}}>Inactive Survey</h2>
            <p>This survey is not active yet, you can therefore not see the survey or submit your answers.</p>
            <p>Come back <span style={{fontWeight: "bolder"}}>{EuropeanTime(survey.start_date)}!</span></p>
        </div>
    )
}

