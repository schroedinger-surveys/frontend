import React, {useEffect, useState} from "react";
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
import {privateSurveyCount, publicSurveyCount, setAllSurveyCounts} from "../utils/CountFunctions";
import {
    setActiveCount, setClosedCount,
    setOverallCount,
    setPendingCount,
    setPrivateCount,
    setPublicCount
} from "../../redux/actions/SurveyCount";
import LoadingScreen from "../utils/LoadingScreen";
import {setPrivateSurveys, setPublicSurveys} from "../../redux/actions/SurveyList";
import {getPrivateSurveys, getPublicSurveys} from "../utils/GetSurveys";

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

    const [loading, setLoading] = useState(true);

    const getSurveysAndCounts = async () => {
        try {
            setLoading(true);

            const listPrivateSurveys = await getPrivateSurveys();
            log.debug("Dashboard",listPrivateSurveys);
            dispatch(setPrivateSurveys(listPrivateSurveys));
            const listPublicSurveys = await getPublicSurveys();
            dispatch(setPublicSurveys(listPublicSurveys));

            const allCounts = setAllSurveyCounts(listPrivateSurveys, listPublicSurveys);
            dispatch(setActiveCount(allCounts[0]));
            dispatch(setPendingCount(allCounts[1]));
            dispatch(setClosedCount(allCounts[2]));

            const privateSurveys = await privateSurveyCount();
            dispatch(setPrivateCount(privateSurveys));

            const publicSurveys = await publicSurveyCount();
            dispatch(setPublicCount(publicSurveys));

            dispatch(setOverallCount(privateSurveys + publicSurveys)); // Sets the count of overall survey belonging to the user

            setLoading(false);
        } catch (e) {
            log.error(e);
        }
    }

    useEffect(() => {
        getSurveysAndCounts();
    }, []);

    return (
        <Container fluid>
            {loading && (
                <LoadingScreen/>
            )}
            {!loading && (
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
            )}
        </Container>
    )
}

export default Dashboard;