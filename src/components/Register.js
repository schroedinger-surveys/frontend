import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

import log from "../log/Logger";
import Message from "./Message";

const Register = (props) => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");
    const {username, email, password} = values;
    const {single} = props;

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

    const handleUserInput = (valueName) => (event) => {
        setShowMessage(false);
        setValues({...values, [valueName]: event.target.value})
    }

    return (
        <div>
            <Form style={{width: single ? "30%" : "100%"}}>
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