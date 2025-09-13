"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
function SearchPageFooter(_a) {
    var count = _a.count, total = _a.total, currency = _a.currency;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var valueTextStyle = (0, react_1.useMemo)(function () { return (isOffline ? [styles.textLabelSupporting, styles.labelStrong] : [styles.labelStrong]); }, [isOffline, styles]);
    return (<react_native_1.View style={[styles.justifyContentEnd, styles.borderTop, styles.ph5, styles.pv3, styles.flexRow, styles.gap3, StyleUtils.getBackgroundColorStyle(theme.appBG)]}>
            <react_native_1.View style={[styles.flexRow, styles.gap1]}>
                <Text_1.default style={styles.textLabelSupporting}>{"".concat(translate('common.expenses'), ":")}</Text_1.default>
                <Text_1.default style={valueTextStyle}>{count}</Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexRow, styles.gap1]}>
                <Text_1.default style={styles.textLabelSupporting}>{"".concat(translate('common.totalSpend'), ":")}</Text_1.default>
                <Text_1.default style={valueTextStyle}>{(0, CurrencyUtils_1.convertToDisplayString)(total, currency)}</Text_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
SearchPageFooter.displayName = 'SearchPageFooter';
exports.default = SearchPageFooter;
