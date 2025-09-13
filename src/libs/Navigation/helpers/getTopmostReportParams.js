"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
function getTopmostReportParams(state) {
    if (!state) {
        return;
    }
    const topmostReportsSplitNavigator = state.routes?.filter((route) => route.name === NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR).at(-1);
    if (!topmostReportsSplitNavigator) {
        return;
    }
    const topmostReport = topmostReportsSplitNavigator.state?.routes.filter((route) => route.name === SCREENS_1.default.REPORT).at(-1);
    if (!topmostReport) {
        return;
    }
    return topmostReport?.params;
}
exports.default = getTopmostReportParams;
