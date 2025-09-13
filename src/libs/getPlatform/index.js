"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPlatform;
const Browser = require("@libs/Browser");
const CONST_1 = require("@src/CONST");
function getPlatform(shouldMobileWebBeDistinctFromWeb = false) {
    if (shouldMobileWebBeDistinctFromWeb && Browser.isMobile()) {
        return CONST_1.default.PLATFORM.MOBILE_WEB;
    }
    return CONST_1.default.PLATFORM.WEB;
}
