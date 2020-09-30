import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import SideMenu from "../menu/SideMenu";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import storageManager from "../../storage/StorageManager";
import Message from "../utils/Message";
import Modal from "react-bootstrap/Modal";
import log from "../../log/Logger";
import {confirmDoubleInput} from "../utils/ConfirmInput";
import UserAPIHandler from "../../calls/user";
import AppNavbar from "../menu/AppNavbar";
import {EuropeanTime} from "../utils/TimeConverter";

const ChangeUserData = (props) => {
    const {history} = props;

    const [showModal, setShowModal] = useState(false);

    const [userData, setUserData] = useState({});
    const [newUserData, setNewUserData] = useState({
        username: "",
        email: "",
        confirmationEmail: "",
        password: "",
        confirmationPassword: "",
        oldPassword: "",
        confirmDeleteUsername: "",
        confirmDeletePassword: ""
    })
    const {username, email, confirmationEmail, password, confirmationPassword, oldPassword, confirmDeleteUsername, confirmDeletePassword} = newUserData;

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    const [showMessageDelete, setShowMessageDelete] = useState(false);
    const [messageTextDelete, setMessageTextDelete] = useState("");
    const [messageTypeDelete, setMessageTypeDelete] = useState("");

    const advancedUserInformation = async () => {
        const apiResponse = await UserAPIHandler.cacheMiddleware(UserAPIHandler.getUserInfo, "userData");
        setUserData(apiResponse);

    }

    const handleUserInput = (name) => (event) => {
        setShowMessage(false);
        setShowMessageDelete(false);
        setNewUserData({...newUserData, [name]: event.target.value})
    }

    const validateInput = () => {
        if (email === "" && username === "" && password === "") {
            return {valid: false, message: "Nothing changed!", type: "warning"}
        } else if (email !== confirmationEmail) {
            return {valid: false, message: "Make sure your your Emails match!", type: "danger"}
        } else if (password !== confirmationPassword) {
            return {valid: false, message: "Make sure your your Passwords match!", type: "danger"}
        } else if (oldPassword !== "" && password !== "" && confirmationPassword !== "" && oldPassword === password) {
            return {valid: false, message: "New Password was already used, please choose a new one.", type: "danger"}
        } else if (oldPassword === "") {
            return {valid: false, message: "Please supply your old password!", type: "danger"}
        }
        return {valid: true, message: "Input valid", type: "success"}
    }

    const sendNewUserData = async (event) => {
        event.preventDefault();
        const validInput = validateInput();
        if (validInput.valid) {
            let apiResponse;
            if (password === "") {
                apiResponse = await UserAPIHandler.changeUserData(username, email, oldPassword);
            } else {
                apiResponse = await UserAPIHandler.changeUserPassword(username, email, oldPassword, password);
                // Logout the user immediately and send to Home
                if (apiResponse.status === 204) {
                    storageManager.clearToken();
                    await UserAPIHandler.userLogout();
                    history.push("/");
                }
            }
            if (apiResponse.status === 204) {
                setShowMessage(true);
                setMessageType("success");
                setMessageText("Change successful.");
                storageManager.clearUserCache();
            } else {
                setShowMessage(true);
                setMessageType("danger");
                setMessageText(apiResponse.backend.data.human_message || "Something went wrong. Please try again.");
                log.debug(apiResponse.log);
            }
        } else {
            setShowMessage(true);
            setMessageType(validInput.type);
            setMessageText(validInput.message)
        }
    }

    const deleteUserModal = () => {
        return (
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting your user account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    To confirm that you want to delete your user account, please provide your <span
                    style={{fontWeight: "bold"}}>username</span> and <span style={{fontWeight: "bold"}}>password</span>.
                    <hr/>
                    <Form.Group controlId="username">
                        <Form.Label>Username*</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" value={confirmDeleteUsername}
                                      onChange={handleUserInput("confirmDeleteUsername")}/>
                    </Form.Group>
                    <Form.Group controlId="username">
                        <Form.Label>Current Password*</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" value={confirmDeletePassword}
                                      onChange={handleUserInput("confirmDeletePassword")}/>
                    </Form.Group>
                    {showMessageDelete && <Message type={messageTypeDelete} message={messageTextDelete}/>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Rather not
                    </Button>
                    <Button variant="danger" onClick={deleteUser}>
                        Yes, delete my account
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const deleteUser = async () => {
        if (confirmDeleteUsername === userData.username) {
            const apiResponse = await UserAPIHandler.userDelete(confirmDeletePassword);
            if (apiResponse.status === 200) {
                storageManager.clearToken();
                await UserAPIHandler.userLogout();
                history.push("/");
            } else {
                log.debug("User could not be deleted", apiResponse.log);
                setShowMessageDelete(true);
                setMessageTypeDelete("danger");
                setMessageTextDelete("Please check the given credentials and try again.");
            }
        } else {
            setShowMessageDelete(true);
            setMessageTypeDelete("danger");
            setMessageTextDelete("Username does not match. Pleased check and try again.");
        }
    }

    useEffect(() => {
        advancedUserInformation()
    }, [])

    const ChangeDataComponent = () => {
        return (
            <div className={"change_user_data_container"}>
                <div style={{marginTop: "10px"}}>
                    {deleteUserModal()}
                    <Row>
                        <div style={{width: "95%", margin: "0 auto"}}>
                            <label className={"change_user_data_label"} style={{fontWeight: "bold", fontSize: "21px"}}>Current Profile</label>
                            <ListGroup>
                                <ListGroup.Item>
                                    <p className={"current_data_p current_data_left"}>Username:</p>
                                    <p className={"current_data_p"} style={{fontWeight: "bold"}}>{userData.username}</p></ListGroup.Item>
                                <ListGroup.Item>
                                    <p className={"current_data_p current_data_left"}>Email:</p>
                                    <p className={"current_data_p"} style={{fontWeight: "bold"}}>{userData.email}</p></ListGroup.Item>
                                <ListGroup.Item>
                                    <p className={"current_data_p current_data_left"}>Account created at:</p>
                                    <p className={"current_data_p"} style={{fontWeight: "bold"}}>{userData.created ? EuropeanTime(userData.created.substr(0, 10)) : ""}</p></ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Row>
                    <hr/>
                    <Row>
                        <Form style={{width: "95%", margin: "0 auto"}}>
                            <label className={"change_user_data_label"}>Change User Data</label>
                            <Form.Group controlId="newUsername">
                                <Form.Label style={{fontWeight: "bold"}}>Username</Form.Label>
                                <Form.Control type="text" placeholder={userData.username} value={username}
                                              onChange={handleUserInput("username")}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label style={{fontWeight: "bold"}}>Email address</Form.Label>
                                <Form.Control id="newEmail" type="email" placeholder={userData.email}
                                              style={confirmDoubleInput("newEmail", "newEmailConfirm")}
                                              value={email}
                                              onChange={handleUserInput("email")}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Confirm Email address</Form.Label>
                                <Form.Control type="email" placeholder={userData.email} id="newEmailConfirm"
                                              style={confirmDoubleInput("newEmail", "newEmailConfirm")}
                                              value={confirmationEmail}
                                              onChange={handleUserInput("confirmationEmail")}/>
                                <Form.Text className="text-muted">
                                    Make sure your email is right and you can login.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label style={{fontWeight: "bold"}}>Password</Form.Label>
                                <Form.Control id={"newPassword"} type="password" placeholder="Password"
                                              style={confirmDoubleInput("newPassword", "newPasswordConfirm")}
                                              value={password} onChange={handleUserInput("password")}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control id={"newPasswordConfirm"} type="password" placeholder="Password"
                                              style={confirmDoubleInput("newPassword", "newPasswordConfirm")}
                                              value={confirmationPassword}
                                              onChange={handleUserInput("confirmationPassword")}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label style={{fontWeight: "bold"}}>Current Password*</Form.Label>
                                <Form.Control id={"newPasswordConfirm"} type="password" placeholder="Password"
                                              value={oldPassword} onChange={handleUserInput("oldPassword")}/>
                            </Form.Group>
                            {showMessage && (
                                <Message type={messageType} message={messageText}/>
                            )}
                            <button className={"submit_changes_user_data"} onClick={sendNewUserData}>
                                Submit Changes
                            </button>
                        </Form>
                    </Row>
                    <hr style={{backgroundColor: "lightgrey"}}/>
                    <Row>
                        <div style={{width: "95%", margin: "0 auto"}}>
                            <Button variant={"outline-danger"} onClick={() => setShowModal(true)}>Delete User
                                account</Button>
                        </div>
                    </Row>
                </div>
            </div>
        )
    }

    return (
        <div className={"app_wrapper"}>
            <AppNavbar/>
            <SideMenu/>
            <div id={"app_page_body"}>
                {ChangeDataComponent()}
            </div>
        </div>
    )
}

export default ChangeUserData;