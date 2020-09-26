import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export const getCurrentStatus = (start_date, end_date) => {
    const renderTooltipPending = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            pending
        </Tooltip>
    );
    const renderTooltipClosed = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            closed
        </Tooltip>
    );
    const renderTooltipActive = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            active
        </Tooltip>
    );

    const today = Date.now();
    const startDate = new Date(start_date).getTime();
    const endDate = new Date(end_date).getTime();
    if (startDate > today) {
        return <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipPending}
        >
            <span style={{color: "orange"}}>p</span>
        </OverlayTrigger>
    } else if (endDate < today) {
        return <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipClosed}
        >
            <span style={{color: "darkredgit "}}>c</span>
        </OverlayTrigger>
    } else if (startDate <= today && endDate >= today) {
        return <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipActive}
        >
            <span style={{color: "darkgreen"}}>a</span>
        </OverlayTrigger>
    }
}

export const getSurveyStatus = (start_date, end_date) => {
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
