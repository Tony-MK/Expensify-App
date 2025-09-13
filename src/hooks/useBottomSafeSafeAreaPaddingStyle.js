"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ScreenWrapperOfflineIndicatorContext_1 = require("@components/ScreenWrapper/ScreenWrapperOfflineIndicatorContext");
const CONST_1 = require("@src/CONST");
const useNetwork_1 = require("./useNetwork");
const useSafeAreaPaddings_1 = require("./useSafeAreaPaddings");
/**
 * useBottomSafeSafeAreaPaddingStyle is a hook that creates or adapts a given style and adds bottom safe area padding.
 * It is useful for creating new styles or updating existing style props (e.g. contentContainerStyle).
 * @param params - The parameters for the hook.
 * @returns The style with bottom safe area padding applied.
 */
function useBottomSafeSafeAreaPaddingStyle({ addBottomSafeAreaPadding = false, addOfflineIndicatorBottomSafeAreaPadding = addBottomSafeAreaPadding, style, styleProperty = 'paddingBottom', additionalPaddingBottom = 0, } = {}) {
    const { paddingBottom: safeAreaPaddingBottom } = (0, useSafeAreaPaddings_1.default)(true);
    const { isOffline } = (0, useNetwork_1.default)();
    const { addSafeAreaPadding: isOfflineIndicatorSafeAreaPaddingEnabled } = (0, react_1.useContext)(ScreenWrapperOfflineIndicatorContext_1.default);
    return (0, react_1.useMemo)(() => {
        let totalPaddingBottom = additionalPaddingBottom;
        // Add the safe area padding to the total padding if the flag is enabled
        if (addBottomSafeAreaPadding) {
            totalPaddingBottom += safeAreaPaddingBottom;
        }
        if (addOfflineIndicatorBottomSafeAreaPadding && isOffline && isOfflineIndicatorSafeAreaPaddingEnabled) {
            totalPaddingBottom += CONST_1.default.OFFLINE_INDICATOR_HEIGHT;
        }
        // If there is no bottom safe area or additional padding, return the style as is
        if (totalPaddingBottom === 0) {
            return style;
        }
        // If a style is provided, flatten the style and add the padding to it
        if (style) {
            const contentContainerStyleFlattened = react_native_1.StyleSheet.flatten(style);
            const styleBottomSafeAreaPadding = contentContainerStyleFlattened?.[styleProperty];
            if (typeof styleBottomSafeAreaPadding === 'number') {
                totalPaddingBottom += styleBottomSafeAreaPadding;
            }
            else if (typeof styleBottomSafeAreaPadding === 'string') {
                totalPaddingBottom = `calc(${totalPaddingBottom}px + ${styleBottomSafeAreaPadding})`;
            }
            else if (styleBottomSafeAreaPadding !== undefined) {
                return style;
            }
            // The user of this hook can decide which style property to use for applying the padding.
            return [style, { [styleProperty]: totalPaddingBottom }];
        }
        // If no style is provided, return the padding as an object
        return { paddingBottom: totalPaddingBottom };
    }, [
        additionalPaddingBottom,
        addBottomSafeAreaPadding,
        addOfflineIndicatorBottomSafeAreaPadding,
        isOffline,
        isOfflineIndicatorSafeAreaPaddingEnabled,
        style,
        safeAreaPaddingBottom,
        styleProperty,
    ]);
}
exports.default = useBottomSafeSafeAreaPaddingStyle;
