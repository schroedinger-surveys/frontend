import React, {useEffect, useState} from "react";
import SideMenu from "../menu/SideMenu";
import {useParams} from "react-router-dom";
import SubmissionAPIHandler from "../../calls/submission";
import ListGroup from "react-bootstrap/ListGroup";
import LoadingScreen from "../utils/LoadingScreen";
import {sortQuestions} from "../utils/SortQuestions";
import AppNavbar from "../menu/AppNavbar";
import logFactory from "../../utils/Logger";
const log = logFactory("src/components/submissions/UsedTokenSubmission.js");

/**
 * scenario: User clicks on used token in ShareLinks and is directed to the submission belonging to it
 * @returns {JSX.Element}
 * @constructor
 */
const UsedTokenSubmission = (props) => {
    const {submission_id} = useParams();
    const token = props.location.state.token;
    const [submission, setSubmission] = useState({});
    const [loading, setLoading] = useState(true);


    const fetchSubmission = async () => {
        const apiResponse = await SubmissionAPIHandler.usedTokenSubmissionGet(submission_id);
        log.debug(apiResponse.data);
        if (apiResponse.status === 200) {
            setSubmission(apiResponse.data);
            setLoading(false);
        } else {
            log.debug(apiResponse.log);
        }
    }

    useEffect(() => {
        fetchSubmission()
    }, []);

    const TokenSubmissionComponent = () => {
        return (
            <div className={"used_token_submission_container"}>
                {loading && <LoadingScreen/>}
                {!loading && (
                    <div style={{marginTop: "20px"}}>
                        <div>
                            <label className={"used_token_sub_label"}>Submission Details</label>
                            <ListGroup style={{marginBottom: "15px"}}>
                                <ListGroup.Item>Used Token: <span
                                    style={{fontWeight: "bold"}}>{token}</span></ListGroup.Item>
                                <ListGroup.Item>Submission Date: <span
                                    style={{fontWeight: "bold"}}>{submission.created.substr(0, 10)}</span></ListGroup.Item>
                            </ListGroup>
                            {sortQuestions(
                                submission.constrained_answers,
                                submission.freestyle_answers,
                                "position",
                                "constrained_questions_option_id").map((item, i) => (
                                <div key={i} style={{
                                    border: "1px solid lightgrey",
                                    borderRadius: "8px",
                                    padding: "5px"
                                }}>
                                    <div>
                                         <p className={"used_token_question"}>Question {i + 1}:</p>
                                         <p className={"used_token_answer"}>{item.type === "freestyle" ? item.question.freestyle_question_question_text : item.question.constrained_question_question_text}</p>
                                    </div>
                                    <div style={{fontSize: "12px"}}>
                                        <p className={"used_token_question"}>Answer:</p>
                                        <p className={"used_token_answer"}>{item.type === "freestyle" ? item.question.freestyle_question_answer : item.question.constrained_question_chose_option}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={"app_wrapper"}>
            <AppNavbar/>
            <SideMenu/>
            <div id={"app_page_body"}>
                {TokenSubmissionComponent()}
            </div>
        </div>
    )
}

export default UsedTokenSubmission;