"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedSearches = getSuggestedSearches;
exports.getListItem = getListItem;
exports.getSections = getSections;
exports.getShouldShowMerchant = getShouldShowMerchant;
exports.getSortedSections = getSortedSections;
exports.isTransactionGroupListItemType = isTransactionGroupListItemType;
exports.isTransactionReportGroupListItemType = isTransactionReportGroupListItemType;
exports.isTransactionMemberGroupListItemType = isTransactionMemberGroupListItemType;
exports.isTransactionCardGroupListItemType = isTransactionCardGroupListItemType;
exports.isTransactionWithdrawalIDGroupListItemType = isTransactionWithdrawalIDGroupListItemType;
exports.isSearchResultsEmpty = isSearchResultsEmpty;
exports.isTransactionListItemType = isTransactionListItemType;
exports.isReportActionListItemType = isReportActionListItemType;
exports.shouldShowYear = shouldShowYear;
exports.getExpenseTypeTranslationKey = getExpenseTypeTranslationKey;
exports.getOverflowMenu = getOverflowMenu;
exports.isCorrectSearchUserName = isCorrectSearchUserName;
exports.isReportActionEntry = isReportActionEntry;
exports.isTaskListItemType = isTaskListItemType;
exports.getActions = getActions;
exports.createTypeMenuSections = createTypeMenuSections;
exports.createBaseSavedSearchMenuItem = createBaseSavedSearchMenuItem;
exports.shouldShowEmptyState = shouldShowEmptyState;
exports.compareValues = compareValues;
exports.isSearchDataLoaded = isSearchDataLoaded;
exports.getStatusOptions = getStatusOptions;
exports.getTypeOptions = getTypeOptions;
exports.getGroupByOptions = getGroupByOptions;
exports.getGroupCurrencyOptions = getGroupCurrencyOptions;
exports.getFeedOptions = getFeedOptions;
exports.getWideAmountIndicators = getWideAmountIndicators;
exports.isTransactionAmountTooLong = isTransactionAmountTooLong;
exports.isTransactionTaxAmountTooLong = isTransactionTaxAmountTooLong;
exports.getDatePresets = getDatePresets;
exports.createAndOpenSearchTransactionThread = createAndOpenSearchTransactionThread;
exports.getWithdrawalTypeOptions = getWithdrawalTypeOptions;
exports.getActionOptions = getActionOptions;
exports.getColumnsToShow = getColumnsToShow;
exports.getHasOptions = getHasOptions;
const LottieAnimations_1 = require("@components/LottieAnimations");
const ChatListItem_1 = require("@components/SelectionList/ChatListItem");
const TaskListItem_1 = require("@components/SelectionList/Search/TaskListItem");
const TransactionGroupListItem_1 = require("@components/SelectionList/Search/TransactionGroupListItem");
const TransactionListItem_1 = require("@components/SelectionList/Search/TransactionListItem");
const Expensicons = require("@src/components/Icon/Expensicons");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const IOU_1 = require("./actions/IOU");
const Report_1 = require("./actions/Report");
const Search_1 = require("./actions/Search");
const CardFeedUtils_1 = require("./CardFeedUtils");
const CurrencyUtils_1 = require("./CurrencyUtils");
const DateUtils_1 = require("./DateUtils");
const interceptAnonymousUser_1 = require("./interceptAnonymousUser");
const Localize_1 = require("./Localize");
const Navigation_1 = require("./Navigation/Navigation");
const Parser_1 = require("./Parser");
const PersonalDetailsUtils_1 = require("./PersonalDetailsUtils");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
const ReportPreviewActionUtils_1 = require("./ReportPreviewActionUtils");
const ReportPrimaryActionUtils_1 = require("./ReportPrimaryActionUtils");
const ReportUtils_1 = require("./ReportUtils");
const SearchQueryUtils_1 = require("./SearchQueryUtils");
const StringUtils_1 = require("./StringUtils");
const SubscriptionUtils_1 = require("./SubscriptionUtils");
const TransactionUtils_1 = require("./TransactionUtils");
const shouldShowTransactionYear_1 = require("./TransactionUtils/shouldShowTransactionYear");
const transactionColumnNamesToSortingProperty = {
    [CONST_1.default.SEARCH.TABLE_COLUMNS.TO]: 'formattedTo',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.FROM]: 'formattedFrom',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.DATE]: 'date',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.TAG]: 'tag',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]: 'formattedMerchant',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT]: 'formattedTotal',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]: 'category',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.TYPE]: 'transactionType',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION]: 'action',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION]: 'comment',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.TAX_AMOUNT]: null,
    [CONST_1.default.SEARCH.TABLE_COLUMNS.RECEIPT]: null,
    [CONST_1.default.SEARCH.TABLE_COLUMNS.IN]: 'parentReportID',
};
const taskColumnNamesToSortingProperty = {
    [CONST_1.default.SEARCH.TABLE_COLUMNS.DATE]: 'created',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION]: 'description',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.TITLE]: 'reportName',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.FROM]: 'formattedCreatedBy',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.ASSIGNEE]: 'formattedAssignee',
    [CONST_1.default.SEARCH.TABLE_COLUMNS.IN]: 'parentReportID',
};
const expenseStatusActionMapping = {
    [CONST_1.default.SEARCH.STATUS.EXPENSE.DRAFTS]: (expenseReport) => expenseReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.OPEN && expenseReport.statusNum === CONST_1.default.REPORT.STATUS_NUM.OPEN,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.OUTSTANDING]: (expenseReport) => expenseReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.SUBMITTED && expenseReport.statusNum === CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.APPROVED]: (expenseReport) => expenseReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED && expenseReport.statusNum === CONST_1.default.REPORT.STATUS_NUM.APPROVED,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.PAID]: (expenseReport) => (expenseReport?.stateNum ?? 0) >= CONST_1.default.REPORT.STATE_NUM.APPROVED && expenseReport.statusNum === CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.DONE]: (expenseReport) => expenseReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED && expenseReport.statusNum === CONST_1.default.REPORT.STATUS_NUM.CLOSED,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.UNREPORTED]: (expenseReport) => !expenseReport,
    [CONST_1.default.SEARCH.STATUS.EXPENSE.ALL]: () => true,
};
function isValidExpenseStatus(status) {
    return typeof status === 'string' && status in expenseStatusActionMapping;
}
function getExpenseStatusOptions() {
    return [
        { text: (0, Localize_1.translateLocal)('common.unreported'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.UNREPORTED },
        { text: (0, Localize_1.translateLocal)('common.draft'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.DRAFTS },
        { text: (0, Localize_1.translateLocal)('common.outstanding'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.OUTSTANDING },
        { text: (0, Localize_1.translateLocal)('iou.approved'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.APPROVED },
        { text: (0, Localize_1.translateLocal)('iou.settledExpensify'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.PAID },
        { text: (0, Localize_1.translateLocal)('iou.done'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.DONE },
    ];
}
function getExpenseReportedStatusOptions() {
    return [
        { text: (0, Localize_1.translateLocal)('common.draft'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.DRAFTS },
        { text: (0, Localize_1.translateLocal)('common.outstanding'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.OUTSTANDING },
        { text: (0, Localize_1.translateLocal)('iou.approved'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.APPROVED },
        { text: (0, Localize_1.translateLocal)('iou.settledExpensify'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.PAID },
        { text: (0, Localize_1.translateLocal)('iou.done'), value: CONST_1.default.SEARCH.STATUS.EXPENSE.DONE },
    ];
}
function getChatStatusOptions() {
    return [
        { text: (0, Localize_1.translateLocal)('common.unread'), value: CONST_1.default.SEARCH.STATUS.CHAT.UNREAD },
        { text: (0, Localize_1.translateLocal)('common.sent'), value: CONST_1.default.SEARCH.STATUS.CHAT.SENT },
        { text: (0, Localize_1.translateLocal)('common.attachments'), value: CONST_1.default.SEARCH.STATUS.CHAT.ATTACHMENTS },
        { text: (0, Localize_1.translateLocal)('common.links'), value: CONST_1.default.SEARCH.STATUS.CHAT.LINKS },
        { text: (0, Localize_1.translateLocal)('search.filters.pinned'), value: CONST_1.default.SEARCH.STATUS.CHAT.PINNED },
    ];
}
function getInvoiceStatusOptions() {
    return [
        { text: (0, Localize_1.translateLocal)('common.outstanding'), value: CONST_1.default.SEARCH.STATUS.INVOICE.OUTSTANDING },
        { text: (0, Localize_1.translateLocal)('iou.settledExpensify'), value: CONST_1.default.SEARCH.STATUS.INVOICE.PAID },
    ];
}
function getTripStatusOptions() {
    return [
        { text: (0, Localize_1.translateLocal)('search.filters.current'), value: CONST_1.default.SEARCH.STATUS.TRIP.CURRENT },
        { text: (0, Localize_1.translateLocal)('search.filters.past'), value: CONST_1.default.SEARCH.STATUS.TRIP.PAST },
    ];
}
function getTaskStatusOptions() {
    return [
        { text: (0, Localize_1.translateLocal)('common.outstanding'), value: CONST_1.default.SEARCH.STATUS.TASK.OUTSTANDING },
        { text: (0, Localize_1.translateLocal)('search.filters.completed'), value: CONST_1.default.SEARCH.STATUS.TASK.COMPLETED },
    ];
}
const emptyPersonalDetails = {
    accountID: CONST_1.default.REPORT.OWNER_ACCOUNT_ID_FAKE,
    avatar: '',
    displayName: undefined,
    login: undefined,
};
/**
 * Returns a list of all possible searches in the LHN, along with their query & hash.
 * *NOTE* When rendering the LHN, you should use the "createTypeMenuSections" method, which
 * contains the conditionals for rendering each of these.
 *
 * Keep all suggested search declarations in this object.
 * If you are updating this function, do not add more params unless absolutely necessary for the searches. The amount of data needed to
 * get the list of searches should be as minimal as possible.
 *
 * These searches should be as static as possible, and should not contain conditionals, or any other logic.
 *
 * If you are trying to access data about a specific search, you do NOT need to subscribe to the data (such as feeds) if it does not
 * affect the specific query you are looking for
 */
function getSuggestedSearches(accountID = CONST_1.default.DEFAULT_NUMBER_ID, defaultFeedID) {
    return {
        [CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES,
            translationPath: 'common.expenses',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.Receipt,
            searchQuery: (0, SearchQueryUtils_1.buildCannedSearchQuery)(),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.REPORTS]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.REPORTS,
            translationPath: 'common.reports',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.Document,
            searchQuery: (0, SearchQueryUtils_1.buildCannedSearchQuery)({ groupBy: CONST_1.default.SEARCH.GROUP_BY.REPORTS }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.CHATS]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.CHATS,
            translationPath: 'common.chats',
            type: CONST_1.default.SEARCH.DATA_TYPES.CHAT,
            icon: Expensicons.ChatBubbles,
            searchQuery: (0, SearchQueryUtils_1.buildCannedSearchQuery)({ type: CONST_1.default.SEARCH.DATA_TYPES.CHAT }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT,
            translationPath: 'common.submit',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.Pencil,
            searchQuery: (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                groupBy: CONST_1.default.SEARCH.GROUP_BY.REPORTS,
                action: CONST_1.default.SEARCH.ACTION_FILTERS.SUBMIT,
                from: [`${accountID}`],
            }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE,
            translationPath: 'search.bulkActions.approve',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.ThumbsUp,
            searchQuery: (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                groupBy: CONST_1.default.SEARCH.GROUP_BY.REPORTS,
                action: CONST_1.default.SEARCH.ACTION_FILTERS.APPROVE,
                to: [`${accountID}`],
            }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.PAY]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.PAY,
            translationPath: 'search.bulkActions.pay',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.MoneyBag,
            searchQuery: (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                groupBy: CONST_1.default.SEARCH.GROUP_BY.REPORTS,
                action: CONST_1.default.SEARCH.ACTION_FILTERS.PAY,
                reimbursable: CONST_1.default.SEARCH.BOOLEAN.YES,
                payer: accountID?.toString(),
            }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT,
            translationPath: 'common.export',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.CheckCircle,
            searchQuery: (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                groupBy: CONST_1.default.SEARCH.GROUP_BY.REPORTS,
                action: CONST_1.default.SEARCH.ACTION_FILTERS.EXPORT,
                exporter: [`${accountID}`],
                exportedOn: CONST_1.default.SEARCH.DATE_PRESETS.NEVER,
            }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.STATEMENTS]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.STATEMENTS,
            translationPath: 'search.statements',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.CreditCard,
            searchQuery: (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                feed: defaultFeedID ? [defaultFeedID] : [''],
                groupBy: CONST_1.default.SEARCH.GROUP_BY.CARD,
                postedOn: CONST_1.default.SEARCH.DATE_PRESETS.LAST_STATEMENT,
            }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH,
            translationPath: 'search.unapprovedCash',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.MoneyHourglass,
            searchQuery: (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                status: [CONST_1.default.SEARCH.STATUS.EXPENSE.DRAFTS, CONST_1.default.SEARCH.STATUS.EXPENSE.OUTSTANDING],
                groupBy: CONST_1.default.SEARCH.GROUP_BY.FROM,
                reimbursable: CONST_1.default.SEARCH.BOOLEAN.YES,
            }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD,
            translationPath: 'search.unapprovedCard',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.CreditCardHourglass,
            searchQuery: (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                feed: defaultFeedID ? [defaultFeedID] : [''],
                groupBy: CONST_1.default.SEARCH.GROUP_BY.CARD,
                status: [CONST_1.default.SEARCH.STATUS.EXPENSE.DRAFTS, CONST_1.default.SEARCH.STATUS.EXPENSE.OUTSTANDING],
            }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
        [CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION]: {
            key: CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION,
            translationPath: 'search.reconciliation',
            type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
            icon: Expensicons.Bank,
            searchQuery: (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                withdrawalType: CONST_1.default.SEARCH.WITHDRAWAL_TYPE.REIMBURSEMENT,
                withdrawnOn: CONST_1.default.SEARCH.DATE_PRESETS.LAST_MONTH,
                groupBy: CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID,
            }),
            get searchQueryJSON() {
                return (0, SearchQueryUtils_1.buildSearchQueryJSON)(this.searchQuery);
            },
            get hash() {
                return this.searchQueryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
            get similarSearchHash() {
                return this.searchQueryJSON?.similarSearchHash ?? CONST_1.default.DEFAULT_NUMBER_ID;
            },
        },
    };
}
function getSuggestedSearchesVisibility(currentUserEmail, cardFeedsByPolicy, policies) {
    let shouldShowSubmitSuggestion = false;
    let shouldShowPaySuggestion = false;
    let shouldShowApproveSuggestion = false;
    let shouldShowExportSuggestion = false;
    let shouldShowStatementsSuggestion = false;
    let shouldShowUnapprovedCashSuggestion = false;
    let shouldShowUnapprovedCardSuggestion = false;
    let shouldShowReconciliationSuggestion = false;
    Object.values(policies ?? {}).some((policy) => {
        if (!policy) {
            return false;
        }
        const isPaidPolicy = (0, PolicyUtils_1.isPaidGroupPolicy)(policy);
        const isPayer = (0, PolicyUtils_1.isPolicyPayer)(policy, currentUserEmail);
        const isAdmin = policy.role === CONST_1.default.POLICY.ROLE.ADMIN;
        const isExporter = policy.exporter === currentUserEmail;
        const isApprover = policy.approver === currentUserEmail;
        const isApprovalEnabled = policy.approvalMode ? policy.approvalMode !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL : false;
        const isPaymentEnabled = (0, PolicyUtils_1.arePaymentsEnabled)(policy);
        const hasVBBA = !!policy.achAccount?.bankAccountID && policy.achAccount.state === CONST_1.default.BANK_ACCOUNT.STATE.OPEN;
        const hasReimburser = !!policy.achAccount?.reimburser;
        const hasCardFeed = cardFeedsByPolicy[policy.id]?.length > 0;
        const isECardEnabled = !!policy.areExpensifyCardsEnabled;
        const isSubmittedTo = Object.values(policy.employeeList ?? {}).some((employee) => {
            return employee.submitsTo === currentUserEmail || employee.forwardsTo === currentUserEmail;
        });
        const isEligibleForSubmitSuggestion = isPaidPolicy;
        const isEligibleForPaySuggestion = isPaidPolicy && isPayer;
        const isEligibleForApproveSuggestion = isPaidPolicy && isApprovalEnabled && (isApprover || isSubmittedTo);
        const isEligibleForExportSuggestion = isExporter;
        const isEligibleForStatementsSuggestion = isPaidPolicy && !!policy.areCompanyCardsEnabled && hasCardFeed;
        const isEligibleForUnapprovedCashSuggestion = isPaidPolicy && isAdmin && isApprovalEnabled && isPaymentEnabled;
        const isEligibleForUnapprovedCardSuggestion = isPaidPolicy && isAdmin && isApprovalEnabled && (hasCardFeed || isECardEnabled);
        const isEligibleForReconciliationSuggestion = isPaidPolicy && isAdmin && ((isPaymentEnabled && hasVBBA && hasReimburser) || isECardEnabled);
        shouldShowSubmitSuggestion || (shouldShowSubmitSuggestion = isEligibleForSubmitSuggestion);
        shouldShowPaySuggestion || (shouldShowPaySuggestion = isEligibleForPaySuggestion);
        shouldShowApproveSuggestion || (shouldShowApproveSuggestion = isEligibleForApproveSuggestion);
        shouldShowExportSuggestion || (shouldShowExportSuggestion = isEligibleForExportSuggestion);
        shouldShowStatementsSuggestion || (shouldShowStatementsSuggestion = isEligibleForStatementsSuggestion);
        shouldShowUnapprovedCashSuggestion || (shouldShowUnapprovedCashSuggestion = isEligibleForUnapprovedCashSuggestion);
        shouldShowUnapprovedCardSuggestion || (shouldShowUnapprovedCardSuggestion = isEligibleForUnapprovedCardSuggestion);
        shouldShowReconciliationSuggestion || (shouldShowReconciliationSuggestion = isEligibleForReconciliationSuggestion);
        // We don't need to check the rest of the policies if we already determined that all suggestions should be displayed
        return (shouldShowSubmitSuggestion &&
            shouldShowPaySuggestion &&
            shouldShowApproveSuggestion &&
            shouldShowExportSuggestion &&
            shouldShowStatementsSuggestion &&
            shouldShowUnapprovedCashSuggestion &&
            shouldShowUnapprovedCardSuggestion &&
            shouldShowReconciliationSuggestion);
    });
    return {
        [CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES]: true,
        [CONST_1.default.SEARCH.SEARCH_KEYS.REPORTS]: true,
        [CONST_1.default.SEARCH.SEARCH_KEYS.CHATS]: true,
        [CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT]: shouldShowSubmitSuggestion,
        [CONST_1.default.SEARCH.SEARCH_KEYS.PAY]: shouldShowPaySuggestion,
        [CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE]: shouldShowApproveSuggestion,
        [CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT]: shouldShowExportSuggestion,
        [CONST_1.default.SEARCH.SEARCH_KEYS.STATEMENTS]: shouldShowStatementsSuggestion,
        [CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH]: shouldShowUnapprovedCashSuggestion,
        [CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD]: shouldShowUnapprovedCardSuggestion,
        [CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION]: shouldShowReconciliationSuggestion,
    };
}
/**
 * @private
 *
 * Returns a list of properties that are common to every Search ListItem
 */
function getTransactionItemCommonFormattedProperties(transactionItem, from, to, policy, formatPhoneNumber) {
    const isExpenseReport = transactionItem.reportType === CONST_1.default.REPORT.TYPE.EXPENSE;
    const fromName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(from);
    const formattedFrom = formatPhoneNumber(fromName);
    // Sometimes the search data personal detail for the 'to' account might not hold neither the display name nor the login
    // so for those cases we fallback to the display name of the personal detail data from onyx.
    let toName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(to, '', false);
    if (!toName && to?.accountID) {
        toName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)((0, ReportUtils_1.getPersonalDetailsForAccountID)(to?.accountID));
    }
    const formattedTo = formatPhoneNumber(toName);
    const formattedTotal = (0, TransactionUtils_1.getAmount)(transactionItem, isExpenseReport);
    const date = transactionItem?.modifiedCreated ? transactionItem.modifiedCreated : transactionItem?.created;
    const merchant = (0, TransactionUtils_1.getMerchant)(transactionItem, policy);
    const formattedMerchant = merchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT ? '' : merchant;
    return {
        formattedFrom,
        formattedTo,
        date,
        formattedTotal,
        formattedMerchant,
    };
}
/**
 * @private
 */
function isReportEntry(key) {
    return key.startsWith(ONYXKEYS_1.default.COLLECTION.REPORT);
}
/**
 * @private
 */
function isGroupEntry(key) {
    return key.startsWith(CONST_1.default.SEARCH.GROUP_PREFIX);
}
/**
 * @private
 */
function isPolicyEntry(key) {
    return key.startsWith(ONYXKEYS_1.default.COLLECTION.POLICY);
}
function isViolationEntry(key) {
    return key.startsWith(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS);
}
/**
 * @private
 */
function isReportActionEntry(key) {
    return key.startsWith(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS);
}
/**
 * @private
 */
function isTransactionEntry(key) {
    return key.startsWith(ONYXKEYS_1.default.COLLECTION.TRANSACTION);
}
/**
 * Determines whether to display the merchant field based on the transactions in the search results.
 */
function getShouldShowMerchant(data) {
    return Object.keys(data).some((key) => {
        if (isTransactionEntry(key)) {
            const item = data[key];
            const merchant = item.modifiedMerchant ? item.modifiedMerchant : (item.merchant ?? '');
            return merchant !== '' && merchant !== CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
        }
        return false;
    });
}
/**
 * Type guard that checks if something is a TransactionGroupListItemType
 */
function isTransactionGroupListItemType(item) {
    return 'transactions' in item;
}
/**
 * Type guard that checks if something is a TransactionReportGroupListItemType
 */
function isTransactionReportGroupListItemType(item) {
    return isTransactionGroupListItemType(item) && 'groupedBy' in item && item.groupedBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS;
}
/**
 * Type guard that checks if something is a TransactionMemberGroupListItemType
 */
function isTransactionMemberGroupListItemType(item) {
    return isTransactionGroupListItemType(item) && 'groupedBy' in item && item.groupedBy === CONST_1.default.SEARCH.GROUP_BY.FROM;
}
/**
 * Type guard that checks if something is a TransactionCardGroupListItemType
 */
function isTransactionCardGroupListItemType(item) {
    return isTransactionGroupListItemType(item) && 'groupedBy' in item && item.groupedBy === CONST_1.default.SEARCH.GROUP_BY.CARD;
}
/**
 * Type guard that checks if something is a TransactionWithdrawalIDGroupListItemType
 */
function isTransactionWithdrawalIDGroupListItemType(item) {
    return isTransactionGroupListItemType(item) && 'groupedBy' in item && item.groupedBy === CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID;
}
/**
 * Type guard that checks if something is a TransactionListItemType
 */
function isTransactionListItemType(item) {
    const transactionListItem = item;
    return transactionListItem.transactionID !== undefined;
}
/**
 * Type guard that check if something is a TaskListItemType
 */
function isTaskListItemType(item) {
    return 'type' in item && item.type === CONST_1.default.REPORT.TYPE.TASK;
}
/**
 * Type guard that checks if something is a ReportActionListItemType
 */
function isReportActionListItemType(item) {
    const reportActionListItem = item;
    return reportActionListItem.reportActionID !== undefined;
}
function isAmountTooLong(amount, maxLength = 8) {
    return Math.abs(amount).toString().length >= maxLength;
}
function isTransactionAmountTooLong(transactionItem) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const amount = Math.abs(transactionItem.modifiedAmount || transactionItem.amount);
    return isAmountTooLong(amount);
}
function isTransactionTaxAmountTooLong(transactionItem) {
    const reportType = transactionItem?.reportType;
    const isFromExpenseReport = reportType === CONST_1.default.REPORT.TYPE.EXPENSE;
    const taxAmount = (0, TransactionUtils_1.getTaxAmount)(transactionItem, isFromExpenseReport);
    return isAmountTooLong(taxAmount);
}
function getWideAmountIndicators(data) {
    let isAmountWide = false;
    let isTaxAmountWide = false;
    const processTransaction = (transaction) => {
        isAmountWide || (isAmountWide = isTransactionAmountTooLong(transaction));
        isTaxAmountWide || (isTaxAmountWide = isTransactionTaxAmountTooLong(transaction));
    };
    if (Array.isArray(data)) {
        data.some((item) => {
            if (isTransactionGroupListItemType(item)) {
                const transactions = item.transactions ?? [];
                for (const transaction of transactions) {
                    processTransaction(transaction);
                    if (isAmountWide && isTaxAmountWide) {
                        break;
                    }
                }
            }
            else if (isTransactionListItemType(item)) {
                processTransaction(item);
            }
            return isAmountWide && isTaxAmountWide;
        });
    }
    else {
        Object.keys(data).some((key) => {
            if (isTransactionEntry(key)) {
                const item = data[key];
                processTransaction(item);
            }
            return isAmountWide && isTaxAmountWide;
        });
    }
    return {
        shouldShowAmountInWideColumn: isAmountWide,
        shouldShowTaxAmountInWideColumn: isTaxAmountWide,
    };
}
/**
 * Checks if the date of transactions or reports indicate the need to display the year because they are from a past year.
 */
function shouldShowYear(data) {
    const currentYear = new Date().getFullYear();
    if (Array.isArray(data)) {
        return data.some((item) => {
            if (isTaskListItemType(item)) {
                const taskYear = new Date(item.created).getFullYear();
                return taskYear !== currentYear;
            }
            if (isTransactionGroupListItemType(item)) {
                // If the item is a TransactionGroupListItemType, iterate over its transactions and check them
                return item.transactions.some((transaction) => {
                    const transactionYear = new Date((0, TransactionUtils_1.getCreated)(transaction)).getFullYear();
                    return transactionYear !== currentYear;
                });
            }
            const createdYear = new Date(item?.modifiedCreated ? item.modifiedCreated : item?.created || '').getFullYear();
            return createdYear !== currentYear;
        });
    }
    for (const key in data) {
        if (isTransactionEntry(key)) {
            const item = data[key];
            if ((0, shouldShowTransactionYear_1.default)(item)) {
                return true;
            }
        }
        else if (isReportActionEntry(key)) {
            const item = data[key];
            for (const action of Object.values(item)) {
                const date = action.created;
                if (DateUtils_1.default.doesDateBelongToAPastYear(date)) {
                    return true;
                }
            }
        }
        else if (isReportEntry(key)) {
            const item = data[key];
            const date = item.created;
            if (date && DateUtils_1.default.doesDateBelongToAPastYear(date)) {
                return true;
            }
        }
    }
    return false;
}
/**
 * @private
 * Extracts all transaction violations from the search data.
 */
function getViolations(data) {
    return Object.fromEntries(Object.entries(data).filter(([key]) => isViolationEntry(key)));
}
/**
 * @private
 * Generates a display name for IOU reports considering the personal details of the payer and the transaction details.
 */
function getIOUReportName(data, reportItem) {
    const payerPersonalDetails = reportItem.managerID ? data.personalDetailsList?.[reportItem.managerID] : emptyPersonalDetails;
    // For cases where the data personal detail for manager ID do not exist in search data.personalDetailsList
    // we fallback to the display name of the personal detail data from onyx.
    const payerName = payerPersonalDetails?.displayName ?? payerPersonalDetails?.login ?? (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)((0, ReportUtils_1.getPersonalDetailsForAccountID)(reportItem.managerID));
    const formattedAmount = (0, CurrencyUtils_1.convertToDisplayString)(reportItem.total ?? 0, reportItem.currency ?? CONST_1.default.CURRENCY.USD);
    if (reportItem.action === CONST_1.default.SEARCH.ACTION_TYPES.PAID) {
        return (0, Localize_1.translateLocal)('iou.payerPaidAmount', {
            payer: payerName,
            amount: formattedAmount,
        });
    }
    return (0, Localize_1.translateLocal)('iou.payerOwesAmount', {
        payer: payerName,
        amount: formattedAmount,
    });
}
function getTransactionViolations(allViolations, transaction) {
    const transactionViolations = allViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`];
    if (!transactionViolations) {
        return [];
    }
    return transactionViolations.filter((violation) => !(0, TransactionUtils_1.isViolationDismissed)(transaction, violation));
}
/**
 * @private
 * Organizes data into List Sections for display, for the TransactionListItemType of Search Results.
 *
 * Do not use directly, use only via `getSections()` facade.
 */
function getTransactionsSections(data, currentSearch, currentAccountID, formatPhoneNumber) {
    const shouldShowMerchant = getShouldShowMerchant(data);
    const doesDataContainAPastYearTransaction = shouldShowYear(data);
    const { shouldShowAmountInWideColumn, shouldShowTaxAmountInWideColumn } = getWideAmountIndicators(data);
    // Pre-filter transaction keys to avoid repeated checks
    const transactionKeys = Object.keys(data).filter(isTransactionEntry);
    // Get violations - optimize by using a Map for faster lookups
    const allViolations = getViolations(data);
    // Use Map for faster lookups of personal details
    const personalDetailsMap = new Map(Object.entries(data.personalDetailsList || {}));
    const transactionsSections = [];
    const queryJSON = (0, SearchQueryUtils_1.getCurrentSearchQueryJSON)();
    for (const key of transactionKeys) {
        const transactionItem = data[key];
        const report = data[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionItem.reportID}`];
        let shouldShow = true;
        if (queryJSON && !transactionItem.isActionLoading) {
            if (queryJSON.type === CONST_1.default.SEARCH.DATA_TYPES.EXPENSE) {
                const status = queryJSON.status;
                if (Array.isArray(status)) {
                    shouldShow = status.some((expenseStatus) => {
                        return isValidExpenseStatus(expenseStatus) ? expenseStatusActionMapping[expenseStatus](report) : false;
                    });
                }
                else {
                    shouldShow = isValidExpenseStatus(status) ? expenseStatusActionMapping[status](report) : false;
                }
            }
        }
        if (shouldShow) {
            const policy = data[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`];
            const shouldShowBlankTo = !report || (0, ReportUtils_1.isOpenExpenseReport)(report);
            const transactionViolations = getTransactionViolations(allViolations, transactionItem);
            // Use Map.get() for faster lookups with default values
            const from = personalDetailsMap.get(transactionItem.accountID.toString()) ?? emptyPersonalDetails;
            const to = transactionItem.managerID && !shouldShowBlankTo ? (personalDetailsMap.get(transactionItem.managerID.toString()) ?? emptyPersonalDetails) : emptyPersonalDetails;
            const { formattedFrom, formattedTo, formattedTotal, formattedMerchant, date } = getTransactionItemCommonFormattedProperties(transactionItem, from, to, policy, formatPhoneNumber);
            const allActions = getActions(data, allViolations, key, currentSearch, currentAccountID);
            const transactionSection = {
                iouRequestType: transactionItem.iouRequestType,
                action: allActions.at(0) ?? CONST_1.default.SEARCH.ACTION_TYPES.VIEW,
                allActions,
                report,
                from,
                to,
                formattedFrom,
                formattedTo: shouldShowBlankTo ? '' : formattedTo,
                formattedTotal,
                formattedMerchant,
                date,
                shouldShowMerchant,
                keyForList: transactionItem.transactionID,
                shouldShowYear: doesDataContainAPastYearTransaction,
                isAmountColumnWide: shouldShowAmountInWideColumn,
                isTaxAmountColumnWide: shouldShowTaxAmountInWideColumn,
                violations: transactionViolations,
                filename: transactionItem.filename,
                // Manually copying all the properties from transactionItem
                transactionID: transactionItem.transactionID,
                created: transactionItem.created,
                modifiedCreated: transactionItem.modifiedCreated,
                amount: transactionItem.amount,
                canDelete: transactionItem.canDelete,
                canHold: transactionItem.canHold,
                canUnhold: transactionItem.canUnhold,
                modifiedAmount: transactionItem.modifiedAmount,
                currency: transactionItem.currency,
                modifiedCurrency: transactionItem.modifiedCurrency,
                merchant: transactionItem.merchant,
                modifiedMerchant: transactionItem.modifiedMerchant,
                comment: transactionItem.comment,
                category: transactionItem.category,
                transactionType: transactionItem.transactionType,
                reportType: transactionItem.reportType,
                policyID: transactionItem.policyID,
                parentTransactionID: transactionItem.parentTransactionID,
                hasEReceipt: transactionItem.hasEReceipt,
                accountID: transactionItem.accountID,
                managerID: transactionItem.managerID,
                reportID: transactionItem.reportID,
                ...(transactionItem.pendingAction ? { pendingAction: transactionItem.pendingAction } : {}),
                transactionThreadReportID: transactionItem.transactionThreadReportID,
                isFromOneTransactionReport: transactionItem.isFromOneTransactionReport,
                tag: transactionItem.tag,
                receipt: transactionItem.receipt,
                taxAmount: transactionItem.taxAmount,
                description: transactionItem.description,
                mccGroup: transactionItem.mccGroup,
                modifiedMCCGroup: transactionItem.modifiedMCCGroup,
                moneyRequestReportActionID: transactionItem.moneyRequestReportActionID,
                pendingAction: transactionItem.pendingAction,
                errors: transactionItem.errors,
                isActionLoading: transactionItem.isActionLoading,
                hasViolation: transactionItem.hasViolation,
                cardID: transactionItem.cardID,
                cardName: transactionItem.cardName,
                convertedAmount: transactionItem.convertedAmount,
                convertedCurrency: transactionItem.convertedCurrency,
            };
            transactionsSections.push(transactionSection);
        }
    }
    return transactionsSections;
}
/**
 * @private
 * Retrieves all transactions associated with a specific report ID from the search data.

 */
function getTransactionsForReport(data, reportID) {
    return Object.entries(data)
        .filter(([key, value]) => isTransactionEntry(key) && value?.reportID === reportID)
        .map(([, value]) => value);
}
/**
 * @private
 * Retrieves a report from the search data based on the provided key.
 */
function getReportFromKey(data, key) {
    if (isTransactionEntry(key)) {
        const transaction = data[key];
        return data[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`];
    }
    if (isReportEntry(key)) {
        return data[key];
    }
    return undefined;
}
/**
 * @private
 * Retrieves the chat report associated with a given report.
 */
function getChatReport(data, report) {
    return data[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`] ?? {};
}
/**
 * @private
 * Retrieves the policy associated with a given report.
 */
function getPolicyFromKey(data, report) {
    return data[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`] ?? {};
}
/**
 * @private
 * Retrieves the report name-value pairs associated with a given report.
 */
function getReportNameValuePairsFromKey(data, report) {
    return data[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`] ?? undefined;
}
/**
 * @private
 * Determines the permission flags for a user reviewing a report.
 */
function getReviewerPermissionFlags(report, policy, currentAccountID) {
    return {
        isSubmitter: report.ownerAccountID === currentAccountID,
        isAdmin: policy.role === CONST_1.default.POLICY.ROLE.ADMIN,
        isApprover: report.managerID === currentAccountID,
    };
}
/**
 * Returns the action that can be taken on a given transaction or report
 *
 * Do not use directly, use only via `getSections()` facade.
 */
function getActions(data, allViolations, key, currentSearch, currentAccountID, reportActions = []) {
    const isTransaction = isTransactionEntry(key);
    const report = getReportFromKey(data, key);
    if (currentSearch === CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT) {
        return [CONST_1.default.SEARCH.ACTION_TYPES.EXPORT_TO_ACCOUNTING];
    }
    if (!isTransaction && !isReportEntry(key)) {
        return [CONST_1.default.SEARCH.ACTION_TYPES.VIEW];
    }
    const transaction = isTransaction ? data[key] : undefined;
    if ((0, TransactionUtils_1.isUnreportedAndHasInvalidDistanceRateTransaction)(transaction)) {
        return [CONST_1.default.SEARCH.ACTION_TYPES.REVIEW];
    }
    // Tracked and unreported expenses don't have a report, so we return early.
    if (!report) {
        return [CONST_1.default.SEARCH.ACTION_TYPES.VIEW];
    }
    const policy = getPolicyFromKey(data, report);
    const isExportAvailable = (0, ReportPrimaryActionUtils_1.isExportAction)(report, policy, reportActions) && !isTransaction;
    if ((0, ReportUtils_1.isSettled)(report) && !isExportAvailable) {
        return [CONST_1.default.SEARCH.ACTION_TYPES.PAID];
    }
    // We need to check both options for a falsy value since the transaction might not have an error but the report associated with it might. We return early if there are any errors for performance reasons, so we don't need to compute any other possible actions.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (transaction?.errors || report?.errors) {
        return [CONST_1.default.SEARCH.ACTION_TYPES.REVIEW];
    }
    // We don't need to run the logic if this is not a transaction or iou/expense report, so let's shortcut the logic for performance reasons
    if (!(0, ReportUtils_1.isMoneyRequestReport)(report) && !(0, ReportUtils_1.isInvoiceReport)(report)) {
        return [CONST_1.default.SEARCH.ACTION_TYPES.VIEW];
    }
    const allActions = [];
    let allReportTransactions;
    if (isReportEntry(key)) {
        allReportTransactions = getTransactionsForReport(data, report.reportID);
    }
    else {
        allReportTransactions = transaction ? [transaction] : [];
    }
    const { isSubmitter, isAdmin, isApprover } = getReviewerPermissionFlags(report, policy, currentAccountID);
    const reportNVP = getReportNameValuePairsFromKey(data, report);
    const isIOUReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNVP);
    const chatReportRNVP = data[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.chatReportID}`] ?? undefined;
    const isChatReportArchived = (0, ReportUtils_1.isArchivedReport)(chatReportRNVP);
    // Only check for violations if we need to (when user has permission to review)
    if ((isSubmitter || isApprover || isAdmin) && (0, ReportUtils_1.hasAnyViolations)(report.reportID, allViolations, allReportTransactions)) {
        if (isSubmitter && !isApprover && !isAdmin && !(0, ReportPreviewActionUtils_1.canReview)(report, allViolations, isIOUReportArchived || isChatReportArchived, policy, allReportTransactions)) {
            allActions.push(CONST_1.default.SEARCH.ACTION_TYPES.VIEW);
        }
        else {
            allActions.push(CONST_1.default.SEARCH.ACTION_TYPES.REVIEW);
        }
    }
    // Submit/Approve/Pay can only be taken on transactions if the transaction is the only one on the report, otherwise `View` is the only option.
    // If this condition is not met, return early for performance reasons
    if (isTransaction && !transaction?.isFromOneTransactionReport) {
        return allActions.length > 0 ? allActions : [CONST_1.default.SEARCH.ACTION_TYPES.VIEW];
    }
    const invoiceReceiverPolicy = (0, ReportUtils_1.isInvoiceReport)(report) && report?.invoiceReceiver?.type === CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS
        ? data[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.invoiceReceiver?.policyID}`]
        : undefined;
    const chatReport = getChatReport(data, report);
    const canBePaid = (0, IOU_1.canIOUBePaid)(report, chatReport, policy, allReportTransactions, false, chatReportRNVP, invoiceReceiverPolicy);
    if (canBePaid && !(0, ReportUtils_1.hasOnlyHeldExpenses)(report.reportID, allReportTransactions)) {
        allActions.push(CONST_1.default.SEARCH.ACTION_TYPES.PAY);
    }
    if (isExportAvailable) {
        allActions.push(CONST_1.default.SEARCH.ACTION_TYPES.EXPORT_TO_ACCOUNTING);
    }
    if ((0, ReportUtils_1.isClosedReport)(report)) {
        return allActions.length > 0 ? allActions : [CONST_1.default.SEARCH.ACTION_TYPES.DONE];
    }
    const hasOnlyPendingCardOrScanningTransactions = allReportTransactions.length > 0 && allReportTransactions.every(TransactionUtils_1.isPendingCardOrScanningTransaction);
    const isAllowedToApproveExpenseReport = (0, ReportUtils_1.isAllowedToApproveExpenseReport)(report, undefined, policy);
    if ((0, IOU_1.canApproveIOU)(report, policy, allReportTransactions) &&
        isAllowedToApproveExpenseReport &&
        !hasOnlyPendingCardOrScanningTransactions &&
        !(0, ReportUtils_1.hasOnlyHeldExpenses)(report.reportID, allReportTransactions)) {
        allActions.push(CONST_1.default.SEARCH.ACTION_TYPES.APPROVE);
    }
    // We check for isAllowedToApproveExpenseReport because if the policy has preventSelfApprovals enabled, we disable the Submit action and in that case we want to show the View action instead
    if ((0, IOU_1.canSubmitReport)(report, policy, allReportTransactions, allViolations, isIOUReportArchived || isChatReportArchived) && isAllowedToApproveExpenseReport) {
        allActions.push(CONST_1.default.SEARCH.ACTION_TYPES.SUBMIT);
    }
    if (reportNVP?.exportFailedTime) {
        return allActions.length > 0 ? allActions : [CONST_1.default.SEARCH.ACTION_TYPES.REVIEW];
    }
    return allActions.length > 0 ? allActions : [CONST_1.default.SEARCH.ACTION_TYPES.VIEW];
}
/**
 * @private
 * Organizes data into List Sections for display, for the TaskListItemType of Search Results.
 *
 * Do not use directly, use only via `getSections()` facade.
 */
function getTaskSections(data, formatPhoneNumber, archivedReportsIDList) {
    return (Object.keys(data)
        .filter(isReportEntry)
        // Ensure that the reports that were passed are tasks, and not some other
        // type of report that was sent as the parent
        .filter((key) => isTaskListItemType(data[key]))
        .map((key) => {
        const taskItem = data[key];
        const personalDetails = data.personalDetailsList;
        const assignee = personalDetails?.[taskItem.managerID] ?? emptyPersonalDetails;
        const createdBy = personalDetails?.[taskItem.accountID] ?? emptyPersonalDetails;
        const formattedAssignee = formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(assignee));
        const formattedCreatedBy = formatPhoneNumber((0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(createdBy));
        const report = (0, ReportUtils_1.getReportOrDraftReport)(taskItem.reportID) ?? taskItem;
        const parentReport = (0, ReportUtils_1.getReportOrDraftReport)(taskItem.parentReportID);
        const doesDataContainAPastYearTransaction = shouldShowYear(data);
        const reportName = StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(taskItem.reportName));
        const description = StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(taskItem.description));
        const result = {
            ...taskItem,
            reportName,
            description,
            assignee,
            formattedAssignee,
            createdBy,
            formattedCreatedBy,
            keyForList: taskItem.reportID,
            shouldShowYear: doesDataContainAPastYearTransaction,
        };
        if (parentReport && personalDetails) {
            // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
            // eslint-disable-next-line deprecation/deprecation
            const policy = (0, PolicyUtils_1.getPolicy)(parentReport.policyID);
            const parentReportName = (0, ReportUtils_1.getReportName)(parentReport, policy, undefined, undefined);
            const isParentReportArchived = archivedReportsIDList?.has(parentReport?.reportID);
            const icons = (0, ReportUtils_1.getIcons)(parentReport, personalDetails, null, '', -1, policy, undefined, isParentReportArchived);
            const parentReportIcon = icons?.at(0);
            result.parentReportName = parentReportName;
            result.parentReportIcon = parentReportIcon;
        }
        if (report) {
            result.report = report;
        }
        return result;
    }));
}
/** Creates transaction thread report and navigates to it from the search page */
function createAndOpenSearchTransactionThread(item, iouReportAction, hash, backTo) {
    // We know that iou report action exists, but it wasn't loaded yet. We need to load iou report to have the necessary data in the onyx.
    if (!iouReportAction) {
        (0, Report_1.openReport)(item.report.reportID);
    }
    const transactionThreadReport = (0, Report_1.createTransactionThreadReport)(item.report, iouReportAction ?? { reportActionID: item.moneyRequestReportActionID });
    if (transactionThreadReport?.reportID) {
        (0, Search_1.updateSearchResultsWithTransactionThreadReportID)(hash, item.transactionID, transactionThreadReport?.reportID);
    }
    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: transactionThreadReport?.reportID, backTo }));
}
/**
 * @private
 * Organizes data into List Sections for display, for the ReportActionListItemType of Search Results.
 *
 * Do not use directly, use only via `getSections()` facade.
 */
function getReportActionsSections(data) {
    const reportActionItems = [];
    const transactions = Object.keys(data)
        .filter(isTransactionEntry)
        .map((key) => data[key]);
    const reports = Object.keys(data)
        .filter(isReportEntry)
        .map((key) => data[key]);
    const policies = Object.keys(data)
        .filter(isPolicyEntry)
        .map((key) => data[key]);
    for (const key in data) {
        if (isReportActionEntry(key)) {
            const reportActions = Object.values(data[key]);
            const freeTrialMessages = reportActions.filter((action) => {
                const html = (0, ReportActionsUtils_1.getReportActionHtml)(action);
                return Parser_1.default.htmlToMarkdown(html) === CONST_1.default.FREE_TRIAL_MARKDOWN;
            });
            const isDuplicateFreeTrialMessage = freeTrialMessages.length > 1;
            const filteredReportActions = reportActions.filter((action) => !isDuplicateFreeTrialMessage || action.reportActionID !== freeTrialMessages.at(0)?.reportActionID);
            for (const reportAction of filteredReportActions) {
                const from = data.personalDetailsList?.[reportAction.accountID];
                const report = data[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportAction.reportID}`] ?? {};
                const policy = data[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report.policyID}`] ?? {};
                const originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(reportAction) : undefined;
                const isSendingMoney = (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && originalMessage?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY && originalMessage?.IOUDetails;
                const invoiceReceiverPolicy = report?.invoiceReceiver?.type === CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS ? data[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report.invoiceReceiver.policyID}`] : undefined;
                if ((0, ReportActionsUtils_1.isDeletedAction)(reportAction) ||
                    (0, ReportActionsUtils_1.isResolvedActionableWhisper)(reportAction) ||
                    reportAction.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CLOSED ||
                    (0, ReportActionsUtils_1.isCreatedAction)(reportAction) ||
                    (0, ReportActionsUtils_1.isWhisperActionTargetedToOthers)(reportAction) ||
                    ((0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && !!report?.isWaitingOnBankAccount && originalMessage?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY && !isSendingMoney)) {
                    continue;
                }
                reportActionItems.push({
                    ...reportAction,
                    from,
                    reportName: (0, ReportUtils_1.getSearchReportName)({ report, policy, personalDetails: data.personalDetailsList, transactions, invoiceReceiverPolicy, reports, policies }),
                    formattedFrom: from?.displayName ?? from?.login ?? '',
                    date: reportAction.created,
                    keyForList: reportAction.reportActionID,
                });
            }
        }
    }
    return reportActionItems;
}
/**
 * @private
 * Organizes data into List Sections grouped by report for display, for the TransactionGroupListItemType of Search Results.
 *
 * Do not use directly, use only via `getSections()` facade.
 */
function getReportSections(data, currentSearch, currentAccountID, formatPhoneNumber, reportActions = {}) {
    const shouldShowMerchant = getShouldShowMerchant(data);
    const doesDataContainAPastYearTransaction = shouldShowYear(data);
    const { shouldShowAmountInWideColumn, shouldShowTaxAmountInWideColumn } = getWideAmountIndicators(data);
    // Get violations - optimize by using a Map for faster lookups
    const allViolations = getViolations(data);
    const queryJSON = (0, SearchQueryUtils_1.getCurrentSearchQueryJSON)();
    const reportIDToTransactions = {};
    for (const key in data) {
        if (isReportEntry(key) && (data[key].type === CONST_1.default.REPORT.TYPE.IOU || data[key].type === CONST_1.default.REPORT.TYPE.EXPENSE || data[key].type === CONST_1.default.REPORT.TYPE.INVOICE)) {
            const reportItem = { ...data[key] };
            const reportKey = `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportItem.reportID}`;
            const transactions = reportIDToTransactions[reportKey]?.transactions ?? [];
            const isIOUReport = reportItem.type === CONST_1.default.REPORT.TYPE.IOU;
            const actions = reportActions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportItem.reportID}`];
            let shouldShow = true;
            if (queryJSON && !reportItem.isActionLoading) {
                if (queryJSON.type === CONST_1.default.SEARCH.DATA_TYPES.EXPENSE) {
                    const status = queryJSON.status;
                    if (Array.isArray(status)) {
                        shouldShow = status.some((expenseStatus) => {
                            return isValidExpenseStatus(expenseStatus) ? expenseStatusActionMapping[expenseStatus](reportItem) : false;
                        });
                    }
                    else {
                        shouldShow = isValidExpenseStatus(status) ? expenseStatusActionMapping[status](reportItem) : false;
                    }
                }
            }
            if (shouldShow) {
                const reportPendingAction = reportItem?.pendingAction ?? reportItem?.pendingFields?.preview;
                const shouldShowBlankTo = !reportItem || (0, ReportUtils_1.isOpenExpenseReport)(reportItem);
                const allActions = getActions(data, allViolations, key, currentSearch, currentAccountID, actions);
                reportIDToTransactions[reportKey] = {
                    ...reportItem,
                    action: allActions.at(0) ?? CONST_1.default.SEARCH.ACTION_TYPES.VIEW,
                    allActions,
                    groupedBy: CONST_1.default.SEARCH.GROUP_BY.REPORTS,
                    keyForList: reportItem.reportID,
                    from: transactions.length > 0 ? data.personalDetailsList[data?.[reportKey]?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID] : emptyPersonalDetails,
                    to: !shouldShowBlankTo && reportItem.managerID ? data.personalDetailsList?.[reportItem.managerID] : emptyPersonalDetails,
                    transactions,
                    ...(reportPendingAction ? { pendingAction: reportPendingAction } : {}),
                };
                if (isIOUReport) {
                    reportIDToTransactions[reportKey].reportName = getIOUReportName(data, reportIDToTransactions[reportKey]);
                }
            }
        }
        else if (isTransactionEntry(key)) {
            const transactionItem = { ...data[key] };
            const reportKey = `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionItem.reportID}`;
            const report = data[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionItem.reportID}`];
            const policy = data[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`];
            const shouldShowBlankTo = !report || (0, ReportUtils_1.isOpenExpenseReport)(report);
            const transactionViolations = getTransactionViolations(allViolations, transactionItem);
            const actions = Object.values(reportActions[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionItem.reportID}`] ?? {});
            const from = data.personalDetailsList?.[transactionItem.accountID];
            const to = transactionItem.managerID && !shouldShowBlankTo ? (data.personalDetailsList?.[transactionItem.managerID] ?? emptyPersonalDetails) : emptyPersonalDetails;
            const { formattedFrom, formattedTo, formattedTotal, formattedMerchant, date } = getTransactionItemCommonFormattedProperties(transactionItem, from, to, policy, formatPhoneNumber);
            const allActions = getActions(data, allViolations, key, currentSearch, currentAccountID, actions);
            const transaction = {
                ...transactionItem,
                action: allActions.at(0) ?? CONST_1.default.SEARCH.ACTION_TYPES.VIEW,
                allActions,
                report,
                from,
                to,
                formattedFrom,
                formattedTo: shouldShowBlankTo ? '' : formattedTo,
                formattedTotal,
                formattedMerchant,
                date,
                shouldShowMerchant,
                shouldShowYear: doesDataContainAPastYearTransaction,
                keyForList: transactionItem.transactionID,
                violations: transactionViolations,
                isAmountColumnWide: shouldShowAmountInWideColumn,
                isTaxAmountColumnWide: shouldShowTaxAmountInWideColumn,
            };
            if (reportIDToTransactions[reportKey]?.transactions) {
                reportIDToTransactions[reportKey].transactions.push(transaction);
                reportIDToTransactions[reportKey].from = data.personalDetailsList[data?.[reportKey]?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
            }
            else if (reportIDToTransactions[reportKey]) {
                reportIDToTransactions[reportKey].transactions = [transaction];
                reportIDToTransactions[reportKey].from = data.personalDetailsList[data?.[reportKey]?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
            }
        }
    }
    return Object.values(reportIDToTransactions);
}
/**
 * @private
 * Organizes data into List Sections grouped by member for display, for the TransactionGroupListItemType of Search Results.
 *
 * Do not use directly, use only via `getSections()` facade.
 */
