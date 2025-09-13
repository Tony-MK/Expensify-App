"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const TextWithIconCell_1 = require("@components/SelectionList/Search/TextWithIconCell");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const TransactionUtils_1 = require("@libs/TransactionUtils");
function TagCell({ shouldUseNarrowLayout, shouldShowTooltip, transactionItem }) {
    const styles = (0, useThemeStyles_1.default)();
    return shouldUseNarrowLayout ? (<TextWithIconCell_1.default icon={Expensicons.Tag} showTooltip={shouldShowTooltip} text={(0, TransactionUtils_1.getTagForDisplay)(transactionItem)} textStyle={[styles.textMicro, styles.mnh0]}/>) : (<TextWithTooltip_1.default shouldShowTooltip={shouldShowTooltip} text={(0, TransactionUtils_1.getTagForDisplay)(transactionItem)} style={[styles.optionDisplayName, styles.lineHeightLarge, styles.pre, styles.justifyContentCenter]}/>);
}
TagCell.displayName = 'TagCell';
exports.default = TagCell;
