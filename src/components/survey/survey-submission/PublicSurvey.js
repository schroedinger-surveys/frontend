import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import LoadingScreen from "../../utils/LoadingScreen";
import Message from "../../utils/Message";
import {checkSurveyStatus, collectAnswers, validateSubmission} from "./Utils";
import SurveyAPIHandler from "../../../calls/survey";
import SubmissionAPIHandler from "../../../calls/submission";
import boxLogo from "../../menu/icons/open-box.png";
import logFactory from "../../../utils/Logger";
const log = logFactory("src/components/surveys/survey-submission/PublicSurvey.js");

/**
 * If a user opens a public survey trough the provided link
 * this Component is shown
 * @returns {JSX.Element}
 * @constructor
 */
const PublicSurvey = (props) => {
    const {history} = props;
    const {id} = useParams();

    /**
     * Used to control the display of LoadingScreen and as variables
     * survey: is the fetched survey
     * loadedSurvey: indicates if Form of Survey is supposed to be shown
     * loading: indicates if getSurvey has fetched the survey or not
     */
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

    const getSurvey = async() => {
        const apiResponse = await SurveyAPIHandler.getSinglePublicSurvey(id);
            if (apiResponse.status === 200) {
                await setSurvey(apiResponse.data)
                setLoadedSurvey(true);
                setLoading(false);
            } else {
                setMessageType("danger");
                setMessageText(apiResponse.backend.data.human_message || "That did not work. Please try again!");
                setShowMessage(true);
                setLoading(false);
                log.debug(apiResponse.log);
                setTimeout(() => {
                    history.push("/")
                }, 3000);
            }
    }

    const submitPublicSurvey = async () => {
        const answers = await collectAnswers(survey);
        log.debug("collected Answers", answers);

        const validationCheck = validateSubmission(answers.constrainedAnswers, answers.freestyleAnswers, survey);
        if (validationCheck.valid){
            log.debug("Check questions", answers.constrainedAnswers, answers.freestyleAnswers);
            const submissionResponse = await SubmissionAPIHandler.submitAnsweredSurvey(answers.constrainedAnswers, answers.freestyleAnswers, survey, null);
            setShowMessage(submissionResponse.status);
            setMessageType(submissionResponse.type);
            setMessageText(submissionResponse.message);
        } else {
            log.debug("Submission is not valid",validationCheck.message);
            setMessageType("danger");
            setMessageText(validationCheck.message);
            setShowMessage(true);
        }
    }


    useEffect(() => {
        getSurvey();
    }, []);

    return (
        <div className={"survey_wrapper"}>
            <div className={"survey_wrapper_logo"}>
                <a href={"https://schroedinger-survey.de"}>
                    <img className={"box_logo survey_logo"} src={boxLogo} alt={"schroedingers survey cat box"}/>
                </a>
                Schrödinger Survey
            </div>
            <div id={"app_page_body"}>
                {loading && (
                    <LoadingScreen/>
                )}
                {loadedSurvey && checkSurveyStatus(survey, submitPublicSurvey)}
                {showMessage && (
                    <Message message={messageText} type={messageType}/>
                )}
            </div>
        </div>
    )
}

export default PublicSurvey;
