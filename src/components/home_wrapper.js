import React from "react";
import SideMenu from "./menu/side-menu/SideMenu";
import AppNavbar from "./menu/AppNavbar";

const Home_wrapper = () => {
    return (
        <div className={"app_wrapper"}>
            <AppNavbar/>
            <SideMenu/>
            <div id={"page_body"}>
                Page
            </div>
        </div>
    )
}

export default Home_wrapper;