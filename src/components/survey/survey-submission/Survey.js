import Form from "react-bootstrap/Form";
import React from "react";
import {sortQuestions} from "../../utils/SortQuestions";


/**
 * Form used to display a survey for users that want to submit a submission
 * @param survey
 * @returns {JSX.Element}
 * @constructor
 */
export const SurveyForm = (survey) => {
    const sortedQuestions = sortQuestions(survey.constrained_questions, survey.freestyle_questions);
    return(
        <div className={"survey_submission_form"}>
            <p className={"survey_submission_title"}>{survey.title}</p>
            <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                <label className={"survey_submission_label"}>Description:</label>
                <p>{survey.description}</p>
            </div>
            {sortedQuestions.map((item, i) => {
                if (item.type === "constrained") {
                    return (
                        <div key={i} style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                            <Form.Group id={`${i}answer`}>
                                <Form.Label className={"survey_submission_label"}>{item.question.position + 1}. {item.question.question_text}</Form.Label>
                                {item.question.options.map((option, j) => (
                                    <Form.Check
                                        key={j}
                                        type="radio"
                                        label={option.answer}
                                        name={`answerOptionToQuestion${i}`}
                                    />
                                ))}
                            </Form.Group>
                        </div>
                    )
                } else {
                    return (
                        <div key={i} style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                            <Form.Group>
                                <Form.Label className={"survey_submission_label"}>{item.question.position + 1}. {item.question.question_text}</Form.Label>
                                <Form.Control id={`${i}answer`} type="text" placeholder="Your Answer..."/>
                            </Form.Group>
                        </div>
                    )
                }
            })}
        </div>
    )
}