function getMemberSections(data, queryJSON) {
    const memberSections = {};
    for (const key in data) {
        if (isGroupEntry(key)) {
            const memberGroup = data[key];
            const personalDetails = data.personalDetailsList[memberGroup.accountID];
            let transactionsQueryJSON;
            if (queryJSON && memberGroup.accountID) {
                const newFlatFilters = queryJSON.flatFilters.filter((filter) => filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM);
                newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: memberGroup.accountID }] });
                const newQueryJSON = { ...queryJSON, groupBy: undefined, flatFilters: newFlatFilters };
                const newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
                transactionsQueryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            }
            memberSections[key] = {
                groupedBy: CONST_1.default.SEARCH.GROUP_BY.FROM,
                transactions: [],
                transactionsQueryJSON,
                ...personalDetails,
                ...memberGroup,
            };
        }
    }
    return Object.values(memberSections);
}
/**
 * @private
 * Organizes data into List Sections grouped by card for display, for the TransactionGroupListItemType of Search Results.
 *
 * Do not use directly, use only via `getSections()` facade.
 */
function getCardSections(data, queryJSON) {
    const cardSections = {};
    for (const key in data) {
        if (isGroupEntry(key)) {
            const cardGroup = data[key];
            const personalDetails = data.personalDetailsList[cardGroup.accountID];
            let transactionsQueryJSON;
            if (queryJSON && cardGroup.cardID) {
                const newFlatFilters = queryJSON.flatFilters.filter((filter) => filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID);
                newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: cardGroup.cardID }] });
                const newQueryJSON = { ...queryJSON, groupBy: undefined, flatFilters: newFlatFilters };
                const newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
                transactionsQueryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            }
            cardSections[key] = {
                groupedBy: CONST_1.default.SEARCH.GROUP_BY.CARD,
                transactions: [],
                transactionsQueryJSON,
                ...personalDetails,
                ...cardGroup,
            };
        }
    }
    return Object.values(cardSections);
}
/**
 * @private
 * Organizes data into List Sections grouped by card for display, for the TransactionWithdrawalIDGroupListItemType of Search Results.
 *
 * Do not use directly, use only via `getSections()` facade.
 */
