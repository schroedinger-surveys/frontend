import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import log from "../../log/Logger";
import Message from "../utils/Message";
import SurveyValidator from "./SurveyValidator";
import {TimeConverter} from "../utils/TimeConverter";
import {sortQuestions} from "../utils/SortQuestions";
import SideMenu from "../menu/SideMenu";
import {BasicForm, fillDefaultOptionsArray} from "./form-utils";
import SurveyAPIHandler from "../../calls/survey";
import storageManager from "../../storage/StorageManager";
import AppNavbar from "../menu/AppNavbar";

const CreateSurvey = () => {
    const minimumOptionsAmount = 2; // At least two options must be given per constrained question
    /**
     * A List of all constrained and freestyle questions,
     * they are sent in separate arrays with the request to the api
     * but need to be in the order of creation,
     * the Index keeps track of the order as it is used to indicate the "position"
     */
    const [constrainedQuestions, setConstrainedQuestions] = useState([]);
    const [freestyleQuestions, setFreestyleQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);

    /**
     * Each constrained question must have options
     * they are temporarily saved in this array
     * which is reset when a constrainedQuestion is added/created
     * The object in this array a placeholders with no further meaning
     */
    const [constrainedOptions, setConstrainedOptions] = useState([]);
    const [optionsIndex, setOptionsIndex] = useState(minimumOptionsAmount);

    useEffect(() => {
        setConstrainedOptions(fillDefaultOptionsArray(minimumOptionsAmount));
    }, []);

    /**
     * ALl the Values (besides questions) needed to create a Survey
     * start_date: by default is the current day
     * end_date: by default 7 days after the current day
     * ...Text: used as placeholders for question Input field (reset to "" when question is added)
     */
    const [values, setValues] = useState({
        title: "",
        description: "",
        start_date: TimeConverter(new Date()),
        end_date: TimeConverter(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7)),
        constrainedQuestionText: "",
        freestyleQuestionText: ""
    });
    const {title, description, start_date, end_date, constrainedQuestionText, freestyleQuestionText} = values;

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    /**
     * Hide Message if it is visible when starting to change Input
     * Set the variables based on Input field value
     * @param name as is name of the variable/state (see above)
     * @returns {function(...[*]=)}
     */
    const handleInputChange = (name) => (event) => {
        setShowMessage(false);
        setValues({...values, [name]: event.target.value})
    }

    /**
     * Template for the ConstrainedQuestions Form
     * contains the Input Group for the question_text
     * and Input fields for the answer_options
     * @returns {JSX.Element}
     */
    const constrainedQuestion = () => {
        return (
            <div>
                <Form.Group controlId="constrainedQuestionForm">
                    <Form.Label>Constrained Question</Form.Label>
                    <Form.Control type="text" placeholder="Enter question" value={constrainedQuestionText}
                                  onChange={handleInputChange("constrainedQuestionText")}/>
                </Form.Group>
                <Row>
                    {constrainedOptions.map((option, i) => (
                        <Col xs={6} key={i}>
                            <Form.Group>
                                <Form.Label>Option {i + 1}</Form.Label>
                                <Form.Control type="text" placeholder="Enter option" className={"allOptions"}/>
                            </Form.Group>
                        </Col>
                    ))}
                </Row>
                <Button variant={"light"} onClick={addConstrainedOption}>Add option</Button>
            </div>
        )
    }

    /**
     * Adds another Input Field to the ConstrainedQuestion Form
     * by adding an object to the constrainedOptions array
     * and incrementing the optionsIndex
     */
    const addConstrainedOption = () => {
        const currentOptions = constrainedOptions;
        currentOptions.push({number: optionsIndex});
        setConstrainedOptions(currentOptions);
        setOptionsIndex(optionsIndex + 1)
    }

    /**
     * Adds a question based on the ConstrainedQuestions Form to the array of constrainedQuestions
     * If at least two options are given the question is added and a success message is shown
     * otherwise a warning is displayed
     */
    const addConstrainedQuestion = () => {
        const options = document.getElementsByClassName("allOptions"); // Get all Option Elements from the ConstrainedQuestion Form
        const optionValues = [];
        let position = 0; // In case an Input Field was left empty the index representing the position of the Option is incremented separately
        for (let i = 0; i < options.length; i++) {
            if (options[i].value !== "") { // Check that Input Field was not left empty
                optionValues.push({answer: options[i].value, position});
                position++; // Increment position marker
            }
        }

        if (optionValues.length >= minimumOptionsAmount) { // Two Options must be supplied
            const question = {question_text: constrainedQuestionText, position: questionIndex, options: optionValues}; // Build the Question according to API
            const currentQuestions = constrainedQuestions;
            currentQuestions.push(question);
            setConstrainedQuestions(currentQuestions);

            setQuestionIndex(questionIndex + 1); // Increment Index used to track creation order/position of all Questions (Freestyle and Constrained)
            setOptionsIndex(minimumOptionsAmount); // Set Options Index back to 2, which is default
            setConstrainedOptions(fillDefaultOptionsArray(minimumOptionsAmount)); // Refill the optionsArray with default objects

            /**
             * Clear the Input fields for the question and the options
             */
            setValues({...values, constrainedQuestionText: ""});
            for (let i = 0; i < minimumOptionsAmount; i++) {
                options[i].value = "";
            }
        } else {
            setShowMessage(true);
            setMessageType("warning");
            setMessageText("You must have at least TWO options!")
        }
    }

    /**
     * Form to create a freestyle question, that provides no sort of answer options
     * @returns {JSX.Element}
     */
    const freestyleQuestion = () => {
        return (
            <div>
                <Form.Group controlId="freestyleQuestionForm">
                    <Form.Label>Freestyle Question</Form.Label>
                    <Form.Control type="text" placeholder="Enter question" value={freestyleQuestionText}
                                  onChange={handleInputChange("freestyleQuestionText")}/>
                </Form.Group>
            </div>
        )
    }

    /**
     * Adds the Freestyle Question to the freestyleQuestions Array
     * Increments the Index, that tracks the creation order of all questions (freestyle and constrained)
     */
    const addFreestyleQuestion = () => {
        const question = {question_text: freestyleQuestionText, position: questionIndex};
        const currentQuestions = freestyleQuestions;
        currentQuestions.push(question);
        setFreestyleQuestions(currentQuestions);
        setQuestionIndex(questionIndex + 1);
        setValues({...values, freestyleQuestionText: ""});
    }

    /**
     * Left side of the page, to set the base information of the survey
     * Input Groups for: title, description, star and end_date, secured status
     * @returns {JSX.Element}
     */
    const basicDataFormInput = () => {
        const params = {
            title,
            description,
            start_date,
            end_date,
            handleInputChange
        }
        return (
            <Form>
                <BasicForm params={params}/>

                <Row>
                    <Col>
                        {constrainedQuestion()}
                        <Button variant="warning" onClick={addConstrainedQuestion}
                                style={{marginBottom: "15px", color: "white"}}>Add Constrained Question</Button>
                    </Col>
                    <Col>
                        {freestyleQuestion()}
                        <Button variant="warning" onClick={addFreestyleQuestion}
                                style={{marginBottom: "15px", color: "white"}}>Add Freestyle Question</Button>
                    </Col>
                </Row>

                <Form.Group>
                    <Form.Check id={"securedStatus"} type="checkbox" label="Make Survey Private"/>
                </Form.Group>

                <Button variant="success" type="submit" onClick={createNewSurvey}>
                    Create Survey
                </Button>
            </Form>
        )
    }

    const createNewSurvey = async (event) => {
        event.preventDefault();

        const securedInput = document.getElementById("securedStatus").checked;

        const validationResponse = SurveyValidator(title, description, start_date, end_date, constrainedQuestions, freestyleQuestions); // Validates Survey based on user input
        if (validationResponse.status) { // Indicates if Survey data is valid - true || false
            const apiResponse = await SurveyAPIHandler.surveyCreate(title, description, start_date, end_date, securedInput, constrainedQuestions, freestyleQuestions);
            if (apiResponse.status === 201) {
                setShowMessage(true);
                setMessageType("success");
                setMessageText("Survey was successfully created.");
                storageManager.clearSurveyCache();
            } else {
                setShowMessage(true);
                setMessageType("warning");
                setMessageText("Something went wrong. Please try again!");
                log.debug(apiResponse.log)
            }
        } else {
            setShowMessage(true);
            setMessageType("danger");
            setMessageText(validationResponse.message); // The error message supplied by the SurveyValidator
        }
    }

    const createSurveyComponent = () => {
        return (
            <div className={"create_survey_container"}>
                <div className={"create_survey_basic_input"}>
                    {basicDataFormInput()}
                    {showMessage && (
                        <Message message={messageText} type={messageType}/>
                    )}
                </div>

                <div className={"create_survey_question_input"}>
                    <div className={"create_survey_preview"}>
                        {   title === "" &&
                            <p className={"title_preview"}>Preview:</p>}
                        <h2>{title}</h2>
                        { description !== "" &&
                            <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                                <label style={{fontWeight: "bold"}}>Description:</label>
                                <p>{description}</p>
                            </div>
                        }
                        {sortQuestions(constrainedQuestions, freestyleQuestions).map((item, i) => {
                            if (item.type === "constrained") {
                                return (
                                    <div key={i} style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                                        <Form.Group id={`${i}answer`}>
                                            <Form.Label
                                                style={{fontWeight: "bold"}}>{item.question.position + 1}. {item.question.question_text}</Form.Label>
                                            {item.question.options.map((option, j) => (
                                                <Form.Check
                                                    key={j}
                                                    type="radio"
                                                    label={option.answer}
                                                    name={`answerOptionToQuestion${i}`}
                                                />
                                            ))}
                                        </Form.Group>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={i} style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                                        <Form.Group>
                                            <Form.Label
                                                style={{fontWeight: "bold"}}>{item.question.position + 1}. {item.question.question_text}</Form.Label>
                                            <Form.Control id={`${i}answer`} type="text" placeholder="Your Answer..."/>
                                        </Form.Group>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={"app_wrapper"}>
            <AppNavbar/>
            <SideMenu/>
            <div id={"app_page_body"}>
                {createSurveyComponent()}
            </div>
        </div>
    )
}

export default CreateSurvey;

/**
 <Row>
 {sortQuestions(constrainedQuestions, freestyleQuestions).map((item, i) => {
                            if (item.question.hasOwnProperty("options")) {
                                return (
                                    <div key={i} style={{
                                        width: "100%",
                                        border: "1px solid lightgrey",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        margin: "0 15px"
                                    }}>
                                        <label>Question {i + 1}: <span
                                            style={{fontWeight: "bold"}}>{item.question.question_text}</span></label>
                                        <ul>
                                            {item.question.options.map((option, j) => (
                                                <li key={j}>{option.answer}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={i} style={{
                                        width: "100%",
                                        border: "1px solid lightgrey",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        margin: "0 15px"
                                    }}>
                                        <label>Question {i + 1}: <span
                                            style={{fontWeight: "bold"}}>{item.question.question_text}</span></label>
                                    </div>
                                )
                            }
                        })}
 </Row>
 **/
