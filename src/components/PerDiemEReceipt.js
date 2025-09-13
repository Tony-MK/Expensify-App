"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EReceiptThumbnail_1 = require("./EReceiptThumbnail");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const Text_1 = require("./Text");
function computeDefaultPerDiemExpenseRates(customUnit, currency) {
    const subRates = customUnit.subRates ?? [];
    const subRateComments = subRates.map((subRate) => {
        const rate = subRate.rate ?? 0;
        const rateComment = subRate.name ?? '';
        const quantity = subRate.quantity ?? 0;
        return `${quantity}x ${rateComment} @ ${(0, CurrencyUtils_1.convertAmountToDisplayString)(rate, currency)}`;
    });
    return subRateComments.join(', ');
}
function getPerDiemDestination(merchant) {
    const merchantParts = merchant.split(', ');
    if (merchantParts.length < 3) {
        return '';
    }
    return merchantParts.slice(0, merchantParts.length - 3).join(', ');
}
function getPerDiemDates(merchant) {
    const merchantParts = merchant.split(', ');
    if (merchantParts.length < 3) {
        return merchant;
    }
    return merchantParts.slice(-3).join(', ');
}
function PerDiemEReceipt({ transactionID }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, {
        canBeMissing: true,
    });
    // Get receipt colorway, or default to Yellow.
    const { backgroundColor: primaryColor, color: secondaryColor } = StyleUtils.getEReceiptColorStyles(StyleUtils.getEReceiptColorCode(transaction)) ?? {};
    const { amount: transactionAmount, currency: transactionCurrency, merchant: transactionMerchant } = (0, ReportUtils_1.getTransactionDetails)(transaction, CONST_1.default.DATE.MONTH_DAY_YEAR_FORMAT) ?? {};
    const ratesDescription = computeDefaultPerDiemExpenseRates(transaction?.comment?.customUnit ?? {}, transactionCurrency ?? '');
    const datesDescription = getPerDiemDates(transactionMerchant ?? '');
    const destination = getPerDiemDestination(transactionMerchant ?? '');
    const formattedAmount = (0, CurrencyUtils_1.convertToDisplayStringWithoutCurrency)(transactionAmount ?? 0, transactionCurrency);
    const currency = (0, CurrencyUtils_1.getCurrencySymbol)(transactionCurrency ?? '');
    const secondaryTextColorStyle = secondaryColor ? StyleUtils.getColorStyle(secondaryColor) : undefined;
    return (<react_native_1.View style={[styles.eReceiptContainer, primaryColor ? StyleUtils.getBackgroundColorStyle(primaryColor) : undefined]}>
            <react_native_1.View style={styles.fullScreen}>
                <EReceiptThumbnail_1.default transactionID={transactionID} centerIconV={false}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.alignItemsCenter, styles.ph8, styles.pb14, styles.pt8]}>
                <react_native_1.View style={[StyleUtils.getWidthAndHeightStyle(variables_1.default.eReceiptIconWidth, variables_1.default.eReceiptIconHeight)]}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexColumn, styles.justifyContentBetween, styles.alignItemsCenter, styles.ph9, styles.flex1]}>
                <react_native_1.View style={[styles.alignItemsCenter, styles.alignSelfCenter, styles.flexColumn, styles.gap2, styles.mb8]}>
                    <react_native_1.View style={[styles.flexRow, styles.justifyContentCenter, StyleUtils.getWidthStyle(variables_1.default.eReceiptTextContainerWidth)]}>
                        <react_native_1.View style={[styles.flexColumn, styles.pt1]}>
                            <Text_1.default style={[styles.eReceiptCurrency, secondaryTextColorStyle]}>{currency}</Text_1.default>
                        </react_native_1.View>
                        <Text_1.default adjustsFontSizeToFit style={[styles.eReceiptAmountLarge, secondaryTextColorStyle]}>
                            {formattedAmount}
                        </Text_1.default>
                    </react_native_1.View>
                    <Text_1.default style={[styles.eReceiptMerchant, styles.breakWord, styles.textAlignCenter]}>{`${destination} ${translate('common.perDiem').toLowerCase()}`}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.alignSelfStretch, styles.flexColumn, styles.mb8, styles.gap4]}>
                    <react_native_1.View style={[styles.flexColumn, styles.gap1]}>
                        <Text_1.default style={[styles.eReceiptWaypointTitle, secondaryTextColorStyle]}>{translate('iou.dates')}</Text_1.default>
                        <Text_1.default style={[styles.eReceiptWaypointAddress]}>{datesDescription}</Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.flexColumn, styles.gap1]}>
                        <Text_1.default style={[styles.eReceiptWaypointTitle, secondaryTextColorStyle]}>{translate('iou.rates')}</Text_1.default>
                        <Text_1.default style={[styles.eReceiptWaypointAddress]}>{ratesDescription}</Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={[styles.justifyContentBetween, styles.alignItemsCenter, styles.alignSelfStretch, styles.flexRow, styles.mb8]}>
                    <Icon_1.default width={variables_1.default.eReceiptWordmarkWidth} height={variables_1.default.eReceiptWordmarkHeight} fill={secondaryColor} src={Expensicons.ExpensifyWordmark}/>
                    <Text_1.default style={styles.eReceiptGuaranteed}>{translate('eReceipt.guaranteed')}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
PerDiemEReceipt.displayName = 'PerDiemEReceipt';
exports.default = PerDiemEReceipt;
