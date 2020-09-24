import React from "react";
import github from "./images/github.png";

const Footer = () => {
    return(
        <div id={"footer"}>
            <div className={"footer_socials"}>
                <a  href="/"><img className={"social_media-icon"} src={github} alt="Link to Schroedinger Surveys GitHub page"/></a>
            </div>
            <div className={"footer_links"}>
                <a className={"info_links"} href={"/"}>Learn More</a>
                <a className={"info_links"} href={"/"}>Contact Us</a>
                <a className={"info_links"} href={"/"}>Terms of Use</a>
            </div>
        </div>
    )
}

export default Footer;