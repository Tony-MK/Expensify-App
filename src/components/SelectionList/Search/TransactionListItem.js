"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const utils_1 = require("@components/Button/utils");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const SearchContext_1 = require("@components/Search/SearchContext");
const TransactionItemRow_1 = require("@components/TransactionItemRow");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useSyncFocus_1 = require("@hooks/useSyncFocus");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const UserInfoAndActionButtonRow_1 = require("./UserInfoAndActionButtonRow");
function TransactionListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onCheckboxPress, onFocus, onLongPressRow, shouldSyncFocus, columns, isLoading, areAllOptionalColumnsHidden, violations, }) {
    const transactionItem = item;
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { isLargeScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { currentSearchHash, currentSearchKey } = (0, SearchContext_1.useSearchContext)();
    const [snapshot] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchHash}`, { canBeMissing: true });
    const snapshotReport = (0, react_1.useMemo)(() => {
        return (snapshot?.data?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionItem.reportID}`] ?? {});
    }, [snapshot, transactionItem.reportID]);
    const snapshotPolicy = (0, react_1.useMemo)(() => {
        return (snapshot?.data?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${transactionItem.policyID}`] ?? {});
    }, [snapshot, transactionItem.policyID]);
    const [lastPaymentMethod] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD}`, { canBeMissing: true });
    const pressableStyle = [
        styles.transactionListItemStyle,
        !isLargeScreenWidth && styles.pt3,
        item.isSelected && styles.activeComponentBG,
        isLargeScreenWidth ? { ...styles.flexRow, ...styles.justifyContentBetween, ...styles.alignItemsCenter } : { ...styles.flexColumn, ...styles.alignItemsStretch },
    ];
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: item?.shouldAnimateInHighlight ?? false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    const { amountColumnSize, dateColumnSize, taxAmountColumnSize } = (0, react_1.useMemo)(() => {
        return {
            amountColumnSize: transactionItem.isAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            taxAmountColumnSize: transactionItem.isTaxAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            dateColumnSize: transactionItem.shouldShowYear ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
        };
    }, [transactionItem]);
    const handleActionButtonPress = (0, react_1.useCallback)(() => {
        (0, Search_1.handleActionButtonPress)(currentSearchHash, transactionItem, () => onSelectRow(item), shouldUseNarrowLayout && !!canSelectMultiple, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey);
    }, [currentSearchHash, transactionItem, shouldUseNarrowLayout, canSelectMultiple, snapshotReport, snapshotPolicy, lastPaymentMethod, currentSearchKey, onSelectRow, item]);
    const handleCheckboxPress = (0, react_1.useCallback)(() => {
        onCheckboxPress?.(item);
    }, [item, onCheckboxPress]);
    const onPress = (0, react_1.useCallback)(() => {
        onSelectRow(item);
    }, [item, onSelectRow]);
    const onLongPress = (0, react_1.useCallback)(() => {
        onLongPressRow?.(item);
    }, [item, onLongPressRow]);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const pressableRef = (0, react_1.useRef)(null);
    (0, useSyncFocus_1.default)(pressableRef, !!isFocused, shouldSyncFocus);
    return (<OfflineWithFeedback_1.default pendingAction={item.pendingAction}>
            <PressableWithFeedback_1.default ref={pressableRef} onLongPress={onLongPress} onPress={onPress} disabled={isDisabled && !item.isSelected} accessibilityLabel={item.text ?? ''} role={(0, utils_1.getButtonRole)(true)} isNested onMouseDown={(e) => e.preventDefault()} hoverStyle={[!item.isDisabled && styles.hoveredComponentBG, item.isSelected && styles.activeComponentBG]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true, [CONST_1.default.INNER_BOX_SHADOW_ELEMENT]: false }} id={item.keyForList ?? ''} style={[
            pressableStyle,
            isFocused && StyleUtils.getItemBackgroundColorStyle(!!item.isSelected, !!isFocused, !!item.isDisabled, theme.activeComponentBG, theme.hoverComponentBG),
        ]} onFocus={onFocus} wrapperStyle={[styles.mb2, styles.mh5, styles.flex1, animatedHighlightStyle, styles.userSelectNone]}>
                {!isLargeScreenWidth && (<UserInfoAndActionButtonRow_1.default item={transactionItem} handleActionButtonPress={handleActionButtonPress} shouldShowUserInfo={!!transactionItem?.from}/>)}
                <TransactionItemRow_1.default transactionItem={transactionItem} report={transactionItem.report} shouldShowTooltip={showTooltip} onButtonPress={handleActionButtonPress} onCheckboxPress={handleCheckboxPress} shouldUseNarrowLayout={!isLargeScreenWidth} columns={columns} isActionLoading={isLoading ?? transactionItem.isActionLoading} isSelected={!!transactionItem.isSelected} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} shouldShowCheckbox={!!canSelectMultiple} style={[styles.p3, shouldUseNarrowLayout ? styles.pt2 : {}]} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} violations={violations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionItem.transactionID}`]}/>
            </PressableWithFeedback_1.default>
        </OfflineWithFeedback_1.default>);
}
TransactionListItem.displayName = 'TransactionListItem';
exports.default = TransactionListItem;
