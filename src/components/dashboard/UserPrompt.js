import React from "react";

const UserPrompt = (props) => {
    const {size} = props;

    const smallPrompt = () => {
        return (
            <h1>SMALL prompt</h1>
        )
    }

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