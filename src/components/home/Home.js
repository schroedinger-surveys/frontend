import React from "react";
import {Redirect} from "react-router-dom";

import imageWebsite from "./images/website.png";
import twitter from "./images/twitter.png";
import instagram from "./images/instagram.png";
import github from "./images/github.png";
import storageManager from "../../storage/StorageManager";
import NavbarMenu from "../menu/NavbarMenu";

/**
 * This Component either redirects to the users dashboard if the users jwt token was found in storage
 * or renders the components login/register and a welcome screen
 * @returns {JSX.Element} home Component
 * @constructor
 */
const Home = () => {
    /**
     * Redirects to Component dashboard
     * @returns {JSX.Element} Redirect Component
     */
    const redirectUser = () => {
        return (
            <Redirect to="/dashboard"/>
        )
    }

    return (
        <div className={"comp_wrapper"}>
            <NavbarMenu/>
            <div className={"home_page-body"}>
                {storageManager.searchForJWTToken() && (
                    redirectUser()
                )}
                <div className={"home_page-left"}>
                    <h1>Schrödinger Survey</h1>
                    <p className={"home_page-text"}>Create unlimited amounts of private and public surveys. <br/>
                        Share invite only link or open links with the whole world.<br/>
                        Analyze your results and take away important new insights.</p>
                    <button className={"home_page-btn"}>SIGN UP</button>
                </div>
                <div className={"home_page-right"}>
                    <div className={"image_dot_cont"}>
                        <span className="dot"/>
                        <img className={"home_page-image"} src={imageWebsite} alt={"Schroedinger Survey dashboard view"}/>
                    </div>
                </div>
            </div>
            <div id={"footer"}>
                <div className={"footer_socials"}>
                    <a href="/"><img className={"social_media-icon"} src={twitter} alt="Link to Schroedinger Surveys Twitter page"/></a>
                    <a href="/"><img className={"social_media-icon"} src={instagram} alt="Link to Schroedinger Surveys Instagram page"/></a>
                    <a  href="/"><img className={"social_media-icon"} src={github} alt="Link to Schroedinger Surveys GitHub page"/></a>
                </div>
                <div className={"footer_links"}>
                    <a className={"info_links"} href={"/"}>Learn More</a>
                    <a className={"info_links"} href={"/"}>Contact Us</a>
                    <a className={"info_links"} href={"/"}>Terms of Use</a>
                </div>
            </div>
        </div>
    )
}

export default Home;