"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenseHeaders = void 0;
const react_1 = require("react");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const SortableTableHeader_1 = require("./SortableTableHeader");
const getExpenseHeaders = (groupBy) => [
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.RECEIPT,
        translationKey: 'common.receipt',
        isColumnSortable: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.TYPE,
        translationKey: 'common.type',
        isColumnSortable: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.DATE,
        translationKey: 'common.date',
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT,
        translationKey: 'common.merchant',
        canBeMissing: true,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION,
        translationKey: 'common.description',
        canBeMissing: true,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.FROM,
        translationKey: 'common.from',
        canBeMissing: true,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.TO,
        translationKey: 'common.to',
        canBeMissing: true,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.CARD,
        translationKey: 'common.card',
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY,
        translationKey: 'common.category',
        canBeMissing: true,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.TAG,
        translationKey: 'common.tag',
        canBeMissing: true,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.WITHDRAWAL_ID,
        translationKey: 'common.withdrawalID',
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.TAX_AMOUNT,
        translationKey: 'common.tax',
        isColumnSortable: false,
        canBeMissing: true,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT,
        translationKey: groupBy ? 'common.total' : 'iou.amount',
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION,
        translationKey: 'common.action',
        isColumnSortable: false,
    },
];
exports.getExpenseHeaders = getExpenseHeaders;
const taskHeaders = [
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.DATE,
        translationKey: 'common.date',
        canBeMissing: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.TITLE,
        translationKey: 'common.title',
        canBeMissing: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION,
        translationKey: 'common.description',
        canBeMissing: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.FROM,
        translationKey: 'common.from',
        canBeMissing: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.IN,
        translationKey: 'common.sharedIn',
        isColumnSortable: false,
        canBeMissing: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.ASSIGNEE,
        translationKey: 'common.assignee',
        canBeMissing: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION,
        translationKey: 'common.action',
        isColumnSortable: false,
        canBeMissing: false,
    },
];
function getSearchColumns(type, groupBy) {
    switch (type) {
        case CONST_1.default.SEARCH.DATA_TYPES.EXPENSE:
            return getExpenseHeaders(groupBy);
        case CONST_1.default.SEARCH.DATA_TYPES.INVOICE:
            return getExpenseHeaders(groupBy);
        case CONST_1.default.SEARCH.DATA_TYPES.TRIP:
            return getExpenseHeaders(groupBy);
        case CONST_1.default.SEARCH.DATA_TYPES.TASK:
            return taskHeaders;
        case CONST_1.default.SEARCH.DATA_TYPES.CHAT:
        default:
            return null;
    }
}
function SearchTableHeader({ columns, type, sortBy, sortOrder, onSortPress, shouldShowYear, shouldShowSorting, canSelectMultiple, isAmountColumnWide, isTaxAmountColumnWide, areAllOptionalColumnsHidden, groupBy, }) {
    const styles = (0, useThemeStyles_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const displayNarrowVersion = isMediumScreenWidth || isSmallScreenWidth;
    const shouldShowColumn = (0, react_1.useCallback)((columnName) => {
        return columns.includes(columnName);
    }, [columns]);
    if (displayNarrowVersion) {
        return;
    }
    const columnConfig = getSearchColumns(type, groupBy);
    if (!columnConfig) {
        return;
    }
    return (<SortableTableHeader_1.default columns={columnConfig} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} shouldShowColumn={shouldShowColumn} dateColumnSize={shouldShowYear ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} amountColumnSize={isAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} taxAmountColumnSize={isTaxAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} shouldShowSorting={shouldShowSorting} sortBy={sortBy} sortOrder={sortOrder} 
    // Don't butt up against the 'select all' checkbox if present
    containerStyles={canSelectMultiple && [styles.pl4]} onSortPress={(columnName, order) => {
            if (columnName === CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS) {
                return;
            }
            onSortPress(columnName, order);
        }}/>);
}
SearchTableHeader.displayName = 'SearchTableHeader';
exports.default = SearchTableHeader;
