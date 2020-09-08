import React from "react";

import sleepingCat from "../icons/kitty.png"

export const PendingSurvey = (survey) => {
    return(
        <div style={{textAlign: "center"}}>
            <h2 style={{color: "orange", fontSize: "50px"}}>Inactive Survey</h2>
            <img src={sleepingCat} alt={"sleeping cat"}/>
            <p>This survey is not active yet, you can therefore not see the survey or submit your answers.</p>
            <p>Come back at <span style={{fontWeight: "bolder"}}>{survey.start_date}!</span></p>
        </div>
    )
}

