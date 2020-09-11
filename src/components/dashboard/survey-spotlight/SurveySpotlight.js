import React, {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";

import RawSurvey from "./RawSurvey";
import ShareLinks from "./ShareLinks";
import storageManager from "../../../storage/LocalStorageManager";
import log from "../../../log/Logger";
import Submissions from "./Submissions";
import NoSubmissions from "./NoSubmissions";
import Button from "react-bootstrap/Button";
import {Redirect} from "react-router-dom";
import {getSurveyStatus} from "../../utils/SurveyStatus";

const SurveySpotlight = (props) => {
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [showRawSurvey, setShowRawSurvey] = useState(false);
    const [showLinks, setShowLinks] = useState(true);
    const [submissionCount, setSubmissionCount] = useState(0);

    const [redirect, setRedirect] = useState(false);

    const manageVisibility = (name) => {
        if (name === "raw") {
            setShowRawSurvey(true);
            setShowSubmissions(false);
            setShowLinks(false);
        } else if (name === "submissions") {
            setShowSubmissions(true);
            setShowLinks(false);
            setShowRawSurvey(false);
        } else if (name === "links") {
            setShowLinks(true);
            setShowSubmissions(false);
            setShowRawSurvey(false);
        }
    }

    const getSubmissionCount = async () => {
        if (props.selectedSurvey) {
            const response = await axios({
                method: "GET",
                url: "/api/v1/submission/count?survey_id=" + props.selectedSurvey.id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            log.debug("Fetched submission count", response);
            if (response.status === 200) {
                setSubmissionCount(response.data.count)
            }
        }
    }

    const redirectSurveyEdit = () => {
        return (
            <Redirect to={{
                pathname: "/survey/edit/" + props.selectedSurvey.id,
                state: {
                    survey: props.selectedSurvey
                }
            }}/>
        )
    }

    useEffect(() => {
        setSubmissionCount(""); // So that the count does not flip from old to new number
        getSubmissionCount()
    }, [props.selectedSurvey])

    return (
        <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
            {redirect && redirectSurveyEdit()}
            {props.selectedSurvey && (
                <h3>{props.selectedSurvey.title} - {submissionCount} submissions</h3>
            )}
            <button style={{
                borderRadius: "5px",
                border: "none",
                marginRight: "5px",
                marginBottom: "10px",
                color: "white",
                backgroundColor: showSubmissions ? "darkgreen" : "lightgrey"
            }} onClick={() => manageVisibility("submissions")}>Submissions
            </button>
            <button style={{
                borderRadius: "5px",
                border: "none",
                marginRight: "5px",
                marginBottom: "10px",
                color: "white",
                backgroundColor: showRawSurvey ? "darkgreen" : "lightgrey"
            }} onClick={() => manageVisibility("raw")}>Raw Survey
            </button>
            <button style={{
                borderRadius: "5px",
                border: "none",
                marginRight: "5px",
                marginBottom: "10px",
                color: "white",
                backgroundColor: showLinks ? "darkgreen" : "lightgrey"
            }} onClick={() => manageVisibility("links")}>Share-Links
            </button>

            {(getSurveyStatus(props.selectedSurvey.start_date, props.selectedSurvey.end_date) === "pending" ||
                (getSurveyStatus(props.selectedSurvey.start_date, props.selectedSurvey.end_date) === "active" && submissionCount === 0)) &&
            <button style={{
                borderRadius: "5px",
                border: "none",
                marginRight: "5px",
                marginBottom: "10px",
                color: "darkgreen",
                fontWeight: "bold"
            }} onClick={() => setRedirect(true)}>
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
                Edit Survey
            </button>
            }

            {showSubmissions && (
                <div>
                    {submissionCount >= 1 ? <Submissions/> : <NoSubmissions/>}
                </div>
            )}
            {showRawSurvey && (
                <RawSurvey/>
            )}
            {showLinks && (
                <ShareLinks/>
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedSurvey: state.selectedSpotlight
    }
}

export default connect(mapStateToProps)(SurveySpotlight);