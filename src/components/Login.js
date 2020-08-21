import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {
    return (
        <Form>
            <h3>Login to your user account</h3>

            <Form.Group controlId="username">
                <Form.Label>Username*</Form.Label>
                <Form.Control type="username" placeholder="Enter username"/>
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password*</Form.Label>
                <Form.Control type="password" placeholder="Password"/>
            </Form.Group>

            <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me"/>
            </Form.Group>

            <Button style={{width: "100%"}} variant="success" type="submit">
                Login
            </Button>
        </Form>
    )
}
export default Login;