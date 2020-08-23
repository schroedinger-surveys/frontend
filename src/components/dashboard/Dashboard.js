import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import log from "../../log/Logger";
import Profile from "./Profile";
import SurveyList from "./SurveyList";
import SurveySpotlight from "./SurveySpotlight";
import UserPrompt from "./UserPrompt";
import SideMenu from "../menu/SideMenu";
import CreateSurveyButton from "./CreateSurveyButton";
import {privateSurveyCount, publicSurveyCount} from "../utils/CountFunctions";

const Dashboard = () => {
    const [overallSurveyCount, setOverallSurveyCount] = useState(0);

    const getSurveyCounts = async () => {
        try {
            const privateSurveys = await privateSurveyCount();
            const publicSurveys = await publicSurveyCount();
            setOverallSurveyCount(privateSurveys + publicSurveys);
        } catch (e) {
            log.error(e);
        }
    }

    useEffect(() => {
        getSurveyCounts();
    }, [])

    return (
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
                        {overallSurveyCount > 0 && (
                            <SurveyList/>
                        )}
                        {overallSurveyCount === 0 && (
                            <UserPrompt size={"small"}/>
                        )}
                    </Row>
                    <Row>
                        <CreateSurveyButton/>
                    </Row>
                </Col>
                <Col xs={6}>
                    {overallSurveyCount > 0 && (
                        <SurveySpotlight/>
                    )}
                    {overallSurveyCount === 0 && (
                        <UserPrompt size={"large"}/>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard;