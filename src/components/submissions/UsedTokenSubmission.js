import React, {useEffect, useState} from "react";
import SideMenu from "../menu/side-menu/SideMenu";
import log from "../../log/Logger";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {useParams} from "react-router-dom";
import SubmissionAPIHandler from "../../calls/submission";
import ListGroup from "react-bootstrap/ListGroup";
import LoadingScreen from "../utils/LoadingScreen";
import {sortQuestions} from "../utils/SortQuestions";

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

    return (
        <Container fluid>
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                {loading && <LoadingScreen/>}
                {!loading && (
                    <Col xs={{span: 5, offset: 3}} style={{marginTop: "30px"}}>
                        <div>
                            <label style={{fontWeight: "bold", fontSize: "21px"}}>Submission Details</label>
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
                                        <p><span
                                            style={{fontWeight: "bold"}}>Question {i + 1}:</span> {item.type === "freestyle" ? item.question.freestyle_question_question_text : item.question.constrained_question_question_text}
                                        </p>
                                        <p style={{fontSize: "12px"}}>
                                            <span style={{fontWeight: "bold", fontSize: "16px"}}>Answer:</span> <span
                                            style={{fontSize: "16px"}}>
                                            {item.type === "freestyle" ? item.question.freestyle_question_answer : item.question.constrained_question_chose_option}</span>
                                        </p>
                                    </div>
                            ))}
                        </div>
                    </Col>
                )}
            </Row>

        </Container>
    )
}

export default UsedTokenSubmission;