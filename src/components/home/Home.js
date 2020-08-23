import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Redirect} from "react-router-dom";

import storageManager from "../../storage/LocalStorageManager";
import Login from "./Login";
import Register from "./Register";

/**
 * This Component either redirects to the users dashboard if the users jwt token was found in storage
 * or renders the components login/register and a welcome screen
 * @returns {JSX.Element} home Component
 * @constructor
 */
const Home = () => {
    const [loginVisibility, setLoginVisibility] = useState(true);

    /**
     * Redirects to Component dashboard
     * @returns {JSX.Element} Redirect Component
     */
    const redirectUser = () => {
        return (
            <Redirect to="/dashboard"/>
        )
    }

    return (
        <Container style={{height: "100vh", width: "100%"}}>
            {storageManager.searchForJWTToken() && (
                redirectUser()
            )}
            <Row>
                <Col md={8}>Welcome to Schroedinger <br/>
                    <a href="/survey/search">Find public surveys and submit your answer</a>
                </Col>
                <Col md={4}>
                    {loginVisibility && (
                        <Login single={false}/>
                    )}
                    {!loginVisibility && (
                        <Register single={false}/>
                    )}
                    <button style={{cursor: "pointer"}} onClick={() => setLoginVisibility(!loginVisibility)}>{loginVisibility ? "Register" : "Login"}</button>
                </Col>
            </Row>
        </Container>
    )
}

export default Home;