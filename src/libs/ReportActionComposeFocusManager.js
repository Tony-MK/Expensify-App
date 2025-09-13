"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const SCREENS_1 = require("@src/SCREENS");
const isReportOpenInRHP_1 = require("./Navigation/helpers/isReportOpenInRHP");
const navigationRef_1 = require("./Navigation/navigationRef");
const composerRef = react_1.default.createRef();
// There are two types of composer: general composer (edit composer) and main composer.
// The general composer callback will take priority if it exists.
const editComposerRef = react_1.default.createRef();
// There are two types of focus callbacks: priority and general
// Priority callback would take priority if it existed
let priorityFocusCallback = null;
let focusCallback = null;
/**
 * Register a callback to be called when focus is requested.
 * Typical uses of this would be call the focus on the ReportActionComposer.
 *
 * @param callback callback to register
 */
function onComposerFocus(callback, isPriorityCallback = false) {
    if (isPriorityCallback) {
        priorityFocusCallback = callback;
    }
    else {
        focusCallback = callback;
    }
}
/**
 * Request focus on the ReportActionComposer
 */
function focus(shouldFocusForNonBlurInputOnTapOutside) {
    /** Do not trigger the refocusing when the active route is not the report screen */
    const navigationState = navigationRef_1.default.getState();
    const focusedRoute = (0, native_1.findFocusedRoute)(navigationState);
    if (!navigationState || (!(0, isReportOpenInRHP_1.default)(navigationState) && focusedRoute?.name !== SCREENS_1.default.REPORT && focusedRoute?.name !== SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT)) {
        return;
    }
    if (typeof priorityFocusCallback !== 'function' && typeof focusCallback !== 'function') {
        return;
    }
    if (typeof priorityFocusCallback === 'function') {
        priorityFocusCallback(shouldFocusForNonBlurInputOnTapOutside);
        return;
    }
    if (typeof focusCallback === 'function') {
        focusCallback();
    }
}
/**
 * Clear the registered focus callback
 */
function clear(isPriorityCallback = false) {
    if (isPriorityCallback) {
        editComposerRef.current = null;
        priorityFocusCallback = null;
    }
    else {
        focusCallback = null;
    }
}
/**
 * Exposes the current focus state of the report action composer.
 */
function isFocused() {
    return !!composerRef.current?.isFocused();
}
/**
 * Exposes the current focus state of the edit message composer.
 */
function isEditFocused() {
    return !!editComposerRef.current?.isFocused();
}
exports.default = {
    composerRef,
    onComposerFocus,
    focus,
    clear,
    isFocused,
    editComposerRef,
    isEditFocused,
};