function getWithdrawalIDSections(data, queryJSON) {
    const withdrawalIDSections = {};
    for (const key in data) {
        if (isGroupEntry(key)) {
            const withdrawalIDGroup = data[key];
            let transactionsQueryJSON;
            if (queryJSON && withdrawalIDGroup.entryID) {
                const newFlatFilters = queryJSON.flatFilters.filter((filter) => filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID);
                newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: withdrawalIDGroup.entryID }] });
                const newQueryJSON = { ...queryJSON, groupBy: undefined, flatFilters: newFlatFilters };
                const newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
                transactionsQueryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            }
            withdrawalIDSections[key] = {
                groupedBy: CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID,
                transactions: [],
                transactionsQueryJSON,
                ...withdrawalIDGroup,
            };
        }
    }
    return Object.values(withdrawalIDSections);
}
/**
 * Returns the appropriate list item component based on the type and status of the search data.
 */
function getListItem(type, status, groupBy) {
    if (type === CONST_1.default.SEARCH.DATA_TYPES.CHAT) {
        return ChatListItem_1.default;
    }
    if (type === CONST_1.default.SEARCH.DATA_TYPES.TASK) {
        return TaskListItem_1.default;
    }
    if (groupBy) {
        return TransactionGroupListItem_1.default;
    }
    return TransactionListItem_1.default;
}
/**
 * Organizes data into appropriate list sections for display based on the type of search results.
 */
