/**
 * Converts a given unix timestamp into the date format: yyyy-mm-dd
 * scenario: used to set default date of date pickers in CreateSurvey
 * @param date as unix timestamp
 * @returns {string} of the given date
 */
const TimeConverter = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth()).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${year}-${month}-${day}`;
}

export default TimeConverter;