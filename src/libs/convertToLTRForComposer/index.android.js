"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Android only - Do not convert RTL text to a LTR text for input box using Unicode controls.
 * Android does not properly support bidirectional text for mixed content for input box
 */
const convertToLTRForComposer = (text) => text;
exports.default = convertToLTRForComposer;
