"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const connections_1 = require("@libs/actions/connections");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const useTheme_1 = require("./useTheme");
function useWorkspacesTabIndicatorStatus() {
    const theme = (0, useTheme_1.default)();
    const [allConnectionSyncProgresses] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS, { canBeMissing: true });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    // If a policy was just deleted from Onyx, then Onyx will pass a null value to the props, and
    // those should be cleaned out before doing any error checking
    const cleanPolicies = (0, react_1.useMemo)(() => Object.fromEntries(Object.entries(policies ?? {}).filter(([, policy]) => policy?.id)), [policies]);
    const policyErrors = {
        [CONST_1.default.INDICATOR_STATUS.HAS_POLICY_ERRORS]: Object.values(cleanPolicies).find(PolicyUtils_1.shouldShowPolicyError),
        [CONST_1.default.INDICATOR_STATUS.HAS_CUSTOM_UNITS_ERROR]: Object.values(cleanPolicies).find(PolicyUtils_1.shouldShowCustomUnitsError),
        [CONST_1.default.INDICATOR_STATUS.HAS_EMPLOYEE_LIST_ERROR]: Object.values(cleanPolicies).find(PolicyUtils_1.shouldShowEmployeeListError),
        [CONST_1.default.INDICATOR_STATUS.HAS_SYNC_ERRORS]: Object.values(cleanPolicies).find((cleanPolicy) => (0, PolicyUtils_1.shouldShowSyncError)(cleanPolicy, (0, connections_1.isConnectionInProgress)(allConnectionSyncProgresses?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${cleanPolicy?.id}`], cleanPolicy))),
        [CONST_1.default.INDICATOR_STATUS.HAS_QBO_EXPORT_ERROR]: Object.values(cleanPolicies).find(QuickbooksOnline_1.shouldShowQBOReimbursableExportDestinationAccountError),
    };
    // All of the error & info-checking methods are put into an array. This is so that using _.some() will return
    // early as soon as the first error / info condition is returned. This makes the checks very efficient since
    // we only care if a single error / info condition exists anywhere.
    const errorChecking = {
        ...Object.fromEntries(Object.entries(policyErrors).map(([error, policy]) => [error, !!policy])),
    };
    const [error] = Object.entries(errorChecking).find(([, value]) => value) ?? [];
    const status = error;
    const policyIDWithErrors = Object.values(policyErrors).find(Boolean)?.id;
    const indicatorColor = error ? theme.danger : theme.success;
    return { indicatorColor, status, policyIDWithErrors };
}
exports.default = useWorkspacesTabIndicatorStatus;
