import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const SurveyCounts = () => {
    return(
        <Row>
            <Col>
                <Row>surveys overall:</Row>
                <Row>12</Row>
            </Col>
            <Col>
                <Row>active surveys:</Row>
                <Row>8</Row>
            </Col>
            <Col>
                <Row>pending surveys:</Row>
                <Row>3</Row>
            </Col>
            <Col>
                <Row>closed surveys:</Row>
                <Row>1</Row>
            </Col>
        </Row>
    )
}