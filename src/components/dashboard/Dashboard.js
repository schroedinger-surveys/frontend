import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Profile from "./Profile";
import SurveyList from "./SurveyList";
import SurveySpotlight from "./SurveySpotlight";
import UserPrompt from "./UserPrompt";
import SideMenu from "../menu/SideMenu";
import CreateSurveyButton from "./CreateSurveyButton";

const Dashboard = () => {
    // TODO: Get jwt token and give relevant infos to child components
    return(
        <Container fluid>
            <Row>
                <Col xs={2}>
                    <SideMenu/>
                </Col>
                <Col xs={4}>
                    <Row>
                        <Profile/>
                    </Row>
                    <Row>
                        <SurveyList/>
                    </Row>
                    <Row>
                        <CreateSurveyButton/>
                    </Row>
                </Col>
                <Col xs={6}>
                    <SurveySpotlight/>
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard;