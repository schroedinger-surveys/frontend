import React, {useEffect, useState} from "react";
import SideMenu from "../menu/side-menu/SideMenu";
import log from "../../log/Logger";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {useParams} from "react-router-dom";
import SubmissionAPIHandler from "../../calls/submission";

/**
 * scenario: User clicks on used token in ShareLinks and is directed to the submission belonging to it
 * @returns {JSX.Element}
 * @constructor
 */
const UsedTokenSubmission = () => {
    const {submission_id} = useParams();
    const [submission, setSubmission] = useState({});

    const fetchSubmission = async () => {
        const apiResponse = await SubmissionAPIHandler.usedTokenSubmissionGet(submission_id);
        log.debug(apiResponse.data);
        if(apiResponse.status === 200){
            setSubmission(apiResponse.data);
        } else {
            log.debug(apiResponse.log);
        }
    }

    useEffect(() => {
        fetchSubmission()
    }, []);

    return(
        <Container fluid>
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                <Col xs={{ span: 4, offset: 4 }} style={{marginTop: "30px"}}>
                    {submission.survey_id}
                </Col>
            </Row>

        </Container>
    )
}

export default UsedTokenSubmission;