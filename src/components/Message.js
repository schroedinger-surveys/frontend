import React from "react";
import Alert from "react-bootstrap/Alert";

const Message = (props) => {
    const {message, type} = props;

    return (
        <Alert variant={type}>{message}</Alert>
    )
}

export default Message;