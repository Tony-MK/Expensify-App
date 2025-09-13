"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveMaxCanvasArea = retrieveMaxCanvasArea;
exports.retrieveMaxCanvasHeight = retrieveMaxCanvasHeight;
exports.retrieveMaxCanvasWidth = retrieveMaxCanvasWidth;
const canvas_size_1 = require("canvas-size");
const react_native_onyx_1 = require("react-native-onyx");
const Browser = require("@libs/Browser");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Calculate the max area of canvas on this specific platform and save it in onyx
 */
function retrieveMaxCanvasArea() {
    // We're limiting the maximum value on mobile web to prevent a crash related to rendering large canvas elements.
    // More information at: https://github.com/jhildenbiddle/canvas-size/issues/13
    canvas_size_1.default
        .maxArea({
        max: Browser.isMobile() ? 8192 : undefined,
        usePromise: true,
        useWorker: false,
    })
        .then(({ width, height }) => {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.MAX_CANVAS_AREA, width * height);
    });
}
/**
 * Calculate the max height of canvas on this specific platform and save it in onyx
 */
function retrieveMaxCanvasHeight() {
    canvas_size_1.default.maxHeight({
        onSuccess: (width, height) => {
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.MAX_CANVAS_HEIGHT, height);
        },
    });
}
/**
 * Calculate the max width of canvas on this specific platform and save it in onyx
 */
function retrieveMaxCanvasWidth() {
    canvas_size_1.default.maxWidth({
        onSuccess: (width) => {
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.MAX_CANVAS_WIDTH, width);
        },
    });
}
