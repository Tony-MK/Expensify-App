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
var EmptyStateComponent_1 = require("@components/EmptyStateComponent");
var Illustrations_1 = require("@components/Icon/Illustrations");
var RenderHTML_1 = require("@components/RenderHTML");
var ScrollView_1 = require("@components/ScrollView");
var SelectionList_1 = require("@components/SelectionList");
var MergeExpensesSkeleton_1 = require("@components/Skeletons/MergeExpensesSkeleton");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var MergeTransaction_1 = require("@libs/actions/MergeTransaction");
var MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportUtils_1 = require("@libs/ReportUtils");
var Report_1 = require("@userActions/Report");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var MergeTransactionItem_1 = require("./MergeTransactionItem");
function MergeTransactionsListContent(_a) {
    var transactionID = _a.transactionID, mergeTransaction = _a.mergeTransaction;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false })[0];
    var transactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: false })[0];
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var targetTransaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID), { canBeMissing: false })[0];
    var report = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(targetTransaction === null || targetTransaction === void 0 ? void 0 : targetTransaction.reportID), { canBeMissing: true })[0];
    var transactionThreadReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat((0, MergeTransactionUtils_1.getTransactionThreadReportID)(targetTransaction)), { canBeMissing: true })[0];
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(report === null || report === void 0 ? void 0 : report.policyID), { canBeMissing: false })[0];
    var eligibleTransactions = mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.eligibleTransactions;
    var currentUserLogin = session === null || session === void 0 ? void 0 : session.email;
    (0, react_1.useEffect)(function () {
        // If the eligible transactions are already loaded, don't fetch them again
        if (Array.isArray(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.eligibleTransactions) || !targetTransaction) {
            return;
        }
        (0, MergeTransaction_1.getTransactionsForMerging)({ isOffline: isOffline, targetTransaction: targetTransaction, transactions: transactions, policy: policy, report: report, currentUserLogin: currentUserLogin });
    }, [transactions, isOffline, mergeTransaction, policy, report, currentUserLogin, targetTransaction]);
    var sections = (0, react_1.useMemo)(function () {
        return [
            {
                data: (eligibleTransactions !== null && eligibleTransactions !== void 0 ? eligibleTransactions : []).map(function (eligibleTransaction) { return (__assign(__assign({}, (0, MergeTransactionUtils_1.fillMissingReceiptSource)(eligibleTransaction)), { keyForList: eligibleTransaction.transactionID, isSelected: eligibleTransaction.transactionID === (mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.sourceTransactionID), errors: eligibleTransaction.errors })); }),
                shouldShow: true,
            },
        ];
    }, [eligibleTransactions, mergeTransaction]);
    var handleSelectRow = (0, react_1.useCallback)(function (item) {
        // Clear the merge transaction data when select a new source transaction to merge
        (0, MergeTransaction_1.setupMergeTransactionData)(transactionID, {
            targetTransactionID: transactionID,
            sourceTransactionID: item.transactionID,
            eligibleTransactions: mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.eligibleTransactions,
        });
    }, [mergeTransaction, transactionID]);
    var headerContent = (0, react_1.useMemo)(function () { return (<react_native_1.View style={[styles.renderHTML, styles.ph5, styles.pb5, styles.textLabel, styles.minHeight5, styles.flexRow]}>
                <RenderHTML_1.default html={translate('transactionMerge.listPage.selectTransactionToMerge', { reportName: (0, ReportUtils_1.getReportName)(transactionThreadReport !== null && transactionThreadReport !== void 0 ? transactionThreadReport : report) })}/>
            </react_native_1.View>); }, [transactionThreadReport, report, translate, styles.renderHTML, styles.ph5, styles.pb5, styles.textLabel, styles.minHeight5, styles.flexRow]);
    var subTitleContent = (0, react_1.useMemo)(function () {
        return (<react_native_1.View style={[styles.renderHTML, styles.textNormal]}>
                <RenderHTML_1.default html={translate('transactionMerge.listPage.noEligibleExpenseFoundSubtitle')}/>
            </react_native_1.View>);
    }, [translate, styles.renderHTML, styles.textNormal]);
    var handleConfirm = (0, react_1.useCallback)(function () {
        var _a;
        var sourceTransaction = (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction);
        if (!sourceTransaction || !targetTransaction) {
            return;
        }
        // It's a temporary solution to ensure the source report is loaded, so we can display reportName in the merge transaction details page
        // We plan to remove this in next phase of merge expenses project
        var sourceReport = (0, ReportUtils_1.getReportOrDraftReport)(sourceTransaction.reportID);
        if (!sourceReport) {
            (0, Report_1.openReport)(sourceTransaction.reportID);
        }
        var _b = (0, MergeTransactionUtils_1.selectTargetAndSourceTransactionsForMerge)(targetTransaction, sourceTransaction), newTargetTransaction = _b.targetTransaction, newSourceTransaction = _b.sourceTransaction;
        if ((0, MergeTransactionUtils_1.shouldNavigateToReceiptReview)([newTargetTransaction, newSourceTransaction])) {
            (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, {
                targetTransactionID: newTargetTransaction === null || newTargetTransaction === void 0 ? void 0 : newTargetTransaction.transactionID,
                sourceTransactionID: newSourceTransaction === null || newSourceTransaction === void 0 ? void 0 : newSourceTransaction.transactionID,
            });
            Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_RECEIPT_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
        }
        else {
            var mergedReceipt = ((_a = newTargetTransaction === null || newTargetTransaction === void 0 ? void 0 : newTargetTransaction.receipt) === null || _a === void 0 ? void 0 : _a.receiptID) ? newTargetTransaction.receipt : newSourceTransaction === null || newSourceTransaction === void 0 ? void 0 : newSourceTransaction.receipt;
            (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, {
                targetTransactionID: newTargetTransaction === null || newTargetTransaction === void 0 ? void 0 : newTargetTransaction.transactionID,
                sourceTransactionID: newSourceTransaction === null || newSourceTransaction === void 0 ? void 0 : newSourceTransaction.transactionID,
                receipt: mergedReceipt,
            });
            var _c = (0, MergeTransactionUtils_1.getMergeableDataAndConflictFields)(newTargetTransaction, newSourceTransaction), conflictFields = _c.conflictFields, mergeableData = _c.mergeableData;
            if (!conflictFields.length) {
                // If there are no conflict fields, we should set mergeable data and navigate to the confirmation page
                (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, mergeableData);
                Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_CONFIRMATION_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_DETAILS_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
        }
    }, [mergeTransaction, transactionID, targetTransaction]);
    if ((eligibleTransactions === null || eligibleTransactions === void 0 ? void 0 : eligibleTransactions.length) === 0) {
        return (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]}>
                <EmptyStateComponent_1.default cardStyles={[styles.appBG]} cardContentStyles={[styles.p0]} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ILLUSTRATION} headerMedia={Illustrations_1.EmptyShelves} title={translate('transactionMerge.listPage.noEligibleExpenseFound')} subtitleText={subTitleContent} headerStyles={[styles.emptyStateCardIllustrationContainer, styles.mb5]} headerContentStyles={styles.emptyStateTransactionMergeIllustration}/>
            </ScrollView_1.default>);
    }
    return (<SelectionList_1.default sections={sections} shouldShowTextInput={false} ListItem={MergeTransactionItem_1.default} confirmButtonStyles={[styles.justifyContentCenter]} showConfirmButton confirmButtonText={translate('common.continue')} isConfirmButtonDisabled={!(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.sourceTransactionID)} onSelectRow={handleSelectRow} showLoadingPlaceholder LoadingPlaceholderComponent={MergeExpensesSkeleton_1.default} fixedNumItemsForLoader={3} headerContent={headerContent} onConfirm={handleConfirm}/>);
}
MergeTransactionsListContent.displayName = 'MergeTransactionsListContent';
exports.default = MergeTransactionsListContent;
