import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideMenu from "../menu/SideMenu";
import Row from "react-bootstrap/Row";
import {Redirect} from "react-router-dom";
import LoadingScreen from "../utils/LoadingScreen";
import SurveyAPIHandler from "../../calls/survey";
import SubmissionAPIHandler from "../../calls/submission";
import AppNavbar from "../menu/AppNavbar";

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

    const [overallSurveyCount, setOverallSurveyCount] = useState(null);

    const getSurveyCounts = async () => {
        const privateCount = await SurveyAPIHandler.cacheMiddleware(SurveyAPIHandler.privateSurveyCount, "privateSurveyCount");
        const publicCount = await SurveyAPIHandler.cacheMiddleware(SurveyAPIHandler.publicSurveyCount, "publicSurveyCount");
        setOverallSurveyCount(privateCount + publicCount);
    }

    useEffect(() => {
        getSurveyCounts();
    })

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

    const SubmissionComponent = () => {
        return (
            <div className={"submission_overview_container"}>

                {choseSurvey && redirectToSpotlight(selectedSurvey)}

                {overallSurveyCount === 0 &&
                <div className={"no_submission_container"}>
                    <h3>No Submission yet!</h3>
                </div>
                }
                {overallSurveyCount > 0 &&
                <div className={"submission_overview_chose_type"}>
                    <div>
                        <h3 className={"chose_type_section_title"}>Choose type of survey</h3>
                        <p>You can inspect all submissions individually for each of your surveys. <br/>Choose the type
                            of survey first. It can be either private or public.</p>
                        <button className={"submission_overview_chose_type_button"}
                                onClick={() => setupPrivateSurveys()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-lock" fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M11.5 8h-7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zm-7-1a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7zm0-3a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z"/>
                            </svg>
                            <br/>Private
                        </button>
                        <button className={"submission_overview_chose_type_button"}
                                onClick={() => setupPublicSurveys()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-globe"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"/>
                            </svg>
                            <br/>Public
                        </button>
                    </div>
                    <hr/>
                    <div>
                        <h3 className={"chose_type_section_title"}>Chose available survey</h3>
                        {loading && (
                            <LoadingScreen/>
                        )}
                        {(privateSurveys.length > 0 && displayPrivate) &&  !loading &&(
                            <div className={"submission_overview_survey_list_items"}>
                                {privateSurveysCount > itemsPerPage && privatePagination()}
                                <ul className={"submission_overview_survey_ul"}>
                                    {privateSurveys.map((item, i) => {
                                        if (item.submissionCount > 0) {
                                            return (
                                                <li key={i} className={"submission_overview_survey_active"} onClick={() => {
                                                    setSelectedSurvey(item.survey);
                                                    setSelectedSurveySubmissionCount(item.submissionCount);
                                                    setChoseSurvey(true);
                                                }}>{item.survey.title} - {item.submissionCount} submissions</li>)
                                        } else {
                                            return (<li key={i} className={"submission_overview_survey_disabled"}>
                                                {item.survey.title} - {item.submissionCount} submissions</li>)
                                        }
                                    })}
                                </ul>
                            </div>
                        )}
                        {(publicSurveys.length > 0 && displayPublic) && !loading && (
                            <div className={"submission_overview_survey_list_items"}>
                                {publicSurveysCount > itemsPerPage && publicPagination()}
                                <ul className={"submission_overview_survey_ul"}>
                                    {publicSurveys.map((item, i) => {
                                        if (item.submissionCount > 0) {
                                            return (
                                                <li key={i} className={"submission_overview_survey_active"} onClick={() => {
                                                    setSelectedSurvey(item.survey);
                                                    setSelectedSurveySubmissionCount(item.submissionCount);
                                                    setChoseSurvey(true);
                                                }}>{item.survey.title} - {item.submissionCount} submissions</li>)
                                        } else {
                                            return (<li key={i} className={"submission_overview_survey_disabled"}>
                                                {item.survey.title} - {item.submissionCount} submissions</li>)
                                        }
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                }
            </div>
        )
    }

    return (
        <div className={"app_wrapper"}>
            <AppNavbar/>
            <SideMenu/>
            <div id={"app_page_body"}>
                {SubmissionComponent()}
            </div>
        </div>
    )
}

export default Submissions;