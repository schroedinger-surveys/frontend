import React, {useEffect} from "react";
import SideMenu from "../menu/side-menu/SideMenu";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

/**
 * scenario: User clicks on used token in ShareLinks and is directed to the submission belonging to it
 * @returns {JSX.Element}
 * @constructor
 */
const UsedTokenSubmission = () => {
    return(
        <Container fluid>
            <Row>
                <Col xs={1} style={{padding: 0}}>
                    <SideMenu/>
                </Col>
                <Col xs={{ span: 4, offset: 4 }}>
                    HEllo this is submission
                </Col>
            </Row>

        </Container>
    )
}

export default UsedTokenSubmission;