"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
// If the transaction is cash, it has the type CONST.EXPENSE.TYPE.CASH_CARD_NAME.
// If there is no credit card name, it means it couldn't be a card transaction,
// so we assume it's cash. Any other type is treated as a card transaction.
// same in getTypeText
const getType = (cardName) => {
    if (!cardName || cardName.includes(CONST_1.default.EXPENSE.TYPE.CASH_CARD_NAME)) {
        return CONST_1.default.SEARCH.TRANSACTION_TYPE.CASH;
    }
    return CONST_1.default.SEARCH.TRANSACTION_TYPE.CARD;
};
const getTypeIcon = (type) => {
    switch (type) {
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.CARD:
            return Expensicons.CreditCard;
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.DISTANCE:
            return Expensicons.Car;
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.CASH:
        default:
            return Expensicons.Cash;
    }
};
const getTypeText = (type) => {
    switch (type) {
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.DISTANCE:
            return 'common.distance';
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.CARD:
            return 'iou.card';
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.CASH:
        default:
            return 'iou.cash';
    }
};
function TypeCell({ transactionItem, shouldUseNarrowLayout, shouldShowTooltip }) {
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const type = transactionItem.transactionType ?? getType(transactionItem.cardName);
    const isPendingExpensifyCardTransaction = (0, TransactionUtils_1.isExpensifyCardTransaction)(transactionItem) && (0, TransactionUtils_1.isPending)(transactionItem);
    const typeIcon = isPendingExpensifyCardTransaction ? Expensicons.CreditCardHourglass : getTypeIcon(type);
    const typeText = isPendingExpensifyCardTransaction ? 'iou.pending' : getTypeText(type);
    const styles = (0, useThemeStyles_1.default)();
    return shouldUseNarrowLayout ? (<TextWithTooltip_1.default shouldShowTooltip={shouldShowTooltip} text={translate(typeText)} style={[styles.textMicroSupporting, styles.pre, styles.justifyContentCenter]}/>) : (<Icon_1.default src={typeIcon} fill={theme.icon} height={20} width={20}/>);
}
TypeCell.displayName = 'TypeCell';
exports.default = TypeCell;
