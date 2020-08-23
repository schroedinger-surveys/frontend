import React, {useEffect} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import {useSelector} from "react-redux";

const SurveyCounts = () => {
    const counts = useSelector(state => state.SurveyCountReducer)

    return(
        <Row style={{border: "1px solid lightgrey", padding: "5px", borderRadius: "0 0 8px 8px"}}>
            <Col style={{textAlign: "center"}}>overall:{counts.overallSurveys}</Col>
            <Col style={{textAlign: "center"}}>active: 0</Col>
            <Col style={{textAlign: "center"}}>pending 0</Col>
            <Col style={{textAlign: "center"}}>closed: 0</Col>
        </Row>
    )
}

export default SurveyCounts;