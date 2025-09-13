"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ScreenWrapperStatusContext_1 = require("@components/ScreenWrapper/ScreenWrapperStatusContext");
const useSafeAreaInsets_1 = require("./useSafeAreaInsets");
const useStyleUtils_1 = require("./useStyleUtils");
/**
 * Custom hook to get safe area padding values and styles.
 *
 * This hook utilizes the `SafeAreaInsetsContext` to retrieve the current safe area insets
 * and applies styling adjustments using the `useStyleUtils` hook.
 *
 * @returns  An object containing the styled safe area insets and additional styles.
 * @returns  .paddingTop The top padding adjusted for safe area.
 * @returns  .paddingBottom The bottom padding adjusted for safe area.
 * @returns  .insets The safe area insets object or undefined if not available.
 * @returns  .safeAreaPaddingBottomStyle An object containing the bottom padding style adjusted for safe area.
 *
 * @example
 * function MyScreen() {
 *   return (
 *      <ScreenWrapper>
 *          <MyComponent />
 *      </ScreenWrapper>
 *   );
 * }
 *
 * function MyComponent() {
 *     const { paddingTop, paddingBottom, safeAreaPaddingBottomStyle } = useSafeAreaPaddings();
 *
 *     // Use these values to style your component accordingly
 * }
 */
function useSafeAreaPaddings(isUsingEdgeToEdgeBottomSafeAreaPadding = false) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const insets = (0, useSafeAreaInsets_1.default)();
    const { paddingTop, paddingBottom } = (0, react_1.useMemo)(() => StyleUtils.getPlatformSafeAreaPadding(insets), [StyleUtils, insets]);
    const screenWrapperStatusContext = (0, react_1.useContext)(ScreenWrapperStatusContext_1.default);
    const isSafeAreaTopPaddingApplied = screenWrapperStatusContext?.isSafeAreaTopPaddingApplied ?? false;
    const isSafeAreaBottomPaddingApplied = screenWrapperStatusContext?.isSafeAreaBottomPaddingApplied ?? false;
    const adaptedPaddingBottom = isSafeAreaBottomPaddingApplied ? 0 : paddingBottom;
    const safeAreaPaddingBottomStyle = (0, react_1.useMemo)(() => ({ paddingBottom: isUsingEdgeToEdgeBottomSafeAreaPadding ? paddingBottom : adaptedPaddingBottom }), [adaptedPaddingBottom, isUsingEdgeToEdgeBottomSafeAreaPadding, paddingBottom]);
    if (isUsingEdgeToEdgeBottomSafeAreaPadding) {
        return {
            paddingTop,
            paddingBottom,
            unmodifiedPaddings: {},
            insets,
            safeAreaPaddingBottomStyle,
        };
    }
    const adaptedInsets = {
        ...insets,
        top: isSafeAreaTopPaddingApplied ? 0 : insets?.top,
        bottom: isSafeAreaBottomPaddingApplied ? 0 : insets?.bottom,
    };
    return {
        paddingTop: isSafeAreaTopPaddingApplied ? 0 : paddingTop,
        paddingBottom: adaptedPaddingBottom,
        unmodifiedPaddings: {
            top: paddingTop,
            bottom: paddingBottom,
        },
        insets: adaptedInsets,
        safeAreaPaddingBottomStyle,
    };
}
exports.default = useSafeAreaPaddings;
