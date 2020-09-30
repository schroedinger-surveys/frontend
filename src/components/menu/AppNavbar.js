import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import storageManager from "../../storage/StorageManager";
import NavDropdown from "react-bootstrap/NavDropdown";

import searchIcon from "./icons/search.png";
import UserAPIHandler from "../../calls/user";

/**
 * The Navbar that will be displayed at every page
 * offers different navigational menu depending on state of user - logged in - logged out
 * @returns {JSX.Element} Navbar
 * @constructor
 */
const AppNavbar = () => {
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
     * Returns the version of the Nav meant for logged IN users
     * @returns {JSX.Element} Nav with Nav.Links to dashboard, CreateSurvey, SubmitSurvey, search and home Component
     */
    const loggedIn = () => {
        return (
            <Nav className="ml-auto app_nav">
                <Nav.Link className={"app_nav-menu"} href="/">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-moon" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M14.53 10.53a7 7 0 0 1-9.058-9.058A7.003 7.003 0 0 0 8 15a7.002 7.002 0 0 0 6.53-4.47z"/>
                    </svg>
                </Nav.Link>
                <Nav.Link className={"app_nav-menu"} href="/">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bell" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
                        <path fillRule="evenodd"
                              d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                    </svg>
                </Nav.Link>
                <NavDropdown title="Menu" id="nav-dropdown" alignRight>
                    <Nav.Link className={"app_nav-link"} href="/settings">Account
                        Settings</Nav.Link>
                    <Nav.Link className={"app_nav-link"} href="/dashboard" disabled>Terms of
                        Service</Nav.Link>
                    <Nav.Link className={"app_nav-link"} href="/dashboard" disabled>Info</Nav.Link>
                    <NavDropdown.Divider/>
                    <Nav.Link className={"app_nav-link"} href="/" onClick={logoutUser}>Logout</Nav.Link>
                </NavDropdown>
            </Nav>
        )
    }

    return (
        <Navbar id={"app_nav"}>
            <input className={"search_input"} type="text" placeholder={"Search public survey..."} disabled/>
            <button className={"search_btn"} disabled><img className={"search_icon"} src={searchIcon}
                                                  alt={"search public survey"}/>
            </button>
            {loggedIn()}
        </Navbar>
    )
}

export default AppNavbar;