"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ELECTRON_EVENTS_1 = require("@desktop/ELECTRON_EVENTS");
const focusApp = () => {
    window.electron.send(ELECTRON_EVENTS_1.default.REQUEST_FOCUS_APP);
};
exports.default = focusApp;
