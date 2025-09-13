"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
function TaxCell({ transactionItem, shouldShowTooltip }) {
    const styles = (0, useThemeStyles_1.default)();
    const taxAmount = (0, TransactionUtils_1.getTaxAmount)(transactionItem, true);
    const currency = (0, TransactionUtils_1.getCurrency)(transactionItem);
    return (<TextWithTooltip_1.default shouldShowTooltip={shouldShowTooltip} text={(0, CurrencyUtils_1.convertToDisplayString)(taxAmount, currency)} style={[styles.optionDisplayName, styles.lineHeightLarge, styles.pre, styles.justifyContentCenter, styles.textAlignRight]}/>);
}
TaxCell.displayName = 'TaxCell';
exports.default = TaxCell;
