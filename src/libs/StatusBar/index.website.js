"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
types_1.default.getBackgroundColor = () => {
    const element = document.querySelector('meta[name=theme-color]');
    if (!element?.content) {
        return null;
    }
    return element.content;
};
types_1.default.setBackgroundColor = (backgroundColor) => {
    const element = document.querySelector('meta[name=theme-color]');
    if (!element) {
        return;
    }
    element.content = backgroundColor;
};
exports.default = types_1.default;
