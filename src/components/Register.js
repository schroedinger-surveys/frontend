import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Register = () => {
    return(
        <Form>
            <h3>Register a new user account</h3>

            <Form.Group controlId="username">
                <Form.Label>Username*</Form.Label>
                <Form.Control type="username" placeholder="Enter username" />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email address*</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password*</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button style={{width: "100%"}} variant="success" type="submit">
                Register
            </Button>
        </Form>
    )
}
export default Register;