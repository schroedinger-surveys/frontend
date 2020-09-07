import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import log from "../../../log/Logger";
import storageManager from "../../../storage/LocalStorageManager";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ShareLinks = (props) => {
    const [amount, setAmount] = useState(3);
    const [links, setLinks] = useState([]);

    const getToken = () => {
        axios({
            method: "POST",
            url: "/api/v1/token",
            headers: {
                "Authorization": storageManager.getJWTToken()
            },
            data: {
                "survey_id": props.selectedSurvey.id,
                amount
            }
        }).then((response) => {
            log.debug("Got the Tokens as response", response);
            if (response.status === 201) {
                setLinks(response.data);
            }
        }).catch((error) => {
            log.debug("could not create token", error.response)
        })
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
                <InputGroup className="mb-3" style={{width: "70%", margin: "0 auto"}}>
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
                <hr/>
                <ul>
                    {links.map((link, i) => (
                        <li key={i} id={"privateLink" + i} style={{fontSize: "10px"}}>
                            <OverlayTrigger
                                placement="right"
                                delay={{show: 250, hide: 400}}
                                overlay={renderTooltip}
                            >
                                <a onClick={copyToClipboard} style={{cursor: "pointer"}}>
                                    {window.location.protocol}://{window.location.hostname}{window.location.hostname === "localhost" ? ":3000" : ""}
                                    /s/{props.selectedSurvey.id}
                                    ?token={link.id}
                                </a>
                            </OverlayTrigger>
                        </li>
                    ))}
                </ul>
            </div>
        )
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
                    <a onClick={copyToClipboard}
                       style={{cursor: "pointer"}}>{window.location.protocol}//{window.location.hostname}{window.location.hostname === "localhost" ? ":3000" : ""}
                        /pub/{props.selectedSurvey.id}</a>
                </OverlayTrigger>
                <hr/>
                <p>Since your survey is public, everyone can take part and search for your survey here: <a
                    href={"/survey/search"}>Click to search for survey</a></p>
            </div>
        )
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