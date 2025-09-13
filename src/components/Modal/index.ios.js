"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var CONST_1 = require("@src/CONST");
var BaseModal_1 = require("./BaseModal");
function Modal(_a) {
    var _b, _c;
    var children = _a.children, rest = __rest(_a, ["children"]);
    var isInNarrowPaneModal = (0, useResponsiveLayout_1.default)().isInNarrowPaneModal;
    var animationInTiming = (_b = rest.animationInTiming) !== null && _b !== void 0 ? _b : (isInNarrowPaneModal ? CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_RIGHT_DOCKED_IOS_IN : undefined);
    var animationOutTiming = (_c = rest.animationOutTiming) !== null && _c !== void 0 ? _c : (isInNarrowPaneModal ? CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_RIGHT_DOCKED_IOS_OUT : undefined);
    return (<BaseModal_1.default useNativeDriver 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} animationInTiming={animationInTiming} animationOutTiming={animationOutTiming}>
            {children}
        </BaseModal_1.default>);
}
Modal.displayName = 'Modal';
exports.default = Modal;
