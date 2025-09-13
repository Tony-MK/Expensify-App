"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const Log_1 = require("@libs/Log");
function publishEvent(event, accountID) {
    if (!window.dataLayer) {
        return;
    }
    const params = { event, user_id: accountID };
    // Pass a copy of params here since the dataLayer modifies the object
    window.dataLayer.push({ ...params });
    Log_1.default.info('[GTM] event published', false, params);
}
const GoogleTagManager = {
    publishEvent,
};
exports.default = GoogleTagManager;
