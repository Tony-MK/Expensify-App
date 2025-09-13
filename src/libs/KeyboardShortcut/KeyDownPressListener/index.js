"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeKeyDownPressListener = exports.addKeyDownPressListener = void 0;
const addKeyDownPressListener = (callbackFunction) => {
    document.addEventListener('keydown', callbackFunction);
};
exports.addKeyDownPressListener = addKeyDownPressListener;
const removeKeyDownPressListener = (callbackFunction) => {
    document.removeEventListener('keydown', callbackFunction);
};
exports.removeKeyDownPressListener = removeKeyDownPressListener;
