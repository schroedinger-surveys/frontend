import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import {useSelector} from "react-redux";

/**
 * Displays the count of surveys, taken from Redux store
 * Filtered by criteria:
 * privat - secured = true
 * public - secured = false
 * active - star_date <= today && end_date >= today
 * pending - star_date > today
 * closed - end_date < today
 * @returns {JSX.Element}
 */
const SurveyCounts = () => {
    const counts = useSelector(state => state.SurveyCountReducer)

    return(
        <Row style={{border: "1px solid lightgrey", padding: "5px", borderRadius: "0 0 8px 8px", marginBottom: "10px"}}>
            <Col style={{textAlign: "center"}}>overall: {counts.overallSurveys}</Col>
            <Col style={{textAlign: "center"}}>active: 0</Col>
            <Col style={{textAlign: "center"}}>pending: 0</Col>
            <Col style={{textAlign: "center"}}>closed: 0</Col>
        </Row>
    )
}

export default SurveyCounts;