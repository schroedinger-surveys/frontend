import React, {useState} from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import log from "../../log/Logger";
import Message from "../utils/Message";
import SurveyValidator from "./SurveyValidator";
import storageManager from "../../storage/LocalStorageManager";
import TimeConverter from "../utils/TimeConverter";

const CreateSurvey = () => {
    const today = new Date();
    const [constrainedQuestions, setConstrainedQuestions] = useState([]);
    const [freestyleQuestions, setFreestyleQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [constrainedOptions, setConstrainedOptions] = useState([{number: 0}, {number: 1}]);
    const [optionsIndex, setOptionsIndex] = useState(2);
    const [values, setValues] = useState({
        title: "",
        description: "",
        start_date: TimeConverter(new Date()),
        end_date: TimeConverter(new Date(today.getFullYear(), today.getMonth(), today.getDate() +7)),
        secured: true,
        constrainedQuestionText: "",
        freestyleQuestionText: ""
    });
    const {title, description, secured, start_date, end_date, constrainedQuestionText, freestyleQuestionText} = values;

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleInputChange = (name) => (event) => {
        setShowMessage(false);
        setValues({...values, [name]: event.target.value})
    }

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

    const addConstrainedOption = () => {
        const currentOptions = constrainedOptions;
        currentOptions.push({number: optionsIndex});
        setConstrainedOptions(currentOptions);
        setOptionsIndex(optionsIndex + 1)
        log.debug(constrainedOptions);
    }

    const addConstrainedQuestion = () => {
        const options = document.getElementsByClassName("allOptions");
        const optionValues = [];
        let position = 0;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value !== "") {
                optionValues.push({answer: options[i].value, position});
                position++;
            }
        }

        if (optionValues.length >= 2) {
            const question = {question_text: constrainedQuestionText, position: questionIndex, options: optionValues};
            const currentQuestions = constrainedQuestions;
            currentQuestions.push(question);
            setConstrainedQuestions(currentQuestions);

            setQuestionIndex(questionIndex + 1)
            setOptionsIndex(2);
            setConstrainedOptions([{number: 0}, {number: 1}]);
        } else {
            setShowMessage(true);
            setMessageType("warning");
            setMessageText("You must have at least TWO options!")

        }
    }

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

    const addFreestyleQuestion = () => {
        const question = {question_text: freestyleQuestionText, position: questionIndex};
        const currentQuestions = freestyleQuestions;
        currentQuestions.push(question);
        setFreestyleQuestions(currentQuestions);
        setQuestionIndex(questionIndex + 1)
    }

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

                <Form.Group controlId="securedStatus">
                    <Form.Check type="checkbox" label="Make Survey Public"/>
                </Form.Group>

                <Button variant="success" type="submit" onClick={createNewSurvey}>
                    Create Survey
                </Button>
            </Form>
        )
    }

    const createNewSurvey = async (event) => {
        event.preventDefault();
        const validationResponse = SurveyValidator(title, description, start_date, end_date, constrainedQuestions, freestyleQuestions);
        if (validationResponse[0]) {
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
                    secured,
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
            setMessageText(validationResponse[1]);
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