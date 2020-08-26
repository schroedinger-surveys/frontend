import React, {useEffect} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch, useSelector} from "react-redux";

import log from "../../log/Logger";
import Profile from "./Profile/Profile";
import SurveyList from "./SurveyList";
import SurveySpotlight from "./SurveySpotlight";
import UserPrompt from "./UserPrompt";
import SideMenu from "../menu/SideMenu";
import CreateSurveyButton from "./CreateSurveyButton";
import {privateSurveyCount, publicSurveyCount} from "../utils/CountFunctions";
import {setOverallCount} from "../../redux/actions/SurveyCount";

const Dashboard = () => {
    const counts = useSelector(state => state.SurveyCountReducer)
    const dispatch = useDispatch();

    const getSurveyCounts = async () => {
        try {
            const privateSurveys = await privateSurveyCount();
            const publicSurveys = await publicSurveyCount();
            dispatch(setOverallCount(privateSurveys + publicSurveys));
        } catch (e) {
            log.error(e);
        }
    }

    useEffect(() => {
        getSurveyCounts();
    })

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
                        {counts.overallSurveys > 0 && (
                            <SurveyList/>
                        )}
                        {counts.overallSurveys === 0 && (
                            <UserPrompt size={"small"}/>
                        )}
                    </Row>
                    <Row>
                        <CreateSurveyButton/>
                    </Row>
                </Col>
                <Col xs={6}>
                    {counts.overallSurveys > 0 && (
                        <SurveySpotlight/>
                    )}
                    {counts.overallSurveys === 0 && (
                        <UserPrompt size={"large"}/>
                    )}
                </Col>
            </Row>
        </Container>
    )
}



export default Dashboard;