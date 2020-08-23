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
        <div>
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