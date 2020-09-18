import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideMenu from "../menu/side-menu/SideMenu";
import Row from "react-bootstrap/Row";
import {Redirect} from "react-router-dom";
import LoadingScreen from "../utils/LoadingScreen";
import SurveyAPIHandler from "../../calls/survey";
import SubmissionAPIHandler from "../../calls/submission";

const Submissions = () => {
    const itemsPerPage = 10;
    const [displayPrivate, setDisplayPrivate] = useState(false);
    const [displayPublic, setDisplayPublic] = useState(false);

    const [publicSurveys, setPublicSurveys] = useState([]);
    const [privateSurveys, setPrivateSurveys] = useState([]);

    const [privateSurveysCount, setPrivateSurveysCount] = useState(0);
    const [publicSurveysCount, setPublicSurveyCount] = useState(0);

    const [choseSurvey, setChoseSurvey] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState({});
    const [selectedSurveySubmissionCount, setSelectedSurveySubmissionCount] = useState(0);

    const [loading, setLoading] = useState(false);

    const setupPrivateSurveys = async (page_number = 0 , pagination = false) => {
        if (privateSurveys.length === 0 || pagination) {
            setLoading(true);

            const privateSurveyList = await SurveyAPIHandler.cacheMiddleware(() => SurveyAPIHandler.surveyPrivateGet(page_number, itemsPerPage), "privateSurveys");

            if(!pagination){
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

    const setupPublicSurveys = async (page_number = 0, pagination = false) => {
        if (publicSurveys.length === 0 || pagination) {
            setLoading(true);

            const publicSurveyList = await SurveyAPIHandler.cacheMiddleware(() => SurveyAPIHandler.surveyPublicGet(page_number, itemsPerPage), "publicSurveys");

            if (!pagination){
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

    const matchSubmissionCount = async (surveys) => {
        const tempSurveyList = [];
        for (let i = 0; i < surveys.length; i++) {
            const apiResponse = await SubmissionAPIHandler.submissionCount(surveys[i].id)
            if (apiResponse.status === 200) {
                tempSurveyList.push({
                    survey: surveys[i],
                    submissionCount: apiResponse.data.count
                })
            }
        }
        return tempSurveyList;
    }

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
                    <button style={{borderRadius: "8px", border: "none", backgroundColor: "orange", marginRight: "5px", color: "white"}} onClick={() => setupPrivateSurveys()}>Private</button>
                    <button style={{borderRadius: "8px", border: "none", backgroundColor: "orange", marginRight: "5px", color: "white"}} onClick={() => setupPublicSurveys()}>Public</button>
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