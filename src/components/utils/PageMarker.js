import React from "react";

export const createPaginationMarker = (pages, clickMethod) => {
    let start = 0;

    let li = [];
    for (let i = 0; i < pages; i++) {
        li.push(<li key={i} className={"pagination_list_li"}
                    onClick={() => clickMethod(i)}>{i + 1}</li>)
    }

    if (pages > 3) {
        const prevLi = <li key={"prevLi"} className={"pagination_list_li"}
                           onClick={() => {
                               console.log("<<",start, pages);
                               if (start >= 1) start--
                           }}>{"<<"}</li>
        const nextLi = <li key={"nextLi"} className={"pagination_list_li"}
                           onClick={() => {
                               console.log(">>",start, pages);
                               if (start+3 < pages) start++
                           }}>{">>"}</li>
        li = [prevLi, ...li.splice(start, start+3), nextLi];
    }

    return (
            <ul className={"pagination_list_ul"}>
                {li}
            </ul>
    )
}
