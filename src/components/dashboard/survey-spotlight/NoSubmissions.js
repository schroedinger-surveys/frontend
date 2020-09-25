import React, {useEffect, useState} from "react";

import emptyBox from "./icons/box.png";
import {connect} from "react-redux";

const NoSubmissions = (props) => {
   const [reason, setReason] = useState({});

    const findReason = () => {
        const today = Date.now();
        const startDate = new Date(props.selectedSurvey.start_date).getTime();
        const endDate = new Date(props.selectedSurvey.end_date).getTime();

        if (startDate > today) {
            return {message: "your survey is not active yet.", instructions: "You need to wait until "+props.selectedSurvey.start_date};
        } else if (endDate < today) {
            return {message: "your survey is already closed and no submission were submitted.", instructions: "You could create the survey again and share it a little more."};
        } else if (startDate <= today && endDate >= today) {
            return {message: "you maybe did not share your Survey?", instructions: "Start sharing your survey by creating and sharing Share-Links"};
        }
    }

    useEffect(() => {
        setReason(findReason());
    }, [props.selectedSurvey])

    return(
        <div>
            <h3>No Submissions because {reason.message}</h3>
            <img className={"no_submissions-image"} src={emptyBox} alt={"No Surveys yet, empty box of Schroedinger"}/>
            <p>What now? - {reason.instructions}</p>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedSurvey: state.selectedSpotlight
    }
}

export default connect(mapStateToProps)(NoSubmissions);