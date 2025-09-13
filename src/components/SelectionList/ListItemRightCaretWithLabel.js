"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ListItemRightCaretWithLabel({ labelText, shouldShowCaret = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<react_native_1.View style={styles.flexRow}>
            <react_native_1.View style={[StyleUtils.getMinimumWidth(60)]}>{!!labelText && <Text_1.default style={[styles.textAlignCenter, styles.textSupporting, styles.label]}>{labelText}</Text_1.default>}</react_native_1.View>
            {shouldShowCaret && (<react_native_1.View style={[styles.pl2]}>
                    <Icon_1.default src={Expensicons.ArrowRight} fill={theme.icon}/>
                </react_native_1.View>)}
        </react_native_1.View>);
}
ListItemRightCaretWithLabel.displayName = 'ListItemRightCaretWithLabel';
exports.default = ListItemRightCaretWithLabel;
