import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideMenu from "../menu/side-menu/SideMenu";
import Row from "react-bootstrap/Row";
import {Redirect} from "react-router-dom";
import LoadingScreen from "../utils/LoadingScreen";
import SurveyAPIHandler from "../../calls/survey";
import SubmissionAPIHandler from "../../calls/submission";

/**
 * User can choose a Survey he wants to look at the individual submissions
 * first pick type - (private|public)
 * choose survey out of list (only surveys with more than zero submissions can be opened)
 * @returns {JSX.Element}
 * @constructor
 */
const Submissions = () => {
    const itemsPerPage = 10;

    // Used to change between the View of the public and private Surveys
    const [displayPrivate, setDisplayPrivate] = useState(false);
    const [displayPublic, setDisplayPublic] = useState(false);

    const [publicSurveys, setPublicSurveys] = useState([]);
    const [privateSurveys, setPrivateSurveys] = useState([]);
    const [privateSurveysCount, setPrivateSurveysCount] = useState(0);
    const [publicSurveysCount, setPublicSurveyCount] = useState(0);

    const [choseSurvey, setChoseSurvey] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState({});
    const [selectedSurveySubmissionCount, setSelectedSurveySubmissionCount] = useState(0);

    // Loading while surveys are fetched and matched with their specific submissionCount - manages visibility of LoadingScreen
    const [loading, setLoading] = useState(false);

    /**
     * Gets all private surveys and matched the submissionCount to it
     * @param page_number
     * @param pagination - function is used for setup after mounting and for fetching new submissions in pagination
     * default is false (setup), in Pagination it is called with true
     * @returns {Promise<void>}
     */
    const setupPrivateSurveys = async (page_number = 0, pagination = false) => {
        if (privateSurveys.length === 0 || pagination) {
            setLoading(true);

            const privateSurveyList = await SurveyAPIHandler.cacheMiddleware(() => SurveyAPIHandler.surveyPrivateGet(page_number, itemsPerPage), "privateSurveys");
            console.log(privateSurveyList);
            if (!pagination) {
                const privateSurveyCounts = await SurveyAPIHandler.cacheMiddleware(SurveyAPIHandler.privateSurveyCount, "privateSurveyCount");
                setPrivateSurveysCount(privateSurveyCounts);
            }

            const matchedSurveys = await matchSubmissionCount(privateSurveyList);
            setPrivateSurveys(matchedSurveys);
            setLoading(false);
        }
        setDisplayPublic(false);
        setDisplayPrivate(true);
    }

    /**
     * Gets all public surveys and matched the submissionCount to it
     * @param page_number
     * @param pagination - function is used for setup after mounting and for fetching new submissions in pagination
     * default is false (setup), in Pagination it is called with true
     * @returns {Promise<void>}
     */
    const setupPublicSurveys = async (page_number = 0, pagination = false) => {
        if (publicSurveys.length === 0 || pagination) {
            setLoading(true);

            const publicSurveyList = await SurveyAPIHandler.cacheMiddleware(() => SurveyAPIHandler.surveyPublicGet(page_number, itemsPerPage), "publicSurveys");

            if (!pagination) {
                const publicSurveysCounts = await SurveyAPIHandler.cacheMiddleware(SurveyAPIHandler.publicSurveyCount, "publicSurveyCount");
                setPublicSurveyCount(publicSurveysCounts);
            }

            const matchedSurveys = await matchSubmissionCount(publicSurveyList);
            setPublicSurveys(matchedSurveys);

            setLoading(false);
        }
        setDisplayPrivate(false);
        setDisplayPublic(true);
    }

    /**
     * Fetched the submission Count of a specific survey
     * returns a list containing objects for all surveys (private or public) with survey, and submissionCount
     * @param surveys either private or public
     * @returns {Promise<[]>}
     */
    const matchSubmissionCount = async (surveys) => {
        const tempSurveyList = [];
        for (let i = 0; i < surveys.length; i++) {
            const apiResponse = await SubmissionAPIHandler.cacheMiddleware(() => SubmissionAPIHandler.submissionCount(surveys[i].id), "submissions", surveys[i].id)
            tempSurveyList.push({
                survey: surveys[i],
                submissionCount: apiResponse
            })

        }
        return tempSurveyList;
    }

    /**
     * Pagination for private and public survey list
     * returns the JSX Element created by createPaginationMarker
     * and gives the function changePage as callback for onCLick
     * in changePage the function to fetch and match the surveys is called: setup---Surveys
     * @returns {*}
     */
    const privatePagination = () => {
        const changePage = async (index) => {
            await setupPrivateSurveys(index, true);
        }
        const pages = Math.ceil(privateSurveysCount / itemsPerPage);
        return createPaginationMarker(pages, changePage);
    }
    const publicPagination = () => {
        const changePage = async (index) => {
            await setupPublicSurveys(index, true);
        }
        const pages = Math.ceil(publicSurveysCount / itemsPerPage);
        return createPaginationMarker(pages, changePage);
    }
    const createPaginationMarker = (pages, clickMethod) => {
        let li = [];
        for (let i = 0; i < pages; i++) {
            li.push(<li key={i} style={{display: "inline", marginRight: "10px", cursor: "pointer"}}
                        onClick={() => clickMethod(i)}>{i + 1}</li>)
        }
        return (
            <div style={{width: "100%"}}>
                <ul style={{listStyle: "none"}}>
                    {li}
                </ul>
            </div>
        )

    }

    /**
     * If a survey (that has more than zero submissions) of the list is clicked
     * the user is being redirected to SurveySpotlight
     * @param survey - the chosen survey the user wants to see the submissions from
     * @returns {JSX.Element}
     */
    const redirectToSpotlight = (survey) => {
        return (
            <Redirect to={{
                pathname: "/survey/submission/spotlight",
                state: {survey, selectedSurveySubmissionCount}
            }}/>
        )
    }

    return (
        <Container fluid>
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                {choseSurvey && redirectToSpotlight(selectedSurvey)}
                <Col xs={3} style={{marginTop: "30px"}}>
                    <h3>Choose type of survey</h3>
                    <button style={{
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "orange",
                        marginRight: "5px",
                        color: "white"
                    }} onClick={() => setupPrivateSurveys()}>Private
                    </button>
                    <button style={{
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "orange",
                        marginRight: "5px",
                        color: "white"
                    }} onClick={() => setupPublicSurveys()}>Public
                    </button>
                </Col>
                <Col xs={8} style={{marginTop: "30px"}}>
                    List of survey with chosen type here
                    {(privateSurveys.length > 0 && displayPrivate) && (
                        <div>
                            {privateSurveysCount > itemsPerPage && privatePagination()}
                            <ul>
                                {privateSurveys.map((item, i) => {
                                    if (item.submissionCount > 0) {
                                        return (<li key={i} style={{cursor: "pointer"}} onClick={() => {
                                            setSelectedSurvey(item.survey);
                                            setSelectedSurveySubmissionCount(item.submissionCount);
                                            setChoseSurvey(true);
                                        }}>{item.survey.title} - {item.submissionCount} submissions</li>)
                                    } else {
                                        return (<li key={i} style={{color: "lightgrey"}}>
                                            {item.survey.title} - {item.submissionCount} submissions</li>)
                                    }
                                })}
                            </ul>
                        </div>
                    )}
                    {(publicSurveys.length > 0 && displayPublic) && (
                        <div>
                            {publicSurveysCount > itemsPerPage && publicPagination()}
                            <ul>
                                {publicSurveys.map((item, i) => {
                                    if (item.submissionCount > 0) {
                                        return (<li key={i} style={{cursor: "pointer"}} onClick={() => {
                                            setSelectedSurvey(item.survey);
                                            setSelectedSurveySubmissionCount(item.submissionCount);
                                            setChoseSurvey(true);
                                        }}>{item.survey.title} - {item.submissionCount} submissions</li>)
                                    } else {
                                        return (<li key={i} style={{color: "lightgrey"}}>
                                            {item.survey.title} - {item.submissionCount} submissions</li>)
                                    }
                                })}
                            </ul>
                        </div>
                    )}
                    {loading && (
                        <LoadingScreen/>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default Submissions;