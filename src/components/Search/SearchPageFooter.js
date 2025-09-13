"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
function SearchPageFooter({ count, total, currency }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const valueTextStyle = (0, react_1.useMemo)(() => (isOffline ? [styles.textLabelSupporting, styles.labelStrong] : [styles.labelStrong]), [isOffline, styles]);
    return (<react_native_1.View style={[styles.justifyContentEnd, styles.borderTop, styles.ph5, styles.pv3, styles.flexRow, styles.gap3, StyleUtils.getBackgroundColorStyle(theme.appBG)]}>
            <react_native_1.View style={[styles.flexRow, styles.gap1]}>
                <Text_1.default style={styles.textLabelSupporting}>{`${translate('common.expenses')}:`}</Text_1.default>
                <Text_1.default style={valueTextStyle}>{count}</Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexRow, styles.gap1]}>
                <Text_1.default style={styles.textLabelSupporting}>{`${translate('common.totalSpend')}:`}</Text_1.default>
                <Text_1.default style={valueTextStyle}>{(0, CurrencyUtils_1.convertToDisplayString)(total, currency)}</Text_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
SearchPageFooter.displayName = 'SearchPageFooter';
exports.default = SearchPageFooter;
