"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceList_1 = require("@hooks/useWorkspaceList");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const NotFoundPage_1 = require("./ErrorPage/NotFoundPage");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function ReportChangeWorkspacePage({ report, route }) {
    const reportID = report?.reportID;
    const { isOffline } = (0, useNetwork_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const { translate, formatPhoneNumber, localeCompare } = (0, useLocalize_1.default)();
    const [policies, fetchStatus] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [reportNextStep] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: false });
    const isReportArchived = (0, useReportIsArchived_1.default)(reportID);
    const shouldShowLoadingIndicator = isLoadingApp && !isOffline;
    const selectPolicy = (0, react_1.useCallback)((policyID) => {
        const policy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
        if (!policyID || !policy) {
            return;
        }
        const { backTo } = route.params;
        Navigation_1.default.goBack(backTo);
        // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
        // eslint-disable-next-line deprecation/deprecation
        if ((0, ReportUtils_1.isIOUReport)(reportID) && (0, PolicyUtils_1.isPolicyAdmin)(policy) && report.ownerAccountID && !(0, PolicyUtils_1.isPolicyMember)(policy, (0, PersonalDetailsUtils_1.getLoginByAccountID)(report.ownerAccountID))) {
            (0, Report_1.moveIOUReportToPolicyAndInviteSubmitter)(reportID, policyID, formatPhoneNumber);
        }
        else if ((0, ReportUtils_1.isIOUReport)(reportID) && (0, PolicyUtils_1.isPolicyMember)(policy, session?.email)) {
            (0, Report_1.moveIOUReportToPolicy)(reportID, policyID);
            // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
            // eslint-disable-next-line deprecation/deprecation
        }
        else if ((0, ReportUtils_1.isExpenseReport)(report) && (0, PolicyUtils_1.isPolicyAdmin)(policy) && report.ownerAccountID && !(0, PolicyUtils_1.isPolicyMember)(policy, (0, PersonalDetailsUtils_1.getLoginByAccountID)(report.ownerAccountID))) {
            const employeeList = policy?.employeeList;
            (0, Report_1.changeReportPolicyAndInviteSubmitter)(report, policy, employeeList, formatPhoneNumber, isReportArchived);
        }
        else {
            (0, Report_1.changeReportPolicy)(report, policy, reportNextStep, isReportArchived);
        }
    }, [session?.email, route.params, report, reportID, reportNextStep, policies, formatPhoneNumber, isReportArchived]);
    const { sections, shouldShowNoResultsFoundMessage, shouldShowSearchInput } = (0, useWorkspaceList_1.default)({
        policies,
        currentUserLogin: session?.email,
        shouldShowPendingDeletePolicy: false,
        selectedPolicyIDs: report.policyID ? [report.policyID] : undefined,
        searchTerm: debouncedSearchTerm,
        localeCompare,
        additionalFilter: (newPolicy) => (0, ReportUtils_1.isWorkspaceEligibleForReportChange)(newPolicy, report, policies),
    });
    if (!(0, ReportUtils_1.isMoneyRequestReport)(report) || (0, ReportUtils_1.isMoneyRequestReportPendingDeletion)(report)) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ReportChangeWorkspacePage.displayName} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            {({ didScreenTransitionEnd }) => (<>
                    <HeaderWithBackButton_1.default title={translate('iou.changeWorkspace')} onBackButtonPress={() => {
                const { backTo } = route.params;
                Navigation_1.default.goBack(backTo);
            }}/>
                    {shouldShowLoadingIndicator ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<SelectionList_1.default ListItem={UserListItem_1.default} sections={sections} onSelectRow={(option) => selectPolicy(option.policyID)} textInputLabel={shouldShowSearchInput ? translate('common.search') : undefined} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={shouldShowNoResultsFoundMessage ? translate('common.noResultsFound') : ''} initiallyFocusedOptionKey={report.policyID} showLoadingPlaceholder={fetchStatus.status === 'loading' || !didScreenTransitionEnd}/>)}
                </>)}
        </ScreenWrapper_1.default>);
}
ReportChangeWorkspacePage.displayName = 'ReportChangeWorkspacePage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportChangeWorkspacePage);
