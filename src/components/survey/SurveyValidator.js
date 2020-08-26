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