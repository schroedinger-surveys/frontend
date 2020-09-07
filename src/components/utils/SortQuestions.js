/**
 * Survey questions are sorted in ascending order based on the position property of each question
 * @param survey, containing the freestyle and constrained questions
 * @returns {*[]} the sorted questions as property of new object, together with an property indicating the type of question - freestyle||constrained
 */
export const sortQuestions = (constrainedQuestions, freestyleQuestions) => {
    const allQuestions = [...constrainedQuestions, ...freestyleQuestions];
    allQuestions.sort((a, b) => (a.position > b.position) ? 1 : -1);  // Sort questions based on position property
    for (let i = 0; i < allQuestions.length; i++) {
        let temp = allQuestions[i];
        if (allQuestions[i].hasOwnProperty("options")) {
            allQuestions[i] = {
                type: "constrained",
                question: temp
            }
        } else {
            allQuestions[i] = {
                type: "freestyle",
                question: temp
            }
        }
    }

    return allQuestions;
}