import React from "react";
import Alert from "react-bootstrap/Alert";

/**
 * Shows a given message in a style based on given type
 * @param props:
 * (prop) message - is a string containing the message to be displayed
 * (prop) type - is a string representing a bootstrap color "danger" || "success" used as variant in Alert
 * @returns {JSX.Element} Alert
 * @constructor
 */
const Message = (props) => {
    const {message, type} = props;

    return (
        <Alert variant={type}>{message}</Alert>
    )
}

export default Message;