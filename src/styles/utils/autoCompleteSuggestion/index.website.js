"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Browser = require("@libs/Browser");
const isMobileSafari = Browser.isMobileSafari();
const shouldPreventScrollOnAutoCompleteSuggestion = () => !isMobileSafari;
exports.default = shouldPreventScrollOnAutoCompleteSuggestion;
