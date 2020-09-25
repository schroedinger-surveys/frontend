import React from "react";

export const getCurrentStatus = (start_date, end_date) => {
    const today = Date.now();
    const startDate = new Date(start_date).getTime();
    const endDate = new Date(end_date).getTime();
    if (startDate > today) {
        return <span style={{color: "orange"}}>p</span>
    } else if (endDate < today) {
        return <span style={{color: "darkred"}}>c</span>
    } else if (startDate <= today && endDate >= today) {
        return <span style={{color: "darkgreen"}}>a</span>
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