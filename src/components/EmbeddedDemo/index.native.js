"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_webview_1 = require("react-native-webview");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function EmbeddedDemo({ url, webViewProps }) {
    const styles = (0, useThemeStyles_1.default)();
    const { testDrive } = (0, useOnboardingMessages_1.default)();
    return (<react_native_webview_1.default source={{ uri: url }} originWhitelist={testDrive.EMBEDDED_DEMO_WHITELIST} style={styles.flex1} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...webViewProps}/>);
}
EmbeddedDemo.displayName = 'EmbeddedDemo';
exports.default = EmbeddedDemo;
