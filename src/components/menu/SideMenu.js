import React from "react";
import Nav from "react-bootstrap/Nav";

import storageManager from "../../storage/StorageManager";
import {useLocation} from "react-router-dom";
import UserAPIHandler from "../../calls/user";
import {Navbar} from "react-bootstrap";

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
            <Nav id="side_nav" className="side_nav flex-column">
                <Nav.Link className={"side_nav_link"} href="/dashboard" style={activePage("/dashboard")}>
                    <p>Dashboard</p>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bell" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
                        <path fillRule="evenodd"
                              d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                    </svg>
                </Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/survey/search" style={activePage("/survey/search")}>Search</Nav.Link>
                <Nav.Link className={"side_nav_link"} href="/survey/create" style={activePage("/survey/create")}>New Survey</Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/survey/overview" style={activePage("/survey/overview")}>Overview</Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/survey/submissions" style={activePage("/survey/submissions")}>Submissions</Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/settings" style={activePage("/settings")}>Settings</Nav.Link>
            </Nav>
    )
}

export default SideMenu;