import React from "react";
export const createPaginationMarker = (pages, clickMethod) => {
    let li = [];
    for (let i = 0; i < pages; i++) {
        li.push(<li key={i} className={"pagination_list_li"}
                    onClick={() => clickMethod(i)}>{i + 1}</li>)
    }


    return (
        <div style={{width: "100%"}}>
            <ul className={"pagination_list_ul"}>
                {li}
            </ul>
        </div>
    )
}
