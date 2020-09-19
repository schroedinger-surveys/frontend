/**
 * Survey questions are sorted in ascending order based on the position property of each question
 * @param the freestyle and constrained questions, property that is used to sort and indicator used to differentiate the types
 * @returns {*[]} the sorted questions as property of new object, together with an property indicating the type of question - freestyle||constrained
 */
export const sortQuestions = (constrainedQuestions, freestyleQuestions, sortProperty = "position", typeIndicator = "options") => {
    const allQuestions = [...constrainedQuestions, ...freestyleQuestions];
    allQuestions.sort((a, b) => (a[`${sortProperty}`] > b[`${sortProperty}`] ) ? 1 : -1);  // Sort questions based on position property
    for (let i = 0; i < allQuestions.length; i++) {
        let temp = allQuestions[i];
        if (allQuestions[i].hasOwnProperty(typeIndicator)) {
            allQuestions[i] = {
                type: "constrained",
                question: temp,
                position: i
            }
        } else {
            allQuestions[i] = {
                type: "freestyle",
                question: temp,
                position: i
            }
        }
    }

    return allQuestions;
}