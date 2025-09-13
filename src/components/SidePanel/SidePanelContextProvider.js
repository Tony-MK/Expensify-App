"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidePanelContext = void 0;
var react_1 = require("react");
// Import Animated directly from 'react-native' as animations are used with navigation.
// eslint-disable-next-line no-restricted-imports
var react_native_1 = require("react-native");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useSidePanelDisplayStatus_1 = require("@hooks/useSidePanelDisplayStatus");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
var SidePanel_1 = require("@libs/actions/SidePanel");
var focusComposerWithDelay_1 = require("@libs/focusComposerWithDelay");
var ReportActionComposeFocusManager_1 = require("@libs/ReportActionComposeFocusManager");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var keyboard_1 = require("@src/utils/keyboard");
var SidePanelContext = (0, react_1.createContext)({
    isSidePanelTransitionEnded: true,
    isSidePanelHiddenOrLargeScreen: true,
    shouldHideSidePanel: true,
    shouldHideSidePanelBackdrop: true,
    shouldHideHelpButton: true,
    shouldHideToolTip: false,
    sidePanelOffset: { current: new react_native_1.Animated.Value(0) },
    sidePanelTranslateX: { current: new react_native_1.Animated.Value(0) },
    openSidePanel: function () { },
    closeSidePanel: function () { },
});
exports.SidePanelContext = SidePanelContext;
/**
 * Hook to get the animated position of the Side Panel and the margin of the navigator
 */
function SidePanelContextProvider(_a) {
    var children = _a.children;
    var _b = (0, useResponsiveLayout_1.default)(), isExtraLargeScreenWidth = _b.isExtraLargeScreenWidth, shouldUseNarrowLayout = _b.shouldUseNarrowLayout;
    var windowWidth = (0, useWindowDimensions_1.default)().windowWidth;
    var sidePanelWidth = shouldUseNarrowLayout ? windowWidth : variables_1.default.sideBarWidth;
    var _c = (0, react_1.useState)(true), isSidePanelTransitionEnded = _c[0], setIsSidePanelTransitionEnded = _c[1];
    var _d = (0, useSidePanelDisplayStatus_1.default)(), shouldHideSidePanel = _d.shouldHideSidePanel, shouldHideSidePanelBackdrop = _d.shouldHideSidePanelBackdrop, shouldHideHelpButton = _d.shouldHideHelpButton, isSidePanelHiddenOrLargeScreen = _d.isSidePanelHiddenOrLargeScreen, sidePanelNVP = _d.sidePanelNVP;
    var shouldHideToolTip = isExtraLargeScreenWidth ? !isSidePanelTransitionEnded : !shouldHideSidePanel;
    var shouldApplySidePanelOffset = isExtraLargeScreenWidth && !shouldHideSidePanel;
    var sidePanelOffset = (0, react_1.useRef)(new react_native_1.Animated.Value(shouldApplySidePanelOffset ? variables_1.default.sideBarWidth : 0));
    var sidePanelTranslateX = (0, react_1.useRef)(new react_native_1.Animated.Value(shouldHideSidePanel ? sidePanelWidth : 0));
    (0, react_1.useEffect)(function () {
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
        ]).start(function () { return setIsSidePanelTransitionEnded(true); });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- sidePanelWidth dependency caused the help panel content to slide in on window resize
    }, [shouldHideSidePanel, shouldApplySidePanelOffset]);
    var openSidePanel = (0, react_1.useCallback)(function () {
        // User shouldn't be able to open side panel if side panel NVP is undefined
        if (!sidePanelNVP) {
            return;
        }
        setIsSidePanelTransitionEnded(false);
        keyboard_1.default.dismiss();
        SidePanel_1.default.openSidePanel(!isExtraLargeScreenWidth);
    }, [isExtraLargeScreenWidth, sidePanelNVP]);
    var closeSidePanel = (0, react_1.useCallback)(function (shouldUpdateNarrow) {
        if (shouldUpdateNarrow === void 0) { shouldUpdateNarrow = false; }
        // User shouldn't be able to close side panel if side panel NVP is undefined
        if (!sidePanelNVP) {
            return;
        }
        setIsSidePanelTransitionEnded(false);
        SidePanel_1.default.closeSidePanel(!isExtraLargeScreenWidth || shouldUpdateNarrow);
        // Focus the composer after closing the Side Panel
        (0, focusComposerWithDelay_1.default)(ReportActionComposeFocusManager_1.default.composerRef.current, CONST_1.default.ANIMATED_TRANSITION + CONST_1.default.COMPOSER_FOCUS_DELAY)(true);
    }, [isExtraLargeScreenWidth, sidePanelNVP]);
    var value = (0, react_1.useMemo)(function () { return ({
        isSidePanelTransitionEnded: isSidePanelTransitionEnded,
        isSidePanelHiddenOrLargeScreen: isSidePanelHiddenOrLargeScreen,
        shouldHideSidePanel: shouldHideSidePanel,
        shouldHideSidePanelBackdrop: shouldHideSidePanelBackdrop,
        shouldHideHelpButton: shouldHideHelpButton,
        shouldHideToolTip: shouldHideToolTip,
        sidePanelOffset: sidePanelOffset,
        sidePanelTranslateX: sidePanelTranslateX,
        openSidePanel: openSidePanel,
        closeSidePanel: closeSidePanel,
        sidePanelNVP: sidePanelNVP,
    }); }, [
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
