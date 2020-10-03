import React, {useState} from "react";
import Form from "react-bootstrap/Form";

import Message from "../utils/Message";
import UserAPIHandler from "../../calls/user";
import {registrationValidator} from "../../validation/user";
import NavbarMenu from "../menu/NavbarMenu";
import Footer from "./Footer";

import logFactory from "../../utils/Logger";
const log = logFactory("src/components/home/Register.js");

/**
 * Register provides functionalities for a user to register a new user account
 * @returns {JSX.Element} Form and Message Component
 * @constructor
 */
const Register = () => {
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

    const [registering, setRegistering] = useState(false);

    /**
     * Provides logic to create a new user account
     * user data is sent to backend api
     * if username and email are not registered yet the user account is created
     * and message is shown that informs user that he can login now
     * if username or email already exist an error message is shown
     * @param event - click
     */
    const registerNewUser = async (event) => {
        setRegistering(true);
        event.preventDefault();
        const valid = registrationValidator(username, email, password)
        if(valid.status){
            const apiResponse = await UserAPIHandler.userRegistration(username, email, password);
            log.debug("Response in FE",apiResponse);
            if (apiResponse.status === 201) {
                setShowMessage(true);
                setMessageText("Your account was created, you can login now.");
                setMessageType("success");
                log.debug("User Registration successful");
            } else {
                setShowMessage(true);
                setMessageText(apiResponse.backend.data.human_message || "Something went wrong. Please try again");
                setMessageType("danger");
                log.debug(apiResponse.log);
            }
        } else {
            setShowMessage(true);
            setMessageText(valid.text);
            setMessageType(valid.type);
        }
        setRegistering(false);
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

    const RegisterComponent = () => {
        return(
            <div className={"home_form"}>
            <Form>
                <h3>Register New User Account</h3>
                <Form.Group controlId="username">
                    <Form.Label>Username*</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" value={username}
                                  onChange={handleUserInput("username")}/>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email address*</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email}
                                  onChange={handleUserInput("email")}/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password*</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password}
                                  onChange={handleUserInput("password")}/>
                </Form.Group>
                <button className={"home_btn"} onClick={registerNewUser}>
                    {registering && <i className="fa fa-circle-o-notch fa-spin"/>}
                    {!registering && "Register"}
                </button>
            </Form>
            {showMessage && (
                <Message message={messageText} type={messageType}/>
            )}
        </div>
        )
    }

    return (
        <div className={"comp_wrapper"}>
            <NavbarMenu/>
            <div id={"page_body"}>
                {RegisterComponent()}
            </div>
            <Footer/>
        </div>
    )
}
export default Register;