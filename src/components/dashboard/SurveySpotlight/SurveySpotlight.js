import React, {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";

import RawSurvey from "./RawSurvey";
import ShareLinks from "./ShareLinks";
import storageManager from "../../../storage/LocalStorageManager";
import log from "../../../log/Logger";
import Submissions from "./Submissions";
import NoSubmissions from "./NoSubmissions";

const SurveySpotlight = (props) => {
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [showRawSurvey, setShowRawSurvey] = useState(false);
    const [showLinks, setShowLinks] = useState(true);
    const [submissionCount, setSubmissionCount] = useState(0);

    const manageVisibility = (name) => {
        if (name === "raw"){
            setShowRawSurvey(true);
            setShowSubmissions(false);
            setShowLinks(false);
        } else if (name === "submissions"){
            setShowSubmissions(true);
            setShowLinks(false);
            setShowRawSurvey(false);
        } else if (name === "links"){
            setShowLinks(true);
            setShowSubmissions(false);
            setShowRawSurvey(false);
        }
    }

    const getSubmissionCount = async() => {
        if(props.selectedSurvey){
            const response = await axios({
                method: "GET",
                url: "/api/v1/submission/count?survey_id=" + props.selectedSurvey.id,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            log.debug("Fetched submission count", response);
            if (response.status === 200){
                setSubmissionCount(response.data.count)
            }
        }
    }

    useEffect(() => {
        setSubmissionCount(""); // So that the count does not flip from old to new number
        getSubmissionCount()
    }, [props.selectedSurvey])

    return(
        <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
            {props.selectedSurvey && (
                <h3>{props.selectedSurvey.title} - {submissionCount} submissions</h3>
            )}
            <button style={{borderRadius: "5px", border: "none", marginRight: "5px", marginBottom: "10px", color: "white", backgroundColor: showSubmissions ? "darkgreen" : "lightgrey"}} onClick={() => manageVisibility("submissions")}>Submissions</button>
            <button style={{borderRadius: "5px", border: "none", marginRight: "5px", marginBottom: "10px", color: "white", backgroundColor: showRawSurvey ? "darkgreen" : "lightgrey"}} onClick={() => manageVisibility("raw")}>Raw Survey</button>
            <button style={{borderRadius: "5px", border: "none", marginRight: "5px", marginBottom: "10px", color: "white", backgroundColor: showLinks ? "darkgreen" : "lightgrey"}} onClick={() => manageVisibility("links")}>Share-Links</button>
            {showSubmissions && (
                <div>
                    {submissionCount >= 1 ? <Submissions/> : <NoSubmissions/>}
                </div>
            )}
            {showRawSurvey && (
                <RawSurvey/>
            )}
            {showLinks && (
                <ShareLinks />
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