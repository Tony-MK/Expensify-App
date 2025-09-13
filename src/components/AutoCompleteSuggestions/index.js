"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// The coordinates are based on the App's height, not the device height.
// So we need to get the height from useWindowDimensions to calculate the position correctly. More details: https://github.com/Expensify/App/issues/53180
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const CONST_1 = require("@src/CONST");
const AutoCompleteSuggestionsPortal_1 = require("./AutoCompleteSuggestionsPortal");
const measureHeightOfSuggestionRows = (numRows, canBeBig) => {
    if (canBeBig) {
        if (numRows > CONST_1.default.AUTO_COMPLETE_SUGGESTER.MAX_AMOUNT_OF_VISIBLE_SUGGESTIONS_IN_CONTAINER) {
            // On large screens, if there are more than 5 suggestions, we display a scrollable window with a height of 5 items, indicating that there are more items available
            return CONST_1.default.AUTO_COMPLETE_SUGGESTER.MAX_AMOUNT_OF_VISIBLE_SUGGESTIONS_IN_CONTAINER * CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT;
        }
        return numRows * CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT;
    }
    if (numRows > 2) {
        // On small screens, we display a scrollable window with a height of 2.5 items, indicating that there are more items available beyond what is currently visible
        return CONST_1.default.AUTO_COMPLETE_SUGGESTER.SMALL_CONTAINER_HEIGHT_FACTOR * CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT;
    }
    return numRows * CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT;
};
function isSuggestionMenuRenderedAbove(isEnoughSpaceAboveForBigMenu, isEnoughSpaceAboveForSmallMenu) {
    return isEnoughSpaceAboveForBigMenu || isEnoughSpaceAboveForSmallMenu;
}
function isEnoughSpaceToRenderMenuAboveCursor({ y, cursorCoordinates, scrollValue, contentHeight, topInset }) {
    return y + (cursorCoordinates.y - scrollValue) > contentHeight + topInset + CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_BOX_MAX_SAFE_DISTANCE;
}
const initialContainerState = {
    width: 0,
    left: 0,
    bottom: 0,
    cursorCoordinates: { x: 0, y: 0 },
};
/**
 * On the mobile-web platform, when long-pressing on auto-complete suggestions,
 * we need to prevent focus shifting to avoid blurring the main input (which makes the suggestions picker close and fires the onSelect callback).
 * The desired pattern for all platforms is to do nothing on long-press.
 * On the native platform, tapping on auto-complete suggestions will not blur the main input.
 */
