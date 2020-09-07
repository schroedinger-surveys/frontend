import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

import log from "../../../log/Logger";
import LoadingScreen from "../../utils/LoadingScreen";
import Message from "../../utils/Message";
import {checkSurveyStatus, collectAnswers, submitAnsweredSurvey, validateSubmission} from "./Utils";

/**
 * If a user opens a public survey trough the provided link
 * this Component is shown
 * @returns {JSX.Element}
 * @constructor
 */
const PublicSurvey = () => {
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


    const submitPublicSurvey = async () => {
        const answers = await collectAnswers(survey);
        log.debug("collected Answers", answers);

        const validationCheck = validateSubmission(answers.constrainedAnswers, answers.freestyleAnswers, survey);
        if (validationCheck.valid){
            const submissionResponse = await submitAnsweredSurvey(answers.constrainedAnswers, answers.freestyleAnswers, survey, null);
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
        <div>
            {loading && (
                <LoadingScreen/>
            )}
            {loadedSurvey && checkSurveyStatus(survey, submitPublicSurvey)}
            {showMessage && (
                <Message message={messageText} type={messageType}/>
            )}
        </div>
    )
}

export default PublicSurvey;
