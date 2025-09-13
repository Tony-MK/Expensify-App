"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
/**
 * Android only - convert RTL text to a LTR text using Unicode controls.
 * https://www.w3.org/International/questions/qa-bidi-unicode-controls
 */
const convertToLTR = (text) => `${CONST_1.default.UNICODE.LTR}${text}`;
exports.default = convertToLTR;
