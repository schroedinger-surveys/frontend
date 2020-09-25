import React from "react";
import {connect} from "react-redux";
import {getCurrentStatus} from "../../utils/SurveyStatus";
import {sortQuestions} from "../../utils/SortQuestions";
import {EuropeanTime} from "../../utils/TimeConverter";

const RawSurvey = (props) => {
    return (
        <div>
            {props.selectedSurvey && (
                <div>
                    <div className={"spotlight_box"}>
                        <label className={"spotlight_box-title"}>Title</label>
                        <p className={"spotlight_box-info"}>{props.selectedSurvey.title}</p>
                    </div>
                    <div className={"spotlight_box"} >
                        <label className={"spotlight_box-title"}>Description</label>
                        <p className={"spotlight_box-info"}>{props.selectedSurvey.description}</p>
                    </div>
                    <div className={"spotlight_box"}>
                        <div className={"spotlight_box-dates"}>
                            <label className={"spotlight_box-title"}>Start-Date</label>
                            <p className={"spotlight_box-info"}>{EuropeanTime(props.selectedSurvey.start_date)}</p>
                        </div>
                        <div className={"spotlight_box-dates"}>
                            <label className={"spotlight_box-title"}>End-Date</label>
                            <p className={"spotlight_box-info"}>{EuropeanTime(props.selectedSurvey.end_date)}</p>
                        </div>
                    </div>
                    <div className={"spotlight_box"}>
                        <label className={"spotlight_box-title"}>Who can submit an answer</label>
                        <p className={"spotlight_box-info"}>{props.selectedSurvey.secured ? "Invite Only" : "Open to public"}</p>
                    </div>


                    <div className={"spotlight_box"}>
                        <label className={"spotlight_box-title"}>Questions</label>
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
