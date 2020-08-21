import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import log from "../log/Logger";

const Register = (props) => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: ""
    })
    const {username, email, password} = values;
    const {single} = props;

    const registerNewUser = (event) => {
        event.preventDefault();
        log.debug("Someone wants to register a user account");

    }

    const handleUserInput = (valueName) => (event) => {
        setValues({...values, [valueName]: event.target.value})
    }

    return(
        <Form style={{width: single ? "30%" : "100%"}}>
            <h3>Register a new user account</h3>
            <Form.Group controlId="username">
                <Form.Label>Username*</Form.Label>
                <Form.Control type="username" placeholder="Enter username" value={username} onChange={handleUserInput("username")}/>
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Email address*</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleUserInput("email")}/>
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password*</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={handleUserInput("password")}/>
            </Form.Group>
            <Button style={{width: "100%"}} variant="success" type="submit" onClick={registerNewUser}>
                Register
            </Button>
        </Form>
    )
}
export default Register;