"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We don't capture performance metrics on web as there are enough tools available
const canCapturePerformanceMetrics = () => false;
exports.default = canCapturePerformanceMetrics;
