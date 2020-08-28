import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import {connect} from "react-redux";

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
const SurveyCounts = (props) => {

    return(
        <Row style={{border: "1px solid lightgrey", padding: "5px", borderRadius: "0 0 8px 8px", marginBottom: "10px"}}>
            <Col style={{textAlign: "center"}}>overall: {props.counts.overallSurveys}</Col>
            <Col style={{textAlign: "center"}}>active: {props.counts.activeCount}</Col>
            <Col style={{textAlign: "center"}}>pending: {props.counts.pendingCount}</Col>
            <Col style={{textAlign: "center"}}>closed: {props.counts.closedCount}</Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
    return {counts: state.surveyCounts}
}

export default connect(mapStateToProps)(SurveyCounts);