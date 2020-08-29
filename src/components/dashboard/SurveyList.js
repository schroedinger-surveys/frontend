import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {ListGroup} from "react-bootstrap";
import {setSurveySpotlight} from "../../redux/actions/SurveySpotlight";
import {getPrivateSurveys, getPublicSurveys} from "../utils/GetSurveys";
import {setPrivateSurveys, setPublicSurveys} from "../../redux/actions/SurveyList";

const SurveyList = (props) => {
    const [pagination, setPagination] = useState({
        pageCountPrivate: 0,
        pageCountPublic: 0,
        itemsPerPage: 3
    });
    const {pageCountPrivate, pageCountPublic, itemsPerPage} = pagination;

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
            props.setPrivateSurveys(surveys);
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
        <div style={{width: "100%"}}>
            <br/>
            <h4>Private Surveys - {props.counts.privateCount}</h4>
            {props.counts.privateCount && privatePagination()}
            <ListGroup>
                {
                    props.surveys.privateSurveys.map((survey, i) => (
                        <ListGroup.Item style={{cursor: "pointer"}} onClick={() => props.setSurveySpotlight(survey)} key={i}>{survey.title} -
                            status: {getCurrentStatus(survey.start_date, survey.end_date)} - {survey.secured === true ? "private" : "public"}</ListGroup.Item>
                    ))
                }
            </ListGroup>
            <br/>
            <h4>Public Surveys - {props.counts.publicCount}</h4>
            {props.counts.publicCount > itemsPerPage && publicPagination()}
            <ListGroup>
                {
                    props.surveys.publicSurveys.map((survey, i) => (
                        <ListGroup.Item style={{cursor: "pointer"}}  onClick={() => props.setSurveySpotlight(survey)} key={i}>{survey.title} -
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

export default connect(mapStateToProps, {setSurveySpotlight, setPrivateSurveys, setPublicSurveys})(SurveyList);