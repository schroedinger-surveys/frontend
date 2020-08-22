import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

import log from "../log/Logger";
import Message from "./Message";

/**
 * Register provides functionalities for a user to register a new user account
 * @param props:
 * (prop) single - if component is used as parent or child component - true || false
 * @returns {JSX.Element} Form and Message Component
 * @constructor
 */
const Register = (props) => {
    const {single} = props;
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: ""
    });
    const {username, email, password} = values;

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
     * Provides logic to create a new user account
     * user data is sent to backend api
     * if username and email are not registered yet the user account is created
     * and message is shown that informs user that he can login now
     * if username or email already exist an error message is shown
     * @param event - click
     */
    const registerNewUser = (event) => {
        event.preventDefault();
        log.debug("Someone wants to register a user account");
        axios({
            method: "POST",
            url: "/api/v1/user",
            headers: {
                "content-type": "application/json"
            },
            data: {
                username,
                email,
                password
            }
        }).then((response) => {
            if(response.status === 201){
                setShowMessage(true);
                setMessageText("Your account was created, you can login now.");
                setMessageType("success");
            }
            log.debug("registered new user", response.status);
        }).catch((error) => {
            if(error.response.status === 409){
                setShowMessage(true);
                setMessageText(error.response.statusText);
                setMessageType("danger");
            }
            log.debug("user could not be registered", error.response.status, error.response);
        })
    }

    /**
     * Takes the changed values from the form and updates the state of the specific value
     * @param valueName is the name of the state variable
     * @returns {function(...[*]=)}
     */
    const handleUserInput = (valueName) => (event) => {
        setShowMessage(false);
        setValues({...values, [valueName]: event.target.value})
    }

    return (
        <div>
            <Form style={{width: single ? "30%" : "100%"}}> {/** Component is styled different when it is used as child comp instead of parent comp**/}
                <h3>Register a new user account</h3>
                <Form.Group controlId="username">
                    <Form.Label>Username*</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" value={username}
                                  onChange={handleUserInput("username")}/>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email address*</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleUserInput("email")}/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password*</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password}
                                  onChange={handleUserInput("password")}/>
                </Form.Group>
                <Button style={{width: "100%"}} variant="success" type="submit" onClick={registerNewUser}>
                    Register
                </Button>
            </Form>
            {showMessage && (
                <Message message={messageText} type={messageType}/>
            )}
        </div>

    )
}
export default Register;