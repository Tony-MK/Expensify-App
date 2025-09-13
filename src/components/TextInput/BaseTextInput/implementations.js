"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RNMarkdownTextInput_1 = require("@components/RNMarkdownTextInput");
const RNMaskedTextInput_1 = require("@components/RNMaskedTextInput");
const RNTextInput_1 = require("@components/RNTextInput");
const InputComponentMap = new Map([
    ['default', RNTextInput_1.default],
    ['mask', RNMaskedTextInput_1.default],
    ['markdown', RNMarkdownTextInput_1.default],
]);
exports.default = InputComponentMap;
