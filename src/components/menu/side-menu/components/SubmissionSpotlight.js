import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideMenu from "../SideMenu";
import Row from "react-bootstrap/Row";
import {Redirect} from "react-router-dom";
import log from "../../../../log/Logger";
import axios from "axios";
import storageManager from "../../../../storage/LocalStorageManager";
import {sortQuestions} from "../../../utils/SortQuestions";

const SubmissionSpotlight = (props) => {
    const survey = props.location.state.survey;
    const submissionCount = props.location.state.selectedSurveySubmissionCount;
    const itemsPerPage = 10;

    const [submissions, setSubmissions] = useState([]);
    const [spotlight, setSpotlight] = useState({});

    const [renamed, setRenamed] = useState(false);
    const [constrainedOptions, setConstrainedOptions] = useState(new Map());

    const setupConstrainedQuestionOptions = () => {
        let sortedConstrainedQuestions = new Map();
        for (let i = 0; i < survey.constrained_questions.length; i++) {
            sortedConstrainedQuestions.set(survey.constrained_questions[i].position, survey.constrained_questions[i].options)
        }
        setConstrainedOptions(sortedConstrainedQuestions);
    }

    useEffect(() => {
        setupConstrainedQuestionOptions()
    }, [])

    const getSubmissions = async (pageNumber = 0) => {
        // eslint-disable-next-line no-undefined
        if (survey !== undefined) {
            const submissionsResponse = await axios({
                method: "GET",
                url: "/api/v1/submission?survey_id=" + survey.id + "&page_number=" + pageNumber + "&page_size=" + itemsPerPage,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            if (submissionsResponse.status === 200) {
                setSubmissions(submissionsResponse.data);
            }
        }
    }

    const renameSubmissionProperties = (submission) => {
        for (let i = 0; i < submission.constrained_answers.length; i++) {
            submission.constrained_answers[i].question_text = submission.constrained_answers[i].constrained_question_question_text;
            submission.constrained_answers[i].position = submission.constrained_answers[i].constrained_question_position;
            submission.constrained_answers[i].answer = submission.constrained_answers[i].constrained_question_chose_option;
        }
        for (let i = 0; i < submission.freestyle_answers.length; i++) {
            submission.freestyle_answers[i].question_text = submission.freestyle_answers[i].freestyle_question_question_text;
            submission.freestyle_answers[i].position = submission.freestyle_answers[i].freestyle_question_position;
            submission.freestyle_answers[i].answer = submission.freestyle_answers[i].freestyle_question_answer;
        }
    }

    const changeSubmission = async (submission) => {
        log.debug(constrainedOptions);
        await renameSubmissionProperties(submission)
        setSpotlight(submission);
        setRenamed(true);
    }

    const submissionPagination = () => {
        const changePage = async (index) => {
            await getSubmissions(index);
        }

        const pages = Math.ceil(submissionCount / itemsPerPage);
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

    const showOptions = (key) => {
        const options = constrainedOptions.get(key);
        let optionValues = [];
        for (let i = 0; i < options.length; i++) {
            optionValues.push(options[i].answer);
        }
        return "(" + optionValues.join(", ") + ")";
    }

    useEffect(() => {
        getSubmissions()
    }, [])

    return (
        <Container fluid>
            <Row>
                {/* eslint-disable-next-line no-undefined */}
                {survey === undefined && (
                    <Redirect to={"/survey/submissions"}/>
                )}
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                <Col xs={3} style={{marginTop: "30px"}}>
                    List of Submissions (newest first)
                    {submissionCount > itemsPerPage && submissionPagination()}
                    <ul>
                        {submissions.map((submission, i) => (
                            <li key={i} style={{cursor: "pointer"}} onClick={() => {
                                changeSubmission(submission)
                            }}>{submission.created.substr(0, 10)}</li>
                        ))}
                    </ul>
                </Col>
                <Col xs={8} style={{marginTop: "30px"}}>
                    Spotlight of selected submission here <br/>
                    {renamed &&
                    sortQuestions(
                        spotlight.constrained_answers,
                        spotlight.freestyle_answers,
                        "position",
                        "constrained_questions_option_id").map((item, i) => (
                        <div key={i} style={{
                            border: "1px solid lightgrey",
                            borderRadius: "8px",
                            padding: "5px",
                            marginBottom: "5px"
                        }}>
                            <p><span
                                style={{fontWeight: "bold"}}>Question {item.question.position + 1}:</span> {item.question.question_text}
                            </p>
                            <p style={{fontSize: "12px"}}>
                                <span style={{fontWeight: "bold", fontSize: "16px"}}>Answer:</span> <span
                                style={{fontSize: "16px"}}>{item.question.answer}</span> {item.type === "constrained" ? showOptions(item.question.position) : ""}
                            </p>
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    )
}

export default SubmissionSpotlight;