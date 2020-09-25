import React, {useEffect, useState} from "react";
import {connect} from "react-redux";

import RawSurvey from "./RawSurvey";
import ShareLinks from "./ShareLinks";
import Submissions from "./Submissions";
import NoSubmissions from "./NoSubmissions";
import {Redirect} from "react-router-dom";
import {getSurveyStatus} from "../../utils/SurveyStatus";
import SubmissionAPIHandler from "../../../calls/submission";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const SurveySpotlight = (props) => {
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [showRawSurvey, setShowRawSurvey] = useState(false);
    const [showLinks, setShowLinks] = useState(true);
    const [submissionCount, setSubmissionCount] = useState(0);

    const [redirect, setRedirect] = useState(false);

    const [fetchedCount, setFetchedCount] = useState(false);

    const manageVisibility = (name) => {
        if (name === "raw") {
            setShowRawSurvey(true);
            setShowSubmissions(false);
            setShowLinks(false);
        } else if (name === "submissions") {
            setShowSubmissions(true);
            setShowLinks(false);
            setShowRawSurvey(false);
        } else if (name === "links") {
            setShowLinks(true);
            setShowSubmissions(false);
            setShowRawSurvey(false);
        }
    }

    const getSubmissionCount = async () => {
        if (props.selectedSurvey) {
            const apiResponse = await SubmissionAPIHandler.cacheMiddleware(() => SubmissionAPIHandler.submissionCount(props.selectedSurvey.id), "submissions", props.selectedSurvey.id);
            setSubmissionCount(apiResponse);
            setFetchedCount(true);
        }
    }

    const redirectSurveyEdit = () => {
        return (
            <Redirect to={{
                pathname: "/survey/edit/" + props.selectedSurvey.id,
                state: {
                    survey: props.selectedSurvey
                }
            }}/>
        )
    }

    useEffect(() => {
        setSubmissionCount(""); // So that the count does not flip from old to new number
        getSubmissionCount()
    }, [props.selectedSurvey])

    return (
        <div className={"survey_spotlight_container"}>
            {redirect && redirectSurveyEdit()}
            <Tabs className={"survey_spotlight_tab-list"} defaultActiveKey="info" transition={false}
                  id="noanim-tab-example">

                <Tab className={"survey_spotlight_tab-item"} eventKey="info" title="Info">
                    <RawSurvey/>
                </Tab>

                <Tab className={"survey_spotlight_tab-item"} eventKey="profile"
                     title={`Submissions ${submissionCount >= 100 ? "99+" : submissionCount}`}>
                    {submissionCount >= 1 ? <Submissions/> : <NoSubmissions/>}
                </Tab>

                <Tab className={"survey_spotlight_tab-item"} eventKey="links" title="Share-Links">
                    <ShareLinks/>
                </Tab>

                {(getSurveyStatus(props.selectedSurvey.start_date, props.selectedSurvey.end_date) === "pending" ||
                    (getSurveyStatus(props.selectedSurvey.start_date, props.selectedSurvey.end_date) === "active" && submissionCount === 0)) &&
                <Tab className={"survey_spotlight_tab-item"} eventKey="edit" title={
                    <a style={{
                }} onClick={() => setRedirect(true)}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                    Edit Survey
                </a>
                }>
                </Tab>
                }
            </Tabs>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedSurvey: state.selectedSpotlight
    }
}

export default connect(mapStateToProps)(SurveySpotlight);