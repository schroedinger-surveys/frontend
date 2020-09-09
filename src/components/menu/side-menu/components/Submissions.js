import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideMenu from "../SideMenu";
import Row from "react-bootstrap/Row";
import {getPrivateSurveys, getPublicSurveys} from "../../../utils/GetSurveys";
import {Redirect} from "react-router-dom";
import LoadingScreen from "../../../utils/LoadingScreen";

const Submissions = () => {
    const [displayPrivate, setDisplayPrivate] = useState(false);
    const [displayPublic, setDisplayPublic] = useState(false);

    const [publicSurveys, setPublicSurveys] = useState([]);
    const [privateSurveys, setPrivateSurveys] = useState([]);

    const [choseSurvey, setChoseSurvey] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState({});

    const [loading, setLoading] = useState(false);

    const fetchPrivateSurveys = async() => {
        if(privateSurveys.length === 0){
            setLoading(true);
            const privateSurveyList = await getPrivateSurveys();
            setPrivateSurveys(privateSurveyList);
            setLoading(false);
        }
        setDisplayPublic(false);
        setDisplayPrivate(true);
    }

    const fetchPublicSurveys = async() => {
        if(publicSurveys.length === 0){
            setLoading(true);
            const publicSurveyList = await getPublicSurveys();
            setPublicSurveys(publicSurveyList);
            setLoading(false);
        }
        setDisplayPrivate(false);
        setDisplayPublic(true);
    }

    const redirectToSpotlight = (survey) => {
        return(
            <Redirect to={{
                pathname: "/survey/submission/spotlight",
                state: {survey}}}/>
        )
    }

    return(
        <Container fluid>
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                {choseSurvey && redirectToSpotlight(selectedSurvey) }
                <Col xs={3} style={{marginTop: "30px"}}>
                    <h3>Choose type of survey</h3>
                    <button onClick={fetchPrivateSurveys}>Private</button><button onClick={fetchPublicSurveys}>Public</button>
                </Col>
                <Col xs={8} style={{marginTop: "30px"}}>
                    List of survey with chosen type here
                    {(privateSurveys.length > 0 && displayPrivate) && (
                        <div>
                            <ul>
                                {privateSurveys.map((survey, i) => (
                                    <li key={i} style={{cursor: "pointer"}} onClick={() => {
                                        setSelectedSurvey(survey);
                                        setChoseSurvey(true)
                                    }}>{survey.title}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {(publicSurveys.length > 0 && displayPublic) && (
                        <div>
                            <ul>
                                {publicSurveys.map((survey, i) => (
                                    <li key={i} style={{cursor: "pointer"}} onClick={() => {
                                        setSelectedSurvey(survey);
                                        setChoseSurvey(true)
                                    }}>{survey.title}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {loading && (
                        <LoadingScreen/>
                    )}
                </Col>
            </Row>

        </Container>
    )
}

export default Submissions;