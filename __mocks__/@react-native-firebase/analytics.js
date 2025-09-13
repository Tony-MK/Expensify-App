"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.logEvent = void 0;
const logEvent = jest.fn();
exports.logEvent = logEvent;
const getAnalytics = jest.fn();
exports.getAnalytics = getAnalytics;
