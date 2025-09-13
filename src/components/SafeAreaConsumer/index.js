"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
/**
 * This component is a light wrapper around the SafeAreaInsetsContext.Consumer. There are several places where we
 * may need not just the insets, but the computed styles so we save a few lines of code with this.
 */
function SafeAreaConsumer({ children }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<react_native_safe_area_context_1.SafeAreaInsetsContext.Consumer>
            {(safeAreaInsets) => {
            const insets = StyleUtils.getSafeAreaInsets(safeAreaInsets);
            const { paddingTop, paddingBottom } = StyleUtils.getPlatformSafeAreaPadding(insets);
            return children({
                paddingTop,
                paddingBottom,
                insets,
                safeAreaPaddingBottomStyle: { paddingBottom },
            });
        }}
        </react_native_safe_area_context_1.SafeAreaInsetsContext.Consumer>);
}
SafeAreaConsumer.displayName = 'SafeAreaConsumer';
exports.default = SafeAreaConsumer;
