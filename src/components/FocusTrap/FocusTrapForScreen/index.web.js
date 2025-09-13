"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const focus_trap_react_1 = require("focus-trap-react");
const react_1 = require("react");
const sharedTrapStack_1 = require("@components/FocusTrap/sharedTrapStack");
const TOP_TAB_SCREENS_1 = require("@components/FocusTrap/TOP_TAB_SCREENS");
const WIDE_LAYOUT_INACTIVE_SCREENS_1 = require("@components/FocusTrap/WIDE_LAYOUT_INACTIVE_SCREENS");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const CONST_1 = require("@src/CONST");
function FocusTrapForScreen({ children, focusTrapSettings }) {
    const isFocused = (0, native_1.useIsFocused)();
    const route = (0, native_1.useRoute)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const isActive = (0, react_1.useMemo)(() => {
        if (typeof focusTrapSettings?.active !== 'undefined') {
            return focusTrapSettings.active;
        }
        // Focus trap can't be active on sidebar screens because it would block access to the tab bar.
        if ((0, isNavigatorName_1.isSidebarScreenName)(route.name)) {
            return false;
        }
        // in top tabs only focus trap for currently shown tab should be active
        if (TOP_TAB_SCREENS_1.default.find((screen) => screen === route.name)) {
            return isFocused;
        }
        // Focus trap can't be active on these screens if the layout is wide because they may be displayed side by side.
        if (WIDE_LAYOUT_INACTIVE_SCREENS_1.default.includes(route.name) && !shouldUseNarrowLayout) {
            return false;
        }
        return true;
    }, [isFocused, shouldUseNarrowLayout, route.name, focusTrapSettings?.active]);
    return (<focus_trap_react_1.FocusTrap active={isActive} paused={!isFocused} containerElements={focusTrapSettings?.containerElements?.length ? focusTrapSettings.containerElements : undefined} focusTrapOptions={{
            onActivate: () => {
                const activeElement = document?.activeElement;
                if (activeElement?.nodeName === CONST_1.default.ELEMENT_NAME.INPUT || activeElement?.nodeName === CONST_1.default.ELEMENT_NAME.TEXTAREA) {
                    return;
                }
                activeElement?.blur();
            },
            trapStack: sharedTrapStack_1.default,
            allowOutsideClick: true,
            fallbackFocus: document.body,
            delayInitialFocus: CONST_1.default.ANIMATED_TRANSITION,
            initialFocus: false,
            setReturnFocus: false,
            ...(focusTrapSettings?.focusTrapOptions ?? {}),
        }}>
            {children}
        </focus_trap_react_1.FocusTrap>);
}
FocusTrapForScreen.displayName = 'FocusTrapForScreen';
exports.default = FocusTrapForScreen;
