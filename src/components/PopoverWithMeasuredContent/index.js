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
var fast_equals_1 = require("fast-equals");
var react_1 = require("react");
var Modal_1 = require("@components/Modal");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var CONST_1 = require("@src/CONST");
var PopoverWithMeasuredContentBase_1 = require("./PopoverWithMeasuredContentBase");
/**
 * Logic for PopoverWithMeasuredContent is in PopoverWithMeasuredContentBase.
 * This component is a perf optimization, it return BOTTOM_DOCKED early, for small screens avoiding Popover measurement logic calculations.
 */
function PopoverWithMeasuredContent(_a) {
    var props = __rest(_a, []);
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    if (isSmallScreenWidth) {
        return (<Modal_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} type={CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED} animationIn="slideInUp" animationOut="slideOutDown"/>);
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <PopoverWithMeasuredContentBase_1.default {...props}/>;
}
PopoverWithMeasuredContent.displayName = 'PopoverWithMeasuredContent';
exports.default = react_1.default.memo(PopoverWithMeasuredContent, function (prevProps, nextProps) {
    if (prevProps.isVisible === nextProps.isVisible && nextProps.isVisible === false) {
        return true;
    }
    return (0, fast_equals_1.circularDeepEqual)(prevProps, nextProps);
});
