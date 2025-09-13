"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPassiveEventListenerSupport = exports.hasHoverSupport = exports.canUseTouchScreen = void 0;
const canUseTouchScreen_1 = require("./canUseTouchScreen");
exports.canUseTouchScreen = canUseTouchScreen_1.default;
const hasHoverSupport_1 = require("./hasHoverSupport");
exports.hasHoverSupport = hasHoverSupport_1.default;
const hasPassiveEventListenerSupport_1 = require("./hasPassiveEventListenerSupport");
exports.hasPassiveEventListenerSupport = hasPassiveEventListenerSupport_1.default;
