import React, {useEffect, useState} from "react";
import {sortQuestions} from "../utils/SortQuestions";
import SubmissionAPIHandler from "../../calls/submission";
import {createPaginationMarker} from "../utils/PageMarker";
import {EuropeanTime} from "../utils/TimeConverter";
import logFactory from "../../utils/Logger";
const log = logFactory("src/components/submissions/SubmissionSpotlight.js");


/**
 * Shows all submissions belonging to a survey
 * Each submission can be looked at individually
 * @param props - survey and submissionCount
 * @returns {JSX.Element}
 * @constructor
 */
const SubmissionSpotlight = (props) => {
    const {survey} = props;
    const {submissionCount} = props;
    const itemsPerPage = 5;

    const [submissions, setSubmissions] = useState([]);
    const [spotlight, setSpotlight] = useState({});

    const [renamed, setRenamed] = useState(false);
    const [constrainedOptions, setConstrainedOptions] = useState(new Map());

    useEffect(() => {
        if(survey !== undefined){
            getSubmissions();
            setupConstrainedQuestionOptions()
        }
    }, [props])

    /**
     *  Fetch the submissions from api - DO NOT CACHE it needs to be fetched for each survey individually
     *  fetches only if survey was correctly passed trough props
     **/
    const getSubmissions = async (pageNumber = 0) => {
        // eslint-disable-next-line no-undefined
        if (survey !== undefined) {
            const apiResponse = await SubmissionAPIHandler.submissionGet(survey.id, pageNumber, itemsPerPage)
            setSubmissions(apiResponse.data);
        }
    }

    /**
     * Creates a Map,
     * mapping the positions of the question in the survey to the answer options Map(2 => [y, n]);
     * scenario: shown behind chosen answer of user
     **/
    const setupConstrainedQuestionOptions = () => {
        if(survey !== undefined){
            let sortedConstrainedQuestions = new Map();
            try{
                for (let i = 0; i < survey.constrained_questions.length; i++) {
                    sortedConstrainedQuestions.set(survey.constrained_questions[i].position, survey.constrained_questions[i].options)
                }
            } catch (e) {
                log.error(e);
            }

            setConstrainedOptions(sortedConstrainedQuestions);
        }
    }

    /**
     * Renames some of the properties of the fetched submission json file
     * for easier use with util functions like sortQuestions
     **/
    const renameSubmissionProperties = (submission) => {
        for (let i = 0; i < submission.constrained_answers.length; i++) {
            submission.constrained_answers[i].question_text = submission.constrained_answers[i].constrained_question_question_text;
            submission.constrained_answers[i].position = submission.constrained_answers[i].constrained_question_position;
            submission.constrained_answers[i].answer = submission.constrained_answers[i].constrained_question_chose_option;
        }
        for (let i = 0; i < submission.freestyle_answers.length; i++) {
            submission.freestyle_answers[i].question_text = submission.freestyle_answers[i].freestyle_question_question_text;
            submission.freestyle_answers[i].position = submission.freestyle_answers[i].freestyle_question_position;
            submission.freestyle_answers[i].answer = submission.freestyle_answers[i].freestyle_question_answer;
        }
    }

    /**
     * If user clicks on submission from list of submissions the Spotlight is reset
     * the submissions properties are renamed and the boolean flag for Rename is set, ending the loading
     **/
    const changeSubmission = async (submission) => {
        await renameSubmissionProperties(submission);
        setSpotlight(submission);
        setRenamed(true);
    }

    /**
     * The Options belonging to an constrained question are returned as a string
     * it uses the Map constrainedOptions, created and mapped in setupConstrainedQuestionOptions
     * scenario: behind the chosen answer these are shown as a overview
     **/
    const showOptions = (key) => {
        const options = constrainedOptions.get(key);
        if(options !== undefined){
            let optionValues = [];
            for (let i = 0; i < options.length; i++) {
                optionValues.push(options[i].answer);
            }
            return "(" + optionValues.join(", ") + ")";
        } else {
            return "";
        }

    }

    /**
     * Creates the Pagination for the list of submissions
     * calls createPaginationMarker
     * returns the JSX element resulting from createPaginationMarker
     * gives the callback function changePage as onClick function
     * changePage fetches the submissions based on the index (number of pagination marker) used as page_number in fetch call
     **/
    const submissionPagination = () => {
        const changePage = async (index) => {
            await getSubmissions(index);
        }

        const pages = Math.ceil(submissionCount / itemsPerPage);
        return createPaginationMarker(pages, changePage);
    }

    return (
        <div>
            {/* eslint-disable-next-line no-undefined */}
            {survey !== undefined && (
                <div className={"submission_spotlight_sub_list"}>
                    <h3 className={"sub_spotlight_section_title"}>Submissions (newest first)</h3>
                    {submissionCount > itemsPerPage && submissionPagination()}
                    <ul className={"submissions_list_ul"}>
                        {submissions.map((submission, i) => (
                            <li key={i} className={"submission_spotlight_list_items"} onClick={() => {
                                changeSubmission(submission)
                            }}>{EuropeanTime(submission.created.substr(0, 10))}</li>
                        ))}
                    </ul>
                </div>
            )}
            <hr/>
            {survey !== undefined && (
                <div className={"submission_spotlight_selected_sub"}>
                    {renamed &&
                    sortQuestions(
                        spotlight.constrained_answers,
                        spotlight.freestyle_answers,
                        "position",
                        "constrained_questions_option_id").map((item, i) => (
                        <div key={i} style={{
                            border: "1px solid lightgrey",
                            borderRadius: "8px",
                            padding: "5px",
                            marginBottom: "5px"
                        }}>
                            <p><span
                                style={{fontWeight: "bold"}}>Question {item.question.position + 1}:</span> {item.question.question_text}
                            </p>
                            <p style={{fontSize: "12px"}}>
                                <span style={{fontWeight: "bold", fontSize: "16px"}}>Answer:</span> <span
                                style={{fontSize: "16px"}}>{item.question.answer}</span> {item.type === "constrained" ? showOptions(item.question.position) : ""}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SubmissionSpotlight;