function AutoCompleteSuggestions({ measureParentContainerAndReportCursor = () => { }, ...props }) {
    const containerRef = react_1.default.useRef(null);
    const isInitialRender = react_1.default.useRef(true);
    const isSuggestionMenuAboveRef = react_1.default.useRef(false);
    const leftValue = react_1.default.useRef(0);
    const prevLeftValue = react_1.default.useRef(0);
    const { height: windowHeight, width: windowWidth } = (0, react_native_1.useWindowDimensions)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [suggestionHeight, setSuggestionHeight] = react_1.default.useState(0);
    const [containerState, setContainerState] = react_1.default.useState(initialContainerState);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const insets = (0, useSafeAreaInsets_1.default)();
    const { keyboardHeight, isKeyboardAnimatingRef } = (0, useKeyboardState_1.default)();
    const { paddingBottom: bottomInset, paddingTop: topInset } = StyleUtils.getPlatformSafeAreaPadding(insets ?? undefined);
    (0, react_1.useEffect)(() => {
        const container = containerRef.current;
        if (!container) {
            return () => { };
        }
        container.onpointerdown = (e) => {
            if ((0, DeviceCapabilities_1.hasHoverSupport)()) {
                return;
            }
            e.preventDefault();
        };
        return () => (container.onpointerdown = null);
    }, []);
    const suggestionsLength = props.suggestions.length;
    (0, react_1.useEffect)(() => {
        if (!measureParentContainerAndReportCursor || isKeyboardAnimatingRef.current) {
            return;
        }
        if (!windowHeight || !windowWidth || !suggestionsLength) {
            setContainerState(initialContainerState);
            return;
        }
        measureParentContainerAndReportCursor(({ x, y, width, scrollValue, cursorCoordinates }) => {
            const xCoordinatesOfCursor = x + cursorCoordinates.x;
            const bigScreenLeftOffset = xCoordinatesOfCursor + CONST_1.default.AUTO_COMPLETE_SUGGESTER.BIG_SCREEN_SUGGESTION_WIDTH > windowWidth
                ? windowWidth - CONST_1.default.AUTO_COMPLETE_SUGGESTER.BIG_SCREEN_SUGGESTION_WIDTH
                : xCoordinatesOfCursor;
            const contentMaxHeight = measureHeightOfSuggestionRows(suggestionsLength, true);
            const contentMinHeight = measureHeightOfSuggestionRows(suggestionsLength, false);
            let bottomValue = windowHeight - (cursorCoordinates.y - scrollValue + y) - keyboardHeight;
            const widthValue = shouldUseNarrowLayout ? width : CONST_1.default.AUTO_COMPLETE_SUGGESTER.BIG_SCREEN_SUGGESTION_WIDTH;
            const isEnoughSpaceToRenderMenuAboveForBig = isEnoughSpaceToRenderMenuAboveCursor({
                y,
                cursorCoordinates,
                scrollValue,
                contentHeight: contentMaxHeight,
                topInset,
            });
            const isEnoughSpaceToRenderMenuAboveForSmall = isEnoughSpaceToRenderMenuAboveCursor({
                y,
                cursorCoordinates,
                scrollValue,
                contentHeight: contentMinHeight,
                topInset,
            });
            const newLeftOffset = shouldUseNarrowLayout ? x : bigScreenLeftOffset;
            // If the suggested word is longer than 150 (approximately half the width of the suggestion popup), then adjust a new position of popup
            const isAdjustmentNeeded = Math.abs(prevLeftValue.current - bigScreenLeftOffset) > 150;
            if (isInitialRender.current || isAdjustmentNeeded) {
                isSuggestionMenuAboveRef.current = isSuggestionMenuRenderedAbove(isEnoughSpaceToRenderMenuAboveForBig, isEnoughSpaceToRenderMenuAboveForSmall);
                leftValue.current = newLeftOffset;
                isInitialRender.current = false;
                prevLeftValue.current = newLeftOffset;
            }
            let measuredHeight = 0;
            if (isSuggestionMenuAboveRef.current && isEnoughSpaceToRenderMenuAboveForBig) {
                // calculation for big suggestion box above the cursor
                measuredHeight = measureHeightOfSuggestionRows(suggestionsLength, true);
            }
            else if (isSuggestionMenuAboveRef.current && isEnoughSpaceToRenderMenuAboveForSmall) {
                // calculation for small suggestion box above the cursor
                measuredHeight = measureHeightOfSuggestionRows(suggestionsLength, false);
            }
            else {
                // calculation for big suggestion box below the cursor
                measuredHeight = measureHeightOfSuggestionRows(suggestionsLength, true);
                bottomValue = windowHeight - y - cursorCoordinates.y + scrollValue - measuredHeight - CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT - keyboardHeight;
            }
            setSuggestionHeight(measuredHeight);
            setContainerState({
                left: leftValue.current,
                bottom: bottomValue,
                width: widthValue,
                cursorCoordinates,
            });
        });
    }, [measureParentContainerAndReportCursor, windowHeight, windowWidth, keyboardHeight, shouldUseNarrowLayout, suggestionsLength, bottomInset, topInset, isKeyboardAnimatingRef]);
    // Prevent rendering if container dimensions are not set or if we have no suggestions
    if ((containerState.width === 0 && containerState.left === 0 && containerState.bottom === 0) || !suggestionsLength) {
        return null;
    }
    return (<AutoCompleteSuggestionsPortal_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} left={containerState.left} width={containerState.width} bottom={containerState.bottom} measuredHeightOfSuggestionRows={suggestionHeight}/>);
}
AutoCompleteSuggestions.displayName = 'AutoCompleteSuggestions';
exports.default = AutoCompleteSuggestions;
