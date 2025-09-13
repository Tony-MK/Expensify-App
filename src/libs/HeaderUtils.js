"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPinMenuItem = getPinMenuItem;
exports.getShareMenuItem = getShareMenuItem;
const Expensicons = require("@components/Icon/Expensicons");
const ROUTES_1 = require("@src/ROUTES");
const Report_1 = require("./actions/Report");
const Session_1 = require("./actions/Session");
const Navigation_1 = require("./Navigation/Navigation");
function getPinMenuItem(report) {
    const isPinned = !!report.isPinned;
    return {
        icon: Expensicons.Pin,
        translationKey: isPinned ? 'common.unPin' : 'common.pin',
        onSelected: (0, Session_1.callFunctionIfActionIsAllowed)(() => (0, Report_1.togglePinnedState)(report.reportID, isPinned)),
    };
}
function getShareMenuItem(report, backTo) {
    return {
        icon: Expensicons.QrCode,
        translationKey: 'common.share',
        onSelected: () => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID_DETAILS_SHARE_CODE.getRoute(report?.reportID, backTo)),
    };
}
