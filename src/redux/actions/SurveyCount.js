const setOverallCount = (count) => {
    return{
        type: "SET_OVERALL_COUNT",
        payload: count
    };
}

export {
    setOverallCount
}