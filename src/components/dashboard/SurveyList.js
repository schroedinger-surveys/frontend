import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Form} from "react-bootstrap";
import {setSurveySpotlight} from "../../redux/actions/SurveySpotlight";
import {setPrivateSurveys, setPublicSurveys} from "../../redux/actions/SurveyList";
import {getCurrentStatus} from "../utils/SurveyStatus";
import SurveyAPIHandler from "../../calls/survey";
import {createPaginationMarker} from "../utils/PageMarker";

const SurveyList = (props) => {
    const itemsPerPage = 2;

    const [filter, setFilter] = useState("all");
    const [filterCount, setFilterCount] = useState(props.counts.overallSurveys || 0);
    const [filterSurveys, setFilterSurveys] = useState([]);

    useEffect(() => {
        const filterSelect = document.getElementById("survey_filter");
        if (filterSelect !== null) {
            filterSelect.addEventListener("change", () => {
                setFilter(filterSelect.value)
            })
        }
    });

    useEffect(() => {
        fetchSurveys(0, false)
    }, [filter]);

    const fetchSurveys = async(index, pagination = false) => {
        if (filter === "private"){
            setFilterCount(props.counts.privateSurveys);
            const privateSurveys = pagination ? await SurveyAPIHandler.surveyPrivateGet(index, itemsPerPage) : await SurveyAPIHandler.cacheMiddleware(() => SurveyAPIHandler.surveyPrivateGet(index, itemsPerPage), "privateSurveys");
            setFilterSurveys(privateSurveys);
        }else if (filter === "public"){
            setFilterCount(props.counts.publicSurveys);
            const publicSurveys = pagination ? await SurveyAPIHandler.surveyPublicGet(index, itemsPerPage) : await SurveyAPIHandler.cacheMiddleware(() => SurveyAPIHandler.surveyPublicGet(index, itemsPerPage), "publicSurveys");
            setFilterSurveys(publicSurveys);
        } else if (filter === "all"){
            const privateSurveys = pagination ? await SurveyAPIHandler.surveyPrivateGet(index, 2) : await SurveyAPIHandler.cacheMiddleware(() => SurveyAPIHandler.surveyPrivateGet(index, 2), "privateSurveys");
            const publicSurveys = pagination ? await SurveyAPIHandler.surveyPublicGet(index, 2) : await SurveyAPIHandler.cacheMiddleware(() => SurveyAPIHandler.surveyPublicGet(index, 2), "publicSurveys");
            setFilterCount(props.counts.overallSurveys);
            setFilterSurveys([...privateSurveys, ...publicSurveys])
        }
    }

    const surveyPagination = () => {
        const changePage = async (index) => {
            await fetchSurveys(index, true);
        }

        const pages = filterCount / (itemsPerPage*2);
        return createPaginationMarker(pages, changePage);
    }

    return (
        <div className={"survey_list"}>
            <div className={"survey_list-header"}>
                <h1 className={"survey_list-title"}>Overview</h1>
                <Form className={"survey_list-select"}>
                    <Form.Group controlId="survey_filter">
                        <Form.Control as="select">
                            <option value={"all"}>all</option>
                            <option value={"private"}>private</option>
                            <option value={"public"}>public</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            <div className={"survey_list-surveys"}>
                {
                    filterSurveys.map((survey, i) => (
                        <div key={i} className={"surveys_list_group"} onClick={() => props.setSurveySpotlight(survey)}>
                            <div className={"surveys_list_items list_item-secure"}>
                                {survey.secured ?
                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                         className="bi bi-lock survey_list-status list_item-box"
                                         fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                              d="M11.5 8h-7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zm-7-1a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7zm0-3a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z"/>
                                    </svg> :
                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                         className="bi bi-globe survey_list-status"
                                         fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4H2.255a7.025 7.025 0 0 1 3.072-2.472 6.7 6.7 0 0 0-.597.933c-.247.464-.462.98-.64 1.539zm-.582 3.5h-2.49c.062-.89.291-1.733.656-2.5H3.82a13.652 13.652 0 0 0-.312 2.5zM4.847 5H7.5v2.5H4.51A12.5 12.5 0 0 1 4.846 5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5H7.5V11H4.847a12.5 12.5 0 0 1-.338-2.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12H7.5v2.923c-.67-.204-1.335-.82-1.887-1.855A7.97 7.97 0 0 1 5.145 12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11H1.674a6.958 6.958 0 0 1-.656-2.5h2.49c.03.877.138 1.718.312 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12h2.355a7.967 7.967 0 0 1-.468 1.068c-.552 1.035-1.218 1.65-1.887 1.855V12zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5h-2.49A13.65 13.65 0 0 0 12.18 5h2.146c.365.767.594 1.61.656 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"/>
                                    </svg>
                                }
                            </div>
                            <div className={"surveys_list_items list_item-title"}>
                                <p className={"survey_title_text"}>{survey.title}</p></div>
                            <div className={"surveys_list_items list_item-status"}>{getCurrentStatus(survey.start_date, survey.end_date)}</div>
                        </div>
                    ))
                }
            </div>
            <div className={"survey_list-pagination"}>
                {filterCount > itemsPerPage && surveyPagination()}
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
