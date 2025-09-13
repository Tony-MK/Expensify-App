"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
function MoneyRequestReportTotalSpend({ hasComments, isLoadingReportActions, isEmptyTransactions, totalDisplaySpend, report, hasPendingAction }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    return (<react_native_1.View style={[styles.dFlex, styles.flexRow, styles.ph5, styles.justifyContentBetween, styles.mb2]}>
            <react_native_reanimated_1.default.Text style={[styles.textLabelSupporting]} entering={hasComments ? undefined : react_native_reanimated_1.FadeIn} exiting={isFocused ? react_native_reanimated_1.FadeOut : undefined}>
                {hasComments || isLoadingReportActions ? translate('common.comments') : ''}
            </react_native_reanimated_1.default.Text>
            {!isEmptyTransactions && (<react_native_1.View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.pr3]}>
                    <Text_1.default style={[styles.mr3, styles.textLabelSupporting]}>{translate('common.total')}</Text_1.default>
                    <Text_1.default style={[shouldUseNarrowLayout ? styles.mnw64p : styles.mnw100p, styles.textAlignRight, styles.textBold, hasPendingAction && styles.opacitySemiTransparent]}>
                        {(0, CurrencyUtils_1.convertToDisplayString)(totalDisplaySpend, report?.currency)}
                    </Text_1.default>
                </react_native_1.View>)}
        </react_native_1.View>);
}
MoneyRequestReportTotalSpend.displayName = 'MoneyRequestReportTotalSpend';
exports.default = MoneyRequestReportTotalSpend;
