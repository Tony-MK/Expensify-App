"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SearchContext_1 = require("@components/Search/SearchContext");
const useOnyx_1 = require("@hooks/useOnyx");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const Transaction_1 = require("@libs/actions/Transaction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Permissions_1 = require("@libs/Permissions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const IOURequestEditReportCommon_1 = require("./IOURequestEditReportCommon");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestEditReport({ route }) {
    const { backTo, reportID, action, shouldTurnOffSelectionMode } = route.params;
    const { selectedTransactionIDs, clearSelectedTransactions } = (0, SearchContext_1.useSearchContext)();
    const [selectedReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: false });
    const [reportNextStep] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`, { canBeMissing: true });
    const [allBetas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    const session = (0, OnyxListItemProvider_1.useSession)();
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const selectReport = (item) => {
        if (selectedTransactionIDs.length === 0 || item.value === reportID) {
            Navigation_1.default.dismissModal();
            return;
        }
        (0, Transaction_1.changeTransactionsReport)(selectedTransactionIDs, item.value, isASAPSubmitBetaEnabled, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, session?.email ?? '', allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${item.policyID}`], reportNextStep);
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        clearSelectedTransactions(true);
        Navigation_1.default.dismissModal();
    };
    const removeFromReport = () => {
        if (!selectedReport || selectedTransactionIDs.length === 0) {
            return;
        }
        (0, Transaction_1.changeTransactionsReport)(selectedTransactionIDs, CONST_1.default.REPORT.UNREPORTED_REPORT_ID, isASAPSubmitBetaEnabled, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, session?.email ?? '');
        if (shouldTurnOffSelectionMode) {
            (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        }
        clearSelectedTransactions(true);
        Navigation_1.default.dismissModal();
    };
    return (<IOURequestEditReportCommon_1.default backTo={backTo} selectedReportID={reportID} transactionIDs={selectedTransactionIDs} selectReport={selectReport} removeFromReport={removeFromReport} isEditing={action === CONST_1.default.IOU.ACTION.EDIT}/>);
}
IOURequestEditReport.displayName = 'IOURequestEditReport';
exports.default = (0, withWritableReportOrNotFound_1.default)(IOURequestEditReport);
