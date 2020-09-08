import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import storageManager from "../../storage/LocalStorageManager";

/**
 * The Navbar that will be displayed at every page
 * offers different navigational menu depending on state of user - logged in - logged out
 * @returns {JSX.Element} Navbar
 * @constructor
 */
const NavbarMenu = () => {
    const location = useLocation(); // Current url path, e.g. "/login"

    /**
     * Used to change the styling of the nav-links
     * if nav-link belongs to currently active path it is styled different than the others
     * changes when page is changed - click on nav-link
     * @param path is url path name from this nav-link - href
     * @returns {{color: string}|{color: string, fontWeight: string}}
     */
    const activePage = (path) => {
        if (location.pathname === path) { //Active Page
            return {color: "#f5c050", fontWeight: "bolder"};
        } else { // Inactive Page
            return {color: "grey"};
        }
    }

    /**
     * Calls the storageManager method clearToken()
     * which removes the jwt token from session and local storage
     * triggered by click on nav-link Logout
     */
    const logoutUser = () => {
        storageManager.clearToken();
    }

    /**
     * Returns the version of the Nav meant for logged OUT users
     * @returns {JSX.Element} Nav with Nav.Links to home, Register, Login and search Component
     */
    const loggedOut = () => {
        return (
            <Nav className="mr-auto">
                <Nav.Link href="/" style={activePage("/")}>Home</Nav.Link>
                <Nav.Link href="/register" style={activePage("/register")}>Register</Nav.Link>
                <Nav.Link href="/login" style={activePage("/login")}>Login</Nav.Link>
                <Nav.Link href="/survey/search" style={activePage("/survey/search")}>Search</Nav.Link>
            </Nav>
        )
    }

    /**
     * Returns the version of the Nav meant for logged IN users
     * @returns {JSX.Element} Nav with Nav.Links to dashboard, CreateSurvey, SubmitSurvey, search and home Component
     */
    const loggedIn = () => {
        return (
            <Nav className="mr-auto">
                <Nav.Link href="/dashboard" style={activePage("/dashboard")}>Dashboard</Nav.Link>
                <Nav.Link href="/survey/create" style={activePage("/survey/create")}>CreateSurvey</Nav.Link>
                <Nav.Link href="/survey/search" style={activePage("/survey/search")}>Search</Nav.Link>
                <Nav.Link href="/" style={activePage("/")} onClick={logoutUser}>Logout</Nav.Link> {/** If clicked, the logoutUser function is called and the nav-link redirects to home **/}
            </Nav>
        )
    }

    return (
        <Navbar  style={{boxShadow: "0 2px 4px -1px rgba(0,0,0,0.25)"}}>
            <Navbar.Brand href="/" style={{color: "#065535", fontWeight: "bolder"}}>Schrödinger-Survey</Navbar.Brand>
            {(location.pathname.split("/")[1] !== "s" && location.pathname.split("/")[1] !== "pub") && (
                <div>
                        {/** Check if a jwt token is in local or session storage
                         * call functions that render different versions based on answer
                         */}
                        {storageManager.searchForJWTToken() && (
                            loggedIn()
                        )}
                        {!storageManager.searchForJWTToken() && (
                            loggedOut()
                        )}
                </div>
            )}
        </Navbar>
    )
}

export default NavbarMenu;