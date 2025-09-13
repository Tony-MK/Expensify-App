"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextWithIconCell;
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function TextWithIconCell({ icon, text, showTooltip, textStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    if (!text) {
        return null;
    }
    return (<react_native_1.View style={[styles.flexRow, styles.flexShrink1, styles.gap1]}>
            <Icon_1.default src={icon} fill={theme.icon} height={12} width={12}/>
            <TextWithTooltip_1.default text={text} shouldShowTooltip={showTooltip} style={[styles.optionDisplayName, styles.label, styles.pre, styles.justifyContentCenter, styles.textMicro, styles.textSupporting, styles.flexShrink1, textStyle]}/>
        </react_native_1.View>);
}
