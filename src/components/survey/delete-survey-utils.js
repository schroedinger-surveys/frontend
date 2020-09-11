import React from "react";
import axios from "axios";
import storageManager from "../../storage/LocalStorageManager";
import Modal from "react-bootstrap/Modal";
import Message from "../utils/Message";
import Button from "react-bootstrap/Button";

export const deleteSurveyRequest = async(id) => {
    const deleteSurveyResponse = await axios({
        method: "DELETE",
        url: "/api/v1/survey/"+ id,
        headers: {
            "Authorization": storageManager.getJWTToken()
        }
    });
    return deleteSurveyResponse.status;
}

export const DeleteModal = (props) => {
    const {parameter} = props;
    return(
        <Modal show={parameter.showDeleteModal} onHide={parameter.closeFunction}>
            <Modal.Header closeButton>
                <Modal.Title>Deleting your user account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure that you want to delete this survey. All data will be lost forever!
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={parameter.closeFunction}>
                    Rather not
                </Button>
                <Button variant="danger" onClick={parameter.deleteSurvey}>
                    Yes, i am sure
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
