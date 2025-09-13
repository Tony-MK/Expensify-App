"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const Illustrations_1 = require("@components/Icon/Illustrations");
const RenderHTML_1 = require("@components/RenderHTML");
const ScrollView_1 = require("@components/ScrollView");
const SelectionList_1 = require("@components/SelectionList");
const MergeExpensesSkeleton_1 = require("@components/Skeletons/MergeExpensesSkeleton");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MergeTransaction_1 = require("@libs/actions/MergeTransaction");
const MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const MergeTransactionItem_1 = require("./MergeTransactionItem");
function MergeTransactionsListContent({ transactionID, mergeTransaction }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [transactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: false });
    const { isOffline } = (0, useNetwork_1.default)();
    const [targetTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { canBeMissing: false });
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${targetTransaction?.reportID}`, { canBeMissing: true });
    const [transactionThreadReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, MergeTransactionUtils_1.getTransactionThreadReportID)(targetTransaction)}`, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: false });
    const eligibleTransactions = mergeTransaction?.eligibleTransactions;
    const currentUserLogin = session?.email;
    (0, react_1.useEffect)(() => {
        // If the eligible transactions are already loaded, don't fetch them again
        if (Array.isArray(mergeTransaction?.eligibleTransactions) || !targetTransaction) {
            return;
        }
        (0, MergeTransaction_1.getTransactionsForMerging)({ isOffline, targetTransaction, transactions, policy, report, currentUserLogin });
    }, [transactions, isOffline, mergeTransaction, policy, report, currentUserLogin, targetTransaction]);
    const sections = (0, react_1.useMemo)(() => {
        return [
            {
                data: (eligibleTransactions ?? []).map((eligibleTransaction) => ({
                    ...(0, MergeTransactionUtils_1.fillMissingReceiptSource)(eligibleTransaction),
                    keyForList: eligibleTransaction.transactionID,
                    isSelected: eligibleTransaction.transactionID === mergeTransaction?.sourceTransactionID,
                    errors: eligibleTransaction.errors,
                })),
                shouldShow: true,
            },
        ];
    }, [eligibleTransactions, mergeTransaction]);
    const handleSelectRow = (0, react_1.useCallback)((item) => {
        // Clear the merge transaction data when select a new source transaction to merge
        (0, MergeTransaction_1.setupMergeTransactionData)(transactionID, {
            targetTransactionID: transactionID,
            sourceTransactionID: item.transactionID,
            eligibleTransactions: mergeTransaction?.eligibleTransactions,
        });
    }, [mergeTransaction, transactionID]);
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.renderHTML, styles.ph5, styles.pb5, styles.textLabel, styles.minHeight5, styles.flexRow]}>
                <RenderHTML_1.default html={translate('transactionMerge.listPage.selectTransactionToMerge', { reportName: (0, ReportUtils_1.getReportName)(transactionThreadReport ?? report) })}/>
            </react_native_1.View>), [transactionThreadReport, report, translate, styles.renderHTML, styles.ph5, styles.pb5, styles.textLabel, styles.minHeight5, styles.flexRow]);
    const subTitleContent = (0, react_1.useMemo)(() => {
        return (<react_native_1.View style={[styles.renderHTML, styles.textNormal]}>
                <RenderHTML_1.default html={translate('transactionMerge.listPage.noEligibleExpenseFoundSubtitle')}/>
            </react_native_1.View>);
    }, [translate, styles.renderHTML, styles.textNormal]);
    const handleConfirm = (0, react_1.useCallback)(() => {
        const sourceTransaction = (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction);
        if (!sourceTransaction || !targetTransaction) {
            return;
        }
        // It's a temporary solution to ensure the source report is loaded, so we can display reportName in the merge transaction details page
        // We plan to remove this in next phase of merge expenses project
        const sourceReport = (0, ReportUtils_1.getReportOrDraftReport)(sourceTransaction.reportID);
        if (!sourceReport) {
            (0, Report_1.openReport)(sourceTransaction.reportID);
        }
        const { targetTransaction: newTargetTransaction, sourceTransaction: newSourceTransaction } = (0, MergeTransactionUtils_1.selectTargetAndSourceTransactionsForMerge)(targetTransaction, sourceTransaction);
        if ((0, MergeTransactionUtils_1.shouldNavigateToReceiptReview)([newTargetTransaction, newSourceTransaction])) {
            (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, {
                targetTransactionID: newTargetTransaction?.transactionID,
                sourceTransactionID: newSourceTransaction?.transactionID,
            });
            Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_RECEIPT_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
        }
        else {
            const mergedReceipt = newTargetTransaction?.receipt?.receiptID ? newTargetTransaction.receipt : newSourceTransaction?.receipt;
            (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, {
                targetTransactionID: newTargetTransaction?.transactionID,
                sourceTransactionID: newSourceTransaction?.transactionID,
                receipt: mergedReceipt,
            });
            const { conflictFields, mergeableData } = (0, MergeTransactionUtils_1.getMergeableDataAndConflictFields)(newTargetTransaction, newSourceTransaction);
            if (!conflictFields.length) {
                // If there are no conflict fields, we should set mergeable data and navigate to the confirmation page
                (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, mergeableData);
                Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_CONFIRMATION_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_DETAILS_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
        }
    }, [mergeTransaction, transactionID, targetTransaction]);
    if (eligibleTransactions?.length === 0) {
        return (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]}>
                <EmptyStateComponent_1.default cardStyles={[styles.appBG]} cardContentStyles={[styles.p0]} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ILLUSTRATION} headerMedia={Illustrations_1.EmptyShelves} title={translate('transactionMerge.listPage.noEligibleExpenseFound')} subtitleText={subTitleContent} headerStyles={[styles.emptyStateCardIllustrationContainer, styles.mb5]} headerContentStyles={styles.emptyStateTransactionMergeIllustration}/>
            </ScrollView_1.default>);
    }
    return (<SelectionList_1.default sections={sections} shouldShowTextInput={false} ListItem={MergeTransactionItem_1.default} confirmButtonStyles={[styles.justifyContentCenter]} showConfirmButton confirmButtonText={translate('common.continue')} isConfirmButtonDisabled={!mergeTransaction?.sourceTransactionID} onSelectRow={handleSelectRow} showLoadingPlaceholder LoadingPlaceholderComponent={MergeExpensesSkeleton_1.default} fixedNumItemsForLoader={3} headerContent={headerContent} onConfirm={handleConfirm}/>);
}
MergeTransactionsListContent.displayName = 'MergeTransactionsListContent';
exports.default = MergeTransactionsListContent;
