"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const Text_1 = require("./Text");
function InlineSystemMessage({ message = '' }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    if (!message) {
        return null;
    }
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
            <Icon_1.default src={Expensicons.Exclamation} fill={theme.danger}/>
            <Text_1.default style={styles.inlineSystemMessage}>{message}</Text_1.default>
        </react_native_1.View>);
}
InlineSystemMessage.displayName = 'InlineSystemMessage';
exports.default = InlineSystemMessage;
