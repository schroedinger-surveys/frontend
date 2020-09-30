import React from "react";
import boxLogo from "./menu/icons/open-box.png";

const Home_wrapper = () => {
    return (
        <div className={"survey_wrapper"}>
            <div className={"survey_wrapper_logo"}>
                <a href={"https://schroedinger-survey.de"}>
                    <img className={"box_logo survey_logo"} src={boxLogo} alt={"schroedingers survey cat box"}/>
                </a>
                Schrödinger Survey
            </div>
            <div id={"app_page_body"}>

            </div>
        </div>
    )
}

export default Home_wrapper;
