import React from "react";
import Nav from "react-bootstrap/Nav";

import "./sideMenu.css";
import storageManager from "../../../storage/LocalStorageManager";

const SideMenu = () => {
    return(
        <div style={{borderRight: "1px solid lightgrey", height: "100vh", padding: "30px 5px", backgroundColor: "#065535", marginRight: "15px"}}>
            <Nav className="mr-auto">
                <label style={{color: "lightgrey", fontWeight: "bolder"}}>Survey</label>
                <Nav.Link className={"side_nav_link"} href="/survey/create" style={{color: "white"}}>New Survey</Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/survey/overview" style={{color: "white"}}>Overview</Nav.Link>
                <Nav.Link className={"side_nav_link"}  href="/survey/submissions" style={{color: "white"}}>Submissions</Nav.Link>
            </Nav>
            <br/>
            <Nav>
                <label style={{color: "lightgrey", fontWeight: "bolder"}}>Account</label>
                <Nav.Link className={"side_nav_link"}  href="/dashboard" style={{color: "white"}}>Settings</Nav.Link>
                <Nav.Link className={"side_nav_logout_link"}  href="/" style={{color: "white"}} onClick={() => storageManager.clearToken()}>Logout</Nav.Link> {/** If clicked, the logoutUser function is called and the nav-link redirects to home **/}
            </Nav>
        </div>
    )
}

export default SideMenu;