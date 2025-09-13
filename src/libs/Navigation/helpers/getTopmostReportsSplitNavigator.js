"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
function getTopmostReportsSplitNavigator() {
    return navigationRef_1.default.getRootState()?.routes.findLast((route) => route.name === NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR);
}
exports.default = getTopmostReportsSplitNavigator;
