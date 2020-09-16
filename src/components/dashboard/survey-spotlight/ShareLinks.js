import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import log from "../../../log/Logger";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Message from "../../utils/Message";
import {createToken, getSurveyToken, sendLinkPerMail} from "../../../calls/token";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

const ShareLinks = (props) => {
    const [amount, setAmount] = useState(3);
    const [links, setLinks] = useState([]);
    const [emails, setEmails] = useState("");

    const [unusedToken, setUnusedToken] = useState([]);
    const [usedToken, setUsedToken] = useState([]);

    /**
     * Used as props for the child Component Message
     * showMessage: state of visibility of component Message
     * messageText: string containing the message to be displayed
     * messageType: "danger" || "success" - based off of bootstrap colors
     */
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");

    const getToken = async () => {
        const apiResponse = await createToken(props.selectedSurvey.id, amount);
        if (apiResponse.status === 201) {
            setLinks(apiResponse.data);
        } else {
            setMessageType("waring");
            setMessageText("Token could not be created. Please try again.");
            setShowMessage(true);
            log.debug(apiResponse.log);
        }
    }

    const privateSurvey = () => {
        return (
            <div>
                <p>Create Share-Links so friends, colleagues or even strangers can only submit answers to your survey if
                    you
                    invite them to</p>
                <p>Attention: The Links will be created and you have to copy and save them at a place for your eyes
                    only. We
                    do not save them for you (yet).</p>
                <InputGroup className="mb-3" style={{width: "70%"}}>
                    <InputGroup.Append>
                        <InputGroup.Text id="basic-addon2" style={{borderRadius: "5px 0 0 5px"}}>Amount of
                            Links</InputGroup.Text>
                    </InputGroup.Append>
                    <FormControl
                        type={"number"}
                        placeholder="30"
                        value={amount}
                        onChange={(event) => setAmount(Number(event.target.value))}
                        aria-label="Amount of Links"
                        aria-describedby="basic-addon2"
                    />
                    <InputGroup.Append>
                        <Button variant="outline-success" onClick={getToken}>Create</Button>
                    </InputGroup.Append>
                </InputGroup>
                <ul>
                    {links.map((link, i) => (
                        <li key={i} id={"privateLink" + i} style={{fontSize: "10px"}}>
                            <OverlayTrigger
                                placement="right"
                                delay={{show: 250, hide: 400}}
                                overlay={renderTooltip}
                            >
                                <button onClick={copyToClipboard}
                                        style={{cursor: "pointer", border: "none", backgroundColor: "transparent"}}>
                                    {window.location.protocol}://{window.location.hostname}{window.location.hostname === "localhost" ? ":3000" : ""}
                                    /s/{props.selectedSurvey.id}
                                    ?token={link.id}
                                </button>
                            </OverlayTrigger>
                        </li>
                    ))}
                </ul>
                <hr/>
                <ul>
                    {unusedToken.map((token, i) => (
                        <li style={{fontSize: "13px"}} key={i}>created: {token.created.substr(0, 10)}<br/>
                            <span style={{fontSize: "11px"}}>{window.location.protocol}://{window.location.hostname}{window.location.hostname === "localhost" ? ":3000" : ""}
                            /s/{props.selectedSurvey.id}
                                ?token={token.id}</span>
                        </li>
                    ))}
                </ul>
                <hr/>
                {sendLinkPerMailForm()}
            </div>
        )
    }

    useEffect(() => {
        createdAndUsedToken();
    }, [])

    const createdAndUsedToken = async () => {
        const apiResponseUnusedToken = await getSurveyToken(props.selectedSurvey.id, false);
        if (apiResponseUnusedToken.status === 200){
            setUnusedToken(apiResponseUnusedToken.data);
        }

        const apiResponseUsedToken = await getSurveyToken(props.selectedSurvey.id, true);
        if (apiResponseUsedToken.status === 200){
            setUsedToken(apiResponseUsedToken.data);
        }
    }

    /**
     * https://www.30secondsofcode.org/blog/s/copy-text-to-clipboard-with-javascript
     * @param event
     */
    const copyToClipboard = (event) => {
        const link = event.target.innerText;
        const tempElement = document.createElement("textarea");
        tempElement.value = link;
        document.body.appendChild(tempElement);
        tempElement.select();
        document.execCommand("copy");
        document.body.removeChild(tempElement)
    }

    const renderTooltip = (settings) => (
        <Tooltip id="button-tooltip" {...settings}>
            Copy to Clipboard
        </Tooltip>
    );

    const publicSurvey = () => {
        return (
            <div>
                <p>Share your Survey trough the following link:</p>
                <OverlayTrigger
                    placement="right"
                    delay={{show: 250, hide: 400}}
                    overlay={renderTooltip}
                >
                    <button onClick={copyToClipboard}
                            style={{
                                cursor: "pointer",
                                border: "none",
                                backgroundColor: "transparent"
                            }}>{window.location.protocol}//{window.location.hostname}{window.location.hostname === "localhost" ? ":3000" : ""}
                        /pub/{props.selectedSurvey.id}</button>
                </OverlayTrigger>
                <p>Since your survey is public, everyone can take part and search for your survey here: <a
                    href={"/survey/search"}>Click to search for survey</a></p>
            </div>
        )
    }

    const sendLinkPerMailForm = () => {
        return (
            <div>
                <p>You can send a link to open and answer the survey to as many people as you like.</p>
                <p><span style={{fontWeight: "bold"}}>Attention:</span> Separate Emails with a comma</p>
                <InputGroup>
                    <FormControl
                        type={"email"}
                        as={"textarea"}
                        rows={3}
                        value={emails}
                        onChange={(event) => setEmails(event.target.value)}
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>
                {showMessage && <Message type={messageType} message={messageText}/>}
                <Button variant={"outline-success"} style={{marginTop: "10px"}} onClick={sendToToken}>Send Token Per
                    Mail</Button>
            </div>
        )
    }

    const sendToToken = async () => {
        const mails = emails.split(",");
        for (let i = 0; i < mails.length; i++) {
            mails[i] = mails[i].trim()
        }
        const apiResponse = await sendLinkPerMail(props.selectedSurvey.id, mails);
        if (apiResponse.status === 201 || apiResponse.status === 204) {
            setShowMessage(true);
            setMessageType("success");
            setMessageText("Links were sent by mail to all receivers in the given list.");
        } else {
            setShowMessage(true);
            setMessageType("danger");
            setMessageText("Something went wrong. Please try again.");
        }
    }

    return (
        <div>
            {props.selectedSurvey && props.selectedSurvey.secured && (
                privateSurvey()
            )}
            {props.selectedSurvey && !props.selectedSurvey.secured && (
                publicSurvey()
            )}
        </div>
    )


}

const mapStateToProps = (state) => {
    return {
        selectedSurvey: state.selectedSpotlight
    }
}

export default connect(mapStateToProps)(ShareLinks);