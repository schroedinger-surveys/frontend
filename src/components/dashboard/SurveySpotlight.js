import React, {useEffect, useState} from "react";

import log from "../../log/Logger";
import {connect} from "react-redux";
import Nav from "react-bootstrap/Nav";

const SurveySpotlight = (props) => {
    const [showSubmissions, setShowSubmissions] = useState(false);

    return(
        <div>Here will be one of the users surveys like: <br/>
            <button onClick={() => setShowSubmissions(!showSubmissions)}>{showSubmissions ? "Raw Survey" : "Submissions"}</button>
            {showSubmissions && (
                <h3>SUBMISSIONS</h3>
            )}
            {!showSubmissions && (
                <h3>RAW SURVEY</h3>
            )}
            <h3>{props.selectedSurvey.title}</h3>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedSurvey: state.selectedSpotlight
    }
}

export default connect(mapStateToProps)(SurveySpotlight);