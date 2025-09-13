"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const Modal_1 = require("@components/Modal");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const CONST_1 = require("@src/CONST");
const PopoverWithMeasuredContentBase_1 = require("./PopoverWithMeasuredContentBase");
/**
 * Logic for PopoverWithMeasuredContent is in PopoverWithMeasuredContentBase.
 * This component is a perf optimization, it return BOTTOM_DOCKED early, for small screens avoiding Popover measurement logic calculations.
 */
function PopoverWithMeasuredContent({ ...props }) {
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    if (isSmallScreenWidth) {
        return (<Modal_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} type={CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED} animationIn="slideInUp" animationOut="slideOutDown"/>);
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <PopoverWithMeasuredContentBase_1.default {...props}/>;
}
PopoverWithMeasuredContent.displayName = 'PopoverWithMeasuredContent';
exports.default = react_1.default.memo(PopoverWithMeasuredContent, (prevProps, nextProps) => {
    if (prevProps.isVisible === nextProps.isVisible && nextProps.isVisible === false) {
        return true;
    }
    return (0, fast_equals_1.circularDeepEqual)(prevProps, nextProps);
});
