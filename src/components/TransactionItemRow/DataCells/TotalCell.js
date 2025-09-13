"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
function TotalCell({ shouldShowTooltip, transactionItem }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const currency = (0, TransactionUtils_1.getCurrency)(transactionItem);
    const amount = (0, ReportUtils_1.getTransactionDetails)(transactionItem)?.amount;
    let amountToDisplay = (0, CurrencyUtils_1.convertToDisplayString)(amount, currency);
    if ((0, TransactionUtils_1.isScanning)(transactionItem)) {
        amountToDisplay = translate('iou.receiptStatusTitle');
    }
    return (<TextWithTooltip_1.default shouldShowTooltip={shouldShowTooltip} text={amountToDisplay} style={[styles.optionDisplayName, styles.justifyContentCenter, styles.flexShrink0]}/>);
}
TotalCell.displayName = 'TotalCell';
exports.default = TotalCell;