function getSections(type, data, currentAccountID, formatPhoneNumber, groupBy, reportActions = {}, currentSearch = CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES, archivedReportsIDList, queryJSON) {
    if (type === CONST_1.default.SEARCH.DATA_TYPES.CHAT) {
        return getReportActionsSections(data);
    }
    if (type === CONST_1.default.SEARCH.DATA_TYPES.TASK) {
        return getTaskSections(data, formatPhoneNumber, archivedReportsIDList);
    }
    if (groupBy) {
        // Disabling the default-case lint rule here is actually safer as this forces us to make the switch cases exhaustive
        // eslint-disable-next-line default-case
        switch (groupBy) {
            case CONST_1.default.SEARCH.GROUP_BY.REPORTS:
                return getReportSections(data, currentSearch, currentAccountID, formatPhoneNumber, reportActions);
            case CONST_1.default.SEARCH.GROUP_BY.FROM:
                return getMemberSections(data, queryJSON);
            case CONST_1.default.SEARCH.GROUP_BY.CARD:
                return getCardSections(data, queryJSON);
            case CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID:
                return getWithdrawalIDSections(data, queryJSON);
        }
    }
    return getTransactionsSections(data, currentSearch, currentAccountID, formatPhoneNumber);
}
/**
 * Sorts sections of data based on a specified column and sort order for displaying sorted results.
 */
