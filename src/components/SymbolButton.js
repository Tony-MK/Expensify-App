"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const Text_1 = require("./Text");
const Tooltip_1 = require("./Tooltip");
function SymbolButton({ onSymbolButtonPress, symbol, isSymbolPressable = true, textStyle }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
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
