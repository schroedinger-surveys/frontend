import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Form} from "react-bootstrap";
import {setSurveySpotlight} from "../../redux/actions/SurveySpotlight";
import {setPrivateSurveys, setPublicSurveys} from "../../redux/actions/SurveyList";
import {getCurrentStatus} from "../utils/SurveyStatus";
import SurveyAPIHandler from "../../calls/survey";

const SurveyList = (props) => {
    const [pagination, setPagination] = useState({
        pageCountPrivate: 0,
        pageCountPublic: 0,
        itemsPerPage: 3
    });
    const {pageCountPrivate, pageCountPublic, itemsPerPage} = pagination;

    const [filter, setFilter] = useState("all");
    const [filterCount, setFilterCount] = useState(props.counts.overallSurveys);
    const [filterSurveys, setFilterSurveys] = useState([...props.surveys.privateSurveys, ...props.surveys.publicSurveys]);

    useEffect(()=> {
        const filterSelect = document.getElementById("survey_filter");
        if(filterSelect !== null){
            filterSelect.addEventListener("change", () => {setFilter(filterSelect.value)})
        }
    });

    useEffect(() => {
        fetchSurveys()
    }, [filter]);

    const fetchSurveys = () =>{

    }

    const surveyPagination = () => {
        const changePage = async(index) => {
            await fetchSurveys(index);
        }

        let li = []
        for (let i = 0; i < filterCount; i++) {
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
        <div className={"survey_list"}>
            <div className={"survey_list-header"}>
                <h1 className={"survey_list-title"}>Overview</h1>
                <Form className={"survey_list-select"}>
                    <Form.Group controlId="survey_filter">
                        <Form.Control as="select">
                            <option value={"all"}>all</option>
                            <option value={"active"}>active</option>
                            <option value={"pending"}>pending</option>
                            <option value={"closed"}>closed</option>
                            <option value={"private"}>private</option>
                            <option value={"public"}>public</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            <div className={"survey_list-surveys"}>
                list
            </div>
            <div className={"survey_list-pagination"}>
                {surveyPagination()}
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


/**
 <div style={{width: "100%", border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
 <div>
 <h5>Private Surveys - {props.counts.privateCount}</h5>
 {props.counts.privateCount > itemsPerPage && privatePagination()}
 <ListGroup>
 {
                        props.surveys.privateSurveys.map((survey, i) => (
                            <ListGroup.Item style={{cursor: "pointer", borderColor: "#065535"}} onClick={() => props.setSurveySpotlight(survey)} key={i}>{survey.title} -
                                status: {getCurrentStatus(survey.start_date, survey.end_date)}
                            </ListGroup.Item>
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
 **/