import React from "react";

export const getCurrentStatus = (start_date, end_date) => {
    const today = Date.now();
    const startDate = new Date(start_date).getTime();
    const endDate = new Date(end_date).getTime();
    if (startDate > today) {
        return <span style={{color: "orange"}}>pending</span>
    } else if (endDate < today) {
        return <span style={{color: "darkred"}}>closed</span>
    } else if (startDate <= today && endDate >= today) {
        return <span style={{color: "darkgreen"}}>active</span>
    }
}