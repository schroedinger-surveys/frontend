import React from "react";
import {Link, useLocation} from "react-router-dom";


const Navbar = () => {
    const location = useLocation();

    const activePage = (path) => {
        if (location.pathname === path){
            return {color: "red"};
        } else {
            return {color: "green"};
        }
    }

    return(
        <div>
            <ul>
                <li><Link to="/" style={activePage("/")}>Home</Link></li>
                <li><Link to="/register" style={activePage("/register")}>Register</Link></li>
                <li><Link to="/login" style={activePage("/login")}>Login</Link></li>
                <li><Link to="/dashboard" style={activePage("/dashboard")}>Dashboard</Link></li>
                <li><Link to="/survey/create" style={activePage("/survey/create")}>CreateSurvey</Link></li>
                <li><Link to="/survey/submission" style={activePage("/survey/submission")}>SubmitSurvey</Link></li>
                <li><Link to="/survey/search" style={activePage("/survey/search")}>Search</Link></li>
            </ul>
        </div>
    )
}

export default Navbar;