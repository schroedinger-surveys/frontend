import React from "react";
import Nav from "react-bootstrap/Nav";

import "./SideMenu.css";
import storageManager from "../../../storage/StorageManager";
import {useLocation} from "react-router-dom";
import UserAPIHandler from "../../../calls/user";

const SideMenu = () => {
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
            return {color: "white"};
        }
    }

    /**
     * Calls the storageManager method clearToken()
     * which removes the jwt token from session and local storage
     * triggered by click on nav-link Logout
     */
    const logoutUser = async () => {
        storageManager.clearToken();
        await UserAPIHandler.userLogout();
    }

    return(
        <div style={{borderRight: "1px solid lightgrey", height: "100vh", padding: "30px 5px", backgroundColor: "#065535", marginRight: "15px"}}>
            <Nav>
                <label style={{color: "lightgrey", fontWeight: "bolder"}}>General</label>
                <Nav.Link className={"side_nav_link"} href="/dashboard" style={activePage("/dashboard")}>Dashboard</Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/survey/search" style={activePage("/survey/search")}>Search</Nav.Link>
            </Nav>
            <br/>
            <Nav>
                <label style={{color: "lightgrey", fontWeight: "bolder"}}>Survey</label>
                <Nav.Link className={"side_nav_link"} href="/survey/create" style={activePage("/survey/create")}>New Survey</Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/survey/overview" style={activePage("/survey/overview")}>Survey Overview</Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/survey/submissions" style={activePage("/survey/submissions")}>Submissions</Nav.Link>
            </Nav>
            <br/>
            <Nav>
                <label style={{color: "lightgrey", fontWeight: "bolder"}}>Account</label>
                <Nav.Link className={"side_nav_link"}  href="/settings" style={activePage("/settings")}>Settings</Nav.Link>
                <Nav.Link className={"side_nav_logout_link"}  href="/" style={{color: "white"}} onClick={logoutUser}>Logout</Nav.Link> {/** If clicked, the logoutUser function is called and the nav-link redirects to home **/}
            </Nav>
        </div>
    )
}

export default SideMenu;