function getSortedSections(type, status, data, localeCompare, sortBy, sortOrder, groupBy) {
    if (type === CONST_1.default.SEARCH.DATA_TYPES.CHAT) {
        return getSortedReportActionData(data, localeCompare);
    }
    if (type === CONST_1.default.SEARCH.DATA_TYPES.TASK) {
        return getSortedTaskData(data, localeCompare, sortBy, sortOrder);
    }
    if (groupBy) {
        // Disabling the default-case lint rule here is actually safer as this forces us to make the switch cases exhaustive
        // eslint-disable-next-line default-case
        switch (groupBy) {
            case CONST_1.default.SEARCH.GROUP_BY.REPORTS:
                return getSortedReportData(data, localeCompare);
            case CONST_1.default.SEARCH.GROUP_BY.FROM:
                return getSortedMemberData(data, localeCompare);
            case CONST_1.default.SEARCH.GROUP_BY.CARD:
                return getSortedCardData(data, localeCompare);
            case CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID:
                return getSortedWithdrawalIDData(data, localeCompare);
        }
    }
    return getSortedTransactionData(data, localeCompare, sortBy, sortOrder);
}
/**
 * Compares two values based on a specified sorting order and column.
 * Handles both string and numeric comparisons.
 */
function compareValues(a, b, sortOrder, sortBy, localeCompare, shouldCompareOriginalValue = false) {
    const isAsc = sortOrder === CONST_1.default.SEARCH.SORT_ORDER.ASC;
    if (a === undefined || b === undefined) {
        return 0;
    }
    if (typeof a === 'string' && typeof b === 'string') {
        return isAsc ? localeCompare(a, b) : localeCompare(b, a);
    }
    if (typeof a === 'number' && typeof b === 'number') {
        const aValue = sortBy === CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT && !shouldCompareOriginalValue ? Math.abs(a) : a;
        const bValue = sortBy === CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT && !shouldCompareOriginalValue ? Math.abs(b) : b;
        return isAsc ? aValue - bValue : bValue - aValue;
    }
    return 0;
}
/**
 * @private
 * Sorts transaction sections based on a specified column and sort order.
 */
