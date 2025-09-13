"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const focus_trap_react_1 = require("focus-trap-react");
const react_1 = require("react");
const sharedTrapStack_1 = require("@components/FocusTrap/sharedTrapStack");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const ReportActionComposeFocusManager_1 = require("@libs/ReportActionComposeFocusManager");
function FocusTrapForModal({ children, active, initialFocus = false, shouldPreventScroll = false }) {
    return (<focus_trap_react_1.FocusTrap active={active} focusTrapOptions={{
            onActivate: blurActiveElement_1.default,
            preventScroll: shouldPreventScroll,
            trapStack: sharedTrapStack_1.default,
            clickOutsideDeactivates: true,
            initialFocus,
            fallbackFocus: document.body,
            setReturnFocus: (element) => {
                if (ReportActionComposeFocusManager_1.default.isFocused()) {
                    return false;
                }
                return element;
            },
        }}>
            {children}
        </focus_trap_react_1.FocusTrap>);
}
FocusTrapForModal.displayName = 'FocusTrapForModal';
exports.default = FocusTrapForModal;
