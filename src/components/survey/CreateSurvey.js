import React, {useState} from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import log from "../../log/Logger";

const CreateSurvey = () => {
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [values, setValues] = useState({
        title: "",
        description: "",
        start_date: Date.now(),
        end_date: Date.now() + 800,
        secured: true,
        constrainedQuestionText: "",
        freestyleQuestionText: "",
        optionOne: ""
    });
    const {title, description, secured, start_date, end_date, constrainedQuestionText, freestyleQuestionText, optionOne} = values;

    const handleInputChange = (name) => (event) => {
        setValues({...values, [name]: event.target.value})
    }

    const createSurvey = (event) => {
        event.preventDefault();
    }

    const constrainedQuestion = () => {
        return (
            <Form>
                <Form.Group controlId="surveyTitle">
                    <Form.Label>Constrained Questions</Form.Label>
                    <Form.Control type="text" placeholder="Enter question" value={constrainedQuestionText}
                                  onChange={handleInputChange("constrainedQuestionText")}/>
                </Form.Group>
                <Form.Group controlId="surveyTitle">
                    <Form.Label>Option 1</Form.Label>
                    <Form.Control type="text" placeholder="Enter option 1" value={optionOne}
                                  onChange={handleInputChange("optionOne")}/>
                </Form.Group>
            </Form>

        )
    }

    const addConstrainedQuestion = () => {
        const question = {index: questionIndex, type: "constrained", question: constrainedQuestionText, options: [optionOne]};
        log.debug("added question", question);
        const currentQuestions = questions;
        currentQuestions.push(question);
        setQuestions(currentQuestions);
        setQuestionIndex(questionIndex+1)
        log.debug(questions);
    }

    const freestyleQuestion = () => {
        return (
            <Form.Group controlId="surveyTitle">
                <Form.Label>Freestyle Questions</Form.Label>
                <Form.Control type="text" placeholder="Enter question" value={freestyleQuestionText}
                              onChange={handleInputChange("freestyleQuestionText")}/>
            </Form.Group>
        )
    }

    const addFreestyleQuestion = () => {
        const question = {index: questionIndex, type: "freestyle", question: freestyleQuestionText};
        log.debug("added question", question);
        const currentQuestions = questions;
        currentQuestions.push(question);
        setQuestions(currentQuestions);
        setQuestionIndex(questionIndex+1)
        log.debug(questions);
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

    return (
        <Container fluid>
            <Row>
                <Col>
                    {basicDataFormInput()}
                </Col>
                <Col>
                    {constrainedQuestion()}
                    <Button variant="primary" onClick={addConstrainedQuestion}>Add Constrained Question</Button>
                    {constrainedQuestionText}
                    <br/>
                    <br/><br/>
                    {freestyleQuestion()}
                    <Button variant="warning" onClick={addFreestyleQuestion}>Add Freestyle Question</Button>
                    {freestyleQuestionText}
                </Col>
            </Row>
        </Container>
    )
}

export default CreateSurvey;