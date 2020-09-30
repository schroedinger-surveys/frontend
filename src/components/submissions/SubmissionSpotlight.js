import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideMenu from "../menu/SideMenu";
import Row from "react-bootstrap/Row";
import {Redirect} from "react-router-dom";
import {sortQuestions} from "../utils/SortQuestions";
import SubmissionAPIHandler from "../../calls/submission";

/**
 * Shows all submissions belonging to a survey
 * Each submission can be looked at individually
 * @param props - survey and submissionCount
 * @returns {JSX.Element}
 * @constructor
 */
const SubmissionSpotlight = (props) => {
    const {survey} = props;
    const {submissionCount} = props;
    const itemsPerPage = 10;

    const [submissions, setSubmissions] = useState([]);
    const [spotlight, setSpotlight] = useState({});

    const [renamed, setRenamed] = useState(false);
    const [constrainedOptions, setConstrainedOptions] = useState(new Map());

    useEffect(() => {
        console.log(survey, submissionCount);
        getSubmissions();
        setupConstrainedQuestionOptions()
    }, [])

    /**
     *  Fetch the submissions from api - DO NOT CACHE it needs to be fetched for each survey individually
     *  fetches only if survey was correctly passed trough props
     **/
    const getSubmissions = async (pageNumber = 0) => {
        // eslint-disable-next-line no-undefined
        if (survey !== undefined) {
            const apiResponse = await SubmissionAPIHandler.submissionGet(survey.id, pageNumber, itemsPerPage)
            setSubmissions(apiResponse.data);
        }
    }

    /**
     * Creates a Map,
     * mapping the positions of the question in the survey to the answer options Map(2 => [y, n]);
     * scenario: shown behind chosen answer of user
     **/
    const setupConstrainedQuestionOptions = () => {
        let sortedConstrainedQuestions = new Map();
        for (let i = 0; i < survey.constrained_questions.length; i++) {
            sortedConstrainedQuestions.set(survey.constrained_questions[i].position, survey.constrained_questions[i].options)
        }
        setConstrainedOptions(sortedConstrainedQuestions);
        console.log(sortedConstrainedQuestions);
    }

    /**
     * Renames some of the properties of the fetched submission json file
     * for easier use with util functions like sortQuestions
     **/
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

    /**
     * If user clicks on submission from list of submissions the Spotlight is reset
     * the submissions properties are renamed and the boolean flag for Rename is set, ending the loading
     **/
    const changeSubmission = async (submission) => {
        await renameSubmissionProperties(submission);
        setSpotlight(submission);
        setRenamed(true);
    }

    /**
     * The Options belonging to an constrained question are returned as a string
     * it uses the Map constrainedOptions, created and mapped in setupConstrainedQuestionOptions
     * scenario: behind the chosen answer these are shown as a overview
     **/
    const showOptions = (key) => {
        const options = constrainedOptions.get(key);
        let optionValues = [];
        for (let i = 0; i < options.length; i++) {
            optionValues.push(options[i].answer);
        }
        return "(" + optionValues.join(", ") + ")";
    }

    /**
     * Creates the Pagination for the list of submissions
     * calls createPaginationMarker
     * returns the JSX element resulting from createPaginationMarker
     * gives the callback function changePage as onClick function
     * changePage fetches the submissions based on the index (number of pagination marker) used as page_number in fetch call
     **/
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