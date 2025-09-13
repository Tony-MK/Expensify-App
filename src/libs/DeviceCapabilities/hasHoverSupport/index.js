"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Allows us to identify whether the platform is hoverable.
 */
const hasHoverSupport = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
exports.default = hasHoverSupport;
