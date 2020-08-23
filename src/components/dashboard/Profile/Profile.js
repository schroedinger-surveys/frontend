import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import storageManager from "../../../storage/LocalStorageManager";
import RandomIcon from "./RandomIcon";

const Profile = () => {
    const userData = storageManager.getUserData();
    const {username} = userData;

    return(
        <Container>
            <Row style={{border: "1px solid lightgrey", padding: "5px", borderRadius: "8px"}}>
                <Col xs={3}>
                    <RandomIcon/>
                </Col>
                <Col xs={9}>
                    <h2 style={{lineHeight: "70px"}}>Welcome back, {username}!</h2>
                </Col>
            </Row>

        </Container>
    )
}

export default Profile;