function getSortedTransactionData(data, localeCompare, sortBy, sortOrder) {
    if (!sortBy || !sortOrder) {
        return data;
    }
    const sortingProperty = transactionColumnNamesToSortingProperty[sortBy];
    if (!sortingProperty) {
        return data;
    }
    return data.sort((a, b) => {
        const aValue = sortingProperty === 'comment' ? a.comment?.comment : a[sortingProperty];
        const bValue = sortingProperty === 'comment' ? b.comment?.comment : b[sortingProperty];
        return compareValues(aValue, bValue, sortOrder, sortingProperty, localeCompare);
    });
}
function getSortedTaskData(data, localeCompare, sortBy, sortOrder) {
    if (!sortBy || !sortOrder) {
        return data;
    }
    const sortingProperty = taskColumnNamesToSortingProperty[sortBy];
    if (!sortingProperty) {
        return data;
    }
    return data.sort((a, b) => {
        const aValue = a[sortingProperty];
        const bValue = b[sortingProperty];
        return compareValues(aValue, bValue, sortOrder, sortingProperty, localeCompare);
    });
}
/**
 * @private
 * Sorts report sections based on a specified column and sort order.
 */
function getSortedReportData(data, localeCompare) {
    for (const report of data) {
        report.transactions = getSortedTransactionData(report.transactions, localeCompare, CONST_1.default.SEARCH.TABLE_COLUMNS.DATE, CONST_1.default.SEARCH.SORT_ORDER.DESC);
    }
    return data.sort((a, b) => {
        const aNewestTransaction = a.transactions?.at(0)?.modifiedCreated ? a.transactions?.at(0)?.modifiedCreated : a.transactions?.at(0)?.created;
        const bNewestTransaction = b.transactions?.at(0)?.modifiedCreated ? b.transactions?.at(0)?.modifiedCreated : b.transactions?.at(0)?.created;
        if (!aNewestTransaction || !bNewestTransaction) {
            return 0;
        }
        return localeCompare(bNewestTransaction.toLowerCase(), aNewestTransaction.toLowerCase());
    });
}
/**
 * @private
 * Sorts member sections based on a specified column and sort order.
 */
