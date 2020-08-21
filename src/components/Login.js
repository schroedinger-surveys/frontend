import React, {useState} from "react";
import axios from "axios";
import {withRouter} from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import log from "../log/Logger";
import Message from "./Message";
import storageManager from "../storage/LocalStorageManager";

const Login = (props) => {
    const [values, setValues] = useState({
        username: "",
        password: ""
    });
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");
    const {username, password} = values;
    const {single, history} = props;

    const login = (event) => {
        event.preventDefault();
        const rememberUser = document.getElementById("rememberMe").checked;
        log.debug("user wants to login", username, password, rememberUser);
        axios({
            method: "POST",
            url: "/api/v1/user/login",
            headers: {
                "content-type": "application/json"
            },
            data: {
                username,
                password
            }
        }).then((response) => {
            log.debug("User logged into his account");
            log.debug("Backend data response", response.data);
            if(response.status === 200){
                const userToken = response.data.jwt;
                if(rememberUser){
                    storageManager.saveJWTToken(userToken);
                }
                try{
                    history.push("/dashboard");
                } catch (e) {
                    log.debug("Redirection from Home/Login to users Dashboard failed", e.stack);
                }
            }
        }).catch((error) => {
            if(error.response.status === 404 || 403){
                setMessageText("Wrong credentials");
            }else {
                setMessageText("Something went wrong. Please try again.")
            }
            setShowMessage(true);
            setMessageType("danger")
            log.debug("user login not successful", error.response.status, error.response.statusText);
        });
    }

    const handleUserInput = (valueName) => (event) => {
        setShowMessage(false);
        setValues({...values, [valueName]: event.target.value})
    }

    return (
        <div>
            <Form style={{width: single ? "30%" : "100%"}}>
                <h3>Login to your user account</h3>
                <Form.Group controlId="username">
                    <Form.Label>Username*</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" value={username} onChange={handleUserInput("username")}/>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password*</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={handleUserInput("password")}/>
                </Form.Group>
                <Form.Group controlId="rememberMe">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <Button style={{width: "100%"}} variant="success" type="submit" onClick={login}>
                    Login
                </Button>
            </Form>
            {showMessage && (
                <Message message={messageText} type={messageType}/>
            )}
        </div>

    )
}
export default withRouter(Login);