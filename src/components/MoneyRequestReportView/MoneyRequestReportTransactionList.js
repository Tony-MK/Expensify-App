"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Checkbox_1 = require("@components/Checkbox");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const Modal_1 = require("@components/Modal");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SearchContext_1 = require("@components/Search/SearchContext");
const Text_1 = require("@components/Text");
const useCopySelectionHelper_1 = require("@hooks/useCopySelectionHelper");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const TransactionThreadNavigation_1 = require("@libs/actions/TransactionThreadNavigation");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Fullstory_1 = require("@libs/Fullstory");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const shouldShowTransactionYear_1 = require("@libs/TransactionUtils/shouldShowTransactionYear");
const Navigation_2 = require("@navigation/Navigation");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const MoneyRequestReportTableHeader_1 = require("./MoneyRequestReportTableHeader");
const MoneyRequestReportTotalSpend_1 = require("./MoneyRequestReportTotalSpend");
const MoneyRequestReportTransactionItem_1 = require("./MoneyRequestReportTransactionItem");
const SearchMoneyRequestReportEmptyState_1 = require("./SearchMoneyRequestReportEmptyState");
const sortableColumnNames = [
    CONST_1.default.SEARCH.TABLE_COLUMNS.DATE,
    CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT,
    CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION,
    CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY,
    CONST_1.default.SEARCH.TABLE_COLUMNS.TAG,
    CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT,
];
const isSortableColumnName = (key) => !!sortableColumnNames.find((val) => val === key);
const getTransactionValue = (transaction, key, reportToSort) => {
    switch (key) {
        case CONST_1.default.SEARCH.TABLE_COLUMNS.DATE:
            return (0, TransactionUtils_1.getCreated)(transaction);
        case CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT:
            return (0, TransactionUtils_1.getMerchant)(transaction);
        case CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY:
            return (0, TransactionUtils_1.getCategory)(transaction);
        case CONST_1.default.SEARCH.TABLE_COLUMNS.TAG:
            return (0, TransactionUtils_1.getTag)(transaction);
        case CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT:
            return (0, TransactionUtils_1.getAmount)(transaction, (0, ReportUtils_1.isExpenseReport)(reportToSort), transaction.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID);
        case CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION:
            return Parser_1.default.htmlToText(transaction.comment?.comment ?? '');
        default:
            return transaction[key];
    }
};
function MoneyRequestReportTransactionList({ report, transactions, newTransactions, reportActions, violations, hasComments, isLoadingInitialReportActions: isLoadingReportActions, scrollToNewTransaction, }) {
    (0, useCopySelectionHelper_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    const [selectedTransactionID, setSelectedTransactionID] = (0, react_1.useState)('');
    const { totalDisplaySpend, nonReimbursableSpend, reimbursableSpend } = (0, ReportUtils_1.getMoneyRequestSpendBreakdown)(report);
    const formattedOutOfPocketAmount = (0, CurrencyUtils_1.convertToDisplayString)(reimbursableSpend, report?.currency);
    const formattedCompanySpendAmount = (0, CurrencyUtils_1.convertToDisplayString)(nonReimbursableSpend, report?.currency);
    const shouldShowBreakdown = !!nonReimbursableSpend && !!reimbursableSpend;
    const transactionsWithoutPendingDelete = (0, react_1.useMemo)(() => transactions.filter((t) => !(0, TransactionUtils_1.isTransactionPendingDelete)(t)), [transactions]);
    const session = (0, OnyxListItemProvider_1.useSession)();
    const hasPendingAction = (0, react_1.useMemo)(() => {
        return transactions.some(TransactionUtils_1.getTransactionPendingAction);
    }, [transactions]);
    const { selectedTransactionIDs, setSelectedTransactions, clearSelectedTransactions } = (0, SearchContext_1.useSearchContext)();
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const personalDetailsList = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const toggleTransaction = (0, react_1.useCallback)((transactionID) => {
        let newSelectedTransactionIDs = selectedTransactionIDs;
        if (selectedTransactionIDs.includes(transactionID)) {
            newSelectedTransactionIDs = selectedTransactionIDs.filter((t) => t !== transactionID);
        }
        else {
            newSelectedTransactionIDs = [...selectedTransactionIDs, transactionID];
        }
        setSelectedTransactions(newSelectedTransactionIDs);
    }, [setSelectedTransactions, selectedTransactionIDs]);
    const isTransactionSelected = (0, react_1.useCallback)((transactionID) => selectedTransactionIDs.includes(transactionID), [selectedTransactionIDs]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        return () => {
            if (Navigation_1.navigationRef?.getRootState()?.routes.at(-1)?.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR) {
                return;
            }
            clearSelectedTransactions(true);
        };
    }, [clearSelectedTransactions]));
    const [sortConfig, setSortConfig] = (0, react_1.useState)({
        sortBy: CONST_1.default.SEARCH.TABLE_COLUMNS.DATE,
        sortOrder: CONST_1.default.SEARCH.SORT_ORDER.ASC,
    });
    const { sortBy, sortOrder } = sortConfig;
    const sortedTransactions = (0, react_1.useMemo)(() => {
        return [...transactions]
            .sort((a, b) => (0, SearchUIUtils_1.compareValues)(getTransactionValue(a, sortBy, report), getTransactionValue(b, sortBy, report), sortOrder, sortBy, localeCompare, true))
            .map((transaction) => ({
            ...transaction,
            shouldBeHighlighted: newTransactions?.includes(transaction),
        }));
    }, [newTransactions, sortBy, sortOrder, transactions, localeCompare, report]);
    const columnsToShow = (0, react_1.useMemo)(() => {
        const columns = (0, SearchUIUtils_1.getColumnsToShow)(session?.accountID, transactions, true);
        return Object.keys(columns).filter((column) => columns[column]);
    }, [transactions, session?.accountID]);
    /**
     * Navigate to the transaction thread for a transaction, creating one optimistically if it doesn't yet exist.
     */
    const navigateToTransaction = (0, react_1.useCallback)((activeTransactionID) => {
        const iouAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, activeTransactionID);
        const backTo = Navigation_2.default.getActiveRoute();
        const reportIDToNavigate = iouAction?.childReportID;
        const routeParams = {
            reportID: reportIDToNavigate,
            backTo,
        };
        if (!iouAction?.childReportID) {
            const transactionThreadReport = (0, Report_1.createTransactionThreadReport)(report, iouAction);
            if (transactionThreadReport) {
                routeParams.reportID = transactionThreadReport.reportID;
            }
        }
        // Single transaction report will open in RHP, and we need to find every other report ID for the rest of transactions
        // to display prev/next arrows in RHP for navigation
        const sortedSiblingTransactionReportIDs = (0, MoneyRequestReportUtils_1.getThreadReportIDsForTransactions)(reportActions, sortedTransactions);
        (0, TransactionThreadNavigation_1.setActiveTransactionThreadIDs)(sortedSiblingTransactionReportIDs).then(() => {
            Navigation_2.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute(routeParams));
        });
    }, [report, reportActions, sortedTransactions]);
    const { amountColumnSize, dateColumnSize, taxAmountColumnSize } = (0, react_1.useMemo)(() => {
        const isAmountColumnWide = transactions.some((transaction) => (0, SearchUIUtils_1.isTransactionAmountTooLong)(transaction));
        const isTaxAmountColumnWide = transactions.some((transaction) => (0, SearchUIUtils_1.isTransactionTaxAmountTooLong)(transaction));
        const shouldShowYearForSomeTransaction = transactions.some((transaction) => (0, shouldShowTransactionYear_1.default)(transaction));
        return {
            amountColumnSize: isAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            taxAmountColumnSize: isTaxAmountColumnWide ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
            dateColumnSize: shouldShowYearForSomeTransaction ? CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE : CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
        };
    }, [transactions]);
    const isEmptyTransactions = (0, isEmpty_1.default)(transactions);
    const handleLongPress = (0, react_1.useCallback)((transactionID) => {
        if (!isSmallScreenWidth) {
            return;
        }
        if (isMobileSelectionModeEnabled) {
            toggleTransaction(transactionID);
            return;
        }
        setSelectedTransactionID(transactionID);
        setIsModalVisible(true);
    }, [isSmallScreenWidth, isMobileSelectionModeEnabled, toggleTransaction, setSelectedTransactionID, setIsModalVisible]);
    const handleOnPress = (0, react_1.useCallback)((transactionID) => {
        if (isMobileSelectionModeEnabled) {
            toggleTransaction(transactionID);
            return;
        }
        navigateToTransaction(transactionID);
    }, [isMobileSelectionModeEnabled, toggleTransaction, navigateToTransaction]);
    const listHorizontalPadding = styles.ph5;
    const transactionItemFSClass = Fullstory_1.default.getChatFSClass(personalDetailsList, report);
    if (isEmptyTransactions) {
        return (<>
                <SearchMoneyRequestReportEmptyState_1.default />
                <MoneyRequestReportTotalSpend_1.default hasComments={hasComments} isLoadingReportActions={!!isLoadingReportActions} isEmptyTransactions={isEmptyTransactions} totalDisplaySpend={totalDisplaySpend} report={report} hasPendingAction={hasPendingAction}/>
            </>);
    }
    return (<>
            {!shouldUseNarrowLayout && (<react_native_1.View style={[styles.dFlex, styles.flexRow, styles.pl5, styles.pr8, styles.alignItemsCenter]}>
                    <react_native_1.View style={[styles.dFlex, styles.flexRow, styles.pv2, styles.pr4, StyleUtils.getPaddingLeft(variables_1.default.w12)]}>
                        <Checkbox_1.default onPress={() => {
                if (selectedTransactionIDs.length !== 0) {
                    clearSelectedTransactions(true);
                }
                else {
                    setSelectedTransactions(transactionsWithoutPendingDelete.map((t) => t.transactionID));
                }
            }} accessibilityLabel={CONST_1.default.ROLE.CHECKBOX} isIndeterminate={selectedTransactionIDs.length > 0 && selectedTransactionIDs.length !== transactionsWithoutPendingDelete.length} isChecked={selectedTransactionIDs.length > 0 && selectedTransactionIDs.length === transactionsWithoutPendingDelete.length}/>
                        {isMediumScreenWidth && <Text_1.default style={[styles.textStrong, styles.ph3]}>{translate('workspace.people.selectAll')}</Text_1.default>}
                    </react_native_1.View>
                    {!isMediumScreenWidth && (<MoneyRequestReportTableHeader_1.default shouldShowSorting sortBy={sortBy} sortOrder={sortOrder} columns={columnsToShow} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} onSortPress={(selectedSortBy, selectedSortOrder) => {
                    if (!isSortableColumnName(selectedSortBy)) {
                        return;
                    }
                    setSortConfig((prevState) => ({ ...prevState, sortBy: selectedSortBy, sortOrder: selectedSortOrder }));
                }}/>)}
                </react_native_1.View>)}
            <react_native_1.View style={[listHorizontalPadding, styles.gap2, styles.pb4]}>
                {sortedTransactions.map((transaction) => {
            return (<MoneyRequestReportTransactionItem_1.default key={transaction.transactionID} transaction={transaction} violations={violations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`]} columns={columnsToShow} report={report} isSelectionModeEnabled={isMobileSelectionModeEnabled} toggleTransaction={toggleTransaction} isSelected={isTransactionSelected(transaction.transactionID)} handleOnPress={handleOnPress} handleLongPress={handleLongPress} dateColumnSize={dateColumnSize} amountColumnSize={amountColumnSize} taxAmountColumnSize={taxAmountColumnSize} 
            // if we add few new transactions, then we need to scroll to the first one
            scrollToNewTransaction={transaction.transactionID === newTransactions?.at(0)?.transactionID ? scrollToNewTransaction : undefined} forwardedFSClass={transactionItemFSClass}/>);
        })}
            </react_native_1.View>
            {shouldShowBreakdown && (<react_native_1.View style={[styles.dFlex, styles.alignItemsEnd, listHorizontalPadding, styles.gap2, styles.mb2]}>
                    {[
                { text: 'cardTransactions.outOfPocket', value: formattedOutOfPocketAmount },
                { text: 'cardTransactions.companySpend', value: formattedCompanySpendAmount },
            ].map(({ text, value }) => (<react_native_1.View key={text} style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.pr3]}>
                            <Text_1.default style={[styles.textLabelSupporting, styles.mr3]} numberOfLines={1}>
                                {translate(text)}
                            </Text_1.default>
                            <Text_1.default numberOfLines={1} style={[styles.textLabelSupporting, styles.textNormal, shouldUseNarrowLayout ? styles.mnw64p : styles.mnw100p, styles.textAlignRight]}>
                                {value}
                            </Text_1.default>
                        </react_native_1.View>))}
                </react_native_1.View>)}
            <MoneyRequestReportTotalSpend_1.default hasComments={hasComments} isLoadingReportActions={!!isLoadingReportActions} isEmptyTransactions={isEmptyTransactions} totalDisplaySpend={totalDisplaySpend} report={report} hasPendingAction={hasPendingAction}/>
            <Modal_1.default isVisible={isModalVisible} type={CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED} onClose={() => setIsModalVisible(false)} shouldPreventScrollOnFocus>
                <MenuItem_1.default title={translate('common.select')} icon={Expensicons.CheckSquare} onPress={() => {
            if (!isMobileSelectionModeEnabled) {
                (0, MobileSelectionMode_1.turnOnMobileSelectionMode)();
            }
            toggleTransaction(selectedTransactionID);
            setIsModalVisible(false);
        }}/>
            </Modal_1.default>
        </>);
}
MoneyRequestReportTransactionList.displayName = 'MoneyRequestReportTransactionList';
exports.default = (0, react_1.memo)(MoneyRequestReportTransactionList);
