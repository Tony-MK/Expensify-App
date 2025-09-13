"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const analytics_1 = require("@react-native-firebase/analytics");
const Log_1 = require("@libs/Log");
const analytics = (0, analytics_1.getAnalytics)();
function publishEvent(event, accountID) {
    (0, analytics_1.logEvent)(analytics, event, { user_id: accountID });
    Log_1.default.info('[GTM] event published', false, { event, user_id: accountID });
}
const GoogleTagManager = {
    publishEvent,
};
exports.default = GoogleTagManager;
