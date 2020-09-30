import React from "react";

import sleepingCat from "../icons/kitty.png"
import boxLogo from "../../menu/icons/open-box.png";

export const PendingSurvey = (survey) => {
    return(
        <div className={"survey_wrapper"}>
            <div className={"survey_wrapper_logo"}>
                <a href={"https://schroedinger-survey.de"}>
                    <img className={"box_logo survey_logo"} src={boxLogo} alt={"schroedingers survey cat box"}/>
                </a>
                Schrödinger Survey
            </div>
            <div id={"app_page_body"}>
                <div style={{textAlign: "center"}}>
                    <h2 style={{color: "orange", fontSize: "50px"}}>Inactive Survey</h2>
                    <img src={sleepingCat} alt={"sleeping cat"}/>
                    <p>This survey is not active yet, you can therefore not see the survey or submit your answers.</p>
                    <p>Come back at <span style={{fontWeight: "bolder"}}>{survey.start_date}!</span></p>
                </div>
            </div>
        </div>
    )
}

