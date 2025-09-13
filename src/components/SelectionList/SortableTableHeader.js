"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const SortableHeaderText_1 = require("./SortableHeaderText");
function SortableTableHeader({ columns, sortBy, sortOrder, shouldShowColumn, dateColumnSize, containerStyles, shouldShowSorting, onSortPress, amountColumnSize, taxAmountColumnSize, areAllOptionalColumnsHidden, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.flex1]}>
            <react_native_1.View style={[styles.flex1, styles.flexRow, styles.gap3, containerStyles]}>
                {columns.map(({ columnName, translationKey, isColumnSortable }) => {
            if (!shouldShowColumn(columnName)) {
                return null;
            }
            const isSortable = shouldShowSorting && isColumnSortable;
            const isActive = sortBy === columnName;
            const textStyle = columnName === CONST_1.default.SEARCH.TABLE_COLUMNS.RECEIPT ? StyleUtils.getTextOverflowStyle('clip') : null;
            return (<SortableHeaderText_1.default key={columnName} text={translationKey ? translate(translationKey) : ''} textStyle={textStyle} sortOrder={sortOrder ?? CONST_1.default.SEARCH.SORT_ORDER.ASC} isActive={isActive} containerStyle={[
                    StyleUtils.getReportTableColumnStyles(columnName, dateColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE, amountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE, taxAmountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE, !!areAllOptionalColumnsHidden),
                ]} isSortable={isSortable} onPress={(order) => onSortPress(columnName, order)}/>);
        })}
            </react_native_1.View>
        </react_native_1.View>);
}
SortableTableHeader.displayName = 'SortableTableHeader';
exports.default = SortableTableHeader;
