import React from "react";

import madCat from "../icons/mad_kitty.png"

export const ClosedSurvey = (survey) => {
    return(
        <div style={{textAlign: "center"}}>
            <h2 style={{color: "darkred", fontSize: "50px"}}>Closed Survey</h2>
            <img src={madCat} alt={"sleeping cat"}/>
            <p>This survey is already closed, you can therefore not see the survey or submit your answers.</p>
            <p>Survey was closed at <span style={{fontWeight: "bolder"}}>{survey.end_date}!</span></p>
        </div>
    )
}