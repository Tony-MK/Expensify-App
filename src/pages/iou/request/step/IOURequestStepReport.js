"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SearchContext_1 = require("@components/Search/SearchContext");
const useOnyx_1 = require("@hooks/useOnyx");
const useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
const Transaction_1 = require("@libs/actions/Transaction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Permissions_1 = require("@libs/Permissions");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const IOURequestEditReportCommon_1 = require("./IOURequestEditReportCommon");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepReport({ route, transaction }) {
    const { backTo, action, iouType, transactionID, reportID: reportIDFromRoute, reportActionID } = route.params;
    const [allReports] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}`, { canBeMissing: false });
    const isUnreported = transaction?.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
    const transactionReport = Object.values(allReports ?? {}).find((report) => report?.reportID === transaction?.reportID);
    const participantReportID = transaction?.participants?.at(0)?.reportID;
    const participantReport = Object.values(allReports ?? {}).find((report) => report?.reportID === participantReportID);
    const shouldUseTransactionReport = (!!transactionReport && (0, ReportUtils_1.isReportOutstanding)(transactionReport, transactionReport?.policyID)) || isUnreported;
    const outstandingReportID = (0, ReportUtils_1.isPolicyExpenseChat)(participantReport) ? participantReport?.iouReportID : participantReportID;
    const selectedReportID = shouldUseTransactionReport ? transactionReport?.reportID : outstandingReportID;
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const { removeTransaction } = (0, SearchContext_1.useSearchContext)();
    const reportOrDraftReport = (0, ReportUtils_1.getReportOrDraftReport)(reportIDFromRoute);
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isCreateReport = action === CONST_1.default.IOU.ACTION.CREATE;
    const isFromGlobalCreate = !!transaction?.isFromGlobalCreate;
    const [allBetas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    const session = (0, OnyxListItemProvider_1.useSession)();
    const handleGoBack = () => {
        if (isEditing) {
            Navigation_1.default.dismissModal();
        }
        else {
            Navigation_1.default.goBack(backTo);
        }
    };
    const handleGlobalCreateReport = (item) => {
        if (!transaction) {
            return;
        }
        const reportOrDraftReportFromValue = (0, ReportUtils_1.getReportOrDraftReport)(item.value);
        const participants = [
            {
                selected: true,
                accountID: 0,
                isPolicyExpenseChat: true,
                reportID: reportOrDraftReportFromValue?.chatReportID,
                policyID: reportOrDraftReportFromValue?.policyID,
            },
        ];
        (0, Transaction_1.setTransactionReport)(transaction.transactionID, {
            reportID: item.value,
            participants,
        }, true);
        const iouConfirmationPageRoute = ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, iouType, transactionID, reportOrDraftReportFromValue?.chatReportID);
        // If the backTo parameter is set, we should navigate back to the confirmation screen that is already on the stack.
        if (backTo) {
            Navigation_1.default.goBack(iouConfirmationPageRoute, { compareParams: false });
        }
        else {
            Navigation_1.default.navigate(iouConfirmationPageRoute);
        }
    };
    const handleRegularReportSelection = (item) => {
        if (!transaction) {
            return;
        }
        handleGoBack();
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, Transaction_1.setTransactionReport)(transaction.transactionID, {
                reportID: item.value,
            }, !isEditing);
            if (isEditing) {
                (0, Transaction_1.changeTransactionsReport)([transaction.transactionID], item.value, isASAPSubmitBetaEnabled, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, session?.email ?? '', allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${item.policyID}`]);
                removeTransaction(transaction.transactionID);
            }
        });
    };
    const selectReport = (item) => {
        if (!transaction) {
            return;
        }
        const isSameReport = item.value === transaction.reportID;
        // Early return for same report selection
        if (isSameReport) {
            handleGoBack();
            return;
        }
        // Handle global create report
        if (isCreateReport && isFromGlobalCreate) {
            handleGlobalCreateReport(item);
            return;
        }
        // Handle regular report selection
        handleRegularReportSelection(item);
    };
    const removeFromReport = () => {
        if (!transaction) {
            return;
        }
        Navigation_1.default.dismissModal();
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, Transaction_1.changeTransactionsReport)([transaction.transactionID], CONST_1.default.REPORT.UNREPORTED_REPORT_ID, isASAPSubmitBetaEnabled, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, session?.email ?? '');
            removeTransaction(transaction.transactionID);
        });
    };
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, reportOrDraftReport, transaction);
    return (<IOURequestEditReportCommon_1.default backTo={backTo} selectReport={selectReport} transactionIDs={transaction ? [transaction.transactionID] : []} selectedReportID={selectedReportID} selectedPolicyID={!isEditing && !isFromGlobalCreate ? reportOrDraftReport?.policyID : undefined} removeFromReport={removeFromReport} isEditing={isEditing} isUnreported={isUnreported} shouldShowNotFoundPage={shouldShowNotFoundPage}/>);
}
IOURequestStepReport.displayName = 'IOURequestStepReport';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepReport));
