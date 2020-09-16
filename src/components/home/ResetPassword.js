import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Message from "../utils/Message";
import {confirmDoubleInput} from "../utils/ConfirmInput";

const ResetPassword = (props) => {
    const [values, setValues] = useState({
        password: "",
        confirmationPassword: ""
    });
    const {password, confirmationPassword} = values;

    const [resetSuccessfully, setResetSuccessfull] = useState(false);

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleUserInput = (name) => (event) => {
        setShowMessage(false);
        setValues({...values, [name]: event.target.value});
    }

    const resetPassword = async () => {
        const queryParams = props.location.search.split("="); // Looks like ["?token", "4d2d2b71-4947-4efc-8daf-01672cede685"]
        const resetToken = queryParams[1];
        if(password === confirmationPassword){
            try{
                const apiResponse = await axios({
                    method: "PUT",
                    url: "/api/v1/user/password/reset",
                    data: {
                        reset_password_token: resetToken,
                        new_password: password
                    }
                });
                if (apiResponse.status === 204){
                    setShowMessage(true);
                    setMessageType("success");
                    setMessageText("Your password was successfully reset");
                    setResetSuccessfull(true);
                } else {
                    setShowMessage(true);
                    setMessageType("warning");
                    setMessageText("Something went wrong. Please try again.")
                }
            } catch {
                setShowMessage(true);
                setMessageType("success");
                setMessageText("Changed your user data")
            }
        } else {
            setShowMessage(true);
            setMessageType("warning");
            setMessageText("The given passwords must match")
        }

    }

    return(
        <div>
            <Form style={{width: "30%", margin: "30px auto"}}> {/** Component is styled different when it is used as child comp instead of parent comp**/}
                <h3>Reset Your Password</h3>
                <Form.Group controlId="password">
                    <Form.Label>New Password*</Form.Label>
                    <Form.Control type="password" placeholder="Enter New Password" style={confirmDoubleInput("password", "confirmationPassword")} value={password} onChange={handleUserInput("password")}/>
                </Form.Group>
                <Form.Group controlId="confirmationPassword">
                    <Form.Label>Confirm New Password*</Form.Label>
                    <Form.Control type="password" placeholder="Enter New Password" style={confirmDoubleInput("password", "confirmationPassword")} value={confirmationPassword} onChange={handleUserInput("confirmationPassword")}/>
                </Form.Group>
                <Button style={{width: "100%"}} variant="success" onClick={resetPassword}>
                    Login
                </Button>
                {showMessage && (
                    <Message message={messageText} type={messageType}/>
                )}
            </Form>
            {resetSuccessfully && (
                <div style={{width: "30%", margin: "30px auto"}}>
                    <h5>Login with your new password. <a href={"/"}>Go to Login</a></h5>
                </div>
            )}

        </div>
    )
}

export default ResetPassword;