"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_render_html_1 = require("react-native-render-html");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function DeletedActionRenderer({ tnode }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const htmlAttribs = tnode.attributes;
    const reversedTransactionValue = htmlAttribs[CONST_1.default.REVERSED_TRANSACTION_ATTRIBUTE];
    const hiddenMessageValue = htmlAttribs[CONST_1.default.HIDDEN_MESSAGE_ATTRIBUTE];
    const getIcon = () => {
        if (reversedTransactionValue === 'true') {
            return Expensicons.ArrowsLeftRight;
        }
        if (hiddenMessageValue === 'true') {
            return Expensicons.EyeDisabled;
        }
        return Expensicons.Trashcan;
    };
    return (<react_native_1.View style={[styles.p4, styles.mt1, styles.appBG, styles.border, { borderColor: theme.border }, styles.flexRow, styles.justifyContentCenter, styles.alignItemsCenter, styles.gap2]}>
            <Icon_1.default width={variables_1.default.iconSizeMedium} height={variables_1.default.iconSizeMedium} fill={theme.icon} src={getIcon()}/>
            <react_native_render_html_1.TNodeChildrenRenderer tnode={tnode} renderChild={(props) => {
            const firstChild = props?.childTnode?.children?.at(0);
            const data = firstChild && 'data' in firstChild ? firstChild.data : null;
            if (typeof data === 'string') {
                return (<Text_1.default key={data} style={(styles.textLabelSupporting, styles.textStrong)}>
                                {data}
                            </Text_1.default>);
            }
            return props.childElement;
        }}/>
        </react_native_1.View>);
}
DeletedActionRenderer.displayName = 'DeletedActionRenderer';
exports.default = DeletedActionRenderer;
