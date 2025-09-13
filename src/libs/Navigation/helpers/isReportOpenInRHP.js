"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const isReportOpenInRHP = (state) => {
    const lastRoute = state?.routes?.at(-1);
    if (!lastRoute) {
        return false;
    }
    const params = lastRoute.params;
    if (params && 'screen' in params && typeof params.screen === 'string' && params.screen === SCREENS_1.default.RIGHT_MODAL.SEARCH_REPORT) {
        return true;
    }
    return !!(lastRoute.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR && lastRoute.state?.routes?.some((route) => route?.name === SCREENS_1.default.RIGHT_MODAL.SEARCH_REPORT));
};
exports.default = isReportOpenInRHP;
