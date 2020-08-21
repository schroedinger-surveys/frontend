import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import log from "../log/Logger";

const Login = (props) => {
    const [values, setValues] = useState({
        username: "",
        password: ""
    })
    const {username, password} = values;
    const {single} = props;

    const login = (event) => {
        event.preventDefault();
        log.debug("user wants to login")
    }

    const handleUserInput = (valueName) => (event) => {
        setValues({...values, [valueName]: event.target.value})
    }

    return (
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

            <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me"/>
            </Form.Group>

            <Button style={{width: "100%"}} variant="success" type="submit" onClick={login}>
                Login
            </Button>
            {username}
            {password}
        </Form>
    )
}
export default Login;