import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import storageManager from "../../../storage/LocalStorageManager";
import RandomIcon from "./RandomIcon";
import SurveyCounts from "./SurveyCounts";

const Profile = () => {
    const userData = storageManager.getUserData();
    const {username} = userData;

    return(
        <Container>
            <Row style={{border: "1px solid lightgrey", padding: "5px", borderRadius: "8px 8px 0 0"}}>
                <Col xs={3}>
                    <RandomIcon/>
                </Col>
                <Col xs={9}>
                    <h2 style={{lineHeight: "70px"}}>Welcome back, {username}!</h2>
                </Col>
            </Row>
            <SurveyCounts/>
        </Container>
    )
}

export default Profile;