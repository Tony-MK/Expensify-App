"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Modal_1 = require("@components/Modal");
const CONST_1 = require("@src/CONST");
/*
 * This is a convenience wrapper around the Modal component for a responsive Popover.
 * On small screen widths, it uses BottomDocked modal type, and a Popover type on wide screen widths.
 */
function Popover({ animationIn, animationOut, popoverAnchorPosition, disableAnimation, anchorPosition = {}, fromSidebarMediumScreen, ...propsWithoutAnimation }) {
    return (<Modal_1.default type={fromSidebarMediumScreen ? CONST_1.default.MODAL.MODAL_TYPE.POPOVER : CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED} popoverAnchorPosition={fromSidebarMediumScreen ? anchorPosition : undefined} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...propsWithoutAnimation} 
    // Mobile will always has fullscreen menu
    fullscreen animationIn="slideInUp" animationOut="slideOutDown"/>);
}
Popover.displayName = 'Popover';
exports.default = Popover;
