"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationType_1 = require("./NotificationType");
// Push notifications are only supported on mobile, so we'll just noop here
const PushNotification = {
    init: () => { },
    register: () => { },
    deregister: () => { },
    onReceived: () => { },
    onSelected: () => { },
    TYPE: NotificationType_1.default,
    clearNotifications: () => { },
};
exports.default = PushNotification;
