import React from "react";
import {connect} from "react-redux";
import {getCurrentStatus} from "../../utils/SurveyStatus";
import {sortQuestions} from "../../utils/SortQuestions";

const RawSurvey = (props) => {
    return (
        <div>
            {props.selectedSurvey && (
                <div>
                    <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                        <label style={{fontWeight: "bold"}}>Title:</label>
                        <p>{props.selectedSurvey.title}</p>
                    </div>
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
                        <label style={{fontWeight: "bold"}}>Questions:</label>
                        {sortQuestions(props.selectedSurvey.constrained_questions, props.selectedSurvey.freestyle_questions).map((item, i) => {
                                if (item.type === "constrained") {
                                    return (
                                        <div key={i}>
                                            <p>Question {i + 1}: {item.question.question_text}</p>
                                            <ul>
                                                {item.question.options.map((option, j) => (
                                                    <li key={j}>{option.answer}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={i}>
                                            <p key={i}>Question {i + 1}: {item.question.question_text}</p>
                                        </div>
                                    )
                                }
                            }
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedSurvey: state.selectedSpotlight
    }
}

export default connect(mapStateToProps)(RawSurvey);
