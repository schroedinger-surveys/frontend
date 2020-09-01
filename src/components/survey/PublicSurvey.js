import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

import log from "../../log/Logger";
import LoadingScreen from "../utils/LoadingScreen";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";

const PublicSurvey = () => {
    const {id} = useParams();
    const [survey, setSurvey] = useState({});
    const [loadedSurvey, setLoadedSurvey] = useState(false);
    const [loading, setLoading] = useState(true);

    const getSurvey = () => {
        axios({
            method: "GET",
            url: "/api/v1/survey/public/" + id
        }).then(async (response) => {
            log.debug(response.data);
            if (response.status === 200) {
                await setSurvey(response.data)
                setLoadedSurvey(true);
                setLoading(false);
            }
        }).catch((error) => {
            log.debug("Could not fetch individual survey", error.response);
        })
    }

    const checkSurveyStatus = () => {
        log.debug(survey.start_date, survey.end_date);
        const start_date = new Date(survey.start_date).getTime();
        const end_date = new Date(survey.end_date).getTime();
        const today = new Date(Date.now()).getTime();

        if (start_date > today) {
            return (
                <div>
                    <h1>PENDING</h1>
                    <p>THE SURVEY IS NOT YET ACTIVE</p>
                </div>
            )
        } else if (end_date < today) {
            return (
                <div>
                    <h1>CLOSED</h1>
                    <p>THE SURVEY DOES NOT TAKE ANYMORE SUBMISSION</p>
                </div>
            )
        } else {
            return (
                submissionForm()
            )
        }
    }

    const submissionForm = () => {
        const sortedQuestions = sortQuestions();
        log.debug(sortedQuestions);
        return (
            <div style={{width: "60%", margin: "0 auto"}}>
                <h2>{survey.title}</h2>
                <div style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                    <label style={{fontWeight: "bold"}}>Description:</label>
                    <p>{survey.description}</p>
                </div>
                {sortedQuestions.map((item, i) => {
                    if (item.type === "constrained"){
                        return (
                            <div key={i} style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                                <Form.Group>
                                    <Form.Label style={{fontWeight: "bold"}}>{item.question.position+1}. {item.question.question_text}</Form.Label>
                                    {item.question.options.map((option, j) => (
                                        <Form.Check
                                            key={j}
                                            type="radio"
                                            label={option.answer}
                                            name="answerOption"
                                            id="AnswerRadioButton"
                                        />
                                    ))}
                                </Form.Group>
                            </div>
                        )
                    } else {
                        return (
                            <div key={i} style={{border: "1px solid lightgrey", borderRadius: "8px", padding: "10px"}}>
                                <Form.Group>
                                    <Form.Label style={{fontWeight: "bold"}}>{item.question.position+1}. {item.question.question_text}</Form.Label>
                                    <Form.Control type="text" placeholder="Your Answer..."/>
                                </Form.Group>
                            </div>
                        )
                    }
                })}
                <Button style={{width: "100%", margin: "15px 0 30px 0"}} variant={"success"}>Submit</Button>
            </div>
        )
    }


    const sortQuestions = () => {
        // Sort questions based on position property
        const allQuestions = [...survey.freestyle_questions, ...survey.constrained_questions];
        allQuestions.sort((a, b) => (a.position > b.position) ? 1 : -1);
        for (let i = 0; i < allQuestions.length; i++){
            let temp = allQuestions[i];
            if (allQuestions[i].hasOwnProperty("options")){
                allQuestions[i] = {
                    type: "constrained",
                    question: temp
                }
            } else {
                allQuestions[i] = {
                    type: "freestyle",
                    question: temp
                }
            }
        }
        return allQuestions;
    }

    useEffect(() => {
        getSurvey();
    }, []);

    return (
        <div>
            {loading && (
                <LoadingScreen/>
            )}
            {loadedSurvey && checkSurveyStatus()}
        </div>
    )
}

export default PublicSurvey;