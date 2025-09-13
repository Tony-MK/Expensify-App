"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var AnimatedCollapsible_1 = require("@components/AnimatedCollapsible");
var Button_1 = require("@components/Button");
var utils_1 = require("@components/Button/utils");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var Pressable_1 = require("@components/Pressable");
var SearchContext_1 = require("@components/Search/SearchContext");
var SearchTableHeader_1 = require("@components/SelectionList/SearchTableHeader");
var Text_1 = require("@components/Text");
var TransactionItemRow_1 = require("@components/TransactionItemRow");
var useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useSyncFocus_1 = require("@hooks/useSyncFocus");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Search_1 = require("@libs/actions/Search");
var MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var variables_1 = require("@styles/variables");
var TransactionThreadNavigation_1 = require("@userActions/TransactionThreadNavigation");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var CardListItemHeader_1 = require("./CardListItemHeader");
var MemberListItemHeader_1 = require("./MemberListItemHeader");
var ReportListItemHeader_1 = require("./ReportListItemHeader");
var WithdrawalIDListItemHeader_1 = require("./WithdrawalIDListItemHeader");
function TransactionGroupListItem(_a) {
    var _b;
    var _c, _d, _e, _f, _g;
    var item = _a.item, isFocused = _a.isFocused, showTooltip = _a.showTooltip, isDisabled = _a.isDisabled, canSelectMultiple = _a.canSelectMultiple, onCheckboxPressRow = _a.onCheckboxPress, onSelectRow = _a.onSelectRow, onFocus = _a.onFocus, onLongPressRow = _a.onLongPressRow, shouldSyncFocus = _a.shouldSyncFocus, columns = _a.columns, groupBy = _a.groupBy, accountID = _a.accountID, isOffline = _a.isOffline, areAllOptionalColumnsHiddenProp = _a.areAllOptionalColumnsHidden, violations = _a.violations;
    var groupItem = item;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var _h = (0, useLocalize_1.default)(), translate = _h.translate, formatPhoneNumber = _h.formatPhoneNumber;
    var _j = (0, SearchContext_1.useSearchContext)(), selectedTransactions = _j.selectedTransactions, currentSearchHash = _j.currentSearchHash;
    var selectedTransactionIDs = Object.keys(selectedTransactions);
    var selectedTransactionIDsSet = (0, react_1.useMemo)(function () { return new Set(selectedTransactionIDs); }, [selectedTransactionIDs]);
    var transactionsSnapshot = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat((_c = groupItem.transactionsQueryJSON) === null || _c === void 0 ? void 0 : _c.hash), { canBeMissing: true })[0];
    var transactionsSnapshotMetadata = (0, react_1.useMemo)(function () {
        return transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.search;
    }, [transactionsSnapshot]);
    var isGroupByReports = groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS;
    var transactions = (0, react_1.useMemo)(function () {
        if (isGroupByReports) {
            return groupItem.transactions;
        }
        if (!(transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.data)) {
            return [];
        }
        var sectionData = (0, SearchUIUtils_1.getSections)(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.data, accountID, formatPhoneNumber);
        return sectionData.map(function (transactionItem) { return (__assign(__assign({}, transactionItem), { isSelected: selectedTransactionIDsSet.has(transactionItem.transactionID) })); });
    }, [isGroupByReports, transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.data, accountID, formatPhoneNumber, groupItem.transactions, selectedTransactionIDsSet]);
    var currentColumns = (0, react_1.useMemo)(function () {
        if (isGroupByReports) {
            return columns !== null && columns !== void 0 ? columns : [];
        }
        if (!(transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.data)) {
            return [];
        }
        var columnsToShow = (0, SearchUIUtils_1.getColumnsToShow)(accountID, transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.data, false, (transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.search.type) === CONST_1.default.SEARCH.DATA_TYPES.TASK);
        return Object.keys(columnsToShow).filter(function (col) { return columnsToShow[col]; });
    }, [accountID, columns, isGroupByReports, transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.data, transactionsSnapshot === null || transactionsSnapshot === void 0 ? void 0 : transactionsSnapshot.search.type]);
    var areAllOptionalColumnsHidden = (0, react_1.useMemo)(function () {
        if (isGroupByReports) {
            return areAllOptionalColumnsHiddenProp !== null && areAllOptionalColumnsHiddenProp !== void 0 ? areAllOptionalColumnsHiddenProp : false;
        }
        var canBeMissingColumns = (0, SearchTableHeader_1.getExpenseHeaders)(groupBy)
            .filter(function (header) { return header.canBeMissing; })
            .map(function (header) { return header.columnName; });
        return canBeMissingColumns.every(function (column) { return !currentColumns.includes(column); });
    }, [areAllOptionalColumnsHiddenProp, currentColumns, groupBy, isGroupByReports]);
    var selectedItemsLength = (0, react_1.useMemo)(function () {
        return transactions.reduce(function (acc, transaction) {
            return transaction.isSelected ? acc + 1 : acc;
        }, 0);
    }, [transactions]);
    var transactionsWithoutPendingDelete = (0, react_1.useMemo)(function () {
        return transactions.filter(function (transaction) { return transaction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE; });
    }, [transactions]);
    var isSelectAllChecked = selectedItemsLength === transactions.length && transactions.length > 0;
    var isIndeterminate = selectedItemsLength > 0 && selectedItemsLength !== transactionsWithoutPendingDelete.length;
    var _k = (0, react_1.useState)(false), isExpanded = _k[0], setIsExpanded = _k[1];
    var isEmpty = transactions.length === 0;
    // Currently only the transaction report groups have transactions where the empty view makes sense
    var shouldDisplayEmptyView = isEmpty && isGroupByReports;
    var isDisabledOrEmpty = isEmpty || isDisabled;
    var shouldDisplayShowMoreButton = !isGroupByReports && !!(transactionsSnapshotMetadata === null || transactionsSnapshotMetadata === void 0 ? void 0 : transactionsSnapshotMetadata.hasMoreResults);
    var shouldDisplayLoadingIndicator = !isGroupByReports && !!(transactionsSnapshotMetadata === null || transactionsSnapshotMetadata === void 0 ? void 0 : transactionsSnapshotMetadata.isLoading);
    var _l = (0, useResponsiveLayout_1.default)(), isLargeScreenWidth = _l.isLargeScreenWidth, shouldUseNarrowLayout = _l.shouldUseNarrowLayout;
    var _m = (0, react_1.useMemo)(function () {
        var isAmountColumnWide = transactions.some(function (transaction) { return transaction.isAmountColumnWide; });
        var isTaxAmountColumnWide = transactions.some(function (transaction) { return transaction.isTaxAmountColumnWide; });
        var shouldShowYearForSomeTransaction = transactions.some(function (transaction) { return transaction.shouldShowYear; });
        return {
            amountColumnSize: isAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            taxAmountColumnSize: isTaxAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            dateColumnSize: shouldShowYearForSomeTransaction ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
        };
    }, [transactions]), amountColumnSize = _m.amountColumnSize, dateColumnSize = _m.dateColumnSize, taxAmountColumnSize = _m.taxAmountColumnSize;
    var animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: (_d = item === null || item === void 0 ? void 0 : item.shouldAnimateInHighlight) !== null && _d !== void 0 ? _d : false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    var isItemSelected = isSelectAllChecked || (item === null || item === void 0 ? void 0 : item.isSelected);
    var pressableStyle = [styles.transactionGroupListItemStyle, isItemSelected && styles.activeComponentBG];
    var openReportInRHP = function (transactionItem) {
        var backTo = Navigation_1.default.getActiveRoute();
        var reportID = (0, MoneyRequestReportUtils_1.getReportIDForTransaction)(transactionItem);
        var siblingTransactionThreadIDs = transactions.map(MoneyRequestReportUtils_1.getReportIDForTransaction);
        // When opening the transaction thread in RHP we need to find every other ID for the rest of transactions
        // to display prev/next arrows in RHP for navigation
        (0, TransactionThreadNavigation_1.setActiveTransactionThreadIDs)(siblingTransactionThreadIDs).then(function () {
            // If we're trying to open a transaction without a transaction thread, let's create the thread and navigate the user
            if (transactionItem.transactionThreadReportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID) {
                var iouAction = (0, ReportActionsUtils_1.getReportAction)(transactionItem.report.reportID, transactionItem.moneyRequestReportActionID);
                (0, SearchUIUtils_1.createAndOpenSearchTransactionThread)(transactionItem, iouAction, currentSearchHash, backTo);
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: reportID, backTo: backTo }));
        });
    };
    var StyleUtils = (0, useStyleUtils_1.default)();
    var pressableRef = (0, react_1.useRef)(null);
    var handleToggle = (0, react_1.useCallback)(function () {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);
    var onPress = (0, react_1.useCallback)(function () {
        if (isGroupByReports || transactions.length === 0) {
            onSelectRow(item);
        }
        if (!isGroupByReports) {
            handleToggle();
        }
    }, [isGroupByReports, transactions.length, onSelectRow, item, handleToggle]);
    var onLongPress = (0, react_1.useCallback)(function () {
        onLongPressRow === null || onLongPressRow === void 0 ? void 0 : onLongPressRow(item);
    }, [item, onLongPressRow]);
    var onCheckboxPress = (0, react_1.useCallback)(function (val) {
        onCheckboxPressRow === null || onCheckboxPressRow === void 0 ? void 0 : onCheckboxPressRow(val, isGroupByReports ? undefined : transactions);
    }, [onCheckboxPressRow, transactions, isGroupByReports]);
    var getHeader = (0, react_1.useMemo)(function () {
        var _a;
        var headers = (_a = {},
            _a[CONST_1.default.SEARCH.GROUP_BY.REPORTS] = (<ReportListItemHeader_1.default report={groupItem} onSelectRow={onSelectRow} onCheckboxPress={onCheckboxPress} isDisabled={isDisabledOrEmpty} isFocused={isFocused} canSelectMultiple={canSelectMultiple} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>),
            _a[CONST_1.default.SEARCH.GROUP_BY.FROM] = (<MemberListItemHeader_1.default member={groupItem} onCheckboxPress={onCheckboxPress} isDisabled={isDisabledOrEmpty} canSelectMultiple={canSelectMultiple} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>),
            _a[CONST_1.default.SEARCH.GROUP_BY.CARD] = (<CardListItemHeader_1.default card={groupItem} onCheckboxPress={onCheckboxPress} isDisabled={isDisabledOrEmpty} isFocused={isFocused} canSelectMultiple={canSelectMultiple} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>),
            _a[CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID] = (<WithdrawalIDListItemHeader_1.default withdrawalID={groupItem} onCheckboxPress={onCheckboxPress} isDisabled={isDisabledOrEmpty} canSelectMultiple={canSelectMultiple} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>),
            _a);
        if (!groupBy) {
            return null;
        }
        return headers[groupBy];
    }, [groupItem, onSelectRow, onCheckboxPress, isDisabledOrEmpty, isFocused, canSelectMultiple, isSelectAllChecked, isIndeterminate, groupBy]);
    (0, useSyncFocus_1.default)(pressableRef, !!isFocused, shouldSyncFocus);
    var pendingAction = ((_e = item.pendingAction) !== null && _e !== void 0 ? _e : (groupItem.transactions.length > 0 && groupItem.transactions.every(function (transaction) { return transaction.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE; })))
        ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE
        : undefined;
    return (<OfflineWithFeedback_1.default pendingAction={pendingAction}>
            <Pressable_1.PressableWithFeedback ref={pressableRef} onLongPress={onLongPress} onPress={onPress} disabled={isDisabled && !isItemSelected} accessibilityLabel={(_f = item.text) !== null && _f !== void 0 ? _f : ''} role={(0, utils_1.getButtonRole)(true)} isNested hoverStyle={[!item.isDisabled && styles.hoveredComponentBG, isItemSelected && styles.activeComponentBG]} dataSet={_b = {}, _b[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _b[CONST_1.default.INNER_BOX_SHADOW_ELEMENT] = false, _b} onMouseDown={function (e) { return e.preventDefault(); }} id={(_g = item.keyForList) !== null && _g !== void 0 ? _g : ''} style={[
            pressableStyle,
            isFocused && StyleUtils.getItemBackgroundColorStyle(!!isItemSelected, !!isFocused, !!item.isDisabled, theme.activeComponentBG, theme.hoverComponentBG),
        ]} onFocus={onFocus} wrapperStyle={[styles.mb2, styles.mh5, animatedHighlightStyle, styles.userSelectNone]}>
                <react_native_1.View style={styles.flex1}>
                    <AnimatedCollapsible_1.default isExpanded={isExpanded} header={getHeader} onPress={function () {
            if (isEmpty && !shouldDisplayEmptyView) {
                onPress();
            }
            handleToggle();
        }}>
                        {shouldDisplayEmptyView ? (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.mnh13]}>
                                <Text_1.default style={[styles.textLabelSupporting]} numberOfLines={1}>
                                    {translate('search.moneyRequestReport.emptyStateTitle')}
                                </Text_1.default>
                            </react_native_1.View>) : (<>
                                {isLargeScreenWidth && (<react_native_1.View style={[styles.searchListHeaderContainerStyle, styles.listTableHeader, styles.bgTransparent, styles.pl9, styles.pr3]}>
                                        <SearchTableHeader_1.default canSelectMultiple type={CONST_1.default.SEARCH.DATA_TYPES.EXPENSE} onSortPress={function () { }} sortOrder={undefined} sortBy={undefined} shouldShowYear={dateColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE} isAmountColumnWide={amountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE} isTaxAmountColumnWide={taxAmountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE} shouldShowSorting={false} columns={currentColumns} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden !== null && areAllOptionalColumnsHidden !== void 0 ? areAllOptionalColumnsHidden : false} groupBy={groupBy}/>
                                    </react_native_1.View>)}
                                {transactions.map(function (transaction) { return (<OfflineWithFeedback_1.default key={transaction.transactionID} pendingAction={transaction.pendingAction}>
                                        <TransactionItemRow_1.default key={transaction.transactionID} report={transaction.report} transactionItem={transaction} violations={violations === null || violations === void 0 ? void 0 : violations["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transaction.transactionID)]} isSelected={!!transaction.isSelected} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} shouldShowTooltip={showTooltip} shouldUseNarrowLayout={!isLargeScreenWidth} shouldShowCheckbox={!!canSelectMultiple} onCheckboxPress={function () { return onCheckboxPress === null || onCheckboxPress === void 0 ? void 0 : onCheckboxPress(transaction); }} columns={currentColumns} onButtonPress={function () {
                    openReportInRHP(transaction);
                }} style={[styles.noBorderRadius, shouldUseNarrowLayout ? [styles.p3, styles.pt2] : [styles.ph3, styles.pv1Half]]} isReportItemChild isInSingleTransactionReport={groupItem.transactions.length === 1} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden}/>
                                    </OfflineWithFeedback_1.default>); })}
                                {shouldDisplayShowMoreButton && !shouldDisplayLoadingIndicator && (<react_native_1.View style={[styles.w100, styles.flexRow, isLargeScreenWidth && styles.pl10]}>
                                        <Button_1.default text={translate('common.showMore')} onPress={function () {
                    var _a;
                    if (!!isOffline || !groupItem.transactionsQueryJSON) {
                        return;
                    }
                    (0, Search_1.search)({
                        queryJSON: groupItem.transactionsQueryJSON,
                        searchKey: undefined,
                        offset: ((_a = transactionsSnapshotMetadata === null || transactionsSnapshotMetadata === void 0 ? void 0 : transactionsSnapshotMetadata.offset) !== null && _a !== void 0 ? _a : 0) + CONST_1.default.SEARCH.RESULTS_PAGE_SIZE,
                        shouldCalculateTotals: false,
                    });
                }} link shouldUseDefaultHover={false} isNested medium innerStyles={[styles.ph3]} textStyles={[styles.fontSizeNormal]}/>
                                    </react_native_1.View>)}
                                {shouldDisplayLoadingIndicator && (<react_native_1.View style={[isLargeScreenWidth && styles.pl10, styles.pt3, isEmpty && styles.pb3]}>
                                        <react_native_1.ActivityIndicator color={theme.spinner} size={25} style={[styles.pl3, !isEmpty && styles.alignItemsStart]}/>
                                    </react_native_1.View>)}
                            </>)}
                    </AnimatedCollapsible_1.default>
                </react_native_1.View>
            </Pressable_1.PressableWithFeedback>
        </OfflineWithFeedback_1.default>);
}
TransactionGroupListItem.displayName = 'TransactionGroupListItem';
exports.default = TransactionGroupListItem;
