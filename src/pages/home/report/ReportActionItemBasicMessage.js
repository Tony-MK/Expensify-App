"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ReportActionItemBasicMessage({ message, children }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View>
            {!!message && <Text_1.default style={[styles.chatItemMessage, styles.colorMuted]}>{expensify_common_1.Str.htmlDecode(message)}</Text_1.default>}
            {children}
        </react_native_1.View>);
}
ReportActionItemBasicMessage.displayName = 'ReportActionBasicMessage';
exports.default = ReportActionItemBasicMessage;
