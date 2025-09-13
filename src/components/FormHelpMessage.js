"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Parser_1 = require("@libs/Parser");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const RenderHTML_1 = require("./RenderHTML");
const Text_1 = require("./Text");
function FormHelpMessage({ message = '', children, isError = true, style, shouldShowRedDotIndicator = true, shouldRenderMessageAsHTML = false, isInfo = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const HTMLMessage = (0, react_1.useMemo)(() => {
        if (typeof message !== 'string' || !shouldRenderMessageAsHTML) {
            return '';
        }
        const replacedText = Parser_1.default.replace(message, { shouldEscapeText: false });
        if (isError) {
            return `<alert-text>${replacedText}</alert-text>`;
        }
        return `<muted-text-label>${replacedText}</muted-text-label>`;
    }, [isError, message, shouldRenderMessageAsHTML]);
    if ((0, isEmpty_1.default)(message) && (0, isEmpty_1.default)(children)) {
        return null;
    }
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mt2, styles.mb1, style]}>
            {isError && shouldShowRedDotIndicator && (<Icon_1.default src={Expensicons.DotIndicator} fill={theme.danger}/>)}
            {isInfo && (<Icon_1.default src={Expensicons.Exclamation} fill={theme.icon} small additionalStyles={[styles.mr1]}/>)}
            <react_native_1.View style={[styles.flex1, isError && shouldShowRedDotIndicator ? styles.ml2 : {}]}>
                {children ?? (shouldRenderMessageAsHTML ? <RenderHTML_1.default html={HTMLMessage}/> : <Text_1.default style={[isError ? styles.formError : styles.formHelp, styles.mb0]}>{message}</Text_1.default>)}
            </react_native_1.View>
        </react_native_1.View>);
}
FormHelpMessage.displayName = 'FormHelpMessage';
exports.default = FormHelpMessage;
