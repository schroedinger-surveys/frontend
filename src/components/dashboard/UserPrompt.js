import React from "react";

/**
 * A Prompt telling/showing the user how to create a survey/use the app
 * scenario: User has no surveys yet
 * @param props
 * size (prop) - there is a small prompt for the SurveyList and a large prompt for the survey-spotlight
 * @returns {JSX.Element}
 * @constructor
 */
const UserPrompt = (props) => {
    const {size} = props;

    /**
     * Displayed instead of the component SurveyList in the Dashboard
     * @returns {JSX.Element}
     */
    const smallPrompt = () => {
        return (
            <h1>SMALL prompt</h1>
        )
    }

    /**
     * Displayed instead of the component survey-spotlight in the Dashboard
     * @returns {JSX.Element}
     */
    const largePrompt = () => {
        return (
            <h1>LARGE prompt</h1>
        )
    }

    return (
        <div style={{width: "100%", padding: "5px", border: "1px solid lightgrey", borderRadius: "8px"}}>
            {size === "small" && (
                smallPrompt()
            )}
            {size === "large" && (
                largePrompt()
            )}
        </div>
    )
}

export default UserPrompt;