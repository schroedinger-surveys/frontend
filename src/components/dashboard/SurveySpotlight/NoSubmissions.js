import React, {useEffect, useState} from "react";

import sleepingKitty from "./icons/kitty.png";
import sadKitty from "./icons/mad_kitty.png";
import wonderingKitty from "./icons/cat.png";
import {connect} from "react-redux";

const NoSubmissions = (props) => {
   const [reason, setReason] = useState({});

    const findReason = () => {
        const today = Date.now();
        const startDate = new Date(props.selectedSurvey.start_date).getTime();
        const endDate = new Date(props.selectedSurvey.end_date).getTime();

        if (startDate > today) {
            return {img_src: sleepingKitty, message: "your survey is not active yet.", instructions: "You need to wait until "+props.selectedSurvey.start_date};
        } else if (endDate < today) {
            return {img_src: sadKitty, message: "your survey is already closed and no submission were submitted.", instructions: "You could create the survey again and share it a little more."};
        } else if (startDate <= today && endDate >= today) {
            return {img_src: wonderingKitty, message: "you maybe did not share your Survey?", instructions: "Start sharing your survey by creating and sharing Share-Links"};
        }
    }

    useEffect(() => {
        setReason(findReason());
    }, [props.selectedSurvey])

    return(
        <div>
            <h3>No Submissions because {reason.message}</h3>
            <img src={reason.img_src} style={{width: "200px"}}/>
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