"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var useLocalize_1 = require("@hooks/useLocalize");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
var Icon_1 = require("./Icon");
var Expensicons = require("./Icon/Expensicons");
var PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
var Text_1 = require("./Text");
var Tooltip_1 = require("./Tooltip");
function SymbolButton(_a) {
    var onSymbolButtonPress = _a.onSymbolButtonPress, symbol = _a.symbol, _b = _a.isSymbolPressable, isSymbolPressable = _b === void 0 ? true : _b, textStyle = _a.textStyle;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    return isSymbolPressable ? (<Tooltip_1.default text={translate('common.selectSymbolOrCurrency')}>
            <PressableWithoutFeedback_1.default onPress={onSymbolButtonPress} accessibilityLabel={translate('common.selectSymbolOrCurrency')} role={CONST_1.default.ROLE.BUTTON} style={[styles.flexRow, styles.alignItemsCenter, styles.gap1]}>
                <Icon_1.default small src={Expensicons.DownArrow} fill={theme.icon}/>
                <Text_1.default style={[styles.iouAmountText, styles.lineHeightUndefined, textStyle]}>{symbol}</Text_1.default>
            </PressableWithoutFeedback_1.default>
        </Tooltip_1.default>) : (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1]}>
            <Text_1.default style={[styles.iouAmountText, styles.lineHeightUndefined, textStyle]}>{symbol}</Text_1.default>
        </react_native_1.View>);
}
SymbolButton.displayName = 'SymbolButton';
exports.default = SymbolButton;
