import React from "react";
import "./Spinner.css";

/**
 * https://loading.io/css/
 * @returns {JSX.Element}
 * @constructor
 */
const LoadingScreen = () => {
    return(
        <div className={"spinnerContainer"}>
            <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <h4 style={{color: "grey"}}>loading...</h4>
        </div>
    )
}

export default LoadingScreen;