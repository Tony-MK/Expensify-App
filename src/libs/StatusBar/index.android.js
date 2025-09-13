"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const setBackgroundColor = types_1.default.setBackgroundColor;
let statusBarColor = null;
types_1.default.getBackgroundColor = () => statusBarColor;
types_1.default.setBackgroundColor = (color, animated = false) => {
    statusBarColor = color;
    setBackgroundColor(color, animated);
};
exports.default = types_1.default;
