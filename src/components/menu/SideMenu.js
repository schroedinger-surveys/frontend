import React, {useEffect} from "react";
import Nav from "react-bootstrap/Nav";

import {useLocation} from "react-router-dom";

const SideMenu = () => {
    const location = useLocation(); // Current url path, e.g. "/login"

    /**
     * Used to change the styling of the nav-links
     * if nav-link belongs to currently active path it is styled different than the others
     * changes when page is changed - click on nav-link
     * @param path is url path name from this nav-link - href
     */
    const activePage = () => {
        const element = document.getElementById(location.pathname);
        if(element !== undefined && element !== null){
            element.classList.add("active_side_nav_link");
        }
    }

    useEffect(()=>{
        activePage();
    }, [location.pathname])



    return(
            <Nav id="side_nav" className="side_nav flex-column">
                <Nav.Link id={"/dashboard"} className={"side_nav_link"} href="/dashboard">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-clipboard" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path fillRule="evenodd"
                              d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                    <p>Dashboard</p>
                </Nav.Link>

                <Nav.Link id={"/survey/create"} className={"side_nav_link"} href="/survey/create">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus-circle" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path fillRule="evenodd"
                              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    <p>Add Survey</p>
                </Nav.Link>

                <Nav.Link id={"/survey/overview"} className={"side_nav_link"}  href="/survey/overview">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-folder2-open" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
                    </svg>
                    <p>Surveys</p>
                </Nav.Link>

                <Nav.Link id={"/survey/submissions"} className={"side_nav_link"}  href="/survey/submissions">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check-circle" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path fillRule="evenodd"
                              d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                    </svg>
                    <p>Submissions</p>
                </Nav.Link>

                <Nav.Link id={"/settings"} className={"side_nav_link"}  href="/settings">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sliders" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
                    </svg>
                    <p>Settings</p>
                </Nav.Link>
            </Nav>
    )
}

export default SideMenu;