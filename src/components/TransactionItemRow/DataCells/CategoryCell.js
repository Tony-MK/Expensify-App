"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const TextWithIconCell_1 = require("@components/SelectionList/Search/TextWithIconCell");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CategoryUtils_1 = require("@libs/CategoryUtils");
function CategoryCell({ shouldUseNarrowLayout, shouldShowTooltip, transactionItem }) {
    const styles = (0, useThemeStyles_1.default)();
    const categoryForDisplay = (0, CategoryUtils_1.isCategoryMissing)(transactionItem?.category) ? '' : (transactionItem?.category ?? '');
    return shouldUseNarrowLayout ? (<TextWithIconCell_1.default icon={Expensicons.Folder} showTooltip={shouldShowTooltip} text={categoryForDisplay} textStyle={[styles.textMicro, styles.mnh0]}/>) : (<TextWithTooltip_1.default shouldShowTooltip={shouldShowTooltip} text={categoryForDisplay} style={[styles.optionDisplayName, styles.lineHeightLarge, styles.pre, styles.justifyContentCenter]}/>);
}
CategoryCell.displayName = 'CategoryCell';
exports.default = CategoryCell;
