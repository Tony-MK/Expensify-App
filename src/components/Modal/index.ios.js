"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const CONST_1 = require("@src/CONST");
const BaseModal_1 = require("./BaseModal");
function Modal({ children, ...rest }) {
    const { isInNarrowPaneModal } = (0, useResponsiveLayout_1.default)();
    const animationInTiming = rest.animationInTiming ?? (isInNarrowPaneModal ? CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_RIGHT_DOCKED_IOS_IN : undefined);
    const animationOutTiming = rest.animationOutTiming ?? (isInNarrowPaneModal ? CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_RIGHT_DOCKED_IOS_OUT : undefined);
    return (<BaseModal_1.default useNativeDriver 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} animationInTiming={animationInTiming} animationOutTiming={animationOutTiming}>
            {children}
        </BaseModal_1.default>);
}
Modal.displayName = 'Modal';
exports.default = Modal;
