import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavbarMenu from "./menu/NavbarMenu";

const Wrapper = () => {
    return (
        <div className={"comp_wrapper"}>
            <NavbarMenu/>
            <div id={"side_nav"}>
                Side Nav
            </div>
            <div id={"page_body"}>
                page
            </div>
        </div>
    )
}

export default Wrapper;