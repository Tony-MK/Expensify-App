"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growlRef = void 0;
exports.setIsReady = setIsReady;
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const growlRef = react_1.default.createRef();
exports.growlRef = growlRef;
let resolveIsReadyPromise;
const isReadyPromise = new Promise((resolve) => {
    resolveIsReadyPromise = resolve;
});
function setIsReady() {
    if (!resolveIsReadyPromise) {
        return;
    }
    resolveIsReadyPromise();
}
/**
 * Show the growl notification
 */
function show(bodyText, type, duration = CONST_1.default.GROWL.DURATION) {
    isReadyPromise.then(() => {
        if (!growlRef?.current?.show) {
            return;
        }
        growlRef.current.show(bodyText, type, duration);
    });
}
/**
 * Show error growl
 */
function error(bodyText, duration = CONST_1.default.GROWL.DURATION) {
    show(bodyText, CONST_1.default.GROWL.ERROR, duration);
}
/**
 * Show success growl
 */
function success(bodyText, duration = CONST_1.default.GROWL.DURATION) {
    show(bodyText, CONST_1.default.GROWL.SUCCESS, duration);
}
exports.default = {
    show,
    error,
    success,
};
