const setOverallCount = (count) => {
    return{
        type: "SET_OVERALL_COUNT",
        payload: count
    };
}

const setPrivateCount = (count) => {
    return{
        type: "SET_PRIVATE_COUNT",
        payload: count
    }
}

const setPublicCount = (count) => {
    return{
        type: "SET_PUBLIC_COUNT",
        payload: count
    }
}

const setActiveCount = (count) => {
    return{
        type: "SET_ACTIVE_COUNT",
        payload: count
    }
}

const setPendingCount = (count) => {
    return{
        type: "SET_PENDING_COUNT",
        payload: count
    }
}

const setClosedCount = (count) => {
    return{
        type: "SET_CLOSED_COUNT",
        payload: count
    }
}

export {
    setOverallCount,
    setPrivateCount,
    setPublicCount,
    setActiveCount,
    setPendingCount,
    setClosedCount
}