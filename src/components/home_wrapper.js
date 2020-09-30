import React from "react";
import SideMenu from "./menu/SideMenu";
import AppNavbar from "./menu/AppNavbar";
import boxLogo from "./menu/icons/open-box.png";
import Navbar from "react-bootstrap/Navbar";

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
