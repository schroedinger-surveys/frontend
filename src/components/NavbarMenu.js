import React from "react";
import {Link, useLocation} from "react-router-dom";
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
        <Navbar expand="lg" style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.25)"}}>
            <Navbar.Brand href="/" style={{color: "#065535", fontWeight: "bolder"}}>Schrödinger-Survey</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link><Link to="/" style={activePage("/")}>Home</Link></Nav.Link>
                    <Nav.Link><Link to="/register" style={activePage("/register")}>Register</Link></Nav.Link>
                    <Nav.Link><Link to="/login" style={activePage("/login")}>Login</Link></Nav.Link>
                    <Nav.Link><Link to="/dashboard" style={activePage("/dashboard")}>Dashboard</Link></Nav.Link>
                    <Nav.Link><Link to="/survey/create" style={activePage("/survey/create")}>CreateSurvey</Link></Nav.Link>
                    <Nav.Link><Link to="/survey/submission" style={activePage("/survey/submission")}>SubmitSurvey</Link></Nav.Link>
                    <Nav.Link><Link to="/survey/search" style={activePage("/survey/search")}>Search</Link></Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
)
}

export default NavbarMenu;