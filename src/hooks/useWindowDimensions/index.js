"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const FullScreenContext_1 = require("@components/VideoPlayerContexts/FullScreenContext");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const Browser_1 = require("@libs/Browser");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const initialViewportHeight = window.visualViewport?.height ?? window.innerHeight;
const tagNamesOpenKeyboard = [CONST_1.default.ELEMENT_NAME.INPUT, CONST_1.default.ELEMENT_NAME.TEXTAREA];
const isMobile = (0, Browser_1.isMobile)();
/**
 * A wrapper around React Native's useWindowDimensions hook.
 */
function default_1(useCachedViewportHeight = false) {
    const { isFullScreenRef, lockedWindowDimensionsRef, lockWindowDimensions, unlockWindowDimensions } = (0, react_1.useContext)(FullScreenContext_1.FullScreenContext) ?? {
        isFullScreenRef: (0, react_1.useRef)(false),
        lockedWindowDimensionsRef: (0, react_1.useRef)(null),
        lockWindowDimensions: () => { },
        unlockWindowDimensions: () => { },
    };
    const isCachedViewportHeight = useCachedViewportHeight && (0, Browser_1.isMobileWebKit)();
    const cachedViewportHeightWithKeyboardRef = (0, react_1.useRef)(initialViewportHeight);
    const { width: windowWidth, height: windowHeight } = (0, react_native_1.useWindowDimensions)();
    // These are the same as the ones in useResponsiveLayout, but we need to redefine them here to avoid cyclic dependency.
    // When the soft keyboard opens on mWeb, the window height changes. Use static screen height instead to get real screenHeight.
    const screenHeight = react_native_1.Dimensions.get('screen').height;
    const isExtraSmallScreenHeight = screenHeight <= variables_1.default.extraSmallMobileResponsiveHeightBreakpoint;
    const isSmallScreenWidth = windowWidth <= variables_1.default.mobileResponsiveWidthBreakpoint;
    const isMediumScreenWidth = windowWidth > variables_1.default.mobileResponsiveWidthBreakpoint && windowWidth <= variables_1.default.tabletResponsiveWidthBreakpoint;
    const isLargeScreenWidth = windowWidth > variables_1.default.tabletResponsiveWidthBreakpoint;
    const isExtraSmallScreenWidth = windowWidth <= variables_1.default.extraSmallMobileResponsiveWidthBreakpoint;
    const lowerScreenDimension = Math.min(windowWidth, windowHeight);
    const isSmallScreen = lowerScreenDimension <= variables_1.default.mobileResponsiveWidthBreakpoint;
    const responsiveLayoutResults = {
        isSmallScreenWidth,
        isExtraSmallScreenHeight,
        isExtraSmallScreenWidth,
        isMediumScreenWidth,
        isLargeScreenWidth,
        isSmallScreen,
    };
    const [, cachedViewportHeight, setCachedViewportHeight] = (0, useDebouncedState_1.default)(windowHeight, CONST_1.default.TIMING.RESIZE_DEBOUNCE_TIME);
    const handleFocusIn = (0, react_1.useRef)((event) => {
        const targetElement = event.target;
        if (tagNamesOpenKeyboard.includes(targetElement.tagName)) {
            setCachedViewportHeight(cachedViewportHeightWithKeyboardRef.current);
        }
    });
    (0, react_1.useEffect)(() => {
        if (!isCachedViewportHeight) {
            return;
        }
        const handleFocusInValue = handleFocusIn.current;
        window.addEventListener('focusin', handleFocusInValue);
        return () => {
            window.removeEventListener('focusin', handleFocusInValue);
        };
    }, [isCachedViewportHeight]);
    const handleFocusOut = (0, react_1.useRef)((event) => {
        const targetElement = event.target;
        if (tagNamesOpenKeyboard.includes(targetElement.tagName)) {
            setCachedViewportHeight(initialViewportHeight);
        }
    });
    (0, react_1.useEffect)(() => {
        if (!isCachedViewportHeight) {
            return;
        }
        const handleFocusOutValue = handleFocusOut.current;
        window.addEventListener('focusout', handleFocusOutValue);
        return () => {
            window.removeEventListener('focusout', handleFocusOutValue);
        };
    }, [isCachedViewportHeight]);
    (0, react_1.useEffect)(() => {
        if (!isCachedViewportHeight && windowHeight >= cachedViewportHeightWithKeyboardRef.current) {
            return;
        }
        setCachedViewportHeight(windowHeight);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [windowHeight, isCachedViewportHeight]);
    (0, react_1.useEffect)(() => {
        if (!isCachedViewportHeight || !window.matchMedia('(orientation: portrait)').matches || windowHeight >= initialViewportHeight) {
            return;
        }
        cachedViewportHeightWithKeyboardRef.current = windowHeight;
    }, [isCachedViewportHeight, windowHeight]);
    const windowDimensions = {
        windowWidth,
        windowHeight: isCachedViewportHeight ? cachedViewportHeight : windowHeight,
        responsiveLayoutResults,
    };
    if (!lockedWindowDimensionsRef.current && !isFullScreenRef.current) {
        return windowDimensions;
    }
    const didScreenChangeOrientation = isMobile &&
        lockedWindowDimensionsRef.current &&
        isExtraSmallScreenWidth === lockedWindowDimensionsRef.current.responsiveLayoutResults.isExtraSmallScreenHeight &&
        isSmallScreenWidth === lockedWindowDimensionsRef.current.responsiveLayoutResults.isSmallScreen &&
        isMediumScreenWidth === lockedWindowDimensionsRef.current.responsiveLayoutResults.isMediumScreenWidth &&
        isLargeScreenWidth === lockedWindowDimensionsRef.current.responsiveLayoutResults.isLargeScreenWidth &&
        lockedWindowDimensionsRef.current.windowWidth !== windowWidth &&
        lockedWindowDimensionsRef.current.windowHeight !== windowHeight;
    // if video is in fullscreen mode, lock the window dimensions since they can change and cause whole app to re-render
    if (!lockedWindowDimensionsRef.current || didScreenChangeOrientation) {
        lockWindowDimensions(windowDimensions);
        return windowDimensions;
    }
    // if video exits fullscreen mode, unlock the window dimensions
    if (lockedWindowDimensionsRef.current && !isFullScreenRef.current) {
        const lastLockedWindowDimensions = { ...lockedWindowDimensionsRef.current };
        unlockWindowDimensions();
        return { windowWidth: lastLockedWindowDimensions.windowWidth, windowHeight: lastLockedWindowDimensions.windowHeight };
    }
    return { windowWidth: lockedWindowDimensionsRef.current.windowWidth, windowHeight: lockedWindowDimensionsRef.current.windowHeight };
}
