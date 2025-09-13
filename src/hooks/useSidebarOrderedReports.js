"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarOrderedReportsContext = void 0;
exports.SidebarOrderedReportsContextProvider = SidebarOrderedReportsContextProvider;
exports.useSidebarOrderedReports = useSidebarOrderedReports;
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const Log_1 = require("@libs/Log");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SidebarUtils_1 = require("@libs/SidebarUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const mapOnyxCollectionItems_1 = require("@src/utils/mapOnyxCollectionItems");
const useCurrentReportID_1 = require("./useCurrentReportID");
const useCurrentUserPersonalDetails_1 = require("./useCurrentUserPersonalDetails");
const useDeepCompareRef_1 = require("./useDeepCompareRef");
const useLocalize_1 = require("./useLocalize");
const useOnyx_1 = require("./useOnyx");
const usePrevious_1 = require("./usePrevious");
const useResponsiveLayout_1 = require("./useResponsiveLayout");
const SidebarOrderedReportsContext = (0, react_1.createContext)({
    orderedReports: [],
    orderedReportIDs: [],
    currentReportID: '',
    policyMemberAccountIDs: [],
});
exports.SidebarOrderedReportsContext = SidebarOrderedReportsContext;
const policySelector = (policy) => (policy && {
    type: policy.type,
    name: policy.name,
    avatarURL: policy.avatarURL,
    employeeList: policy.employeeList,
});
const policiesSelector = (policies) => (0, mapOnyxCollectionItems_1.default)(policies, policySelector);
function SidebarOrderedReportsContextProvider({ children, 
/**
 * Only required to make unit tests work, since we
 * explicitly pass the currentReportID in LHNTestUtils
 * to SidebarLinksData, so this context doesn't have
 * access to currentReportID in that case.
 *
 * This is a workaround to have currentReportID available in testing environment.
 */
currentReportIDForTests, }) {
    const { localeCompare } = (0, useLocalize_1.default)();
    const [priorityMode = CONST_1.default.PRIORITY_MODE.DEFAULT] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { canBeMissing: true });
    const [chatReports, { sourceValue: reportUpdates }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const [policies, { sourceValue: policiesUpdates }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { selector: policiesSelector, canBeMissing: true });
    const [transactions, { sourceValue: transactionsUpdates }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: true });
    const [transactionViolations, { sourceValue: transactionViolationsUpdates }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true });
    const [reportNameValuePairs, { sourceValue: reportNameValuePairsUpdates }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, { canBeMissing: true });
    const [, { sourceValue: reportsDraftsUpdates }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT, { canBeMissing: true });
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { selector: (value) => value?.reports, canBeMissing: true });
    const [currentReportsToDisplay, setCurrentReportsToDisplay] = (0, react_1.useState)({});
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { accountID } = (0, useCurrentUserPersonalDetails_1.default)();
    const currentReportIDValue = (0, useCurrentReportID_1.default)();
    const derivedCurrentReportID = currentReportIDForTests ?? currentReportIDValue?.currentReportIDFromPath ?? currentReportIDValue?.currentReportID;
    const prevDerivedCurrentReportID = (0, usePrevious_1.default)(derivedCurrentReportID);
    const policyMemberAccountIDs = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getPolicyEmployeeListByIdWithoutCurrentUser)(policies, undefined, accountID), [policies, accountID]);
    const prevBetas = (0, usePrevious_1.default)(betas);
    const prevPriorityMode = (0, usePrevious_1.default)(priorityMode);
    /**
     * Find the reports that need to be updated in the LHN
     */
    const getUpdatedReports = (0, react_1.useCallback)(() => {
        let reportsToUpdate = [];
        if (betas !== prevBetas || priorityMode !== prevPriorityMode) {
            reportsToUpdate = Object.keys(chatReports ?? {});
        }
        else if (reportUpdates) {
            reportsToUpdate = Object.keys(reportUpdates ?? {});
        }
        else if (reportNameValuePairsUpdates) {
            reportsToUpdate = Object.keys(reportNameValuePairsUpdates ?? {}).map((key) => key.replace(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, ONYXKEYS_1.default.COLLECTION.REPORT));
        }
        else if (transactionsUpdates) {
            reportsToUpdate = Object.values(transactionsUpdates ?? {}).map((transaction) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`);
        }
        else if (transactionViolationsUpdates) {
            reportsToUpdate = Object.keys(transactionViolationsUpdates ?? {})
                .map((key) => key.replace(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, ONYXKEYS_1.default.COLLECTION.TRANSACTION))
                .map((key) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${transactions?.[key]?.reportID}`);
        }
        else if (reportsDraftsUpdates) {
            reportsToUpdate = Object.keys(reportsDraftsUpdates).map((key) => key.replace(ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT, ONYXKEYS_1.default.COLLECTION.REPORT));
        }
        else if (policiesUpdates) {
            const updatedPolicies = Object.keys(policiesUpdates).map((key) => key.replace(ONYXKEYS_1.default.COLLECTION.POLICY, ''));
            reportsToUpdate = Object.entries(chatReports ?? {})
                .filter(([, value]) => {
                if (!value?.policyID) {
                    return;
                }
                return updatedPolicies.includes(value.policyID);
            })
                .map(([key]) => key);
        }
        // Make sure the previous and current reports are always included in the updates when we switch reports.
        if (prevDerivedCurrentReportID !== derivedCurrentReportID) {
            reportsToUpdate.push(`${ONYXKEYS_1.default.COLLECTION.REPORT}${prevDerivedCurrentReportID}`, `${ONYXKEYS_1.default.COLLECTION.REPORT}${derivedCurrentReportID}`);
        }
        return reportsToUpdate;
    }, [
        reportUpdates,
        reportNameValuePairsUpdates,
        transactionsUpdates,
        transactionViolationsUpdates,
        reportsDraftsUpdates,
        policiesUpdates,
        chatReports,
        transactions,
        betas,
        priorityMode,
        prevBetas,
        prevPriorityMode,
        prevDerivedCurrentReportID,
        derivedCurrentReportID,
    ]);
    const reportsToDisplayInLHN = (0, react_1.useMemo)(() => {
        const updatedReports = getUpdatedReports();
        const shouldDoIncrementalUpdate = updatedReports.length > 0 && Object.keys(currentReportsToDisplay).length > 0;
        let reportsToDisplay = {};
        if (shouldDoIncrementalUpdate) {
            reportsToDisplay = SidebarUtils_1.default.updateReportsToDisplayInLHN(currentReportsToDisplay, chatReports, updatedReports, derivedCurrentReportID, priorityMode === CONST_1.default.PRIORITY_MODE.GSD, betas, policies, transactionViolations, reportNameValuePairs, reportAttributes);
        }
        else {
            reportsToDisplay = SidebarUtils_1.default.getReportsToDisplayInLHN(derivedCurrentReportID, chatReports, betas, policies, priorityMode, transactionViolations, reportNameValuePairs, reportAttributes);
        }
        return reportsToDisplay;
        // Rule disabled intentionally — triggering a re-render on currentReportsToDisplay would cause an infinite loop
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [getUpdatedReports, chatReports, derivedCurrentReportID, priorityMode, betas, policies, transactionViolations, reportNameValuePairs, reportAttributes]);
    const deepComparedReportsToDisplayInLHN = (0, useDeepCompareRef_1.default)(reportsToDisplayInLHN);
    (0, react_1.useEffect)(() => {
        setCurrentReportsToDisplay(reportsToDisplayInLHN);
    }, [reportsToDisplayInLHN]);
    const getOrderedReportIDs = (0, react_1.useCallback)(() => SidebarUtils_1.default.sortReportsToDisplayInLHN(deepComparedReportsToDisplayInLHN ?? {}, priorityMode, localeCompare, reportNameValuePairs, reportAttributes), 
    // Rule disabled intentionally - reports should be sorted only when the reportsToDisplayInLHN changes
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [reportsToDisplayInLHN, localeCompare]);
    const orderedReportIDs = (0, react_1.useMemo)(() => getOrderedReportIDs(), [getOrderedReportIDs]);
    // Get the actual reports based on the ordered IDs
    const getOrderedReports = (0, react_1.useCallback)((reportIDs) => {
        if (!chatReports) {
            return [];
        }
        return reportIDs.map((reportID) => chatReports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]).filter(Boolean);
    }, [chatReports]);
    const orderedReports = (0, react_1.useMemo)(() => getOrderedReports(orderedReportIDs), [getOrderedReports, orderedReportIDs]);
    const contextValue = (0, react_1.useMemo)(() => {
        // We need to make sure the current report is in the list of reports, but we do not want
        // to have to re-generate the list every time the currentReportID changes. To do that
        // we first generate the list as if there was no current report, then we check if
        // the current report is missing from the list, which should very rarely happen. In this
        // case we re-generate the list a 2nd time with the current report included.
        // We also execute the following logic if `shouldUseNarrowLayout` is false because this is
        // requirement for web and desktop. Consider a case, where we have report with expenses and we click on
        // any expense, a new LHN item is added in the list and is visible on web and desktop. But on mobile, we
        // just navigate to the screen with expense details, so there seems no point to execute this logic on mobile.
        if ((!shouldUseNarrowLayout || orderedReportIDs.length === 0) &&
            derivedCurrentReportID &&
            derivedCurrentReportID !== '-1' &&
            orderedReportIDs.indexOf(derivedCurrentReportID) === -1) {
            const updatedReportIDs = getOrderedReportIDs();
            const updatedReports = getOrderedReports(updatedReportIDs);
            return {
                orderedReports: updatedReports,
                orderedReportIDs: updatedReportIDs,
                currentReportID: derivedCurrentReportID,
                policyMemberAccountIDs,
            };
        }
        return {
            orderedReports,
            orderedReportIDs,
            currentReportID: derivedCurrentReportID,
            policyMemberAccountIDs,
        };
    }, [getOrderedReportIDs, orderedReportIDs, derivedCurrentReportID, policyMemberAccountIDs, shouldUseNarrowLayout, getOrderedReports, orderedReports]);
    const currentDeps = {
        priorityMode,
        chatReports,
        policies,
        transactions,
        transactionViolations,
        reportNameValuePairs,
        betas,
        reportAttributes,
        currentReportsToDisplay,
        shouldUseNarrowLayout,
        accountID,
        currentReportIDValue,
        derivedCurrentReportID,
        prevDerivedCurrentReportID,
        policyMemberAccountIDs,
        prevBetas,
        prevPriorityMode,
        reportsToDisplayInLHN,
        orderedReportIDs,
        orderedReports,
    };
    const prevContextValue = (0, usePrevious_1.default)(contextValue);
    const previousDeps = (0, usePrevious_1.default)(currentDeps);
    const firstRender = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
        // Cases below ensure we only log when the edge case (empty -> non-empty or non-empty -> empty) happens.
        // This is done to avoid excessive logging when the orderedReports array is updated, but does not impact LHN.
        // Case 1: orderedReports goes from empty to non-empty
        if (contextValue.orderedReports.length > 0 && prevContextValue?.orderedReports.length === 0) {
            logChangedDeps('[useSidebarOrderedReports] Ordered reports went from empty to non-empty', currentDeps, previousDeps);
        }
        // Case 2: orderedReports goes from non-empty to empty
        if (contextValue.orderedReports.length === 0 && prevContextValue?.orderedReports.length > 0) {
            logChangedDeps('[useSidebarOrderedReports] Ordered reports went from non-empty to empty', currentDeps, previousDeps);
        }
        // Case 3: orderedReports are empty from the beginning
        if (firstRender.current && contextValue.orderedReports.length === 0) {
            logChangedDeps('[useSidebarOrderedReports] Ordered reports initialized empty', currentDeps, previousDeps);
        }
        firstRender.current = false;
    });
    return <SidebarOrderedReportsContext.Provider value={contextValue}>{children}</SidebarOrderedReportsContext.Provider>;
}
function useSidebarOrderedReports() {
    return (0, react_1.useContext)(SidebarOrderedReportsContext);
}
function getChangedKeys(deps, prevDeps) {
    const depsKeys = Object.keys(deps);
    return depsKeys.filter((depKey) => !(0, fast_equals_1.deepEqual)(deps[depKey], prevDeps[depKey]));
}
function logChangedDeps(msg, deps, prevDeps) {
    const startTime = performance.now();
    const changedDeps = getChangedKeys(deps, prevDeps);
    const parsedDeps = parseDepsForLogging(deps);
    const processingDuration = performance.now() - startTime;
    Log_1.default.info(msg, false, {
        deps: parsedDeps,
        changedDeps,
        processingDuration,
    });
}
/**
 * @param deps - The dependencies to parse.
 * @returns A simplified object with light-weight values.
 */
function parseDepsForLogging(deps) {
    // If object or array, return the keys' length
    // If primitive, return the value
    return Object.fromEntries(Object.entries(deps).map(([key, value]) => [key, typeof value === 'object' && value !== null ? Object.keys(value).length : value]));
}
