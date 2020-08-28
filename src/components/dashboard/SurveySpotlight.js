import React from "react";

import log from "../../log/Logger";
import {connect} from "react-redux";

const SurveySpotlight = (props) => {
    return(
        <div>Here will be one of the users surveys like:
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