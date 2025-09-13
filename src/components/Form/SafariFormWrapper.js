"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Browser_1 = require("@libs/Browser");
/**
 * If we used any <input> without <form> wrapper, Safari 11+ would show the auto-fill suggestion popup.
 */
function SafariFormWrapper({ children }) {
    if ((0, Browser_1.isSafari)()) {
        return <form>{children}</form>;
    }
    return children;
}
exports.default = SafariFormWrapper;
