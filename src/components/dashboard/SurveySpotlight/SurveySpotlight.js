import React, {useState} from "react";
import {connect} from "react-redux";
import RawSurvey from "./RawSurvey";
import ShareLinks from "./ShareLinks";

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

    return(
        <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
            <h3>{props.selectedSurvey.title} - {submissionCount} submissions</h3>
            <button style={{borderRadius: "5px", border: "none", marginRight: "5px", marginBottom: "10px", color: "white", backgroundColor: showSubmissions ? "darkgreen" : "lightgrey"}} onClick={() => manageVisibility("submissions")}>Submissions</button>
            <button style={{borderRadius: "5px", border: "none", marginRight: "5px", marginBottom: "10px", color: "white", backgroundColor: showRawSurvey ? "darkgreen" : "lightgrey"}} onClick={() => manageVisibility("raw")}>Raw Survey</button>
            <button style={{borderRadius: "5px", border: "none", marginRight: "5px", marginBottom: "10px", color: "white", backgroundColor: showLinks ? "darkgreen" : "lightgrey"}} onClick={() => manageVisibility("links")}>Share-Links</button>
            {showSubmissions && (
                <p>{submissionCount > 1 ? "submissions...." : "No Submissions yet"}</p>
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