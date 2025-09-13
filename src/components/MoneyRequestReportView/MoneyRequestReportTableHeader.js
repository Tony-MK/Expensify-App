"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const SearchTableHeader_1 = require("@components/SelectionList/SearchTableHeader");
const SortableTableHeader_1 = require("@components/SelectionList/SortableTableHeader");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const columnConfig = [
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
const expenseHeaders = (0, SearchTableHeader_1.getExpenseHeaders)();
function MoneyRequestReportTableHeader({ sortBy, sortOrder, onSortPress, dateColumnSize, shouldShowSorting, columns, amountColumnSize, taxAmountColumnSize }) {
    const styles = (0, useThemeStyles_1.default)();
    const shouldShowColumn = (0, react_1.useCallback)((columnName) => {
        return columns.includes(columnName);
    }, [columns]);
    const areAllOptionalColumnsHidden = (0, react_1.useMemo)(() => {
        const canBeMissingColumns = expenseHeaders.filter((header) => header.canBeMissing).map((header) => header.columnName);
        return canBeMissingColumns.every((column) => !columns.includes(column));
    }, [columns]);
    return (<react_native_1.View style={[styles.dFlex, styles.flex5]}>
            <SortableTableHeader_1.default columns={columnConfig} shouldShowColumn={shouldShowColumn} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} shouldShowSorting={shouldShowSorting} sortBy={sortBy} sortOrder={sortOrder} onSortPress={onSortPress}/>
        </react_native_1.View>);
}
MoneyRequestReportTableHeader.displayName = 'MoneyRequestReportTableHeader';
exports.default = MoneyRequestReportTableHeader;
