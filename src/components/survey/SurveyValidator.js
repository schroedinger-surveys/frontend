/**
 * Validates the user input from CreateSurvey
 * checks if:
 *  title and description are not empty
 *  at least one question was supplied
 *  the start and end_date are valid (start >= today && start < end)
 * @param title
 * @param description
 * @param start_date
 * @param end_date
 * @param constrainedQuestions
 * @param freestyleQuestions
 * @returns {[boolean, string]} if input is valid, success/error message
 */
const SurveyValidator = (title, description, start_date, end_date, constrainedQuestions, freestyleQuestions) => {
    if (DateValidation(start_date, end_date)) {
        if (title === "" || description === "") {
            return [false, "Title and Description can not be empty"];
        } else if ((constrainedQuestions.length + freestyleQuestions.length) < 1) {
            return [false, "Add at least ONE question"];
        } else {
            return [true, "Survey is valid, we'll try to create it for you now"];
        }
    } else {
        return [false, "Start day should not be in past and must be before end date"];
    }
}
export default SurveyValidator;

/**
 * Checks if start and end_date are valid (start >= today && start < end)
 * @param start_date
 * @param end_date
 * @returns {boolean|boolean}
 */
const DateValidation = (start_date, end_date) => {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const start = String(start_date).split("-");
    const startDay = Number(start[2]);
    const startMonth = Number(start[1]);
    const startYear = Number(start[0]);

    const end = String(end_date).split("-");
    const endDay = Number(end[2]);
    const endMonth = Number(end[1]);
    const endYear = Number(end[0]);

    return ((startDay >= currentDay && startYear >= currentYear && startMonth >= currentMonth) || (startYear > currentYear)) &&
        ((startYear < endYear) || (startYear === endYear && startMonth < endMonth) || (startYear === endYear && startMonth === endMonth && startDay < endDay));
}