import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Login from "./Login";
import Register from "./Register";

const Home = () => {
    const [loginVisibility, setLoginVisibility] = useState(true);

    return (
        <Container style={{height: "100vh", width: "100%"}}>
            <Row>
                <Col md={6}>Welcome to Schroedinger</Col>
                <Col md={6}>
                    {loginVisibility && (
                        <Login/>
                    )}
                    {!loginVisibility && (
                        <Register/>
                    )}
                    <button onClick={() => setLoginVisibility(!loginVisibility)}>{loginVisibility ? "Register" : "Login"}</button>
                </Col>

            </Row>
        </Container>
    )
}

export default Home;