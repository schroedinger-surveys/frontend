import * as types from "../types/SurveyCount";

const setOverallCount = (count) => dispatch => {
    dispatch({
        type: types.SET_OVERALL_COUNT,
        payload: count
    });
}

const setPrivateCount = (count) => dispatch => {
    dispatch({
        type: types.SET_PRIVATE_COUNT,
        payload: count
    })
}

const setPublicCount = (count) => dispatch => {
    dispatch({
        type: types.SET_PUBLIC_COUNT,
        payload: count
    })
}

const setActiveCount = (count) => dispatch => {
    dispatch({
        type: types.SET_ACTIVE_COUNT,
        payload: count
    })
}

const setPendingCount = (count) => dispatch => {
    dispatch({
        type: types.SET_PENDING_COUNT,
        payload: count
    })
}

const setClosedCount = (count) => dispatch => {
    dispatch({
        type: types.SET_CLOSED_COUNT,
        payload: count
    })
}

export {
    setActiveCount,
    setClosedCount,
    setOverallCount,
    setPendingCount,
    setPrivateCount,
    setPublicCount
}