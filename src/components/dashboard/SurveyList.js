import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {ListGroup} from "react-bootstrap";
import {setSurveySpotlight} from "../../redux/actions/SurveySpotlight";
import {getPrivateSurveys, getPublicSurveys} from "../utils/GetSurveys";
import {setPrivateSurveys, setPublicSurveys} from "../../redux/actions/SurveyList";
import {getCurrentStatus} from "../utils/SurveyStatus";

const SurveyList = (props) => {
    const [pagination, setPagination] = useState({
        pageCountPrivate: 0,
        pageCountPublic: 0,
        itemsPerPage: 3
    });
    const {pageCountPrivate, pageCountPublic, itemsPerPage} = pagination;

    const privatePagination = () => {
        const changePage = async (index) => {
            const surveys = await getPrivateSurveys(index)
            props.setPrivateSurveys(surveys);
        }

        let li = []
        for (let i = 0; i < pageCountPrivate; i++) {
            li.push(<li key={i} style={{display: "inline", marginRight: "10px", cursor: "pointer"}} onClick={() => changePage(i)}>{i+1}</li>)
        }

        return (
            <div style={{ width: "100%"}}>
                <ul style={{listStyle: "none"}}>
                    {li}
                </ul>
            </div>
        )
    }

    const publicPagination = () => {
        const changePage = async(index) => {
            const surveys = await getPublicSurveys(index)
            props.setPublicSurveys(surveys);
        }

        let li = []
        for (let i = 0; i < pageCountPublic; i++) {
            li.push(<li key={i} style={{display: "inline", marginRight: "10px", cursor: "pointer"}} onClick={() => changePage(i)}>{i+1}</li>)
        }

        return (
            <div style={{ width: "100%"}}>
                <ul style={{listStyle: "none"}}>
                    {li}
                </ul>
            </div>
        )
    }

    useEffect(() => {
        setPagination({
            ...pagination,
            pageCountPrivate: (Math.ceil(props.counts.privateCount / itemsPerPage)),
            pageCountPublic: (Math.ceil(props.counts.publicCount / itemsPerPage))
        });
    }, [])

    return (
        <div style={{width: "100%", border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
            <div>
                <h5>Private Surveys - {props.counts.privateCount}</h5>
                {props.counts.privateCount > itemsPerPage && privatePagination()}
                <ListGroup>
                    {
                        props.surveys.privateSurveys.map((survey, i) => (
                            <ListGroup.Item style={{cursor: "pointer", borderColor: "#065535"}} onClick={() => props.setSurveySpotlight(survey)} key={i}>{survey.title} -
                                status: {getCurrentStatus(survey.start_date, survey.end_date)}</ListGroup.Item>
                        ))
                    }
                </ListGroup>
            </div>
            <hr/>
            <div>
                <h5>Public Surveys - {props.counts.publicCount}</h5>
                {props.counts.publicCount > itemsPerPage && publicPagination()}
                <ListGroup>
                    {
                        props.surveys.publicSurveys.map((survey, i) => (
                            <ListGroup.Item style={{cursor: "pointer", borderColor: "#065535"}}  onClick={() => props.setSurveySpotlight(survey)} key={i}>{survey.title} -
                                status: {getCurrentStatus(survey.start_date, survey.end_date)} </ListGroup.Item>
                        ))
                    }
                </ListGroup>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        counts: state.surveyCounts,
        surveys: state.surveyLists
    }
}

export default connect(mapStateToProps, {setSurveySpotlight, setPrivateSurveys, setPublicSurveys})(SurveyList);