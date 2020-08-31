/**
 * Converts a given unix timestamp into the date format: yyyy-mm-dd
 * scenario: used to set default date of date pickers in CreateSurvey
 * @param date as unix timestamp
 * @returns {string} of the given date
 */
const TimeConverter = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth()+1).padStart(2, "0"); // Add 1 because getMonth() starts counting the months at 0 (0-11)
    const year = String(date.getFullYear());
    return `${year}-${month}-${day}`;
}

const UnixToHumanTime = (date) => {
    const dateParts = date.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return new Date(Date.UTC(year, month, day)).getTime();
}

export {
    TimeConverter,
    UnixToHumanTime
};