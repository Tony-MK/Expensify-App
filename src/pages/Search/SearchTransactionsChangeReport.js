"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SearchContext_1 = require("@components/Search/SearchContext");
const useOnyx_1 = require("@hooks/useOnyx");
const Transaction_1 = require("@libs/actions/Transaction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Permissions_1 = require("@libs/Permissions");
const IOURequestEditReportCommon_1 = require("@pages/iou/request/step/IOURequestEditReportCommon");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function SearchTransactionsChangeReport() {
    const { selectedTransactions, clearSelectedTransactions } = (0, SearchContext_1.useSearchContext)();
    const selectedTransactionsKeys = (0, react_1.useMemo)(() => Object.keys(selectedTransactions), [selectedTransactions]);
    const [allReportNextSteps] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.NEXT_STEP, { canBeMissing: true });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [allBetas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    const session = (0, OnyxListItemProvider_1.useSession)();
    const firstTransactionKey = selectedTransactionsKeys.at(0);
    const firstTransactionReportID = firstTransactionKey ? selectedTransactions[firstTransactionKey]?.reportID : undefined;
    const selectedReportID = Object.values(selectedTransactions).every((transaction) => transaction.reportID === firstTransactionReportID) && firstTransactionReportID !== CONST_1.default.REPORT.UNREPORTED_REPORT_ID
        ? firstTransactionReportID
        : undefined;
    const selectReport = (item) => {
        if (selectedTransactionsKeys.length === 0) {
            return;
        }
        const reportNextStep = allReportNextSteps?.[`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${item.value}`];
        (0, Transaction_1.changeTransactionsReport)(selectedTransactionsKeys, item.value, isASAPSubmitBetaEnabled, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, session?.email ?? '', allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${item.policyID}`], reportNextStep);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            clearSelectedTransactions();
        });
        Navigation_1.default.goBack();
    };
    const removeFromReport = () => {
        if (selectedTransactionsKeys.length === 0) {
            return;
        }
        (0, Transaction_1.changeTransactionsReport)(selectedTransactionsKeys, CONST_1.default.REPORT.UNREPORTED_REPORT_ID, isASAPSubmitBetaEnabled, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, session?.email ?? '');
        clearSelectedTransactions();
        Navigation_1.default.goBack();
    };
    return (<IOURequestEditReportCommon_1.default backTo={undefined} transactionIDs={selectedTransactionsKeys} selectedReportID={selectedReportID} selectReport={selectReport} removeFromReport={removeFromReport} isEditing/>);
}
SearchTransactionsChangeReport.displayName = 'SearchTransactionsChangeReport';
exports.default = SearchTransactionsChangeReport;
