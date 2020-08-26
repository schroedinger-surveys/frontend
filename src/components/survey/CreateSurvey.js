import React, {useState} from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import log from "../../log/Logger";

const CreateSurvey = () => {
    const [constrainedQuestions, setConstrainedQuestions] = useState([]);
    const [freestyleQuestions, setFreestyleQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [constrainedOptions, setConstrainedOptions] = useState([]);
    const [optionsIndex, setOptionsIndex] = useState(0);
    const [values, setValues] = useState({
        title: "",
        description: "",
        start_date: 0,
        end_date: 0,
        secured: true,
        constrainedQuestionText: "",
        freestyleQuestionText: ""
    });
    const {title, description, secured, start_date, end_date, constrainedQuestionText, freestyleQuestionText} = values;

    const handleInputChange = (name) => (event) => {
        setValues({...values, [name]: event.target.value})
    }

    const createSurvey = (event) => {
        event.preventDefault();
    }

    const constrainedQuestion = () => {
        return (
            <Form>
                <Form.Group controlId="constrainedQuestionForm">
                    <Form.Label>Constrained Question</Form.Label>
                    <Form.Control type="text" placeholder="Enter question" value={constrainedQuestionText}
                                  onChange={handleInputChange("constrainedQuestionText")}/>
                </Form.Group>
                {constrainedOptions.map((option, i) => (
                    <Form.Group key={i}>
                        <Form.Label>Option {i + 1}</Form.Label>
                        <Form.Control type="text" placeholder="Enter option" className={"allOptions"}/>
                    </Form.Group>
                ))}
                <Button variant={"dark"} onClick={addConstrainedOption}>Add option</Button>
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

        const question = {question_text: constrainedQuestionText, position: questionIndex, options: optionValues};
        const currentQuestions = constrainedQuestions;
        currentQuestions.push(question);
        setConstrainedQuestions(currentQuestions);

        setQuestionIndex(questionIndex + 1)
        setOptionsIndex(0);
        setConstrainedOptions([]);
    }

    const freestyleQuestion = () => {
        return (
            <Form.Group controlId="freestyleQuestionForm">
                <Form.Label>Freestyle Question</Form.Label>
                <Form.Control type="text" placeholder="Enter question" value={freestyleQuestionText}
                              onChange={handleInputChange("freestyleQuestionText")}/>
            </Form.Group>
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

                <Form.Group controlId="securedStatus">
                    <Form.Check type="checkbox" label="Make Survey Public"/>
                </Form.Group>

                <Button variant="success" type="submit" onClick={createSurvey}>
                    Create Survey
                </Button>
            </Form>
        )
    }

    const createNewSurvey = () => {
        log.debug("title:", title);
        log.debug("description:", description);
        log.debug("start_date", start_date);
        log.debug("end_date", end_date);
        log.debug("secured:", secured);
        log.debug("constrained_questions:", constrainedQuestions);
        log.debug("freestyle_questions:", freestyleQuestions);
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    {basicDataFormInput()}
                </Col>
                <Col>
                    {constrainedQuestion()}
                    <Button variant="primary" onClick={addConstrainedQuestion}>Add Constrained Question</Button>
                    <br/>
                    <br/><br/>
                    {freestyleQuestion()}
                    <Button variant="warning" onClick={addFreestyleQuestion}>Add Freestyle Question</Button>
                </Col>
            </Row>
            <Button variant={"light"} onClick={createNewSurvey}>Create Survey</Button>
        </Container>
    )
}

export default CreateSurvey;