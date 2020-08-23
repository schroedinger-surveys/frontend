import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import log from "../../../log/Logger";
import store from "../../../redux/store/Store";

const SurveyCounts = () => {
    const {overallSurveys, activeSurveys, pendingSurveys, closedSurveys} = store.getState().surveyCount;
    log.debug(store.getState());
    return(
        <Row>
            <Col>
                <Row>surveys overall:</Row>
                <Row>{overallSurveys}</Row>
            </Col>
            <Col>
                <Row>active surveys:</Row>
                <Row>{activeSurveys}</Row>
            </Col>
            <Col>
                <Row>pending surveys:</Row>
                <Row>{pendingSurveys}</Row>
            </Col>
            <Col>
                <Row>closed surveys:</Row>
                <Row>{closedSurveys}</Row>
            </Col>
        </Row>
    )
}

export default SurveyCounts;