function getSortedMemberData(data, localeCompare) {
    return data.sort((a, b) => localeCompare(a.displayName ?? a.login ?? '', b.displayName ?? b.login ?? ''));
}
/**
 * @private
 * Sorts card sections based on a specified column and sort order.
 */
function getSortedCardData(data, localeCompare) {
    return data.sort((a, b) => localeCompare(a.displayName ?? a.login ?? '', b.displayName ?? b.login ?? ''));
}
/**
 * @private
 * Sorts withdrawal ID sections based on a specified column and sort order.
 */
function getSortedWithdrawalIDData(data, localeCompare) {
    return data.sort((a, b) => localeCompare(b.debitPosted, a.debitPosted));
}
/**
 * @private
 * Sorts report actions sections based on a specified column and sort order.
 */
function getSortedReportActionData(data, localeCompare) {
    return data.sort((a, b) => {
        const aValue = a?.created;
        const bValue = b?.created;
        if (aValue === undefined || bValue === undefined) {
            return 0;
        }
        return localeCompare(bValue.toLowerCase(), aValue.toLowerCase());
    });
}
/**
 * Checks if the search results contain any data, useful for determining if the search results are empty.
 */
function isSearchResultsEmpty(searchResults) {
    return !Object.keys(searchResults?.data).some((key) => key.startsWith(ONYXKEYS_1.default.COLLECTION.TRANSACTION) &&
        searchResults?.data[key]?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
}
/**
 * Returns the corresponding translation key for expense type
 */
function getExpenseTypeTranslationKey(expenseType) {
    // eslint-disable-next-line default-case
    switch (expenseType) {
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.DISTANCE:
            return 'common.distance';
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.CARD:
            return 'common.card';
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.CASH:
            return 'iou.cash';
        case CONST_1.default.SEARCH.TRANSACTION_TYPE.PER_DIEM:
            return 'common.perDiem';
    }
}
/**
 * Constructs and configures the overflow menu for search items, handling interactions such as renaming or deleting items.
 */
function getOverflowMenu(itemName, hash, inputQuery, showDeleteModal, isMobileMenu, closeMenu) {
    return [
        {
            text: (0, Localize_1.translateLocal)('common.rename'),
            onSelected: () => {
                if (isMobileMenu && closeMenu) {
                    closeMenu();
                }
                Navigation_1.default.navigate(ROUTES_1.default.SEARCH_SAVED_SEARCH_RENAME.getRoute({ name: encodeURIComponent(itemName), jsonQuery: inputQuery }));
            },
            icon: Expensicons.Pencil,
            shouldShowRightIcon: false,
            shouldShowRightComponent: false,
            shouldCallAfterModalHide: true,
        },
        {
            text: (0, Localize_1.translateLocal)('common.delete'),
            onSelected: () => {
                if (isMobileMenu && closeMenu) {
                    closeMenu();
                }
                showDeleteModal(hash);
            },
            icon: Expensicons.Trashcan,
            shouldShowRightIcon: false,
            shouldShowRightComponent: false,
            shouldCallAfterModalHide: true,
            shouldCloseAllModals: true,
        },
    ];
}
/**
 * Checks if the passed username is a correct standard username, and not a placeholder
 */
function isCorrectSearchUserName(displayName) {
    return displayName && displayName.toUpperCase() !== CONST_1.default.REPORT.OWNER_EMAIL_FAKE;
}
function createTypeMenuSections(currentUserEmail, currentUserAccountID, cardFeedsByPolicy, defaultCardFeed, policies, activePolicyID, savedSearches, isOffline) {
    const typeMenuSections = [];
    const suggestedSearches = getSuggestedSearches(currentUserAccountID, defaultCardFeed?.id);
    const suggestedSearchesVisibility = getSuggestedSearchesVisibility(currentUserEmail, cardFeedsByPolicy, policies);
    // Todo section
    {
        const todoSection = {
            translationPath: 'common.todo',
            menuItems: [],
        };
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT]) {
            const groupPoliciesWithChatEnabled = (0, PolicyUtils_1.getGroupPaidPoliciesWithExpenseChatEnabled)(policies);
            todoSection.menuItems.push({
                ...suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT],
                emptyState: {
                    headerMedia: LottieAnimations_1.default.Fireworks,
                    title: 'search.searchResults.emptySubmitResults.title',
                    subtitle: 'search.searchResults.emptySubmitResults.subtitle',
                    buttons: groupPoliciesWithChatEnabled.length > 0
                        ? [
                            {
                                success: true,
                                buttonText: 'report.newReport.createReport',
                                buttonAction: () => {
                                    (0, interceptAnonymousUser_1.default)(() => {
                                        const activePolicy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`];
                                        const personalDetails = (0, ReportUtils_1.getPersonalDetailsForAccountID)(currentUserAccountID);
                                        let workspaceIDForReportCreation;
                                        // If the user's default workspace is a paid group workspace with chat enabled, we create a report with it by default
                                        if (activePolicy && activePolicy.isPolicyExpenseChatEnabled && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy)) {
                                            workspaceIDForReportCreation = activePolicy.id;
                                        }
                                        else if (groupPoliciesWithChatEnabled.length === 1) {
                                            workspaceIDForReportCreation = groupPoliciesWithChatEnabled.at(0)?.id;
                                        }
                                        if (workspaceIDForReportCreation && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(workspaceIDForReportCreation) && personalDetails) {
                                            const createdReportID = (0, Report_1.createNewReport)(personalDetails, workspaceIDForReportCreation);
                                            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
                                                Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID: createdReportID, backTo: Navigation_1.default.getActiveRoute() }));
                                            });
                                            return;
                                        }
                                        // If the user's default workspace is personal and the user has more than one group workspace, which is paid and has chat enabled, or a chosen workspace is past the grace period, we need to redirect them to the workspace selection screen
                                        Navigation_1.default.navigate(ROUTES_1.default.NEW_REPORT_WORKSPACE_SELECTION);
                                    });
                                },
                            },
                        ]
                        : [],
                },
            });
        }
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE]) {
            todoSection.menuItems.push({
                ...suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE],
                emptyState: {
                    headerMedia: LottieAnimations_1.default.Fireworks,
                    title: 'search.searchResults.emptyApproveResults.title',
                    subtitle: 'search.searchResults.emptyApproveResults.subtitle',
                },
            });
        }
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.PAY]) {
            todoSection.menuItems.push({
                ...suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.PAY],
                emptyState: {
                    headerMedia: LottieAnimations_1.default.Fireworks,
                    title: 'search.searchResults.emptyPayResults.title',
                    subtitle: 'search.searchResults.emptyPayResults.subtitle',
                },
            });
        }
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT]) {
            todoSection.menuItems.push({
                ...suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT],
                emptyState: {
                    headerMedia: LottieAnimations_1.default.Fireworks,
                    title: 'search.searchResults.emptyExportResults.title',
                    subtitle: 'search.searchResults.emptyExportResults.subtitle',
                },
            });
        }
        if (todoSection.menuItems.length > 0) {
            typeMenuSections.push(todoSection);
        }
    }
    // Accounting section
    {
        const accountingSection = {
            translationPath: 'workspace.common.accounting',
            menuItems: [],
        };
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.STATEMENTS]) {
            accountingSection.menuItems.push({
                ...suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.STATEMENTS],
                emptyState: {
                    headerMedia: LottieAnimations_1.default.Fireworks,
                    title: 'search.searchResults.emptyStatementsResults.title',
                    subtitle: 'search.searchResults.emptyStatementsResults.subtitle',
                },
            });
        }
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH]) {
            accountingSection.menuItems.push({
                ...suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH],
                emptyState: {
                    headerMedia: LottieAnimations_1.default.Fireworks,
                    title: 'search.searchResults.emptyUnapprovedResults.title',
                    subtitle: 'search.searchResults.emptyUnapprovedResults.subtitle',
                },
            });
        }
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD]) {
            accountingSection.menuItems.push({
                ...suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD],
                emptyState: {
                    headerMedia: LottieAnimations_1.default.Fireworks,
                    title: 'search.searchResults.emptyUnapprovedResults.title',
                    subtitle: 'search.searchResults.emptyUnapprovedResults.subtitle',
                },
            });
        }
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION]) {
            accountingSection.menuItems.push({
                ...suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION],
                emptyState: {
                    headerMedia: LottieAnimations_1.default.Fireworks,
                    title: 'search.searchResults.emptyStatementsResults.title',
                    subtitle: 'search.searchResults.emptyStatementsResults.subtitle',
                },
            });
        }
        if (accountingSection.menuItems.length > 0) {
            typeMenuSections.push(accountingSection);
        }
    }
    // Saved section
    {
        const shouldShowSavedSearchesMenuItemTitle = Object.values(savedSearches ?? {}).filter((s) => s.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || isOffline).length > 0;
        if (shouldShowSavedSearchesMenuItemTitle) {
            const savedSection = {
                translationPath: 'search.savedSearchesMenuItemTitle',
                menuItems: [],
            };
            typeMenuSections.push(savedSection);
        }
    }
    // Explore section
    {
        const exploreSection = {
            translationPath: 'common.explore',
            menuItems: [],
        };
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES]) {
            exploreSection.menuItems.push(suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.EXPENSES]);
        }
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.REPORTS]) {
            exploreSection.menuItems.push(suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.REPORTS]);
        }
        if (suggestedSearchesVisibility[CONST_1.default.SEARCH.SEARCH_KEYS.CHATS]) {
            exploreSection.menuItems.push(suggestedSearches[CONST_1.default.SEARCH.SEARCH_KEYS.CHATS]);
        }
        if (exploreSection.menuItems.length > 0) {
            typeMenuSections.push(exploreSection);
        }
    }
    return typeMenuSections;
}
function createBaseSavedSearchMenuItem(item, key, index, title, isFocused) {
    return {
        key,
        title,
        hash: key,
        query: item.query,
        shouldShowRightComponent: true,
        focused: isFocused,
        pendingAction: item.pendingAction,
        disabled: item.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
        shouldIconUseAutoWidthStyle: true,
    };
}
/**
 * Whether to show the empty state or not
 */
function shouldShowEmptyState(isDataLoaded, dataLength, type) {
    return !isDataLoaded || dataLength === 0 || !Object.values(CONST_1.default.SEARCH.DATA_TYPES).includes(type);
}
function isSearchDataLoaded(searchResults, queryJSON) {
    const { status } = queryJSON ?? {};
    const sortedSearchResultStatus = !Array.isArray(searchResults?.search?.status)
        ? searchResults?.search?.status?.split(',').sort().join(',')
        : searchResults?.search?.status?.sort().join(',');
    const sortedQueryJSONStatus = Array.isArray(status) ? status.sort().join(',') : status;
    const isDataLoaded = searchResults?.data !== undefined && searchResults?.search?.type === queryJSON?.type && sortedSearchResultStatus === sortedQueryJSONStatus;
    return isDataLoaded;
}
function getStatusOptions(type, groupBy) {
    switch (type) {
        case CONST_1.default.SEARCH.DATA_TYPES.CHAT:
            return getChatStatusOptions();
        case CONST_1.default.SEARCH.DATA_TYPES.INVOICE:
            return getInvoiceStatusOptions();
        case CONST_1.default.SEARCH.DATA_TYPES.TRIP:
            return getTripStatusOptions();
        case CONST_1.default.SEARCH.DATA_TYPES.TASK:
            return getTaskStatusOptions();
        case CONST_1.default.SEARCH.DATA_TYPES.EXPENSE:
        default:
            return groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS ? getExpenseReportedStatusOptions() : getExpenseStatusOptions();
    }
}
function getHasOptions(type) {
    switch (type) {
        case CONST_1.default.SEARCH.DATA_TYPES.EXPENSE:
            return [{ text: (0, Localize_1.translateLocal)('common.receipt'), value: CONST_1.default.SEARCH.HAS_VALUES.RECEIPT }];
        default:
            return [];
    }
}
function getTypeOptions(policies, currentUserLogin) {
    const typeOptions = [
        { text: (0, Localize_1.translateLocal)('common.expense'), value: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE },
        { text: (0, Localize_1.translateLocal)('common.chat'), value: CONST_1.default.SEARCH.DATA_TYPES.CHAT },
        { text: (0, Localize_1.translateLocal)('common.invoice'), value: CONST_1.default.SEARCH.DATA_TYPES.INVOICE },
        { text: (0, Localize_1.translateLocal)('common.trip'), value: CONST_1.default.SEARCH.DATA_TYPES.TRIP },
        { text: (0, Localize_1.translateLocal)('common.task'), value: CONST_1.default.SEARCH.DATA_TYPES.TASK },
    ];
    const shouldHideInvoiceOption = !(0, PolicyUtils_1.canSendInvoice)(policies, currentUserLogin) && !(0, ReportUtils_1.hasInvoiceReports)();
    // Remove the invoice option if the user is not allowed to send invoices
    return shouldHideInvoiceOption ? typeOptions.filter((typeOption) => typeOption.value !== CONST_1.default.SEARCH.DATA_TYPES.INVOICE) : typeOptions;
}
function getGroupByOptions() {
    return Object.values(CONST_1.default.SEARCH.GROUP_BY).map((value) => ({ text: (0, Localize_1.translateLocal)(`search.filters.groupBy.${value}`), value }));
}
function getGroupCurrencyOptions(currencyList) {
    return Object.keys(currencyList).reduce((options, currencyCode) => {
        if (!currencyList?.[currencyCode]?.retired) {
            options.push({ text: `${currencyCode} - ${(0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)}`, value: currencyCode });
        }
        return options;
    }, []);
}
function getFeedOptions(allCardFeeds, allCards) {
    return Object.values((0, CardFeedUtils_1.getCardFeedsForDisplay)(allCardFeeds, allCards)).map((cardFeed) => ({
        text: cardFeed.name,
        value: cardFeed.id,
    }));
}
function getDatePresets(filterKey, hasFeed) {
    const defaultPresets = [CONST_1.default.SEARCH.DATE_PRESETS.THIS_MONTH, CONST_1.default.SEARCH.DATE_PRESETS.LAST_MONTH];
    switch (filterKey) {
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED:
            return [...defaultPresets, ...(hasFeed ? [CONST_1.default.SEARCH.DATE_PRESETS.LAST_STATEMENT] : [])];
        case CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTED:
            return [...defaultPresets, CONST_1.default.SEARCH.DATE_PRESETS.NEVER];
        default:
            return defaultPresets;
    }
}
function getWithdrawalTypeOptions(translate) {
    return Object.values(CONST_1.default.SEARCH.WITHDRAWAL_TYPE).map((value) => ({ text: translate(`search.filters.withdrawalType.${value}`), value }));
}
function getActionOptions(translate) {
    return Object.values(CONST_1.default.SEARCH.ACTION_FILTERS).map((value) => ({ text: translate(`search.filters.action.${value}`), value }));
}
/**
 * Determines what columns to show based on available data
 * @param isExpenseReportView: true when we are inside an expense report view, false if we're in the Reports page.
 */
function getColumnsToShow(currentAccountID, data, isExpenseReportView = false, isTaskView = false) {
    if (isTaskView) {
        return {
            [CONST_1.default.SEARCH.TABLE_COLUMNS.DATE]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TITLE]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.FROM]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.IN]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.ASSIGNEE]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.RECEIPT]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TO]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TAG]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TAX_AMOUNT]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.COMMENTS]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TYPE]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.CARD]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.WITHDRAWAL_ID]: false,
        };
    }
    const columns = isExpenseReportView
        ? {
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.RECEIPT]: true,
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TYPE]: true,
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DATE]: true,
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT]: false,
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DESCRIPTION]: false,
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.CATEGORY]: false,
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAG]: false,
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS]: true,
            [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TOTAL_AMOUNT]: true,
        }
        : {
            [CONST_1.default.SEARCH.TABLE_COLUMNS.RECEIPT]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TYPE]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.DATE]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.FROM]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TO]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TAG]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TAX_AMOUNT]: false,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION]: true,
            [CONST_1.default.SEARCH.TABLE_COLUMNS.TITLE]: true,
        };
    const updateColumns = (transaction) => {
        const merchant = transaction.modifiedMerchant ? transaction.modifiedMerchant : (transaction.merchant ?? '');
        if ((merchant !== '' && merchant !== CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT) || (0, TransactionUtils_1.isScanning)(transaction)) {
            columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT] = true;
        }
        if ((0, TransactionUtils_1.getDescription)(transaction) !== '') {
            columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DESCRIPTION] = true;
        }
        const category = (0, TransactionUtils_1.getCategory)(transaction);
        const categoryEmptyValues = CONST_1.default.SEARCH.CATEGORY_EMPTY_VALUE.split(',');
        if (category !== '' && !categoryEmptyValues.includes(category)) {
            columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.CATEGORY] = true;
        }
        const tag = (0, TransactionUtils_1.getTag)(transaction);
        if (tag !== '' && tag !== CONST_1.default.SEARCH.TAG_EMPTY_VALUE) {
            columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAG] = true;
        }
        if (isExpenseReportView) {
            return;
        }
        // Handle From&To columns that are only shown in the Reports page
        // if From or To differ from current user in any transaction, show the columns
        const accountID = transaction.accountID;
        if (accountID !== currentAccountID) {
            columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.FROM] = true;
        }
        const managerID = transaction.managerID;
        if (managerID && managerID !== currentAccountID && !columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TO]) {
            const report = data[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction.reportID}`];
            columns[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TO] = !!report && !(0, ReportUtils_1.isOpenReport)(report);
        }
    };
    if (Array.isArray(data)) {
        data.forEach(updateColumns);
    }
    else {
        Object.keys(data).forEach((key) => {
            if (!isTransactionEntry(key)) {
                return;
            }
            updateColumns(data[key]);
        });
    }
    return columns;
}
