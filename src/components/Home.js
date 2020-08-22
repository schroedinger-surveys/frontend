import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Login from "./Login";
import Register from "./Register";
import storageManager from "../storage/LocalStorageManager";
import {Redirect} from "react-router-dom";


const Home = () => {
    const [loginVisibility, setLoginVisibility] = useState(true);

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
                <Col md={8}>Welcome to Schroedinger</Col>
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