import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Message from "../utils/Message";
import axios from "axios";
import {userRequestPasswordReset} from "../../calls/user";

const ForgotPassword = (props) => {
    const {single} = props;
    const [values, setValues] = useState({
        username: "",
        email: ""
    });
    const {username, email} = values;

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleInput = (name) => (event) => {
        setValues({...values, [name]: event.target.value})
    }

    const requestPasswordReset = async () => {
        const apiResponse = await userRequestPasswordReset(username, email);
        if (apiResponse.status === 200) {
            setMessageText(apiResponse.data);
            setMessageType("info");
            setShowMessage(true);
        } else {
            setMessageText("That did not work. Invalid Email or Username");
            setMessageType("danger");
            setShowMessage(true);
        }
    }

    return (
        <div>
            <Form
                style={{width: single ? "30%" : "100%"}}> {/** Component is styled different when it is used as child comp instead of parent comp**/}
                <h3>Forgot Password or Username?</h3>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username}
                                  onChange={handleInput("username")}/>
                    <Form.Text className="text-muted">
                        If you forgot your username, leave this field empty.
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email*</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleInput("email")}/>
                </Form.Group>
                <Button style={{width: "100%"}} variant="success" onClick={requestPasswordReset}>
                    Request Password Reset
                </Button>
            </Form>
            {showMessage && (
                <Message message={messageText} type={messageType}/>
            )}
        </div>
    )
}

export default ForgotPassword;