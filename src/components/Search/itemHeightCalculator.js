"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateItemHeight = calculateItemHeight;
exports.createItemHeightCalculator = createItemHeightCalculator;
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var itemHeights_1 = require("./itemHeights");
/**
 * Checks if a transaction item has violations that require extra height
 */
function transactionHasViolations(item) {
    var _a;
    var hasFieldErrors = (0, TransactionUtils_1.hasMissingSmartscanFields)(item);
    var amountMissing = (0, TransactionUtils_1.isAmountMissing)(item);
    var merchantMissing = (0, TransactionUtils_1.isMerchantMissing)(item);
    var hasViolationsCheck = (_a = item.hasViolation) !== null && _a !== void 0 ? _a : !!item.errors;
    return hasFieldErrors || (amountMissing && merchantMissing) || hasViolationsCheck;
}
/**
 * Calculates height for report action items (chat messages)
 */
function getReportActionItemHeight(item) {
    var actionName = item.actionName;
    if (actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) {
        return itemHeights_1.default.CHAT.REPORT_PREVIEW;
    }
    return itemHeights_1.default.CHAT.STANDARD;
}
/**
 * Calculates height for transaction items
 */
function getTransactionItemHeight(item, config) {
    var isLargeScreenWidth = config.isLargeScreenWidth, shouldUseNarrowLayout = config.shouldUseNarrowLayout;
    var itemAction = item.action;
    var isItemActionView = itemAction === CONST_1.default.SEARCH.ACTION_TYPES.VIEW;
    var heightConstants;
    if (shouldUseNarrowLayout) {
        // For narrow screens without drawer (mobile or collapsed desktop)
        heightConstants = isItemActionView ? itemHeights_1.default.NARROW_WITHOUT_DRAWER.STANDARD : itemHeights_1.default.NARROW_WITHOUT_DRAWER.WITH_BUTTON;
    }
    else if (!isLargeScreenWidth) {
        // For narrow screens with drawer
        heightConstants = isItemActionView ? itemHeights_1.default.NARROW_WITH_DRAWER.STANDARD : itemHeights_1.default.NARROW_WITH_DRAWER.WITH_BUTTON;
    }
    else {
        // For wide screens (desktop)
        heightConstants = itemHeights_1.default.WIDE.STANDARD;
    }
    // Add extra height for violations (Review required marker)
    var violationHeightAdjustment = transactionHasViolations(item) ? variables_1.default.searchViolationWarningMarkHeight : 0;
    return heightConstants + violationHeightAdjustment;
}
/**
 * Calculates height for report list items (grouped transactions)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getReportListItemHeight(item, config) {
    var isLargeScreenWidth = config.isLargeScreenWidth;
    if (!item.transactions || item.transactions.length === 0) {
        return Math.max(itemHeights_1.default.HEADER, 1);
    }
    var baseReportItemHeight = isLargeScreenWidth
        ? variables_1.default.searchOptionRowMargin + variables_1.default.searchOptionRowBaseHeight + variables_1.default.searchOptionRowLargeFooterHeight
        : variables_1.default.searchOptionRowMargin + variables_1.default.searchOptionRowBaseHeight + variables_1.default.searchOptionRowSmallFooterHeight;
    var transactionHeight = isLargeScreenWidth ? variables_1.default.searchOptionRowTransactionHeightLargeScreen : variables_1.default.searchOptionRowTransactionHeightSmallScreen;
    var hasViolationsInReport = item.transactions.some(transactionHasViolations);
    var violationHeightAdjustment = hasViolationsInReport ? variables_1.default.searchViolationWarningMarkHeight : 0;
    var calculatedHeight = baseReportItemHeight + item.transactions.length * transactionHeight + variables_1.default.optionRowListItemPadding + variables_1.default.searchOptionRowMargin + violationHeightAdjustment;
    return Math.max(calculatedHeight, itemHeights_1.default.HEADER, 1);
}
/**
 * Main function to calculate item height
 */
function calculateItemHeight(item, config) {
    try {
        // Chat messages (report actions)
        if ((0, SearchUIUtils_1.isReportActionListItemType)(item) && config.type === CONST_1.default.SEARCH.DATA_TYPES.CHAT) {
            return getReportActionItemHeight(item);
        }
        // Transactions
        if ((0, SearchUIUtils_1.isTransactionListItemType)(item)) {
            return getTransactionItemHeight(item, config);
        }
        // Report groups
        if ((0, SearchUIUtils_1.isTransactionGroupListItemType)(item)) {
            return getReportListItemHeight(item, config);
        }
        // Default fallback
        return config.isLargeScreenWidth ? variables_1.default.searchListItemHeightLargeScreen : variables_1.default.searchListItemHeightSmallScreen;
    }
    catch (error) {
        console.error('SearchList: Error calculating item height', error, item);
        return itemHeights_1.default.WIDE.STANDARD;
    }
}
/**
 * Factory function to create a height calculator with pre-configured settings
 */
function createItemHeightCalculator(config) {
    return function (item) { return calculateItemHeight(item, config); };
}
