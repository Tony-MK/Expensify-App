"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AnimatedCollapsible_1 = require("@components/AnimatedCollapsible");
const Button_1 = require("@components/Button");
const utils_1 = require("@components/Button/utils");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Pressable_1 = require("@components/Pressable");
const SearchContext_1 = require("@components/Search/SearchContext");
const SearchTableHeader_1 = require("@components/SelectionList/SearchTableHeader");
const Text_1 = require("@components/Text");
const TransactionItemRow_1 = require("@components/TransactionItemRow");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useSyncFocus_1 = require("@hooks/useSyncFocus");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const variables_1 = require("@styles/variables");
const TransactionThreadNavigation_1 = require("@userActions/TransactionThreadNavigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const CardListItemHeader_1 = require("./CardListItemHeader");
const MemberListItemHeader_1 = require("./MemberListItemHeader");
const ReportListItemHeader_1 = require("./ReportListItemHeader");
const WithdrawalIDListItemHeader_1 = require("./WithdrawalIDListItemHeader");
function TransactionGroupListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onCheckboxPress: onCheckboxPressRow, onSelectRow, onFocus, onLongPressRow, shouldSyncFocus, columns, groupBy, accountID, isOffline, areAllOptionalColumnsHidden: areAllOptionalColumnsHiddenProp, violations, }) {
    const groupItem = item;
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const { selectedTransactions, currentSearchHash } = (0, SearchContext_1.useSearchContext)();
    const selectedTransactionIDs = Object.keys(selectedTransactions);
    const selectedTransactionIDsSet = (0, react_1.useMemo)(() => new Set(selectedTransactionIDs), [selectedTransactionIDs]);
    const [transactionsSnapshot] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${groupItem.transactionsQueryJSON?.hash}`, { canBeMissing: true });
    const transactionsSnapshotMetadata = (0, react_1.useMemo)(() => {
        return transactionsSnapshot?.search;
    }, [transactionsSnapshot]);
    const isGroupByReports = groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS;
    const transactions = (0, react_1.useMemo)(() => {
        if (isGroupByReports) {
            return groupItem.transactions;
        }
        if (!transactionsSnapshot?.data) {
            return [];
        }
        const sectionData = (0, SearchUIUtils_1.getSections)(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, transactionsSnapshot?.data, accountID, formatPhoneNumber);
        return sectionData.map((transactionItem) => ({
            ...transactionItem,
            isSelected: selectedTransactionIDsSet.has(transactionItem.transactionID),
        }));
    }, [isGroupByReports, transactionsSnapshot?.data, accountID, formatPhoneNumber, groupItem.transactions, selectedTransactionIDsSet]);
    const currentColumns = (0, react_1.useMemo)(() => {
        if (isGroupByReports) {
            return columns ?? [];
        }
        if (!transactionsSnapshot?.data) {
            return [];
        }
        const columnsToShow = (0, SearchUIUtils_1.getColumnsToShow)(accountID, transactionsSnapshot?.data, false, transactionsSnapshot?.search.type === CONST_1.default.SEARCH.DATA_TYPES.TASK);
        return Object.keys(columnsToShow).filter((col) => columnsToShow[col]);
    }, [accountID, columns, isGroupByReports, transactionsSnapshot?.data, transactionsSnapshot?.search.type]);
    const areAllOptionalColumnsHidden = (0, react_1.useMemo)(() => {
        if (isGroupByReports) {
            return areAllOptionalColumnsHiddenProp ?? false;
        }
        const canBeMissingColumns = (0, SearchTableHeader_1.getExpenseHeaders)(groupBy)
            .filter((header) => header.canBeMissing)
            .map((header) => header.columnName);
        return canBeMissingColumns.every((column) => !currentColumns.includes(column));
    }, [areAllOptionalColumnsHiddenProp, currentColumns, groupBy, isGroupByReports]);
    const selectedItemsLength = (0, react_1.useMemo)(() => {
        return transactions.reduce((acc, transaction) => {
            return transaction.isSelected ? acc + 1 : acc;
        }, 0);
    }, [transactions]);
    const transactionsWithoutPendingDelete = (0, react_1.useMemo)(() => {
        return transactions.filter((transaction) => transaction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    }, [transactions]);
    const isSelectAllChecked = selectedItemsLength === transactions.length && transactions.length > 0;
    const isIndeterminate = selectedItemsLength > 0 && selectedItemsLength !== transactionsWithoutPendingDelete.length;
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    const isEmpty = transactions.length === 0;
    // Currently only the transaction report groups have transactions where the empty view makes sense
    const shouldDisplayEmptyView = isEmpty && isGroupByReports;
    const isDisabledOrEmpty = isEmpty || isDisabled;
    const shouldDisplayShowMoreButton = !isGroupByReports && !!transactionsSnapshotMetadata?.hasMoreResults;
    const shouldDisplayLoadingIndicator = !isGroupByReports && !!transactionsSnapshotMetadata?.isLoading;
    const { isLargeScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { amountColumnSize, dateColumnSize, taxAmountColumnSize } = (0, react_1.useMemo)(() => {
        const isAmountColumnWide = transactions.some((transaction) => transaction.isAmountColumnWide);
        const isTaxAmountColumnWide = transactions.some((transaction) => transaction.isTaxAmountColumnWide);
        const shouldShowYearForSomeTransaction = transactions.some((transaction) => transaction.shouldShowYear);
        return {
            amountColumnSize: isAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            taxAmountColumnSize: isTaxAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            dateColumnSize: shouldShowYearForSomeTransaction ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
        };
    }, [transactions]);
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: item?.shouldAnimateInHighlight ?? false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    const isItemSelected = isSelectAllChecked || item?.isSelected;
    const pressableStyle = [styles.transactionGroupListItemStyle, isItemSelected && styles.activeComponentBG];
    const openReportInRHP = (transactionItem) => {
        const backTo = Navigation_1.default.getActiveRoute();
        const reportID = (0, MoneyRequestReportUtils_1.getReportIDForTransaction)(transactionItem);
        const siblingTransactionThreadIDs = transactions.map(MoneyRequestReportUtils_1.getReportIDForTransaction);
        // When opening the transaction thread in RHP we need to find every other ID for the rest of transactions
        // to display prev/next arrows in RHP for navigation
        (0, TransactionThreadNavigation_1.setActiveTransactionThreadIDs)(siblingTransactionThreadIDs).then(() => {
            // If we're trying to open a transaction without a transaction thread, let's create the thread and navigate the user
            if (transactionItem.transactionThreadReportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID) {
                const iouAction = (0, ReportActionsUtils_1.getReportAction)(transactionItem.report.reportID, transactionItem.moneyRequestReportActionID);
                (0, SearchUIUtils_1.createAndOpenSearchTransactionThread)(transactionItem, iouAction, currentSearchHash, backTo);
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID, backTo }));
        });
    };
    const StyleUtils = (0, useStyleUtils_1.default)();
    const pressableRef = (0, react_1.useRef)(null);
    const handleToggle = (0, react_1.useCallback)(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);
    const onPress = (0, react_1.useCallback)(() => {
        if (isGroupByReports || transactions.length === 0) {
            onSelectRow(item);
        }
        if (!isGroupByReports) {
            handleToggle();
        }
    }, [isGroupByReports, transactions.length, onSelectRow, item, handleToggle]);
    const onLongPress = (0, react_1.useCallback)(() => {
        onLongPressRow?.(item);
    }, [item, onLongPressRow]);
    const onCheckboxPress = (0, react_1.useCallback)((val) => {
        onCheckboxPressRow?.(val, isGroupByReports ? undefined : transactions);
    }, [onCheckboxPressRow, transactions, isGroupByReports]);
    const getHeader = (0, react_1.useMemo)(() => {
        const headers = {
            [CONST_1.default.SEARCH.GROUP_BY.REPORTS]: (<ReportListItemHeader_1.default report={groupItem} onSelectRow={onSelectRow} onCheckboxPress={onCheckboxPress} isDisabled={isDisabledOrEmpty} isFocused={isFocused} canSelectMultiple={canSelectMultiple} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>),
            [CONST_1.default.SEARCH.GROUP_BY.FROM]: (<MemberListItemHeader_1.default member={groupItem} onCheckboxPress={onCheckboxPress} isDisabled={isDisabledOrEmpty} canSelectMultiple={canSelectMultiple} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>),
            [CONST_1.default.SEARCH.GROUP_BY.CARD]: (<CardListItemHeader_1.default card={groupItem} onCheckboxPress={onCheckboxPress} isDisabled={isDisabledOrEmpty} isFocused={isFocused} canSelectMultiple={canSelectMultiple} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>),
            [CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID]: (<WithdrawalIDListItemHeader_1.default withdrawalID={groupItem} onCheckboxPress={onCheckboxPress} isDisabled={isDisabledOrEmpty} canSelectMultiple={canSelectMultiple} isSelectAllChecked={isSelectAllChecked} isIndeterminate={isIndeterminate}/>),
        };
        if (!groupBy) {
            return null;
        }
        return headers[groupBy];
    }, [groupItem, onSelectRow, onCheckboxPress, isDisabledOrEmpty, isFocused, canSelectMultiple, isSelectAllChecked, isIndeterminate, groupBy]);
    (0, useSyncFocus_1.default)(pressableRef, !!isFocused, shouldSyncFocus);
    const pendingAction = (item.pendingAction ?? (groupItem.transactions.length > 0 && groupItem.transactions.every((transaction) => transaction.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)))
        ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE
        : undefined;
    return (<OfflineWithFeedback_1.default pendingAction={pendingAction}>
            <Pressable_1.PressableWithFeedback ref={pressableRef} onLongPress={onLongPress} onPress={onPress} disabled={isDisabled && !isItemSelected} accessibilityLabel={item.text ?? ''} role={(0, utils_1.getButtonRole)(true)} isNested hoverStyle={[!item.isDisabled && styles.hoveredComponentBG, isItemSelected && styles.activeComponentBG]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true, [CONST_1.default.INNER_BOX_SHADOW_ELEMENT]: false }} onMouseDown={(e) => e.preventDefault()} id={item.keyForList ?? ''} style={[
            pressableStyle,
            isFocused && StyleUtils.getItemBackgroundColorStyle(!!isItemSelected, !!isFocused, !!item.isDisabled, theme.activeComponentBG, theme.hoverComponentBG),
        ]} onFocus={onFocus} wrapperStyle={[styles.mb2, styles.mh5, animatedHighlightStyle, styles.userSelectNone]}>
                <react_native_1.View style={styles.flex1}>
                    <AnimatedCollapsible_1.default isExpanded={isExpanded} header={getHeader} onPress={() => {
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
                                        <SearchTableHeader_1.default canSelectMultiple type={CONST_1.default.SEARCH.DATA_TYPES.EXPENSE} onSortPress={() => { }} sortOrder={undefined} sortBy={undefined} shouldShowYear={dateColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE} isAmountColumnWide={amountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE} isTaxAmountColumnWide={taxAmountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE} shouldShowSorting={false} columns={currentColumns} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden ?? false} groupBy={groupBy}/>
                                    </react_native_1.View>)}
                                {transactions.map((transaction) => (<OfflineWithFeedback_1.default key={transaction.transactionID} pendingAction={transaction.pendingAction}>
                                        <TransactionItemRow_1.default key={transaction.transactionID} report={transaction.report} transactionItem={transaction} violations={violations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`]} isSelected={!!transaction.isSelected} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} shouldShowTooltip={showTooltip} shouldUseNarrowLayout={!isLargeScreenWidth} shouldShowCheckbox={!!canSelectMultiple} onCheckboxPress={() => onCheckboxPress?.(transaction)} columns={currentColumns} onButtonPress={() => {
                    openReportInRHP(transaction);
                }} style={[styles.noBorderRadius, shouldUseNarrowLayout ? [styles.p3, styles.pt2] : [styles.ph3, styles.pv1Half]]} isReportItemChild isInSingleTransactionReport={groupItem.transactions.length === 1} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden}/>
                                    </OfflineWithFeedback_1.default>))}
                                {shouldDisplayShowMoreButton && !shouldDisplayLoadingIndicator && (<react_native_1.View style={[styles.w100, styles.flexRow, isLargeScreenWidth && styles.pl10]}>
                                        <Button_1.default text={translate('common.showMore')} onPress={() => {
                    if (!!isOffline || !groupItem.transactionsQueryJSON) {
                        return;
                    }
                    (0, Search_1.search)({
                        queryJSON: groupItem.transactionsQueryJSON,
                        searchKey: undefined,
                        offset: (transactionsSnapshotMetadata?.offset ?? 0) + CONST_1.default.SEARCH.RESULTS_PAGE_SIZE,
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
