import React, {useEffect, useState} from "react";
import {connect} from "react-redux";

import log from "../../log/Logger";
import SurveyList from "./SurveyList";
import SurveySpotlight from "./survey-spotlight/SurveySpotlight";
import UserPrompt from "./UserPrompt";
import SideMenu from "../menu/SideMenu";
import {setAllSurveyCounts} from "../utils/CountFunctions";
import SurveyAPIHandler from "../../calls/survey";
import {
    setActiveCount, setClosedCount,
    setOverallCount,
    setPendingCount,
    setPrivateCount,
    setPublicCount
} from "../../redux/actions/SurveyCount";
import LoadingScreen from "../utils/LoadingScreen";
import {setPrivateSurveys, setPublicSurveys} from "../../redux/actions/SurveyList";
import {setSurveySpotlight} from "../../redux/actions/SurveySpotlight";
import AppNavbar from "../menu/AppNavbar";

/**
 * User Dashboard containing multiple elements to give user an overview of his acocunt
 * Child Components:
 * SideMenu - Shows Page to navigate to
 * profile - greets the user, shows cute icon and displays the survey counts
 * SurveyList - a list of the users surveys, click opens them in survey-spotlight
 * survey-spotlight - Shows one Survey, its questions and all submitted answers
 * CreateSurveyButton - Redirects to the CreateSurvey Component
 * UserPrompt - in case user has no surveys yet it prompts him to create some
 * @returns {JSX.Element}
 */
const Dashboard = (props) => {
    const [loading, setLoading] = useState(true);

    const getSurveysAndCounts = async () => {
        try {
            setLoading(true);

            const listPrivateSurveys = await SurveyAPIHandler.cacheMiddleware(SurveyAPIHandler.surveyPrivateGet, "privateSurveys");
            props.setPrivateSurveys(listPrivateSurveys);
            const listPublicSurveys = await SurveyAPIHandler.cacheMiddleware(SurveyAPIHandler.surveyPublicGet, "publicSurveys");
            props.setPublicSurveys(listPublicSurveys);

            const allCounts = setAllSurveyCounts(listPrivateSurveys, listPublicSurveys);
            props.setActiveCount(allCounts[0]);
            props.setPendingCount(allCounts[1]);
            props.setClosedCount(allCounts[2]);

            const privateSurveys = await SurveyAPIHandler.cacheMiddleware(SurveyAPIHandler.privateSurveyCount, "privateSurveyCount");
            props.setPrivateCount(privateSurveys);

            const publicSurveys = await SurveyAPIHandler.cacheMiddleware(SurveyAPIHandler.publicSurveyCount, "publicSurveyCount");
            props.setPublicCount(publicSurveys);

            props.setOverallCount(privateSurveys + publicSurveys); // Sets the count of overall surveys belonging to the user

            const allSurveys = [...listPrivateSurveys, ...listPublicSurveys];
            if (allSurveys.length >= 1){
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
        <div>
            {loading && (
                <LoadingScreen/>
            )}
            {!loading && (
                <div className={"app_wrapper"}>
                    <AppNavbar/>
                    <SideMenu/>
                    <div id={"dashboard_page_body"} >
                            <div id={"survey_overview-dashboard"}>
                                <div>
                                    {props.counts.overallSurveys > 0 && (
                                        <SurveyList/>
                                    )}
                                    {props.counts.overallSurveys === 0 && (
                                        <UserPrompt size={"small"}/>
                                    )}
                                </div>
                            </div>

                            <div id={"survey_spotlight-dashboard"}>
                                {props.counts.overallSurveys > 0 && ( // Check submission count, NOT Survey Count
                                    <SurveySpotlight/>
                                )}
                                {props.counts.overallSurveys === 0 && (
                                    <UserPrompt size={"large"}/>
                                )}
                            </div>
                    </div>
                </div>
            )}
        </div>
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