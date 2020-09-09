import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideMenu from "../SideMenu";
import Row from "react-bootstrap/Row";
import {Redirect} from "react-router-dom";
import log from "../../../../log/Logger";
import axios from "axios";
import storageManager from "../../../../storage/LocalStorageManager";

const SubmissionSpotlight = (props) => {
    const survey = props.location.state.survey;

    const [submissions, setSubmissions] = useState([]);
    const [spotlight, setSpotlight] = useState({});

    const getSubmissions = async(pageNumber = 0, pageSize = 5) => {
        // eslint-disable-next-line no-undefined
        if(survey !== undefined){
            const submissionsResponse = await axios({
                method: "GET",
                url: "/api/v1/submission?survey_id="+ survey.id + "&page_number=" + pageNumber + "&page_size=" + pageSize,
                headers: {
                    "Authorization": storageManager.getJWTToken()
                }
            });
            if(submissionsResponse.status === 200){
                setSubmissions(submissionsResponse.data)
            }
            log.debug(submissionsResponse)
        }

    }

    useEffect(() => {
        getSubmissions()
    }, [])

    return (
        <Container fluid>
            <Row>
                {/* eslint-disable-next-line no-undefined */}
                {survey === undefined && (
                    <Redirect to={"/survey/submissions"}/>
                )}
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                <Col xs={3} style={{marginTop: "30px"}}>
                    List of Submissions
                    <ul>
                        {submissions.map((submission, i) => (
                            <li key={i} style={{cursor: "pointer"}} onClick={() => setSpotlight(submission)}>{submission.created.substr(0, 10)}</li>
                        ))}
                    </ul>
                </Col>
                <Col xs={8} style={{marginTop: "30px"}}>
                    Spotlight of selected submission here <br/>
                    {spotlight.id}
                </Col>
            </Row>
        </Container>
    )
}

export default SubmissionSpotlight;