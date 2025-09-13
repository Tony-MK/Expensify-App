"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clipboard_1 = require("@react-native-clipboard/clipboard");
/**
 * Sets a string on the Clipboard object via @react-native-clipboard/clipboard
 */
const setString = (text) => {
    clipboard_1.default.setString(text);
};
// We don't want to set HTML on native platforms so noop them.
const canSetHtml = () => false;
const setHtml = () => { };
exports.default = {
    setString,
    canSetHtml,
    setHtml,
};
