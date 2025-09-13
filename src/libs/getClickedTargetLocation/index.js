"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the Bounding Rectangle for the passed native event's target.
 */
const getClickedTargetLocation = (target) => target.getBoundingClientRect();
exports.default = getClickedTargetLocation;
