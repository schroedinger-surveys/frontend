import React from "react";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

const CreateSurveyButton = () => {
    const history = useHistory();

    return(
        <div style={{width: "100%", border: "1px solid lightgrey", padding: "5px", borderRadius: "8px", textAlign: "center", marginTop: "10px"}}>
            <h3>Create A New Survey:</h3>
            <Button variant="success" onClick={() => history.push("/survey/create")}>New Survey</Button>
        </div>
    )
}

export default CreateSurveyButton;