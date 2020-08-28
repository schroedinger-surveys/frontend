import React from "react";
import {connect} from "react-redux";
import {ListGroup} from "react-bootstrap";
import {setSurveySpotlight} from "../../redux/actions/SurveySpotlight";

const SurveyList = (props) => {

    const getCurrentStatus = (start_date, end_date) => {
        const today = Date.now();
        const startDate = new Date(start_date).getTime();
        const endDate = new Date(end_date).getTime();
        if (startDate > today) {
            return "pending"
        } else if (endDate < today) {
            return "closed"
        } else if (startDate <= today && endDate >= today) {
            return "active"
        }

    }

    return (
        <div style={{width: "100%"}}>
            <br/>
            <h4>Private Surveys - {props.counts.privateCount}</h4>
            <ListGroup>
                {
                    props.surveys.privateSurveys.map((survey, i) => (
                        <ListGroup.Item onClick={() => props.setSurveySpotlight(survey)} key={i}>{survey.title} -
                            status: {getCurrentStatus(survey.start_date, survey.end_date)} - {survey.secured === true ? "private" : "public"}</ListGroup.Item>
                    ))
                }
            </ListGroup>
            <br/>
            <h4>Public Surveys - {props.counts.publicCount}</h4>
            <ListGroup>
                {
                    props.surveys.publicSurveys.map((survey, i) => (
                        <ListGroup.Item onClick={() => props.setSurveySpotlight(survey)} key={i}>{survey.title} -
                            status: {getCurrentStatus(survey.start_date, survey.end_date)} - {survey.secured === true ? "private" : "public"}</ListGroup.Item>
                    ))
                }
            </ListGroup>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        counts: state.surveyCounts,
        surveys: state.surveyLists
    }
}

export default connect(mapStateToProps, {setSurveySpotlight})(SurveyList);