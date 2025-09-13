"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function FullScreenLoadingIndicator({ style, iconSize = 'large', testID = '' }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFillObject, styles.fullScreenLoading, style]}>
            <react_native_1.ActivityIndicator color={theme.spinner} size={iconSize} testID={testID}/>
        </react_native_1.View>);
}
FullScreenLoadingIndicator.displayName = 'FullScreenLoadingIndicator';
exports.default = FullScreenLoadingIndicator;
