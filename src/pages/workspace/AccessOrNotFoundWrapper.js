"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable rulesdir/no-negated-variables */
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const Policy_1 = require("@libs/actions/Policy/Policy");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const callOrReturn_1 = require("@src/types/utils/callOrReturn");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ACCESS_VARIANTS = {
    [CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]: (policy) => (0, PolicyUtils_1.isPaidGroupPolicy)(policy),
    [CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]: (policy) => (0, PolicyUtils_1.isControlPolicy)(policy),
    [CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]: (policy, login) => (0, PolicyUtils_1.isPolicyAdmin)(policy, login),
    [CONST_1.default.IOU.ACCESS_VARIANTS.CREATE]: (policy, login, report, allPolicies, iouType, isReportArchived) => !!iouType &&
        (0, IOUUtils_1.isValidMoneyRequestType)(iouType) &&
        // Allow the user to submit the expense if we are submitting the expense in global menu or the report can create the expense
        ((0, EmptyObject_1.isEmptyObject)(report?.reportID) || (0, ReportUtils_1.canCreateRequest)(report, policy, iouType, isReportArchived)) &&
        (iouType !== CONST_1.default.IOU.TYPE.INVOICE || (0, PolicyUtils_1.canSendInvoice)(allPolicies, login)),
};
function PageNotFoundFallback({ policyID, fullPageNotFoundViewProps, isFeatureEnabled, isPolicyNotAccessible, isMoneyRequest }) {
    const shouldShowFullScreenFallback = !isFeatureEnabled || isPolicyNotAccessible;
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<NotFoundPage_1.default shouldForceFullScreen={shouldShowFullScreenFallback} shouldShowOfflineIndicator={false} onBackButtonPress={() => {
            if (isPolicyNotAccessible) {
                const rootState = Navigation_1.navigationRef.getRootState();
                const secondToLastRoute = rootState.routes.at(-2);
                if (secondToLastRoute?.name === NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR) {
                    Navigation_1.default.dismissModal();
                }
                else {
                    Navigation_1.default.goBack(ROUTES_1.default.WORKSPACES_LIST.route);
                }
                return;
            }
            Navigation_1.default.goBack(policyID && !isMoneyRequest ? ROUTES_1.default.WORKSPACE_OVERVIEW.getRoute(policyID) : undefined);
        }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...fullPageNotFoundViewProps} shouldShowBackButton={fullPageNotFoundViewProps?.shouldShowBackButton ?? (!shouldShowFullScreenFallback ? shouldUseNarrowLayout : undefined)}/>);
}
function AccessOrNotFoundWrapper({ accessVariants = [], fullPageNotFoundViewProps, shouldBeBlocked, policyID, reportID, iouType, allPolicies, featureName, ...props }) {
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
        canBeMissing: true,
    });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        canBeMissing: true,
    });
    const [isLoadingReportData = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_REPORT_DATA, { canBeMissing: true });
    const { login = '' } = (0, useCurrentUserPersonalDetails_1.default)();
    const isPolicyIDInRoute = !!policyID?.length;
    const isMoneyRequest = !!iouType && (0, IOUUtils_1.isValidMoneyRequestType)(iouType);
    const isFromGlobalCreate = !!reportID && (0, EmptyObject_1.isEmptyObject)(report?.reportID);
    const pendingField = featureName ? policy?.pendingFields?.[featureName] : undefined;
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        if (!isPolicyIDInRoute || !(0, EmptyObject_1.isEmptyObject)(policy)) {
            // If the workspace is not required or is already loaded, we don't need to call the API
            return;
        }
        (0, Policy_1.openWorkspace)(policyID, []);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isPolicyIDInRoute, policyID]);
    const shouldShowFullScreenLoadingIndicator = !isMoneyRequest && isLoadingReportData !== false && (!Object.entries(policy ?? {}).length || !policy?.id);
    const isFeatureEnabled = featureName ? (0, PolicyUtils_1.isPolicyFeatureEnabled)(policy, featureName) : true;
    const { isOffline } = (0, useNetwork_1.default)();
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isPageAccessible = accessVariants.reduce((acc, variant) => {
        const accessFunction = ACCESS_VARIANTS[variant];
        return acc && accessFunction(policy, login, report, allPolicies ?? null, iouType, isReportArchived);
    }, true);
    const isPolicyNotAccessible = !(0, PolicyUtils_1.isPolicyAccessible)(policy);
    const shouldShowNotFoundPage = (!isMoneyRequest && !isFromGlobalCreate && isPolicyNotAccessible) || !isPageAccessible || shouldBeBlocked;
    // We only update the feature state if it isn't pending.
    // This is because the feature state changes several times during the creation of a workspace, while we are waiting for a response from the backend.
    // Without this, we can be unexpectedly navigated to the More Features page.
    (0, react_1.useEffect)(() => {
        if (!isFocused || isFeatureEnabled || (pendingField && !isOffline && !isFeatureEnabled)) {
            return;
        }
        // When a workspace feature linked to the current page is disabled we will navigate to the More Features page.
        Navigation_1.default.isNavigationReady().then(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)));
        // We don't need to run the effect on policyID change as we only use it to get the route to navigate to.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingField, isOffline, isFeatureEnabled]);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (isLoadingReportData || !isPolicyNotAccessible) {
            return;
        }
        Navigation_1.default.removeScreenFromNavigationState(SCREENS_1.default.WORKSPACE.INITIAL);
    }, [isLoadingReportData, isPolicyNotAccessible]);
    if (shouldShowFullScreenLoadingIndicator) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    if (shouldShowNotFoundPage) {
        return (<PageNotFoundFallback policyID={policyID} isMoneyRequest={isMoneyRequest} isFeatureEnabled={isFeatureEnabled} isPolicyNotAccessible={isPolicyNotAccessible} fullPageNotFoundViewProps={fullPageNotFoundViewProps}/>);
    }
    return (0, callOrReturn_1.default)(props.children, { report, policy, isLoadingReportData });
}
exports.default = AccessOrNotFoundWrapper;
