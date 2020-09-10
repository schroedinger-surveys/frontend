import React, {useEffect, useState} from "react";
import {Container, Form} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SideMenu from "../menu/side-menu/SideMenu";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import storageManager from "../../storage/LocalStorageManager";
import Message from "../utils/Message";
import {Redirect} from "react-router-dom";

const ChangeUserData = (props) => {
    const {history} = props;
    const [userData, setUserData] = useState({});
    const [newUserData, setNewUserData] = useState({
        username: "",
        email: "",
        confirmationEmail: "",
        password: "",
        confirmationPassword: "",
        oldPassword: ""
    })
    const {username, email, confirmationEmail, password, confirmationPassword, oldPassword} = newUserData;

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    const advancedUserInformation = async() => {
        const userInfoResponse = await axios({
            method: "POST",
            url: "/api/v1/user/info",
            headers: {
                "Authorization": storageManager.getJWTToken()
            }
        });
        if (userInfoResponse.status === 200){
            setUserData(userInfoResponse.data);
        }
    }

    const confirmPassword = (identification, confirmIdentification) => {
        const firstInput = document.getElementById(identification);
        const confirmInput = document.getElementById(confirmIdentification);

        if (firstInput !== null && confirmInput !== null){
            if(firstInput.value === confirmInput.value){
                return {backgroundColor: "white"};
            } else {
                return {backgroundColor: "darkred"};
            }
        }
    }

    const handleUserInput = (name) => (event) => {
        setNewUserData({...newUserData, [name]: event.target.value})
    }

    const validateInput = () => {
        if(email === "" && username === "" && password === ""){
            return {valid: false, message: "Nothing changed!", type: "warning"}
        }else if(email !== confirmationEmail){
            return {valid: false, message: "Make sure your your Emails match!", type: "danger"}
        } else if (password !== confirmationPassword){
            return {valid: false, message: "Make sure your your Passwords match!", type: "danger"}
        } else if (oldPassword !== "" && password !== "" && confirmationPassword !== "" && oldPassword === password ){
            return {valid: false, message: "New Password was already used, please choose a new one.", type: "danger"}
        } else if( oldPassword === ""){
            return {valid: false, message: "Please supply your old password!", type: "danger"}
        }
        return {valid: true, message: "Input valid", type: "success"}
    }

    const sendNewUserData = async() => {
        const validInput = validateInput();
        if (validInput.valid){
            let sendChangedData;
            if(password === ""){
               sendChangedData = await axios({
                   method: "PUT",
                   url: "/api/v1/user",
                   headers: {
                       "Authorization": storageManager.getJWTToken()
                   },
                   data: {
                       username: username !== "" ? username : null,
                       email: email !== "" ? email : null,
                       old_password: oldPassword
                   }
               })
            } else {
               sendChangedData = await axios({
                    method: "PUT",
                    url: "/api/v1/user",
                    headers: {
                        "Authorization": storageManager.getJWTToken()
                    },
                    data: {
                        username: username !== "" ? username : null,
                        email: email !== "" ? email : null,
                        old_password: oldPassword,
                        new_password: password
                    }
                })
                if(sendChangedData.status === 204){
                    storageManager.clearToken();
                    history.push("/");
                }
            }
            if (sendChangedData.status === 204){
                setShowMessage(true);
                setMessageType("success");
                setMessageText("Changed your user data")
            }
        } else {
            setShowMessage(true);
            setMessageType(validInput.type);
            setMessageText(validInput.message)
        }
    }

    useEffect(() => {
       advancedUserInformation()
    }, [])

    return(
        <Container fluid>
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                <Col xs={{span: 5, offset: 3}} style={{marginTop: "10px"}}>
                    <Row>
                        <div style={{width: "95%", margin: "0 auto"}}>
                            <label style={{fontWeight: "bold", fontSize: "21px"}}>Current Profile</label>
                            <ListGroup>
                                <ListGroup.Item>Username: <span style={{fontWeight: "bold"}}>{userData.username}</span></ListGroup.Item>
                                <ListGroup.Item>Email: <span style={{fontWeight: "bold"}}>{userData.email}</span></ListGroup.Item>
                                <ListGroup.Item>Account created at: <span style={{fontWeight: "bold"}}>{userData.created ? userData.created.substr(0, 10) : ""}</span></ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Row>
                    <hr style={{backgroundColor: "#065535"}}/>
                    <Row>
                        <Form style={{width: "95%", margin: "0 auto"}}>
                            <label style={{fontWeight: "bold", fontSize: "21px"}}>Change User Data</label>
                            <Form.Group controlId="newUsername">
                                <Form.Label style={{fontWeight: "bold"}}>Username</Form.Label>
                                <Form.Control type="text" placeholder={userData.username} value={username} onChange={handleUserInput("username")}/>
                            </Form.Group>

                            <Form.Group >
                                <Form.Label style={{fontWeight: "bold"}}>Email address</Form.Label>
                                <Form.Control id="newEmail" type="email" placeholder={userData.email} style={confirmPassword("newEmail", "newEmailConfirm")} value={email} onChange={handleUserInput("email")}/>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Confirm Email address</Form.Label>
                                <Form.Control type="email" placeholder={userData.email} id="newEmailConfirm" style={confirmPassword("newEmail", "newEmailConfirm")} value={confirmationEmail} onChange={handleUserInput("confirmationEmail")}/>
                                <Form.Text className="text-muted">
                                    Make sure your email is right and you can login.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label style={{fontWeight: "bold"}}>Password</Form.Label>
                                <Form.Control id={"newPassword"} type="password" placeholder="Password" style={confirmPassword("newPassword", "newPasswordConfirm")} value={password} onChange={handleUserInput("password")}/>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control id={"newPasswordConfirm"} type="password" placeholder="Password" style={confirmPassword("newPassword", "newPasswordConfirm")} value={confirmationPassword} onChange={handleUserInput("confirmationPassword")}/>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Old Password</Form.Label>
                                <Form.Control id={"newPasswordConfirm"} type="password" placeholder="Password" value={oldPassword} onChange={handleUserInput("oldPassword")}/>
                            </Form.Group>
                            {showMessage && (
                                <Message type={messageType} message={messageText}/>
                            )}
                            <Button variant="success" onClick={sendNewUserData}>
                                Submit Changes
                            </Button>
                        </Form>
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}

export default ChangeUserData;