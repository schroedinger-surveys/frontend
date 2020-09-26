import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import log from "../../../log/Logger";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Message from "../../utils/Message";
import TokenAPIHandler from "../../../calls/token";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

const ShareLinks = (props) => {
    const itemsPerPage = 5;
    const [amount, setAmount] = useState(3);
    const [links, setLinks] = useState([]);
    const [emails, setEmails] = useState("");

    const [unusedToken, setUnusedToken] = useState([]);
    const [usedToken, setUsedToken] = useState([]);
    const [loadingToken, setLoadingToken] = useState(true);

    const [currentPageUnusedToken, setCurrentPageUnusedToken] = useState(0);

    const [unusedTokenCount, setUnusedTokenCount] = useState(0);
    const [usedTokenCount, setUsedTokenCount] = useState(0);

    const [chosenSubmissionId, setChosenSubmissionId] = useState("");
    const [chosenSubmissionToken, setChosenSubmissionToken] = useState("");
    const [redirectToUsedTokenSubmission, setRedirectToUsedTokenSubmission] = useState(false);

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
        const apiResponse = await TokenAPIHandler.createToken(props.selectedSurvey.id, amount);
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
            <div className={"share_links_container"}>
                <p>Create Share-Links so friends, colleagues or even strangers can only submit answers to your survey if
                    you
                    invite them to</p>
                <p>Attention: The Links will be created and you have to copy and save them at a place for your eyes
                    only. We
                    do not save them for you (yet).</p>
                <InputGroup className="mb-3 share_links_amount_group">
                    <InputGroup.Append>
                        <InputGroup.Text id="basic-addon2" className={"share_links_amount_label"}>Amount of
                            Links</InputGroup.Text>
                    </InputGroup.Append>
                    <FormControl
                        className={"share_links_amount_input"}
                        type={"number"}
                        placeholder="30"
                        value={amount}
                        onChange={(event) => setAmount(Number(event.target.value))}
                        aria-label="Amount of Links"
                        aria-describedby="basic-addon2"
                    />
                    <InputGroup.Append>
                        <button className={"share_links_btn"} onClick={getToken}>Create</button>
                    </InputGroup.Append>
                </InputGroup>
                <ul className={"share_links_private_ul"}>
                    {links.map((link, i) => (
                        <li key={i} id={"privateLink" + i} className={"share_links_private_links"}>
                            <OverlayTrigger
                                placement="right"
                                delay={{show: 250, hide: 400}}
                                overlay={renderTooltip}
                            >
                                <button onClick={copyToClipboard}
                                        className={"share_links_private_links_copy"}>
                                    {window.location.protocol}://{window.location.hostname}{window.location.hostname === "localhost" ? ":3000" : ""}
                                    /s/{props.selectedSurvey.id}
                                    ?token={link.id}
                                </button>
                            </OverlayTrigger>
                        </li>
                    ))}
                </ul>
                {(unusedToken.length > 0 || usedToken.length > 0) && !loadingToken && (
                    <div>
                        <hr/>
                        <Accordion>
                            {unusedToken.length > 0 && displayUnusedToken()}
                            {usedToken.length > 0 && displayUsedToken()}
                        </Accordion>
                    </div>
                )}
                <hr/>
                {sendLinkPerMailForm()}
            </div>
        )
    }

    const unusedTokenPagination = () => {
        const changePage = async (index) => {
            const apiResponseUnusedToken = await TokenAPIHandler.getSurveyToken(props.selectedSurvey.id, false, index, itemsPerPage);
            if (apiResponseUnusedToken.status === 200) {
                setUnusedToken(apiResponseUnusedToken.data);
                setCurrentPageUnusedToken(index);
            }
        }

        const pages = Math.ceil(unusedTokenCount / itemsPerPage);
        return createPaginationMarker(pages, changePage);
    }

    const usedTokenPagination = () => {
        const changePage = async (index) => {
            const apiResponse = await TokenAPIHandler.getSurveyToken(props.selectedSurvey.id, true, index, itemsPerPage);
            if (apiResponse.status === 200) {
                setUsedToken(apiResponse.data);
                setCurrentPageUnusedToken(index);
            }
        }

        const pages = Math.ceil(usedTokenCount / itemsPerPage);
        return createPaginationMarker(pages, changePage);
    }

    const createPaginationMarker = (pages, clickMethod) => {
        let li = [];
        for (let i = 0; i < pages; i++) {
            li.push(<li key={i} style={{display: "inline", marginRight: "10px", cursor: "pointer"}}
                        onClick={() => clickMethod(i)}>{i + 1}</li>)
        }

        return (
            <div style={{width: "100%"}}>
                <ul style={{listStyle: "none"}}>
                    {li}
                </ul>
            </div>
        )
    }

    const displayUnusedToken = () => {
        const deleteToken = async (token) => {
            const apiResponse = await TokenAPIHandler.tokenDelete(token.id);
            if (apiResponse.status === 204) {
                log.debug("Token was deleted");
                await createdAndUsedToken();
            } else {
                log.debug("Token could not be deleted");
            }
        }

        return (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0" style={{color: "grey"}}>
                        Unused Tokens
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        {unusedTokenCount > itemsPerPage && unusedTokenPagination()}
                        <ul>
                            {unusedToken.map((token, i) => (
                                <li style={{fontSize: "13px"}} key={i}>created: {token.created.substr(0, 10)}<br/>
                                    <span
                                        style={{fontSize: "11px"}}>{window.location.protocol}://{window.location.hostname}{window.location.hostname === "localhost" ? ":3000" : ""}
                                        /s/{props.selectedSurvey.id}
                                        ?token={token.id}</span>
                                    <button style={{border: "none", backgroundColor: "transparent", float: "right"}}
                                            onClick={() => deleteToken(token)}
                                    >
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash"
                                             fill="currentColor"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fillRule="evenodd"
                                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    const displayUsedToken = () => {
        return (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1" style={{color: "grey"}}>
                        Used Tokens
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        {usedTokenCount > itemsPerPage && usedTokenPagination()}
                        <ul>
                            {usedToken.map((token, i) => (
                                <li style={{fontSize: "13px"}} key={i}>created: {token.created.substr(0, 10)}<br/>
                                    <span
                                        style={{fontSize: "11px"}}>{window.location.protocol}://{window.location.hostname}{window.location.hostname === "localhost" ? ":3000" : ""}
                                        /s/{props.selectedSurvey.id}
                                        ?token={token.id}</span>
                                    <button style={{border: "none", backgroundColor: "transparent", float: "right"}}
                                            onClick={() => setChosenSubmission(token)}
                                    >
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search"
                                             fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                                            <path fillRule="evenodd"
                                                  d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    const setChosenSubmission = (token) => {
        setChosenSubmissionToken(token.id);
        setChosenSubmissionId(token.submission_id);
        setRedirectToUsedTokenSubmission(true);
    }

    const redirectToSubmission = () => {
        return (
            <Redirect to={{
                pathname: "/submission/" + chosenSubmissionId,
                state: {
                    submission_id: chosenSubmissionId,
                    token: chosenSubmissionToken
                }
            }}/>
        )
    }

    useEffect(() => {
        setLoadingToken(true);
        createdAndUsedToken();
    }, [links, props.selectedSurvey])

    const createdAndUsedToken = async () => {
        const apiResponseUnusedToken = await TokenAPIHandler.getSurveyToken(props.selectedSurvey.id, false, currentPageUnusedToken);
        if (apiResponseUnusedToken.status === 200) {
            setUnusedToken(apiResponseUnusedToken.data);
        }
        const apiResponseUnusedTokenCount = await TokenAPIHandler.tokenCount(props.selectedSurvey.id, false);
        if (apiResponseUnusedTokenCount.status === 200) {
            setUnusedTokenCount(apiResponseUnusedTokenCount.data.count);
            log.debug("Count of usedToken", apiResponseUnusedTokenCount.data.count)
        }

        const apiResponseUsedToken = await TokenAPIHandler.getSurveyToken(props.selectedSurvey.id, true);
        if (apiResponseUsedToken.status === 200) {
            setUsedToken(apiResponseUsedToken.data);
        }
        const apiResponseUsedTokenCount = await TokenAPIHandler.tokenCount(props.selectedSurvey.id, true);
        if (apiResponseUsedTokenCount.status === 200) {
            setUsedTokenCount(apiResponseUsedTokenCount.data.count);
            log.debug("Count of usedToken", apiResponseUsedTokenCount.data.count)
        }
        setLoadingToken(false);
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
                <button className={"send_links_mail"} onClick={sendToToken}>Send Token Per
                    Mail</button>
            </div>
        )
    }

    const sendToToken = async () => {
        const mails = emails.split(",");
        for (let i = 0; i < mails.length; i++) {
            mails[i] = mails[i].trim()
        }
        const apiResponse = await TokenAPIHandler.sendLinkPerMail(props.selectedSurvey.id, mails);
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
            {redirectToUsedTokenSubmission && redirectToSubmission()}
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
