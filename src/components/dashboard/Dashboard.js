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

/**
 * User Dashboard containing multiple elements to give user an overview of his acocunt
 * Child Components:
 * SideMenu - Shows Page to navigate to
 * Profile - greets the user, shows cute icon and displays the survey counts
 * SurveyList - a list of the users surveys, click opens them in SurveySpotlight
 * SurveySpotlight - Shows one Survey, its questions and all submitted answers
 * CreateSurveyButton - Redirects to the CreateSurvey Component
 * UserPrompt - in case user has no surveys yet it prompts him to create some
 * @returns {JSX.Element}
 */
const Dashboard = () => {
    const counts = useSelector(state => state.SurveyCountReducer) // Gets the count of the surveys from the redux store
    const dispatch = useDispatch();

    const getSurveyCounts = async () => {
        try {
            const privateSurveys = await privateSurveyCount();
            const publicSurveys = await publicSurveyCount();
            dispatch(setOverallCount(privateSurveys + publicSurveys)); // Sets the count of overall survey belonging to the user
        } catch (e) {
            log.error(e);
        }
    }

    useEffect(() => {
        getSurveyCounts();
    }, []);

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