import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Message from "../utils/Message";
import {confirmDoubleInput} from "../utils/ConfirmInput";
import UserAPIHandler from "../../calls/user";
import NavbarMenu from "../menu/NavbarMenu";
import Footer from "./Footer";
import logFactory from "../../utils/Logger";
const log = logFactory("src/components/home/ResetPassword.js");

const ResetPassword = (props) => {
    const [values, setValues] = useState({
        password: "",
        confirmationPassword: ""
    });
    const {password, confirmationPassword} = values;

    const [resetSuccessfully, setResetSuccessfull] = useState(false);

    const [reseting, setReseting] = useState(false);

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

    const resetPassword = async (event)  => {
        event.preventDefault();
        setReseting(true);
        const queryParams = props.location.search.split("="); // Looks like ["?token", "4d2d2b71-4947-4efc-8daf-01672cede685"]
        const resetToken = queryParams[1];
        if(password === confirmationPassword){
                const apiResponse = await UserAPIHandler.userResetPassword(resetToken, password);
                if (apiResponse.status === 204){
                    setShowMessage(true);
                    setMessageType("success");
                    setMessageText("Your password was successfully reset.");
                    setResetSuccessfull(true);
                } else {
                    setShowMessage(true);
                    setMessageType("warning");
                    setMessageText("Something went wrong. Please try again.");
                    log.debug(apiResponse.log);
                }
        } else {
            setShowMessage(true);
            setMessageType("warning");
            setMessageText("The given passwords must match")
        }
        setReseting(false);
    }

    const ResetPasswordComponent = () => {
        return(
            <div className={"home_form"}>
                <Form>
                    <h3>Reset Your Password</h3>
                    <Form.Group controlId="password">
                        <Form.Label>New Password*</Form.Label>
                        <Form.Control type="password" placeholder="Enter New Password" style={confirmDoubleInput("password", "confirmationPassword")} value={password} onChange={handleUserInput("password")}/>
                    </Form.Group>
                    <Form.Group controlId="confirmationPassword">
                        <Form.Label>Confirm New Password*</Form.Label>
                        <Form.Control type="password" placeholder="Enter New Password" style={confirmDoubleInput("password", "confirmationPassword")} value={confirmationPassword} onChange={handleUserInput("confirmationPassword")}/>
                    </Form.Group>
                    <button className={"home_btn"} onClick={resetPassword}>
                        {reseting && <i className="fa fa-circle-o-notch fa-spin"/>}
                        {!reseting && "Reset Password"}
                    </button>
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

    return(
        <div className={"comp_wrapper"}>
            <NavbarMenu/>
            <div id={"page_body"}>
                {ResetPasswordComponent()}
            </div>
            <Footer/>
        </div>
    )
}

export default ResetPassword;