import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavbarMenu from "./menu/NavbarMenu";

const Home_wrapper = () => {
    return (
        <div className={"comp_wrapper"}>
            <NavbarMenu/>
            <div id={"page_body"}>
                page
            </div>
            <div id={"footer"}>
                Footer
            </div>
        </div>
    )
}

export default Home_wrapper;