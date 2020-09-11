import React, {useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SideMenu from "../menu/side-menu/SideMenu";
import {Container} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {TimeConverter} from "../utils/TimeConverter";
import {sortQuestions} from "../utils/SortQuestions";
import storageManager from "../../storage/LocalStorageManager";
import Modal from "react-bootstrap/Modal";
import Message from "../utils/Message";

const EditSurvey = (props) => {
    const {history} = props;
    const survey = props.location.state.survey;

    const minimumOptionsAmount = 2; // At least two options must be given per constrained question
    /**
     * A List of all constrained and freestyle questions,
     * they are sent in separate arrays with the request to the api
     * but need to be in the order of creation,
     * the Index keeps track of the order as it is used to indicate the "position"
     */
    const [constrainedQuestions, setConstrainedQuestions] = useState([]);
    const [freestyleQuestions, setFreestyleQuestions] = useState([]);

    /**
     * Each constrained question must have options
     * they are temporarily saved in this array
     * which is reset when a constrainedQuestion is added/created
     * The object in this array a placeholders with no further meaning
     */
    const [constrainedOptions, setConstrainedOptions] = useState([]);
    const [optionsIndex, setOptionsIndex] = useState(minimumOptionsAmount);

    const [values, setValues] = useState({
        title: "",
        description: "",
        start_date: new Date(),
        end_date: "",
        constrainedQuestionText: "",
        freestyleQuestionText: ""
    });
    const {title, description, start_date, end_date, constrainedQuestionText, freestyleQuestionText} = values;

    const [changedValues, setChangedValues] = useState({
        addedConstrainedQuestions: [],
        deletedConstrainedQuestions: [],
        addedFreestyleQuestions: [],
        deletedFreestyleQuestions: []
    });
    const {addedConstrainedQuestions, deletedConstrainedQuestions, addedFreestyleQuestions, deletedFreestyleQuestions} = changedValues;

    const [addedQuestions, setAddedQuestions] = useState([]);

    const [showConstrainedQuestionForm, setShowConstrainedQuestionForm] = useState(false);
    const [showFreestyleQuestionForm, setShowFreestyleQuestionForm] = useState(false);

    const [lastPosition, setLastPosition] = useState(0);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const setupSurveyForm = () => {
        setValues({
            ...values,
            title: survey.title,
            description: survey.description,
            start_date: TimeConverter(new Date(survey.start_date)),
            end_date: TimeConverter(new Date(survey.end_date)),
            constrainedQuestions: survey.constrained_questions,
            freestyleQuestions: survey.freestyle_questions
        });
        const sortedQuestions = sortQuestions(survey.constrained_questions, survey.freestyle_questions);
        setLastPosition(sortedQuestions[sortedQuestions.length-1].question.position+2);
    }

    const [showMessageDelete, setShowMessageDelete] = useState(false);
    const [messageTextDelete, setMessageTextDelete] = useState("");
    const [messageTypeDelete, setMessageTypeDelete] = useState("");

    const handleInputChange = (name) => (event) => {
        setValues({...values, [name]: event.target.value});
    }

    /**
     * Left side of the page, to change the base information of the survey
     * Input Groups for: title, description, star and end_date, secured status
     * @returns {JSX.Element}
     */
    const basicDataFormInput = () => {
        return (
            <Form>
                <Form.Group controlId="surveyTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" value={title}
                                  onChange={handleInputChange("title")}/>
                    <Form.Text className="text-muted">
                        Public surveys are easier to find with a poignant title.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="surveyDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="3" placeholder="Description" value={description}
                                  onChange={handleInputChange("description")}/>
                    <Form.Text className="text-muted">
                        If the mission of your survey is clear to a user, they will have a better experience taking it.
                    </Form.Text>
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group controlId="surveyStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" value={start_date} onChange={handleInputChange("start_date")}/>
                            <Form.Text className="text-muted">
                                The date your survey starts taking submissions.
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="surveyEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" value={end_date} onChange={handleInputChange("end_date")}/>
                            <Form.Text className="text-muted">
                                The date your survey closes for submissions.
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group>
                    <Form.Check id={"securedStatusPrivate"} type="radio" name={"securedRadio"} label="Private"
                                defaultChecked={survey.secured}/>
                    <Form.Check id={"securedStatusPublic"} type="radio" name={"securedRadio"} label="Public"
                                defaultChecked={!survey.secured}/>
                    <Form.Text className="text-muted">
                        A private survey can only be found trough a link provided by yourself. But anyone can submit an
                        answer to a public survey.
                    </Form.Text>
                </Form.Group>

                <Button variant="success" onClick={updateSurvey}>
                    Update Survey
                </Button>
                <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>Delete Survey</Button>
            </Form>
        )
    }

    const deleteSurveyModal = () => {
        return(
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting your user account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure that you want to delete this survey. All data will be lost forever!
                    {showMessageDelete && <Message type={messageTypeDelete} message={messageTextDelete}/>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Rather not
                    </Button>
                    <Button variant="danger" onClick={deleteSurvey}>
                        Yes, i am sure
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const deleteSurvey = async() => {
        const deleteSurveyResponse = await axios({
            method: "DELETE",
            url: "/api/v1/survey/"+ survey.id,
            headers: {
                "Authorization": storageManager.getJWTToken()
            }
        });
        if(deleteSurveyResponse.status === 204){
            history.push("/dashboard");
        } else {
            setShowMessageDelete(true);
            setMessageTypeDelete("danger");
            setMessageTextDelete("That did not work. Please try again.");
        }
    }

    const QuestionsForm = () => {
        const sortedQuestions = sortQuestions(survey.constrained_questions, survey.freestyle_questions);
        return (
            <div style={{width: "90%"}}>
                <label>Questions</label>
                {sortedQuestions.map((item, i) => (
                    <div key={i} id={"question"+i} style={{
                        width: "100%",
                        border: "1px solid lightgrey",
                        borderRadius: "5px",
                        padding: "5px",
                        marginBottom: "5px"
                    }}>
                        <button style={{border: "none", backgroundColor: "transparent"}}
                                onClick={() => deleteQuestion(i, item)}
                        >
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash"
                                 fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd"
                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                        Question {i + 1}: {item.question.question_text}
                        {item.type === "constrained" &&
                            <ul>
                                {item.question.options.map((option, j) =>(
                                  <li key={j}>{option.answer}</li>
                                ))}
                            </ul>}
                    </div>
                ))}
            </div>
        )
    }

    const deleteQuestion = (index, item) => {
        const question = document.getElementById(`question${index}`);
        if(question){
            question.style.backgroundColor = "#DA2D2D";
            question.style.color = "white";
            if(item.type === "constrained"){
                setChangedValues({...changedValues, deletedConstrainedQuestions: [...deletedConstrainedQuestions, {question_id: item.question.id}]});
            } else {
                setChangedValues({...changedValues, deletedFreestyleQuestions: [...deletedFreestyleQuestions, {question_id: item.question.id}]});
            }
        }
    }

    /**
     * Template for the ConstrainedQuestions Form
     * contains the Input Group for the question_text
     * and Input fields for the answer_options
     * @returns {JSX.Element}
     */
    const constrainedQuestion = () => {
        return (
            <Form style={{marginTop: "10px"}}>
                <Form.Group controlId="constrainedQuestionForm">
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
                <Button variant={"light"} onClick={addConstrainedOption}>Add option</Button> <br/>
                <Button variant={"outline-success"} onClick={addConstrainedQuestion}>Add Question</Button>
                <Button variant={"outline-danger"} onClick={() => setShowConstrainedQuestionForm(false)}>Cancel</Button>
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

    const fillDefaultOptionsArray = () => {
        const defaultOptions = [];
        for (let i = 0; i < minimumOptionsAmount; i++){
            defaultOptions.push({index: i})
        }
        setConstrainedOptions(defaultOptions);
    }

    /**
     * Adds a question based on the ConstrainedQuestions Form to the array of constrainedQuestions
     * If at least two options are given the question is added and a success message is shown
     * otherwise a warning is displayed
     */
    const addConstrainedQuestion = (event) => {
        event.preventDefault();
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
            const question = {question_text: constrainedQuestionText, position: lastPosition, options: optionValues}; // Build the Question according to API
            setConstrainedQuestions([...constrainedQuestions, question]);
            setAddedQuestions([...addedQuestions, question]);

            setLastPosition(lastPosition+1)
            setOptionsIndex(minimumOptionsAmount); // Set Options Index back to 2, which is default

            setValues({...values, constrainedQuestionText: ""});
            setChangedValues({...changedValues, addedConstrainedQuestions: [...addedConstrainedQuestions, question]});

            fillDefaultOptionsArray(); // Refill the optionsArray with default objects

            /**
             * Clear the Input fields for the question and the options
             */
            setValues({...values, constrainedQuestionText: ""});
            for(let i = 0; i < minimumOptionsAmount; i ++){
                options[i].value = "";
            }
        }
    }

    /**
     * Form to create a freestyle question, that provides no sort of answer options
     * @returns {JSX.Element}
     */
    const freestyleQuestion = () => {
        return (
            <Form style={{marginTop: "10px"}}>
                <Form.Group controlId="freestyleQuestionForm">
                    <Form.Control type="text" placeholder="Enter question" value={freestyleQuestionText}
                                  onChange={handleInputChange("freestyleQuestionText")}/>
                </Form.Group>
                <Button variant={"outline-success"} onClick={addFreestyleQuestion}>Add Question</Button>
                <Button variant={"outline-danger"} onClick={() => setShowFreestyleQuestionForm(false)}>Cancel</Button>
            </Form>
        )
    }

    /**
     * Adds the Freestyle Question to the freestyleQuestions Array
     * Increments the Index, that tracks the creation order of all questions (freestyle and constrained)
     */
    const addFreestyleQuestion = (event) => {
        event.preventDefault();
        const question = {question_text: freestyleQuestionText, position: lastPosition};
        setLastPosition(lastPosition+1)
        setFreestyleQuestions([...freestyleQuestions, question]);
        setAddedQuestions([...addedQuestions, question]);
        setValues({...values, freestyleQuestionText: ""});
        setChangedValues({...changedValues, addedFreestyleQuestions: [...addedFreestyleQuestions, question]});
    }

    const AddedQuestions = () => {
        const sortedQuestions = sortQuestions(addedQuestions, []);
        return (
            <div style={{width: "90%"}}>
                {sortedQuestions.map((item, i) => (
                    <div key={i} id={"addedQuestion"+i} style={{
                        width: "100%",
                        border: "1px solid lightgrey",
                        borderRadius: "5px",
                        padding: "5px",
                        marginBottom: "5px",
                        backgroundColor: "#24AE24",
                        color: "white"
                    }}>
                        <button style={{border: "none", backgroundColor: "transparent"}}
                                onClick={() => removeAddedQuestion(i, item)}
                        >
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash"
                                 fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd"
                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                        Question {item.question.position}: {item.question.question_text}
                        {item.type === "constrained" &&
                        <ul>
                            {item.question.options.map((option, j) =>(
                                <li key={j}>{option.answer}</li>
                            ))}
                        </ul>}
                    </div>
                ))}
            </div>
        )
    }

    const removeAddedQuestion = (index, item) => {
        if(item.type === "constrained"){
            const currentIndex = addedConstrainedQuestions.findIndex(obj => obj === item.question);
            const temp = addedConstrainedQuestions;
            temp.splice(currentIndex, 1);
        } else {
            const currentIndex = addedFreestyleQuestions.findIndex(obj => obj === item.question);
            const temp = addedFreestyleQuestions;
            temp.splice(currentIndex, 1);
            // setChangedValues({...changedValues, addedFreestyleQuestions: temp}) This would remove the added question from display, but the position number would look awful
        }
        const question = document.getElementById(`addedQuestion${index}`);
        if(question) {
            question.style.backgroundColor = "#DA2D2D";
            question.style.color = "white";
        }
    }

    const updateSurvey = async() => {
        const secured = document.getElementById("securedStatusPrivate").checked;
        const updateResponse = await axios({
            method: "PUT",
            url: "/api/v1/survey/" + survey.id,
            headers: {
                "Authorization": storageManager.getJWTToken()
            },
            data: {
                title,
                description,
                start_date,
                end_date,
                secured,
                added_constrained_questions: addedConstrainedQuestions,
                added_freestyle_questions: addedFreestyleQuestions,
                deleted_constrained_questions: deletedConstrainedQuestions,
                deleted_freestyle_questions: deletedFreestyleQuestions
            }
        });
        console.log(updateResponse.status);
    }

    useEffect(() => {
        setupSurveyForm();
        fillDefaultOptionsArray();
    }, [])

    return (
        <Container fluid>
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                {deleteSurveyModal()}
                <Col xs={5} style={{marginTop: "30px"}}>
                    {basicDataFormInput()}
                </Col>
                <Col xs={6} style={{marginTop: "30px"}}>
                    <Row>
                        {QuestionsForm()}
                        {AddedQuestions()}
                    </Row>
                    <Row>
                        <Button variant={"warning"} style={{color: "white", marginRight: "10px"}} onClick={() => {
                            setShowConstrainedQuestionForm(true);
                            setShowFreestyleQuestionForm(false);
                        }}>Add Constrained
                            Question</Button>
                        <Button variant={"warning"} style={{color: "white", marginRight: "10px"}} onClick={() => {
                            setShowConstrainedQuestionForm(false);
                            setShowFreestyleQuestionForm(true);
                        }}>Add Freestyle
                            Question</Button>
                        <div style={{width: "90%"}}>
                            {showConstrainedQuestionForm && constrainedQuestion()}
                            {showFreestyleQuestionForm && freestyleQuestion()}
                        </div>

                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default EditSurvey;