import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


export const DeleteModal = (props) => {
    const {parameter} = props;
    return(
        <Modal show={parameter.showDeleteModal} onHide={parameter.closeFunction}>
            <Modal.Header closeButton>
                <Modal.Title>Deleting this survey</Modal.Title>
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
