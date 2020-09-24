import React, {useState} from "react";
import {withRouter} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import log from "../../log/Logger";
import Message from "../utils/Message";
import storageManager from "../../storage/StorageManager";
import UserAPIHandler from "../../calls/user";
import {loginValidator} from "../../validation/user";
import NavbarMenu from "../menu/NavbarMenu";
import Footer from "./Footer";

/**
 * Login provides functionalities for a user to log in to the application
 * @param props:
 * (prop) single - if component is used as parent or child component - true || false
 * (prop) history - together with the HOC withRouter from React Router allows changes to current url path
 * @returns {JSX.Element} Form and Message Component
 * @constructor
 */
const Login = (props) => {
    const {history} = props;
    const [values, setValues] = useState({
        username: "",
        password: ""
    });
    const {username, password} = values;

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    const [singin, setSignin] = useState(false);

    /**
     * Provides logic to log in user meaning
     * user credentials are sent to backend api
     * valid credentials get a request containing the jwt token, that is then being stored via storageManager
     * invalid credentials trigger the Message Component, show error message
     * @param event - click
     */
    const login = async (event) => {
        setSignin(true);
        event.preventDefault();
        const valid = loginValidator(username, password);
        if (valid.status){
            const apiResponse = await UserAPIHandler.userLogin(username, password);
            log.debug("Status in FE", apiResponse.status);
            if (apiResponse.status === 200) {
                const userToken = apiResponse.data.jwt; // The jwt token belonging to the user
                const rememberUser = document.getElementById("rememberMe").checked; // Based on this the jwt token will be saved to local or session storage
                if (rememberUser) {
                    storageManager.saveJWTTokenLocal(userToken);
                } else {
                    storageManager.saveJWTTokenSession(userToken);
                }
                history.push("/dashboard");
            } else {
                setShowMessage(true);
                setMessageText(apiResponse.backend.data.human_message || "Something went wrong, please try again.");
                setMessageType("danger");
                log.debug("Error Login: ",apiResponse.log);
                log.error("Error Login: ", apiResponse)
            }
        } else {
            setShowMessage(true);
            setMessageText(valid.text);
            setMessageType(valid.type);
        }
        setSignin(false);
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

    const LoginComponent = () => {
        return(
            <div className={"home_form"}>
                <Form> {/** Component is styled different when it is used as child comp instead of parent comp**/}
                    <h3>Login to your user account</h3>
                    <Form.Group controlId="username">
                        <Form.Label>Username*</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" value={username}
                                      onChange={handleUserInput("username")}/>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password*</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password}
                                      onChange={handleUserInput("password")}/>
                    </Form.Group>
                    <Form.Group controlId="rememberMe">
                        <Form.Check type="checkbox" label="Remember me"/>
                    </Form.Group>
                    <button className={"home_btn"} onClick={login}>
                        {singin && <i className="fa fa-circle-o-notch fa-spin"/>}
                        {!singin && "Login"}
                    </button>
                </Form>
                <a className={"forgot_password-link"} href={"/password/forgot"}>Forgot Password or Username?</a>
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
                {LoginComponent()}
            </div>
            <Footer/>
        </div>
    )
}
export default withRouter(Login);