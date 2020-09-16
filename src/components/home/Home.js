import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Redirect} from "react-router-dom";

import storageManager from "../../storage/LocalStorageManager";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

/**
 * This Component either redirects to the users dashboard if the users jwt token was found in storage
 * or renders the components login/register and a welcome screen
 * @returns {JSX.Element} home Component
 * @constructor
 */
const Home = () => {
    const [loginVisibility, setLoginVisibility] = useState(true);
    const [registerVisibility, setRegisterVisibility] = useState(false);
    const [resetPasswordVisibility, setResetPasswordVisibility] = useState(false);

    /**
     * Redirects to Component dashboard
     * @returns {JSX.Element} Redirect Component
     */
    const redirectUser = () => {
        return (
            <Redirect to="/dashboard"/>
        )
    }

    const handleVisibility = (componentName) => {
        if(componentName === "Register"){
            setRegisterVisibility(true);
            setLoginVisibility(false);
            setResetPasswordVisibility(false);
        } else if (componentName === "Login"){
            setLoginVisibility(true);
            setRegisterVisibility(false);
            setResetPasswordVisibility(false);
        } else if (componentName === "Reset"){
            setResetPasswordVisibility(true);
            setLoginVisibility(false);
            setRegisterVisibility(false);
        }
    }

    return (
        <Container style={{height: "100vh", width: "100%"}}>
            {storageManager.searchForJWTToken() && (
                redirectUser()
            )}
            <Row>
                <Col style={{marginTop: "30px"}}>Welcome to Schroedinger <br/>
                    <a href="/survey/search">Find public surveys and submit your answer</a>
                </Col>
                <Col style={{marginTop: "30px"}}>
                    {loginVisibility && (
                        <Login single={false}/>
                    )}
                    {registerVisibility && (
                        <Register single={false}/>
                    )}
                    {resetPasswordVisibility && (
                        <ForgotPassword single={false}/>
                    )}

                    {!loginVisibility && (
                        <button style={{cursor: "pointer"}} onClick={() => handleVisibility("Login")}>Login</button>
                    )}
                    {!registerVisibility && (
                        <button style={{cursor: "pointer"}} onClick={() => handleVisibility("Register")}>Register</button>
                    )}
                    {!resetPasswordVisibility && (
                        <button style={{border: "none", backgroundColor: "transparent", color:"darkred"}} onClick={() => handleVisibility("Reset")}>Forgot Password or Username?</button>
                    )}
                    </Col>
            </Row>
        </Container>
    )
}

export default Home;