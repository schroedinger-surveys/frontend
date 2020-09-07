import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Message from "../utils/Message";
import SurveyValidator from "./SurveyValidator";
import storageManager from "../../storage/LocalStorageManager";
import {TimeConverter} from "../utils/TimeConverter";
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

    const fillDefaultOptionsArray = () => {
        const defaultOptions = [];
        for (let i = 0; i < minimumOptionsAmount; i++){
            defaultOptions.push({index: i})
        }
        setConstrainedOptions(defaultOptions);
    }

    useEffect(() => {
        fillDefaultOptionsArray();
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
        end_date: TimeConverter(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() +7)),
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
            <Form>
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
            </Form>
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
            fillDefaultOptionsArray(); // Refill the optionsArray with default objects

            /**
             * Clear the Input fields for the question and the options
             */
            setValues({...values, constrainedQuestionText: ""});
            for(let i = 0; i < minimumOptionsAmount; i ++){
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
            <Form>
                <Form.Group controlId="freestyleQuestionForm">
                    <Form.Label>Freestyle Question</Form.Label>
                    <Form.Control type="text" placeholder="Enter question" value={freestyleQuestionText}
                                  onChange={handleInputChange("freestyleQuestionText")}/>
                </Form.Group>
            </Form>
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
        setQuestionIndex(questionIndex + 1)
    }

    /**
     * Left side of the page, to set the base information of the survey
     * Input Groups for: title, description, star and end_date, secured status
     * @returns {JSX.Element}
     */
    const basicDataFormInput = () => {
        return (
            <Form style={{width: "70%", margin: "0 auto"}}>
                <Form.Group controlId="surveyTitle">
                    <Form.Label>Title*</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" value={title}
                                  onChange={handleInputChange("title")}/>
                    <Form.Text className="text-muted">
                        Public surveys are easier to find with a poignant title.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="surveyDescription">
                    <Form.Label>Description*</Form.Label>
                    <Form.Control as="textarea" rows="3" placeholder="Description" value={description}
                                  onChange={handleInputChange("description")}/>
                    <Form.Text className="text-muted">
                        If the mission of your survey is clear to a user, they will have a better experience taking it.
                    </Form.Text>
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group controlId="surveyStartDate">
                            <Form.Label>Start Date*</Form.Label>
                            <Form.Control type="date" value={start_date} onChange={handleInputChange("start_date")}/>
                            <Form.Text className="text-muted">
                                The date your survey starts taking submissions.
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="surveyEndDate">
                            <Form.Label>End Date*</Form.Label>
                            <Form.Control type="date" value={end_date} onChange={handleInputChange("end_date")}/>
                            <Form.Text className="text-muted">
                                The date your survey closes for submissions.
                            </Form.Text>
                        </Form.Group>
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
        if (validationResponse[0]) { // Indicates if Survey data is valid - true || false
            const createSurveyResponse = await axios({
                method: "POST",
                url: "/api/v1/survey",
                headers: {
                    "content-type": "application/json",
                    "Authorization": storageManager.getJWTToken()
                },
                data: {
                    title,
                    description,
                    start_date,
                    end_date,
                    secured: securedInput,
                    constrained_questions: constrainedQuestions,
                    freestyle_questions: freestyleQuestions
                }
            });
            if (createSurveyResponse.status === 201){
                setShowMessage(true);
                setMessageType("success");
                setMessageText("Survey was successfully created.")
            } else {
                setShowMessage(true);
                setMessageType("warning");
                setMessageText(`${createSurveyResponse.status} ${createSurveyResponse.statusText}`);
            }
        } else {
            setShowMessage(true);
            setMessageType("danger");
            setMessageText(validationResponse[1]); // The error message supplied by the SurveyValidator
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    {basicDataFormInput()}
                </Col>
                <Col>
                    {showMessage && (
                        <Message message={messageText} type={messageType}/>
                    )}
                    <Row>
                        <Col>
                            {constrainedQuestion()}
                            <Button variant="warning" onClick={addConstrainedQuestion}>Add Constrained Question</Button>
                            {constrainedQuestions.map((question, i) => (
                                <div key={i}>
                                    <h4>{question.question_text}</h4>
                                    {question.options.map((option, j) => (
                                        <p key={j}>{option.answer}</p>
                                    ))}
                                </div>
                            ))}
                        </Col>
                        <Col>
                            {freestyleQuestion()}
                            <Button variant="warning" onClick={addFreestyleQuestion}>Add Freestyle Question</Button>
                            {freestyleQuestions.map((question, i) => (
                                <div key={i}><h4>{question.question_text}</h4></div>
                            ))}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default CreateSurvey;