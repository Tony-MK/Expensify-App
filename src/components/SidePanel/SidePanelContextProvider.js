"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidePanelContext = void 0;
const react_1 = require("react");
// Import Animated directly from 'react-native' as animations are used with navigation.
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSidePanelDisplayStatus_1 = require("@hooks/useSidePanelDisplayStatus");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const SidePanel_1 = require("@libs/actions/SidePanel");
const focusComposerWithDelay_1 = require("@libs/focusComposerWithDelay");
const ReportActionComposeFocusManager_1 = require("@libs/ReportActionComposeFocusManager");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const keyboard_1 = require("@src/utils/keyboard");
const SidePanelContext = (0, react_1.createContext)({
    isSidePanelTransitionEnded: true,
    isSidePanelHiddenOrLargeScreen: true,
    shouldHideSidePanel: true,
    shouldHideSidePanelBackdrop: true,
    shouldHideHelpButton: true,
    shouldHideToolTip: false,
    sidePanelOffset: { current: new react_native_1.Animated.Value(0) },
    sidePanelTranslateX: { current: new react_native_1.Animated.Value(0) },
    openSidePanel: () => { },
    closeSidePanel: () => { },
});
exports.SidePanelContext = SidePanelContext;
/**
 * Hook to get the animated position of the Side Panel and the margin of the navigator
 */
function SidePanelContextProvider({ children }) {
    const { isExtraLargeScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const sidePanelWidth = shouldUseNarrowLayout ? windowWidth : variables_1.default.sideBarWidth;
    const [isSidePanelTransitionEnded, setIsSidePanelTransitionEnded] = (0, react_1.useState)(true);
    const { shouldHideSidePanel, shouldHideSidePanelBackdrop, shouldHideHelpButton, isSidePanelHiddenOrLargeScreen, sidePanelNVP } = (0, useSidePanelDisplayStatus_1.default)();
    const shouldHideToolTip = isExtraLargeScreenWidth ? !isSidePanelTransitionEnded : !shouldHideSidePanel;
    const shouldApplySidePanelOffset = isExtraLargeScreenWidth && !shouldHideSidePanel;
    const sidePanelOffset = (0, react_1.useRef)(new react_native_1.Animated.Value(shouldApplySidePanelOffset ? variables_1.default.sideBarWidth : 0));
    const sidePanelTranslateX = (0, react_1.useRef)(new react_native_1.Animated.Value(shouldHideSidePanel ? sidePanelWidth : 0));
    (0, react_1.useEffect)(() => {
        setIsSidePanelTransitionEnded(false);
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(sidePanelOffset.current, {
                toValue: shouldApplySidePanelOffset ? variables_1.default.sideBarWidth : 0,
                duration: CONST_1.default.ANIMATED_TRANSITION,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(sidePanelTranslateX.current, {
                toValue: shouldHideSidePanel ? sidePanelWidth : 0,
                duration: CONST_1.default.ANIMATED_TRANSITION,
                useNativeDriver: true,
            }),
        ]).start(() => setIsSidePanelTransitionEnded(true));
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- sidePanelWidth dependency caused the help panel content to slide in on window resize
    }, [shouldHideSidePanel, shouldApplySidePanelOffset]);
    const openSidePanel = (0, react_1.useCallback)(() => {
        // User shouldn't be able to open side panel if side panel NVP is undefined
        if (!sidePanelNVP) {
            return;
        }
        setIsSidePanelTransitionEnded(false);
        keyboard_1.default.dismiss();
        SidePanel_1.default.openSidePanel(!isExtraLargeScreenWidth);
    }, [isExtraLargeScreenWidth, sidePanelNVP]);
    const closeSidePanel = (0, react_1.useCallback)((shouldUpdateNarrow = false) => {
        // User shouldn't be able to close side panel if side panel NVP is undefined
        if (!sidePanelNVP) {
            return;
        }
        setIsSidePanelTransitionEnded(false);
        SidePanel_1.default.closeSidePanel(!isExtraLargeScreenWidth || shouldUpdateNarrow);
        // Focus the composer after closing the Side Panel
        (0, focusComposerWithDelay_1.default)(ReportActionComposeFocusManager_1.default.composerRef.current, CONST_1.default.ANIMATED_TRANSITION + CONST_1.default.COMPOSER_FOCUS_DELAY)(true);
    }, [isExtraLargeScreenWidth, sidePanelNVP]);
    const value = (0, react_1.useMemo)(() => ({
        isSidePanelTransitionEnded,
        isSidePanelHiddenOrLargeScreen,
        shouldHideSidePanel,
        shouldHideSidePanelBackdrop,
        shouldHideHelpButton,
        shouldHideToolTip,
        sidePanelOffset,
        sidePanelTranslateX,
        openSidePanel,
        closeSidePanel,
        sidePanelNVP,
    }), [
        closeSidePanel,
        isSidePanelHiddenOrLargeScreen,
        isSidePanelTransitionEnded,
        openSidePanel,
        shouldHideHelpButton,
        shouldHideSidePanel,
        shouldHideSidePanelBackdrop,
        shouldHideToolTip,
        sidePanelNVP,
    ]);
    return <SidePanelContext.Provider value={value}>{children}</SidePanelContext.Provider>;
}
exports.default = SidePanelContextProvider;
