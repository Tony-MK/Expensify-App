"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("@components/Button/utils");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var Pressable_1 = require("@components/Pressable");
var SearchTableHeader_1 = require("@components/SelectionList/SearchTableHeader");
var TransactionItemRow_1 = require("@components/TransactionItemRow");
var useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ControlSelection_1 = require("@libs/ControlSelection");
var canUseTouchScreen_1 = require("@libs/DeviceCapabilities/canUseTouchScreen");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var expenseHeaders = (0, SearchTableHeader_1.getExpenseHeaders)();
function MoneyRequestReportTransactionItem(_a) {
    var _b;
    var _c;
    var transaction = _a.transaction, violations = _a.violations, report = _a.report, isSelectionModeEnabled = _a.isSelectionModeEnabled, toggleTransaction = _a.toggleTransaction, isSelected = _a.isSelected, handleOnPress = _a.handleOnPress, handleLongPress = _a.handleLongPress, columns = _a.columns, dateColumnSize = _a.dateColumnSize, amountColumnSize = _a.amountColumnSize, taxAmountColumnSize = _a.taxAmountColumnSize, scrollToNewTransaction = _a.scrollToNewTransaction, forwardedFSClass = _a.forwardedFSClass;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var _d = (0, useResponsiveLayout_1.default)(), isSmallScreenWidth = _d.isSmallScreenWidth, isMediumScreenWidth = _d.isMediumScreenWidth, shouldUseNarrowLayout = _d.shouldUseNarrowLayout;
    var theme = (0, useTheme_1.default)();
    var isPendingDelete = (0, TransactionUtils_1.isTransactionPendingDelete)(transaction);
    var pendingAction = (0, TransactionUtils_1.getTransactionPendingAction)(transaction);
    var viewRef = (0, react_1.useRef)(null);
    // This useEffect scrolls to this transaction when it is newly added to the report
    (0, react_1.useEffect)(function () {
        var _a;
        if (!transaction.shouldBeHighlighted || !scrollToNewTransaction) {
            return;
        }
        (_a = viewRef === null || viewRef === void 0 ? void 0 : viewRef.current) === null || _a === void 0 ? void 0 : _a.measure(function (x, y, width, height, pageX, pageY) {
            scrollToNewTransaction === null || scrollToNewTransaction === void 0 ? void 0 : scrollToNewTransaction(pageY);
        });
    }, [scrollToNewTransaction, transaction.shouldBeHighlighted]);
    var animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: (_c = transaction.shouldBeHighlighted) !== null && _c !== void 0 ? _c : false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    var areAllOptionalColumnsHidden = (0, react_1.useMemo)(function () {
        var canBeMissingColumns = expenseHeaders.filter(function (header) { return header.canBeMissing; }).map(function (header) { return header.columnName; });
        return canBeMissingColumns.every(function (column) { return !columns.includes(column); });
    }, [columns]);
    return (<OfflineWithFeedback_1.default pendingAction={pendingAction}>
            <Pressable_1.PressableWithFeedback key={transaction.transactionID} onPress={function () {
            handleOnPress(transaction.transactionID);
        }} accessibilityLabel={translate('iou.viewDetails')} role={(0, utils_1.getButtonRole)(true)} isNested id={transaction.transactionID} style={[styles.transactionListItemStyle]} hoverStyle={[!isPendingDelete && styles.hoveredComponentBG, isSelected && styles.activeComponentBG]} dataSet={_b = {}, _b[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _b} onPressIn={function () { return (0, canUseTouchScreen_1.default)() && ControlSelection_1.default.block(); }} onPressOut={function () { return ControlSelection_1.default.unblock(); }} onLongPress={function () {
            handleLongPress(transaction.transactionID);
        }} disabled={(0, TransactionUtils_1.isTransactionPendingDelete)(transaction)} ref={viewRef} wrapperStyle={[animatedHighlightStyle, styles.userSelectNone]} forwardedFSClass={forwardedFSClass}>
                <TransactionItemRow_1.default transactionItem={transaction} violations={violations} report={report} isSelected={isSelected} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} shouldShowTooltip shouldUseNarrowLayout={shouldUseNarrowLayout || isMediumScreenWidth} shouldShowCheckbox={!!isSelectionModeEnabled || !isSmallScreenWidth} onCheckboxPress={toggleTransaction} columns={columns} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} isDisabled={isPendingDelete} style={[styles.p3]}/>
            </Pressable_1.PressableWithFeedback>
        </OfflineWithFeedback_1.default>);
}
MoneyRequestReportTransactionItem.displayName = 'MoneyRequestReportTransactionItem';
exports.default = MoneyRequestReportTransactionItem;
