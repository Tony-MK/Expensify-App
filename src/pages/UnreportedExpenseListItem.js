"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const utils_1 = require("@components/Button/utils");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Pressable_1 = require("@components/Pressable");
const TransactionItemRow_1 = require("@components/TransactionItemRow");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useSyncFocus_1 = require("@hooks/useSyncFocus");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function UnreportedExpenseListItem({ item, isFocused, showTooltip, isDisabled, onFocus, shouldSyncFocus, onSelectRow, violations, }) {
    const styles = (0, useThemeStyles_1.default)();
    const transactionItem = item;
    const [isSelected, setIsSelected] = (0, react_1.useState)(false);
    const theme = (0, useTheme_1.default)();
    const pressableStyle = [styles.transactionListItemStyle, isSelected && styles.activeComponentBG];
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: item?.shouldAnimateInHighlight ?? false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    const StyleUtils = (0, useStyleUtils_1.default)();
    const pressableRef = (0, react_1.useRef)(null);
    (0, useSyncFocus_1.default)(pressableRef, !!isFocused, shouldSyncFocus);
    return (<OfflineWithFeedback_1.default pendingAction={item.pendingAction}>
            <Pressable_1.PressableWithFeedback ref={pressableRef} onPress={() => {
            onSelectRow(item);
            setIsSelected((val) => !val);
        }} disabled={isDisabled && !isSelected} accessibilityLabel={item.text ?? ''} role={(0, utils_1.getButtonRole)(true)} isNested onMouseDown={(e) => e.preventDefault()} hoverStyle={[!item.isDisabled && styles.hoveredComponentBG, isSelected && styles.activeComponentBG]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true, [CONST_1.default.INNER_BOX_SHADOW_ELEMENT]: false }} id={item.keyForList ?? ''} style={[pressableStyle, isFocused && StyleUtils.getItemBackgroundColorStyle(!!isSelected, !!isFocused, !!item.isDisabled, theme.activeComponentBG, theme.hoverComponentBG)]} onFocus={onFocus} wrapperStyle={[styles.mb2, styles.mh5, styles.flex1, animatedHighlightStyle, styles.userSelectNone]}>
                <TransactionItemRow_1.default transactionItem={transactionItem} violations={violations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionItem.transactionID}`]} shouldUseNarrowLayout isSelected={isSelected} shouldShowTooltip={showTooltip} dateColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} amountColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} taxAmountColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} onCheckboxPress={() => {
            onSelectRow(item);
            setIsSelected((val) => !val);
        }} shouldShowCheckbox style={styles.p3}/>
            </Pressable_1.PressableWithFeedback>
        </OfflineWithFeedback_1.default>);
}
UnreportedExpenseListItem.displayName = 'UnreportedExpenseListItem';
exports.default = UnreportedExpenseListItem;
