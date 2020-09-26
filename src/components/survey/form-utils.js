import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";

export const BasicForm = (props) => {
    const {params} = props;
    return (
        <div className={"basic_form_container"}>
            <Form.Group controlId="surveyTitle">
                <Form.Label className={"create_survey_basic_form_label"}>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter title" value={params.title}
                              onChange={params.handleInputChange("title")}/>
                <Form.Text className="text-muted">
                    Public surveys are easier to find with a poignant title.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="surveyDescription">
                <Form.Label className={"create_survey_basic_form_label"}>Description</Form.Label>
                <Form.Control as="textarea" rows="3" placeholder="Description" value={params.description}
                              onChange={params.handleInputChange("description")}/>
                <Form.Text className="text-muted">
                    If the mission of your survey is clear to a user, they will have a better experience taking it.
                </Form.Text>
            </Form.Group>

            <Row>
                <Col>
                    <Form.Group controlId="surveyStartDate">
                        <Form.Label className={"create_survey_basic_form_label"}>Start Date</Form.Label>
                        <Form.Control type="date" value={params.start_date}
                                      onChange={params.handleInputChange("start_date")}/>
                        <Form.Text className="text-muted">
                            The date your survey starts taking submissions.
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="surveyEndDate">
                        <Form.Label className={"create_survey_basic_form_label"}>End Date</Form.Label>
                        <Form.Control type="date" value={params.end_date}
                                      onChange={params.handleInputChange("end_date")}/>
                        <Form.Text className="text-muted">
                            The date your survey closes for submissions.
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    )
}

export const fillDefaultOptionsArray = (minimumAmount) => {
    const defaultOptions = [];
    for (let i = 0; i < minimumAmount; i++) {
        defaultOptions.push({index: i})
    }
    return defaultOptions;
}
