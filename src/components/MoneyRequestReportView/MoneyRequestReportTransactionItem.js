"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const utils_1 = require("@components/Button/utils");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Pressable_1 = require("@components/Pressable");
const SearchTableHeader_1 = require("@components/SelectionList/SearchTableHeader");
const TransactionItemRow_1 = require("@components/TransactionItemRow");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ControlSelection_1 = require("@libs/ControlSelection");
const canUseTouchScreen_1 = require("@libs/DeviceCapabilities/canUseTouchScreen");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const expenseHeaders = (0, SearchTableHeader_1.getExpenseHeaders)();
function MoneyRequestReportTransactionItem({ transaction, violations, report, isSelectionModeEnabled, toggleTransaction, isSelected, handleOnPress, handleLongPress, columns, dateColumnSize, amountColumnSize, taxAmountColumnSize, scrollToNewTransaction, forwardedFSClass, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth, isMediumScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const theme = (0, useTheme_1.default)();
    const isPendingDelete = (0, TransactionUtils_1.isTransactionPendingDelete)(transaction);
    const pendingAction = (0, TransactionUtils_1.getTransactionPendingAction)(transaction);
    const viewRef = (0, react_1.useRef)(null);
    // This useEffect scrolls to this transaction when it is newly added to the report
    (0, react_1.useEffect)(() => {
        if (!transaction.shouldBeHighlighted || !scrollToNewTransaction) {
            return;
        }
        viewRef?.current?.measure((x, y, width, height, pageX, pageY) => {
            scrollToNewTransaction?.(pageY);
        });
    }, [scrollToNewTransaction, transaction.shouldBeHighlighted]);
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: transaction.shouldBeHighlighted ?? false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    const areAllOptionalColumnsHidden = (0, react_1.useMemo)(() => {
        const canBeMissingColumns = expenseHeaders.filter((header) => header.canBeMissing).map((header) => header.columnName);
        return canBeMissingColumns.every((column) => !columns.includes(column));
    }, [columns]);
    return (<OfflineWithFeedback_1.default pendingAction={pendingAction}>
            <Pressable_1.PressableWithFeedback key={transaction.transactionID} onPress={() => {
            handleOnPress(transaction.transactionID);
        }} accessibilityLabel={translate('iou.viewDetails')} role={(0, utils_1.getButtonRole)(true)} isNested id={transaction.transactionID} style={[styles.transactionListItemStyle]} hoverStyle={[!isPendingDelete && styles.hoveredComponentBG, isSelected && styles.activeComponentBG]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }} onPressIn={() => (0, canUseTouchScreen_1.default)() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()} onLongPress={() => {
            handleLongPress(transaction.transactionID);
        }} disabled={(0, TransactionUtils_1.isTransactionPendingDelete)(transaction)} ref={viewRef} wrapperStyle={[animatedHighlightStyle, styles.userSelectNone]} forwardedFSClass={forwardedFSClass}>
                <TransactionItemRow_1.default transactionItem={transaction} violations={violations} report={report} isSelected={isSelected} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} shouldShowTooltip shouldUseNarrowLayout={shouldUseNarrowLayout || isMediumScreenWidth} shouldShowCheckbox={!!isSelectionModeEnabled || !isSmallScreenWidth} onCheckboxPress={toggleTransaction} columns={columns} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} isDisabled={isPendingDelete} style={[styles.p3]}/>
            </Pressable_1.PressableWithFeedback>
        </OfflineWithFeedback_1.default>);
}
MoneyRequestReportTransactionItem.displayName = 'MoneyRequestReportTransactionItem';
exports.default = MoneyRequestReportTransactionItem;
