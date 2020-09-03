import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

import log from "../../log/Logger";
import LoadingScreen from "../utils/LoadingScreen";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import Message from "../utils/Message";

const PublicSurvey = () => {
    const {id} = useParams();
    const [survey, setSurvey] = useState({});
    const [loadedSurvey, setLoadedSurvey] = useState(false);
    const [loading, setLoading] = useState(true);

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    const getSurvey = () => {
        axios({
            method: "GET",
            url: "/api/v1/survey/public/" + id
        }).then(async (response) => {
            log.debug(response.data);
            if (response.status === 200) {
                await setSurvey(response.data)
                setLoadedSurvey(true);
                setLoading(false);
            }
        }).catch((error) => {
            log.debug("Could not fetch individual survey", error.response);
        })
    }

    const checkSurveyStatus = () => {
        log.debug(survey.start_date, survey.end_date);
        const start_date = new Date(survey.start_date).getTime();
        const end_date = new Date(survey.end_date).getTime();
        const today = new Date(Date.now()).getTime();

        if (start_date > today) {
            return (
                <div>
                    <h1>PENDING</h1>
                    <p>THE SURVEY IS NOT YET ACTIVE</p>
                </div>
            )
        } else if (end_date < today) {
            return (
                <div>
                    <h1>CLOSED</h1>
                    <p>THE SURVEY DOES NOT TAKE ANYMORE SUBMISSION</p>
                </div>
            )
        } else {
            return (
                submissionForm()
            )
        }
    }

    const collectAnswers = () => {
        const sortedQuestions = sortQuestions();
        const constrainedAnswers = [];
        const freestyleAnswers = [];
        for (let i = 0; i < sortedQuestions.length; i++) {
            const question = document.getElementById(`${i}answer`);
            //log.debug(question);
            if (question.hasChildNodes()) { // ChildNodes are the radio buttons in the constrainedQuestions
                const children = question.childNodes;
                for (let j = 0; j < children.length; j++) {
                    if (children[j].firstChild.type === "radio" && children[j].firstChild.checked) {
                        constrainedAnswers.push({
                            constrained_question_id: sortedQuestions[i].question.id,
                            constrained_questions_option_id: sortedQuestions[i].question.options[j - 1].id
                        })
                    }
                }
            } else {
                freestyleAnswers.push({
                    freestyle_question_id: sortedQuestions[i].question.id,
                    answer: question.value
                });
            }
        }
        const validationCheck = validateSubmission(constrainedAnswers, freestyleAnswers);
        if (validationCheck.valid){
            submitAnsweredSurvey(constrainedAnswers, freestyleAnswers);
        } else {
            log.debug("Submission is not valid",validationCheck.message);
            setMessageType("danger");
            setMessageText(validationCheck.message);
            setShowMessage(true);
        }
    }

    const validateSubmission = (constrainedAnswers, freestyleAnswers) => {
        const constrained = survey.constrained_questions;
        const freestyle = survey.freestyle_questions;
        if (constrained.length !== constrainedAnswers.length || freestyle.length !== freestyleAnswers.length){
            return { valid: false, message: "Please answer all questions!"};
        } else {
            for (let i = 0; i < constrained.length; i++){
                if (constrained[i].id !== constrainedAnswers[i].constrained_question_id){
                    log.debug("ID of submitted constrained question does not match surveys constrained question id", i, constrained[i].id, constrainedAnswers.constrained_question_id)
                    return { valid: false, message: "Something went wrong, please try again"};
                }
            }
            for (let i = 0; i < freestyle.length; i++){
                if (freestyle[i].id !== freestyleAnswers[i].freestyle_question_id){
                    log.debug("ID of submitted freestyle question does not match surveys freestyle question id")
                    return {valid: false, message: "Something went wrong, please try again"};
                }
                if (freestyleAnswers[i].answer === ""){
                    return {valid: false, message: "Please answer all freestyle questions with a text!"};
                }
            }
        }
        return {valid: true, message: "Survey is valid, your Submission will be processed"};
    }

    const submitAnsweredSurvey = async(constrainedAnswers, freestyleAnswers) => {
        try {
            const submitResponse = await axios({
                method: "POST",
                url: "/api/v1/submission",
                data: {
                    survey_id: survey.id,
                    constrained_answers: constrainedAnswers,
                    freestyle_answers: freestyleAnswers
                }
            });
            if (submitResponse.status === 201){
                log.debug("Submission of survey successful");
                setShowMessage(true);
                setMessageType("success");
                setMessageText("Your answers were submitted");
            }
            log.debug("Response of submitting the submission", submitResponse);
        } catch (e) {
            log.debug("Submission could not be submit", e.message);
        }
        log.debug("Survey Submission was submitted", survey.id, constrainedAnswers, freestyleAnswers);
    }

    const submissionForm = () => {
        const sortedQuestions = sortQuestions();
        return (
            <div style={{width: "60%", margin: "0 auto"}}>
                <h2>{survey.title}</h2>
                <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                    <label style={{fontWeight: "bold"}}>Description:</label>
                    <p>{survey.description}</p>
                </div>
                {sortedQuestions.map((item, i) => {
                    if (item.type === "constrained") {
                        return (
                            <div key={i} style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                                <Form.Group id={`${i}answer`}>
                                    <Form.Label
                                        style={{fontWeight: "bold"}}>{item.question.position + 1}. {item.question.question_text}</Form.Label>
                                    {item.question.options.map((option, j) => (
                                        <Form.Check
                                            key={j}
                                            type="radio"
                                            label={option.answer}
                                            name={`answerOptionToQuestion${i}`}
                                        />
                                    ))}
                                </Form.Group>
                            </div>
                        )
                    } else {
                        return (
                            <div key={i} style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                                <Form.Group>
                                    <Form.Label
                                        style={{fontWeight: "bold"}}>{item.question.position + 1}. {item.question.question_text}</Form.Label>
                                    <Form.Control id={`${i}answer`} type="text" placeholder="Your Answer..."/>
                                </Form.Group>
                            </div>
                        )
                    }
                })}
                {showMessage && (
                    <Message message={messageText} type={messageType}/>
                )}
                <Button style={{width: "100%", margin: "15px 0 30px 0"}} onClick={collectAnswers}
                        variant={"success"}>Submit</Button>
            </div>
        )
    }


    const sortQuestions = () => {
        // Sort questions based on position property
        const allQuestions = [...survey.freestyle_questions, ...survey.constrained_questions];
        allQuestions.sort((a, b) => (a.position > b.position) ? 1 : -1);
        for (let i = 0; i < allQuestions.length; i++) {
            let temp = allQuestions[i];
            if (allQuestions[i].hasOwnProperty("options")) {
                allQuestions[i] = {
                    type: "constrained",
                    question: temp
                }
            } else {
                allQuestions[i] = {
                    type: "freestyle",
                    question: temp
                }
            }
        }
        return allQuestions;
    }

    useEffect(() => {
        getSurvey();
    }, []);

    return (
        <div>
            {loading && (
                <LoadingScreen/>
            )}
            {loadedSurvey && checkSurveyStatus()}
        </div>
    )
}

export default PublicSurvey;
