"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = processReportIDDeeplink;
const CONST_1 = require("@src/CONST");
const getReportIDFromUrl_1 = require("./getReportIDFromUrl");
function processReportIDDeeplink(url) {
    const prevUrl = sessionStorage.getItem(CONST_1.default.SESSION_STORAGE_KEYS.INITIAL_URL);
    const prevReportID = (0, getReportIDFromUrl_1.default)(prevUrl ?? '');
    const currentReportID = (0, getReportIDFromUrl_1.default)(url);
    if (currentReportID && url) {
        sessionStorage.setItem(CONST_1.default.SESSION_STORAGE_KEYS.INITIAL_URL, url);
    }
    return currentReportID || prevReportID;
}
