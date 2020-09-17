import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RandomIcon from "./RandomIcon";
import SurveyCounts from "./SurveyCounts";
import UserAPIHandler from "../../../calls/user";

/**
 * Component greets the User by name (data from jwt in storage)
 * Shows random icon of cat
 * shows count of surveys belonging to the user (filtered by criterias: public, private, active, pending, closed)
 * Child components: RandomIcon and SurveyCount
 * @returns {JSX.Element}
 */
const Profile = () => {
    const [username, setUsername] = useState("");

    const getUserName = async () => {
        const apiResponse = await UserAPIHandler.getUserInfo();
        if (apiResponse.status === 200) {
            setUsername(apiResponse.data.username);
        }
    }

    useEffect(() => {
        getUserName()
    }, [])

    return (
        <Container>
            <Row style={{border: "1px solid lightgrey", padding: "5px", borderRadius: "8px 8px 0 0"}}>
                <Col xs={3}>
                    <RandomIcon/>
                </Col>
                <Col xs={9}>
                    <h2 style={{lineHeight: "70px"}}>Welcome back, {username}!</h2>
                </Col>
            </Row>
            <SurveyCounts/>
        </Container>
    )
}

export default Profile;