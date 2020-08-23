import React from "react";

import cat from "./001-cat.png";
import cat2 from "./002-idea.png";
import cat3 from "./003-kitty.png";
import cat4 from "./004-kitty-1.png";
import cat5 from"./005-kitty-2.png";
import cat6 from "./006-kitty-3.png";
import cat7 from "./007-kitty-4.png";
import cat8 from "./008-kitty-5.png";
import cat9 from "./009-kitty-6.png";

const RandomIcon = () => {
    const icons = [cat, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9];

    const randomIndex = () => {
        return Math.floor(Math.random() * icons.length);
    }

    return(
        <img src={icons[randomIndex()]} style={{width: "70px"}} alt={"random cat icon"}/>
    )
}

export default RandomIcon;