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

    const [username, setUsername] = useState("");

    const getUserName = async () => {
        if(storageManager.getJWTToken() !== ""){
            const apiResponse = await UserAPIHandler.cacheMiddleware(UserAPIHandler.getUserInfo, "userData");
            setUsername(apiResponse.username);
        }
    }

    useEffect(() => {
        getUserName()
    }, [location.pathname])

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

    /**
     * Returns the version of the Nav meant for logged IN users
     * @returns {JSX.Element} Nav with Nav.Links to dashboard, CreateSurvey, SubmitSurvey, search and home Component
     */
    const loggedIn = () => {
        return (
            <Nav className="ml-auto">
                <Navbar.Brand href="/" style={{marginRight: "0"}}><img src={catIcon}
                                                                       style={{height: "40px"}} alt={"curious cat creates, edits and shares surveys"}/></Navbar.Brand>
                <NavDropdown title="Menu" id="nav-dropdown" alignRight style={{lineHeight: "40px"}}>
                    <NavDropdown.Item id={1} title={username}
                                      style={{fontWeight: "Bolder", lineHeight: "25px"}}>{username}</NavDropdown.Item>
                    <NavDropdown.Divider/>
                    <Nav.Link href="/settings" style={{paddingLeft: "25px", lineHeight: "25px"}}>Account
                        Settings</Nav.Link>
                    <Nav.Link href="/dashboard" style={{paddingLeft: "25px", lineHeight: "25px"}} disabled>Terms of
                        Service</Nav.Link>
                    <Nav.Link href="/dashboard" style={{paddingLeft: "25px", lineHeight: "25px"}} disabled>Info</Nav.Link>
                    <NavDropdown.Divider/>
                    <Nav.Link href="/" onClick={logoutUser}
                              style={{paddingLeft: "25px", lineHeight: "25px", color: "darkred"}}>Logout</Nav.Link>
                </NavDropdown>
            </Nav>
        )
    }

    return (
        <Navbar id={"top_nav"}>
            <Navbar.Brand href="/"><img className={"box_logo"} src={boxLogo} alt={"schroedingers survey cat box"}/></Navbar.Brand>
            <input className={"search_input"} type="text" placeholder={"Search public survey..."}/><button className={"search_btn"}><img className={"search_icon"} src={searchIcon} alt={"search public survey"}/></button>
            {(location.pathname.split("/")[1] !== "s" && location.pathname.split("/")[1] !== "pub") && (
                storageManager.searchForJWTToken() && (
                    loggedIn()
                )
            )}
            {(location.pathname.split("/")[1] !== "s" && location.pathname.split("/")[1] !== "pub") && (
                !storageManager.searchForJWTToken() && (
                    loggedOut()
                )
            )}
        </Navbar>
    )
}

export default NavbarMenu;