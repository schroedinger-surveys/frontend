import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Home = () => {
    return (
        <Container>
            <Row>
                <Col lg={8}>Welcome to Schroedinger</Col>
                <Col lg={4}>Register or Login</Col>
            </Row>
        </Container>
    )
}

export default Home;