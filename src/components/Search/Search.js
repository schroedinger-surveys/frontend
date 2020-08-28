import React, {useEffect} from "react";
import {useSelector} from "react-redux";

import log from "../../log/Logger";

const Search = () => {
    const surveys = useSelector(state => state.SurveyListReducer);

    useEffect(() => {
        log.debug("Search",surveys.privateSurveys);
        log.debug("Search",surveys.publicSurveys);
    }, []);

    return(
        <div>
            <h1>Hello this is: SEARCH</h1>
        </div>
    )
}

export default Search;