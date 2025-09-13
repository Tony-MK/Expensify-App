"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Browser = require("@libs/Browser");
const isMobileChrome = Browser.isMobileChrome();
const shouldUseEmojiPickerSelection = () => isMobileChrome;
exports.default = shouldUseEmojiPickerSelection;
