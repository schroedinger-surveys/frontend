import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import storageManager from "../../storage/LocalStorageManager";
import RandomIcon from "../utils/IconRotator";

const Profile = () => {
    const userData = storageManager.getUserData();
    const {username} = userData;

    return(
        <Container>
            <Row>
                <Col>
                    <RandomIcon/>
                </Col>
                <Col>
                    Greeting, {username}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Row>surveys overall:</Row>
                    <Row>12</Row>
                </Col>
                <Col>
                    <Row>active surveys:</Row>
                    <Row>8</Row>
                </Col>
                <Col>
                    <Row>pending surveys:</Row>
                    <Row>3</Row>
                </Col>
                <Col>
                    <Row>closed surveys:</Row>
                    <Row>1</Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Profile;