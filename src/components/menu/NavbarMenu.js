import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import storageManager from "../../storage/StorageManager";
import NavDropdown from "react-bootstrap/NavDropdown";

import catIcon from "./icons/cat.png";
import boxLogo from "./icons/open-box.png";
import searchIcon from "./icons/search.png";
import UserAPIHandler from "../../calls/user";

/**
 * The Navbar that will be displayed at every page
 * offers different navigational menu depending on state of user - logged in - logged out
 * @returns {JSX.Element} Navbar
 * @constructor
 */
const NavbarMenu = () => {
    const location = useLocation(); // Current url path, e.g. "/login"

    /**
     * Calls the storageManager method clearToken()
     * which removes the jwt token from session and local storage
     * triggered by click on nav-link Logout
     */
    const logoutUser = async () => {
        storageManager.clearToken();
        await UserAPIHandler.userLogout();
    }

    /**
     * Returns the version of the Nav meant for logged OUT users
     * @returns {JSX.Element} Nav with Nav.Links to home, Register, Login and search Component
     */
    const loggedOut = () => {
        return (
            <div className="ml-auto">
                <a className={"home_login-button"} href="/login">Login</a>
                <a className={"home_register_button"} href="/register">Register</a>
            </div>
        )
    }

    return (
        <Navbar id={"top_nav"}>
            <Navbar.Brand href="/"><img className={"box_logo"} src={boxLogo}
                                        alt={"schroedingers survey cat box"}/></Navbar.Brand>
            <input className={"search_input"} type="text" placeholder={"Search public survey..."} disabled/>
            <button className={"search_btn"} disabled><img className={"search_icon"} src={searchIcon}
                                                  alt={"search public survey"}/></button>
            {(location.pathname.split("/")[1] !== "s" && location.pathname.split("/")[1] !== "pub") && (
                loggedOut()
            )}
        </Navbar>
    )
}

export default NavbarMenu;