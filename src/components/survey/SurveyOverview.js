import React, {useEffect, useState} from "react";
import {Container, ListGroup} from "react-bootstrap";
import SideMenu from "../menu/side-menu/SideMenu";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import LoadingScreen from "../utils/LoadingScreen";
import {getCurrentStatus, getSurveyStatus} from "../utils/SurveyStatus";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import SurveyAPIHandler from "../../calls/survey";
import Message from "../utils/Message";
import {Redirect} from "react-router-dom";
import {DeleteModal} from "./delete-survey-utils";
import SubmissionAPIHandler from "../../calls/submission";

const SurveyOverview = () => {
    const [matching, setMatching] = useState(true);

    const [privateSurveys, setPrivateSurveys] = useState([]);
    const [publicSurveys, setPublicSurveys] = useState([]);

    const [privateCount, setPrivateCount] = useState(0);
    const [publicCount, setPublicCount] = useState(0);

    const itemsPerPage = 3;

    const [surveyToDelete, setSurveyToDelete] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMessageDelete, setShowMessageDelete] = useState(false);
    const [messageTextDelete, setMessageTextDelete] = useState("");
    const [messageTypeDelete, setMessageTypeDelete] = useState("");

    const [redirect, setRedirect] = useState(false);
    const [surveyToEdit, setSurveyToEdit] = useState("");

    const getSurveyLists = async () => {
        setMatching(true);
        const listPrivateSurveys = await SurveyAPIHandler.surveyPrivateGet(0, itemsPerPage);
        const listPublicSurveys = await SurveyAPIHandler.surveyPublicGet(0, itemsPerPage);
        await matchPrivateSurveys(listPrivateSurveys)
        await matchPublicSurveys(listPublicSurveys);
        setMatching(false);
    }

    const getSurveyCounts = async () => {
        const privateSurveyCounts = await SurveyAPIHandler.privateSurveyCount();
        setPrivateCount(privateSurveyCounts);
        const publicSurveysCounts = await SurveyAPIHandler.publicSurveyCount();
        setPublicCount(publicSurveysCounts);
    }

    const matchPrivateSurveys = async (privateList) => {
        // TODO match Seen-Count when backend api is ready
        const tempListPrivateSurveys = [];
        for (let i = 0; i < privateList.length; i++) {
            const apiResponse = await SubmissionAPIHandler.submissionCount(privateList[i].id);
            if (apiResponse.status === 200) {
                tempListPrivateSurveys.push({
                    secured: true,
                    survey: privateList[i],
                    submissionCount: apiResponse.data.count
                })
            }
        }
        await setPrivateSurveys(tempListPrivateSurveys);
    }

    const matchPublicSurveys = async (publicList) => {
        // TODO match Seen-Count when backend api is ready
        const tempListPublicSurveys = [];
        for (let i = 0; i < publicList.length; i++) {
            const apiResponse = await SubmissionAPIHandler.submissionCount(publicList[i].id);
            if (apiResponse.status === 200) {
                tempListPublicSurveys.push({
                    secured: false,
                    survey: publicList[i],
                    submissionCount: apiResponse.data.count
                })
            }
        }
        await setPublicSurveys(tempListPublicSurveys);
    }

    const SurveyList = (surveys) => {
        return (
            <ListGroup>
                {surveys.map((item, i) => (
                    <ListGroup.Item style={{cursor: "pointer", borderColor: "#065535"}} key={i}>
                        <span style={{fontWeight: "bold"}}>{item.survey.title}</span><br/>
                        status: <i>{getCurrentStatus(item.survey.start_date, item.survey.end_date)}</i> -
                        start: <i>{item.survey.start_date.substr(0, 10)}</i> -
                        end: <i>{item.survey.end_date.substr(0, 10)}</i> -
                        submissions: <i>{item.submissionCount}</i> -
                        questions: <i>{item.survey.constrained_questions.length + item.survey.freestyle_questions.length}</i> -
                        seen: <i>0 times</i><br/>
                        <Accordion>
                            {item.survey.constrained_questions.length > 0 && (
                                constrainedQuestionsList(item.survey)
                            )}
                            {item.survey.freestyle_questions.length > 0 && (
                                freestyleQuestionList(item.survey)
                            )}
                        </Accordion>
                        {(getSurveyStatus(item.survey.start_date, item.survey.end_date) === "pending" ||
                            (getSurveyStatus(item.survey.start_date, item.survey.end_date) === "active" && item.submissionCount === 0)) &&
                        <button style={{border: "none", backgroundColor: "transparent", float: "left"}}
                                onClick={() => redirectToSurvey(item.survey)}
                        >
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square"
                                 fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </button>
                        }
                        <button style={{border: "none", backgroundColor: "transparent", float: "right"}}
                                onClick={() => {
                                    setShowDeleteModal(true);
                                    setSurveyToDelete(item.survey)
                                }}
                        >
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash"
                                 fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd"
                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        )
    }

    const redirectToSurvey = async (survey) => {
        await setSurveyToEdit(survey);
        setRedirect(true);
    }

    const redirectSurveyEdit = () => {
        return (
            <Redirect to={"/survey/edit/" + surveyToEdit.id}/>
        )
    }

    const deleteSurveyModal = () => {
        const closeFunction = () => {
            setShowDeleteModal(false);
            setSurveyToDelete({});
        }
        const params = {
            closeFunction,
            deleteSurvey,
            showDeleteModal
        }
        return (
            <DeleteModal parameter={params}/>
        )
    }

    const deleteSurvey = async () => {
        const deleteSurveyResponse = await SurveyAPIHandler.surveyDelete(surveyToDelete.id);
        if (deleteSurveyResponse === 204) {
            await getSurveyLists();
            await getSurveyCounts();
            setShowDeleteModal(false);
        } else {
            setShowMessageDelete(true);
            setMessageTypeDelete("danger");
            setMessageTextDelete("That did not work. Please try again.");
        }
    }

    const constrainedQuestionsList = (survey) => {
        const constrainedQuestions = survey.constrained_questions;
        return (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1" style={{color: "grey"}}>
                        Click to see: Constrained Questions
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        {constrainedQuestions.map((question, i) => (
                            <div key={i}>
                                <p>{question.question_text}</p>
                                <ul>
                                    {question.options.map((option, j) => (
                                        <li key={j}>{option.answer}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    const freestyleQuestionList = (survey) => {
        const freestyleQuestions = survey.freestyle_questions;
        return (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0" style={{color: "grey"}}>
                        Click to see: Freestyle Questions
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <ul>
                            {freestyleQuestions.map((question, i) => (
                                <li key={i}>{question.question_text}</li>
                            ))}
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    const privatePagination = () => {
        const changePage = async (index) => {
            const listPrivateSurveys = await SurveyAPIHandler.surveyPrivateGet(index, itemsPerPage);
            await matchPrivateSurveys(listPrivateSurveys);
        }

        const pages = Math.ceil(privateCount / itemsPerPage);
        return createPaginationMarker(pages, changePage);
    }

    const publicPagination = () => {
        const changePage = async (index) => {
            const listPublicSurveys = await SurveyAPIHandler.surveyPublicGet(index, itemsPerPage);
            await matchPublicSurveys(listPublicSurveys);
        }

        const pages = Math.ceil(publicCount / itemsPerPage);
        return createPaginationMarker(pages, changePage);
    }

    const createPaginationMarker = (pages, clickMethod) => {
        let li = [];
        for (let i = 0; i < pages; i++) {
            li.push(<li key={i} style={{display: "inline", marginRight: "10px", cursor: "pointer"}}
                        onClick={() => clickMethod(i)}>{i + 1}</li>)
        }

        if (pages <= 1) {
            return (
                <div style={{width: "100%"}}>
                    <ul style={{listStyle: "none"}}>
                        <li style={{color: "transparent"}}>.</li>
                    </ul>
                </div>
            )
        } else {
            return (
                <div style={{width: "100%"}}>
                    <ul style={{listStyle: "none"}}>
                        {li}
                    </ul>
                </div>
            )
        }
    }

    useEffect(() => {
        getSurveyLists();
        getSurveyCounts();
    }, []);

    return (
        <Container fluid>
            {redirect && redirectSurveyEdit()}
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                {deleteSurveyModal()}
                {matching && (
                    <Col xs={11}>
                        <LoadingScreen/>
                    </Col>

                )}
                {!matching && (
                    <Col xs={5} style={{margin: "30px 30px 0 0", border: "1px solid lightgrey", borderRadius: "8px"}}>
                        {showMessageDelete && <Message type={messageTypeDelete} message={messageTextDelete}/>}
                        <h3>Private Surveys - {privateCount}</h3>
                        {privateSurveys.length > 0 && (
                            <div>
                                {privatePagination()}
                                {SurveyList(privateSurveys)}
                            </div>
                        )}
                        {privateSurveys.length === 0 && (
                            <div>
                                <p>No Private Surveys yet.</p>
                                <a href={"/survey/create"}>Create a Private Survey now</a>
                            </div>

                        )}
                    </Col>
                )}
                {!matching && (
                    <Col xs={5} style={{marginTop: "30px", border: "1px solid lightgrey", borderRadius: "8px"}}>
                        {showMessageDelete && <Message type={messageTypeDelete} message={messageTextDelete}/>}
                        <h3>Public Surveys - {publicCount}</h3>
                        {publicSurveys.length > 0 && (
                            <div>
                                {publicPagination()}
                                {SurveyList(publicSurveys)}
                            </div>
                        )}
                        {publicSurveys.length === 0 && (
                            <div>
                                <p>No Public Surveys yet.</p>
                                <a href={"/survey/create"}>Create a Public Survey now</a>
                            </div>
                        )}
                    </Col>
                )}
            </Row>
        </Container>
    )
}

export default SurveyOverview;