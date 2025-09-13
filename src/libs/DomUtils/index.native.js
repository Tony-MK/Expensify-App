"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getActiveElement = () => null;
const addCSS = () => { };
const getAutofilledInputStyle = () => null;
const requestAnimationFrame = (callback) => {
    if (!callback) {
        return;
    }
    callback();
};
exports.default = {
    addCSS,
    getAutofilledInputStyle,
    getActiveElement,
    requestAnimationFrame,
};
