"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
const navigateFromNotification = (reportID) => {
    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
};
exports.default = navigateFromNotification;
