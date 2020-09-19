import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import log from "../../../log/Logger";
import storageManager from "../../../storage/StorageManager";
import LoadingScreen from "../../utils/LoadingScreen";
import {checkSurveyStatus, collectAnswers, submitAnsweredSurvey, validateSubmission} from "./Utils";
import Message from "../../utils/Message";
import SurveyAPIHandler from "../../../calls/survey";
import SubmissionAPIHandler from "../../../calls/submission";

/**
 * If a User opens a private survey over the provided link, this component is shown
 * to see the survey either a token (as query param) or the authorization jwt is required
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PrivateSurvey = (props) => {
    const {id} = useParams();

    /**
     * Used to control the display of LoadingScreen and as variables
     * survey: is the fetched survey
     * token: token needed to open private survey, taken from url query
     * loadedSurvey: indicates if Form of Survey is supposed to be shown
     * loading: indicates if getSurvey has fetched the survey or not
     */
    const [survey, setSurvey] = useState({});
    const [token, setToken] = useState("");
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

    const getSurvey = async () => {
        const queryParams = props.location.search.split("="); // Looks like ["?token", "4d2d2b71-4947-4efc-8daf-01672cede685"]
        log.debug(storageManager.getJWTToken());

        if (queryParams[0] === "?token") { // Variant 1: Token
            log.debug("WITH TOKEN");
            setToken(queryParams[1])
            const apiResponse = await SurveyAPIHandler.getSinglePrivateSurveyToken(id, queryParams[1])
            if (apiResponse.status === 200) {
                setSurvey(apiResponse.data);
                await setSurvey(apiResponse.data)
                setLoadedSurvey(true);
                setLoading(false);
            } else if (apiResponse.status === 403 || apiResponse.status === 400) {
                log.debug("User is not allowed to see survey -  token not valid");
                setMessageType("danger");
                setMessageText("That did not work. Maybe the token is invalid. Please try again or contact the survey creator!");
                setShowMessage(true);
            } else {
                setMessageType("danger");
                setMessageText("That did not work. Please try again!");
                setShowMessage(true);
                log.debug(apiResponse.log);
            }

        } else if (storageManager.getJWTToken() !== "") { // Variant 2: JWT
            //If a JWT token is found, a registered user is trying to open the private survey
            const apiResponse = await SurveyAPIHandler.getSinglePrivateSurveyJWT(id)
            if (apiResponse.status === 200) {
                await setSurvey(apiResponse.data);
            } else if (apiResponse.status === 500) {
                setMessageType("danger");
                setMessageText("That did not work. Please try again!");
                setShowMessage(true);
            } else {
                // TODO "Survey not found"  TOKEN is MISSING and NO JWT TOKEN, redirect to HOME
                log.debug("Survey not found");
                setMessageType("danger");
                setMessageText("Survey Not found.");
                setShowMessage(true);
            }
        }
    }

    const submitAnswers = async () => {
        const answers = await collectAnswers(survey);
        log.debug("collected Answers", answers);

        const validationCheck = validateSubmission(answers.constrainedAnswers, answers.freestyleAnswers, survey);
        if (validationCheck.valid) {
            const submissionResponse = await SubmissionAPIHandler.submitAnsweredSurvey(answers.constrainedAnswers, answers.freestyleAnswers, survey, token);
            console.log("SubmissionResponse", submissionResponse);
            setShowMessage(submissionResponse.status);
            setMessageType(submissionResponse.type);
            setMessageText(submissionResponse.message);
        } else {
            log.debug("Submission is not valid", validationCheck.message);
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
            {loadedSurvey && checkSurveyStatus(survey, submitAnswers)}
            {showMessage && (
                <Message message={messageText} type={messageType}/>
            )}
        </div>
    )
}

export default PrivateSurvey;