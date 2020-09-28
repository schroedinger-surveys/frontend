import React, {useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SideMenu from "../menu/SideMenu";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {TimeConverter} from "../utils/TimeConverter";
import {sortQuestions} from "../utils/SortQuestions";
import Message from "../utils/Message";
import {DeleteModal} from "./delete-survey-utils";
import {BasicForm, fillDefaultOptionsArray} from "./form-utils";
import SurveyAPIHandler from "../../calls/survey";
import log from "../../log/Logger";
import storageManager from "../../storage/StorageManager";
import AppNavbar from "../menu/AppNavbar";
import {useParams} from "react-router-dom";
import LoadingScreen from "../utils/LoadingScreen";

const EditSurvey = (props) => {
    const {history} = props;
    const {id} = useParams();

    const [survey, setSurvey] = useState({});

    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);

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

    const setupSurveyForm = async () => {
        setLoading(true);
        const publicSurvey = await SurveyAPIHandler.getSinglePublicSurvey(id);
        const privateSurvey = await SurveyAPIHandler.getSinglePrivateSurveyJWT(id);
        const survey = privateSurvey.data || publicSurvey.data;
        await setSurvey(survey);
        setLoaded(true);
        if (survey !== undefined){
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
            setLastPosition(sortedQuestions[sortedQuestions.length - 1].question.position + 2);
            setLoading(false);
        } else {
            history.push("/");
        }
    }

    const [showMessageDelete, setShowMessageDelete] = useState(false);
    const [messageTextDelete, setMessageTextDelete] = useState("");
    const [messageTypeDelete, setMessageTypeDelete] = useState("");

    const [showMessageUpdate, setShowMessageUpdate] = useState(false);
    const [messageTextUpdate, setMessageTextUpdate] = useState("");
    const [messageTypeUpdate, setMessageTypeUpdate] = useState("");

    const handleInputChange = (name) => (event) => {
        setValues({...values, [name]: event.target.value});
    }

    /**
     * Left side of the page, to change the base information of the survey
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

                <button className={"update_edited_survey_btn"} onClick={updateSurvey}>
                    Update Survey
                </button>
                <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>Delete Survey</Button>
            </Form>
        )
    }

    const deleteSurveyModal = () => {
        const closeFunction = () => {
            setShowDeleteModal(false)
        }
        const params = {
            closeFunction,
            deleteSurvey,
            showDeleteModal
        }
        return (
            <DeleteModal parameter={params}/>
        )
    }

    const deleteSurvey = async () => {
        const apiResponse = await SurveyAPIHandler.surveyDelete(survey.id);
        if (apiResponse.status === 204) {
            storageManager.clearSurveyCache();
            history.push("/dashboard");
        } else {
            setShowMessageDelete(true);
            setMessageTypeDelete("danger");
            setMessageTextDelete("That did not work. Please try again.");
            log.debug(apiResponse.log);
        }
    }

    const QuestionsForm = () => {
        const sortedQuestions = sortQuestions(survey.constrained_questions, survey.freestyle_questions);
        return (
            <div style={{width: "90%"}}>
                <label>Questions</label>
                {sortedQuestions.map((item, i) => (
                    <div key={i} id={"question" + i} style={{
                        width: "100%",
                        border: "1px solid lightgrey",
                        borderRadius: "5px",
                        padding: "5px",
                        marginBottom: "5px"
                    }}>
                        <button className={"edit_survey_remove_question"}
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
                            {item.question.options.map((option, j) => (
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
        if (question) {
            question.style.backgroundColor = "rgba(254,13,19, 0.6)";
            question.style.color = "white";
            if (item.type === "constrained") {
                setChangedValues({
                    ...changedValues,
                    deletedConstrainedQuestions: [...deletedConstrainedQuestions, {question_id: item.question.id}]
                });
            } else {
                setChangedValues({
                    ...changedValues,
                    deletedFreestyleQuestions: [...deletedFreestyleQuestions, {question_id: item.question.id}]
                });
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
                <button className={"add_option_btn"} onClick={addConstrainedOption}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus-square" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path fillRule="evenodd"
                              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                </button>
                <br/>
                <button className={"edit_survey_add_question_btn"} onClick={addConstrainedQuestion}>Add Question</button>
                <Button variant={"outline-danger"} onClick={() => setShowConstrainedQuestionForm(false)}>Cancel</Button>
            </Form>
        )
    }

    /**
     * Adds another Input Field to the ConstrainedQuestion Form
     * by adding an object to the constrainedOptions array
     * and incrementing the optionsIndex
     */
    const addConstrainedOption = (event) => {
        event.preventDefault();
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

            setLastPosition(lastPosition + 1)
            setOptionsIndex(minimumOptionsAmount); // Set Options Index back to 2, which is default

            setValues({...values, constrainedQuestionText: ""});
            setChangedValues({...changedValues, addedConstrainedQuestions: [...addedConstrainedQuestions, question]});

            setConstrainedOptions(fillDefaultOptionsArray(minimumOptionsAmount)); // Refill the optionsArray with default objects

            /**
             * Clear the Input fields for the question and the options
             */
            setValues({...values, constrainedQuestionText: ""});
            for (let i = 0; i < minimumOptionsAmount; i++) {
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
                <button className={"edit_survey_add_question_btn"} onClick={addFreestyleQuestion}>Add Question</button>
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
        setLastPosition(lastPosition + 1)
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
                    <div key={i} id={"addedQuestion" + i} style={{
                        width: "100%",
                        border: "1px solid lightgrey",
                        borderRadius: "5px",
                        padding: "5px",
                        marginBottom: "5px",
                        backgroundColor: "rgba(36,174,36,0.6)",
                        color: "white"
                    }}>
                        <button className={"edit_survey_remove_question"}
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
                            {item.question.options.map((option, j) => (
                                <li key={j}>{option.answer}</li>
                            ))}
                        </ul>}
                    </div>
                ))}
            </div>
        )
    }

    const removeAddedQuestion = (index, item) => {
        if (item.type === "constrained") {
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
        if (question) {
            question.style.backgroundColor = "rgba(254,13,19, 0.6)";
            question.style.color = "white";
        }
    }

    const updateSurvey = async (event) => {
        event.preventDefault();
        const secured = document.getElementById("securedStatusPrivate").checked;
        const apiResponse = await SurveyAPIHandler.surveyUpdate(survey.id, title, description, start_date, end_date, secured, addedConstrainedQuestions, addedFreestyleQuestions, deletedConstrainedQuestions, deletedFreestyleQuestions)
        if (apiResponse.status === 204) {
            setShowMessageUpdate(true);
            setMessageTypeUpdate("success");
            setMessageTextUpdate("Survey was updated. You will be redirected.");
            storageManager.clearSurveyCache();
            setTimeout(() => {
                history.push("/dashboard");
            }, 3000);
        } else {
            setShowMessageUpdate(true);
            setMessageTypeUpdate("warning");
            setMessageTextUpdate("Something did not work. Please try again.");
            log.debug(apiResponse.log);
        }
    }

    useEffect(() => {
        setupSurveyForm();
        setConstrainedOptions(fillDefaultOptionsArray(minimumOptionsAmount));
    }, [])

    const editSurveyComponent = () => {
        return (
            <div className={"edit_survey_component"}>
                {deleteSurveyModal()}
                {loading && (
                    <LoadingScreen/>
                )}
                {!loading && (
                    <div className={"edit_survey_basic_form"} style={{marginTop: "30px"}}>
                        {basicDataFormInput()}
                        {showMessageDelete && <Message type={messageTypeDelete} message={messageTextDelete}/>}
                        {showMessageUpdate && <Message type={messageTypeUpdate} message={messageTextUpdate}/>}
                    </div>
                )}
                {!loading && (
                    <div className={"edit_survey_questions"} style={{marginTop: "30px"}}>
                        <Row>
                            {loaded && QuestionsForm()}
                            {AddedQuestions()}
                        </Row>
                        <Row>
                            <button className={"edit_survey_add_question_btn"} onClick={() => {
                                setShowConstrainedQuestionForm(true);
                                setShowFreestyleQuestionForm(false);
                            }}>Add Constrained
                                Question</button>
                            <button className={"edit_survey_add_question_btn"} onClick={() => {
                                setShowConstrainedQuestionForm(false);
                                setShowFreestyleQuestionForm(true);
                            }}>Add Freestyle
                                Question</button>
                            <div style={{width: "90%"}}>
                                {showConstrainedQuestionForm && constrainedQuestion()}
                                {showFreestyleQuestionForm && freestyleQuestion()}
                            </div>
                        </Row>
                    </div>
                )}

            </div>
        )
    }

    return (
        <div className={"app_wrapper"}>
            <AppNavbar/>
            <SideMenu/>
            <div id={"app_page_body"}>
                {editSurveyComponent()}
            </div>
        </div>
    )
}

export default EditSurvey;