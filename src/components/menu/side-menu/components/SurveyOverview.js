import React from "react";
import {Container} from "react-bootstrap";
import SideMenu from "../SideMenu";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {connect} from "react-redux";

const SurveyOverview = () => {

    const matchSubmissionCountToSurvey = () => {
        // TODO
    }

    return(
        <Container fluid>
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                <Col xs={6} style={{marginTop: "30px"}}>
                </Col>
                <Col xs={6} style={{marginTop: "30px"}}>
                </Col>
            </Row>
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        counts: state.surveyCounts,
        surveys: state.surveyLists
    }
}

export default connect(mapStateToProps)(SurveyOverview);