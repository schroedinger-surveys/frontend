import React from "react";
import {useLocation} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";


const NavbarMenu = () => {
    const location = useLocation();

    const activePage = (path) => {
        if (location.pathname === path) {
            return {color: "#f5c050", fontWeight: "bolder"};
        } else {
            return {color: "grey"};
        }
    }

    return (
        <Navbar expand="lg" style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.25)", marginBottom: "100px"}}>
            <Navbar.Brand href="/" style={{color: "#065535", fontWeight: "bolder"}}>Schrödinger-Survey</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/" style={activePage("/")}>Home</Nav.Link>
                    <Nav.Link href="/register" style={activePage("/register")}>Register</Nav.Link>
                    <Nav.Link href="/login" style={activePage("/login")}>Login</Nav.Link>
                    <Nav.Link href="/dashboard" style={activePage("/dashboard")}>Dashboard</Nav.Link>
                    <Nav.Link href="/survey/create" style={activePage("/survey/create")}>CreateSurvey</Nav.Link>
                    <Nav.Link href="/survey/submission" style={activePage("/survey/submission")}>SubmitSurvey</Nav.Link>
                    <Nav.Link href="/survey/search" style={activePage("/survey/search")}>Search</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
)
}

export default NavbarMenu;