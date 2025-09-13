"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var SearchTableHeader_1 = require("@components/SelectionList/SearchTableHeader");
var SortableTableHeader_1 = require("@components/SelectionList/SortableTableHeader");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
var columnConfig = [
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
        isColumnSortable: true,
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
        columnName: CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS,
        translationKey: undefined, // comments have no title displayed
        isColumnSortable: false,
    },
    {
        columnName: CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT,
        translationKey: 'iou.amount',
    },
];
var expenseHeaders = (0, SearchTableHeader_1.getExpenseHeaders)();
function MoneyRequestReportTableHeader(_a) {
    var sortBy = _a.sortBy, sortOrder = _a.sortOrder, onSortPress = _a.onSortPress, dateColumnSize = _a.dateColumnSize, shouldShowSorting = _a.shouldShowSorting, columns = _a.columns, amountColumnSize = _a.amountColumnSize, taxAmountColumnSize = _a.taxAmountColumnSize;
    var styles = (0, useThemeStyles_1.default)();
    var shouldShowColumn = (0, react_1.useCallback)(function (columnName) {
        return columns.includes(columnName);
    }, [columns]);
    var areAllOptionalColumnsHidden = (0, react_1.useMemo)(function () {
        var canBeMissingColumns = expenseHeaders.filter(function (header) { return header.canBeMissing; }).map(function (header) { return header.columnName; });
        return canBeMissingColumns.every(function (column) { return !columns.includes(column); });
    }, [columns]);
    return (<react_native_1.View style={[styles.dFlex, styles.flex5]}>
            <SortableTableHeader_1.default columns={columnConfig} shouldShowColumn={shouldShowColumn} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} shouldShowSorting={shouldShowSorting} sortBy={sortBy} sortOrder={sortOrder} onSortPress={onSortPress}/>
        </react_native_1.View>);
}
MoneyRequestReportTableHeader.displayName = 'MoneyRequestReportTableHeader';
exports.default = MoneyRequestReportTableHeader;
