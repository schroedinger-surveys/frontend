import React, {useEffect} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import {useSelector} from "react-redux";

const SurveyCounts = () => {
    const counts = useSelector(state => state.SurveyCountReducer)

    return(
        <Row>
            <Col>
                <Row>surveys overall:</Row>
                <Row>{counts.overallSurveys}</Row>
            </Col>
            <Col>
                <Row>active surveys:</Row>
                <Row>0</Row>
            </Col>
            <Col>
                <Row>pending surveys:</Row>
                <Row>0</Row>
            </Col>
            <Col>
                <Row>closed surveys:</Row>
                <Row>0</Row>
            </Col>
        </Row>
    )
}

export default SurveyCounts;