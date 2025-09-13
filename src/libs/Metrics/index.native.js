"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONFIG_1 = require("@src/CONFIG");
/**
 * Is capturing performance stats enabled.
 */
const canCapturePerformanceMetrics = () => CONFIG_1.default.CAPTURE_METRICS;
exports.default = canCapturePerformanceMetrics;
