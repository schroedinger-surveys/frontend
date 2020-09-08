import log from "../../../log/Logger";
import axios from "axios";
import {SurveyForm} from "./Survey";
import {Button} from "react-bootstrap";
import React from "react";
import {sortQuestions} from "../../utils/SortQuestions";
import {PendingSurvey} from "./PendingSurvey";
import {ClosedSurvey} from "./ClosedSurvey";

/**
 * Validate the submission attempt of a user
 * check if every question is answered (required)
 * check if amount of submitted answers fits the amount of questions
 * check if the submitted questions are equal to the submitted answers
 * @param constrainedAnswers - array of all submitted answers of type constrained
 * @param freestyleAnswers - array of all submitted answers of type freestyle
 * @param survey - contains array of original freestyle and constrained questions
 * @returns {{valid: boolean, message: string}} used for Message and check if submission is valid
 */
export const validateSubmission = (constrainedAnswers, freestyleAnswers, survey) => {
    const constrained = survey.constrained_questions;
    const freestyle = survey.freestyle_questions;
    if (constrained.length !== constrainedAnswers.length || freestyle.length !== freestyleAnswers.length) {
        return {valid: false, message: "Please answer all questions!"};
    } else {
        for (let i = 0; i < constrained.length; i++) {
            if (constrained[i].id !== constrainedAnswers[i].constrained_question_id) {
                log.debug("ID of submitted constrained question does not match surveys constrained question id", i, constrained[i].id, constrainedAnswers.constrained_question_id)
                return {valid: false, message: "Something went wrong, please try again"};
            }
        }
        for (let i = 0; i < freestyle.length; i++) {
            if (freestyle[i].id !== freestyleAnswers[i].freestyle_question_id) {
                log.debug("ID of submitted freestyle question does not match surveys freestyle question id")
                return {valid: false, message: "Something went wrong, please try again"};
            }
            if (freestyleAnswers[i].answer === "") {
                return {valid: false, message: "Please answer all freestyle questions with a text!"};
            }
        }
    }
    return {valid: true, message: "Survey is valid, your Submission will be processed"};
}

/**
 * Submits a valid Survey Submission
 * @param constrainedAnswers - array of all submitted answers of type constrained
 * @param freestyleAnswers - array of all submitted answers of type freestyle
 * @param survey - needed for id property
 * @param token - is null for public survey and given for private survey
 * @returns {Promise<{type: string, message: string, status: boolean}>} used for Message
 */
export const submitAnsweredSurvey = async (constrainedAnswers, freestyleAnswers, survey, token) => {
    log.debug("Submitted Answers", constrainedAnswers, freestyleAnswers);
    try {
        let submitResponse
        if (survey.secured){
            submitResponse = await axios({
                method: "POST",
                url: "/api/v1/submission?token="+token,
                data: {
                    survey_id: survey.id,
                    constrained_answers: constrainedAnswers,
                    freestyle_answers: freestyleAnswers
                }
            });
        } else {
            submitResponse = await axios({
                method: "POST",
                url: "/api/v1/submission",
                data: {
                    survey_id: survey.id,
                    constrained_answers: constrainedAnswers,
                    freestyle_answers: freestyleAnswers
                }
            });
        }

        log.debug("Response of submitting the submission", submitResponse);
        if (submitResponse.status === 201) {
            log.debug("Survey Submission was submitted", survey.id, constrainedAnswers, freestyleAnswers);
            return {status: true, type: "success", message: "Your answers were submitted"}
        } else if (submitResponse.status === 400) {
            return {status: true, type: "warning", message: "We could not submit your answers, please try again!"}
        } else if (submitResponse.status === 500) {
            return {status: true, type: "danger", message: "Something went wrong. Please try again!"}
        } else {
            return {status: true, type: "danger", message: "Something went wrong. Please try again!"}
        }
    } catch (e) {
        log.debug("Submission could not be submit", e);
        return {status: true, type: "danger", message: "Something went wrong. Please try again!"}
    }
}

/**
 * Based on the start and end date a different component is shown
 * pending: the survey is not yet active
 * closed: no submissions allowed
 * active: show the survey as a form ready for the user to submit his submission
 * @param survey
 * @param collect - a function used to collect the answers of the user
 * @returns {JSX.Element}
 */
export const checkSurveyStatus = (survey, collect) => {
    const start_date = new Date(survey.start_date).getTime();
    const end_date = new Date(survey.end_date).getTime();
    const today = new Date(Date.now()).getTime();

    if (start_date > today) {
        return (
            <div>
                {PendingSurvey(survey)}
            </div>
        )
    } else if (end_date < today) {
        return (
            <div>
                {ClosedSurvey(survey)}
            </div>
        )
    } else {
        return (
            <div style={{width: "60%", margin: "0 auto"}}>
                {SurveyForm(survey)}
                <Button style={{width: "100%", margin: "15px 0 30px 0"}} onClick={collect}
                        variant={"success"}>Submit</Button>
            </div>
        )
    }
}


/**
 * Function used to collect all answers of a users submission
 * collects and separates answers by type
 * @param survey
 * @returns {{constrainedAnswers: [], freestyleAnswers: []}}
 */
export const collectAnswers = (survey) => {
    const sortedQuestions = sortQuestions(survey.constrained_questions, survey.freestyle_questions);
    const constrainedAnswers = [];
    const freestyleAnswers = [];
    for (let i = 0; i < sortedQuestions.length; i++) {
        const question = document.getElementById(`${i}answer`);
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
    return {constrainedAnswers, freestyleAnswers}
}