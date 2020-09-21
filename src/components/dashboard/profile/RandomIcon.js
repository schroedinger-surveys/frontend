import React from "react";

import cat from "./icons/001-cat.png";
import cat2 from "./icons/002-idea.png";
import cat3 from "./icons/003-kitty.png";
import cat4 from "./icons/004-kitty-1.png";
import cat5 from "./icons/005-kitty-2.png";
import cat6 from "./icons/006-kitty-3.png";
import cat7 from "./icons/007-kitty-4.png";
import cat8 from "./icons/008-kitty-5.png";
import cat9 from "./icons/009-kitty-6.png";

/**
 * Picks a random image as source of the img tag
 * scenario: Used in profile component to greet the user with a changing icon for every render/reload of the page
 * @returns {JSX.Element}
 */
const RandomIcon = () => {
    const icons = [cat, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9];

    const randomIndex = () => {
        return Math.floor(Math.random() * icons.length);
    }

    return(
        <div>
            <img src={icons[randomIndex()]} style={{width: "70px"}} alt={"curious cat creates and analyzes surveys"}/>
        </div>
    )
}

export default RandomIcon;