"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateGlobalBackgroundColor = (theme) => {
    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.style.setProperty('background-color', theme.appBG);
};
exports.default = updateGlobalBackgroundColor;
