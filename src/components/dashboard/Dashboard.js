import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {connect} from "react-redux";

import log from "../../log/Logger";
import Profile from "./Profile/Profile";
import SurveyList from "./SurveyList";
import SurveySpotlight from "./SurveySpotlight/SurveySpotlight";
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
import {setSurveySpotlight} from "../../redux/actions/SurveySpotlight";

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
const Dashboard = (props) => {
    const [loading, setLoading] = useState(true);

    const getSurveysAndCounts = async () => {

        try {
            setLoading(true);

            const listPrivateSurveys = await getPrivateSurveys();
            props.setPrivateSurveys(listPrivateSurveys);
            const listPublicSurveys = await getPublicSurveys();
            props.setPublicSurveys(listPublicSurveys);

            const allCounts = setAllSurveyCounts(listPrivateSurveys, listPublicSurveys);
            props.setActiveCount(allCounts[0]);
            props.setPendingCount(allCounts[1]);
            props.setClosedCount(allCounts[2]);

            const privateSurveys = await privateSurveyCount();
            props.setPrivateCount(privateSurveys);

            const publicSurveys = await publicSurveyCount();
            props.setPublicCount(publicSurveys);

            props.setOverallCount(privateSurveys + publicSurveys); // Sets the count of overall survey belonging to the user

            const allSurveys = [...listPrivateSurveys, ...listPublicSurveys];
            if (allSurveys.length > 1){
                props.setSurveySpotlight(allSurveys[0]);
            }

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
                            {props.counts.overallSurveys > 0 && (
                                <SurveyList/>
                            )}
                            {props.counts.overallSurveys === 0 && (
                                <UserPrompt size={"small"}/>
                            )}
                        </Row>
                        <Row>
                            <CreateSurveyButton/>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        {props.counts.overallSurveys > 0 && ( // Check submission count, NOT Survey Count
                            <SurveySpotlight/>
                        )}
                        {props.counts.overallSurveys === 0 && (
                            <UserPrompt size={"large"}/>
                        )}
                    </Col>
                </Row>
            )}
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        counts: state.surveyCounts,
        surveys: state.surveyLists
    }
}

export default connect(mapStateToProps, {
    setOverallCount,
    setPrivateCount,
    setPublicCount,
    setPrivateSurveys,
    setPublicSurveys,
    setActiveCount,
    setPendingCount,
    setClosedCount,
    setSurveySpotlight
})(Dashboard);