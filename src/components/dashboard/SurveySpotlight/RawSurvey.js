import React from "react";
import {connect} from "react-redux";
import {getCurrentStatus} from "../../utils/SurveyStatus";

const RawSurvey = (props) => {
    return(
        <div>
            <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                <label style={{fontWeight: "bold"}}>Description:</label>
                <p>{props.selectedSurvey.description}</p>
            </div>
            <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                <label style={{fontWeight: "bold"}}>Start & End-Date:</label>
                <p>{props.selectedSurvey.start_date} - {props.selectedSurvey.end_date} | {getCurrentStatus(props.selectedSurvey.start_date, props.selectedSurvey.end_date)} </p>
            </div>
            <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                <label style={{fontWeight: "bold"}}>Who can submit an answer:</label>
                <p>{props.selectedSurvey.secured ? "Invite Only" : "Open to public"}</p>
            </div>
            <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                <label style={{fontWeight: "bold"}}>Constrained Questions:</label>
                {props.selectedSurvey.constrained_questions.length > 0 && props.selectedSurvey.constrained_questions.map((question, i) => (
                    <div key={i}>
                        <p>{question.question_text}</p>
                        <ul>
                            {question.options.map((option, j) => (
                                <li key={j}>{option.answer}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                {props.selectedSurvey.constrained_questions.length === 0 && (
                    <p>No Constrained Questions in this survey</p>
                )}
            </div>
            <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                <label style={{fontWeight: "bold"}}>Freestyle Questions:</label>
                {props.selectedSurvey.freestyle_questions.length > 0 && props.selectedSurvey.freestyle_questions.map((question, i) => (
                    <p key={i}>{question.question_text}</p>
                ))}
                {props.selectedSurvey.freestyle_questions.length === 0 && (
                    <p>No Freestyle Questions in this survey</p>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedSurvey: state.selectedSpotlight
    }
}

export default connect(mapStateToProps)(RawSurvey);
