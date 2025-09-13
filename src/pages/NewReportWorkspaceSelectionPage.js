"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function NewReportWorkspaceSelectionPage() {
    const { isOffline } = (0, useNetwork_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [policies, fetchStatus] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const shouldShowLoadingIndicator = isLoadingApp && !isOffline;
    const navigateToNewReport = (0, react_1.useCallback)((optimisticReportID) => {
        if (shouldUseNarrowLayout) {
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
                Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID: optimisticReportID }), { forceReplace: true });
            });
            return;
        }
        // On wide screens we use dismissModal instead of forceReplace to avoid performance issues
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
            Navigation_1.default.dismissModal();
        });
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID: optimisticReportID }));
        });
    }, [shouldUseNarrowLayout]);
    const selectPolicy = (0, react_1.useCallback)((policyID) => {
        if (!policyID) {
            return;
        }
        if ((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyID)) {
            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policyID));
            return;
        }
        const optimisticReportID = (0, Report_1.createNewReport)(currentUserPersonalDetails, policyID);
        navigateToNewReport(optimisticReportID);
    }, [currentUserPersonalDetails, navigateToNewReport]);
    const usersWorkspaces = (0, react_1.useMemo)(() => {
        if (!policies || (0, EmptyObject_1.isEmptyObject)(policies)) {
            return [];
        }
        return Object.values(policies)
            .filter((policy) => (0, PolicyUtils_1.shouldShowPolicy)(policy, !!isOffline, currentUserPersonalDetails?.login) && !policy?.isJoinRequestPending && policy?.isPolicyExpenseChatEnabled)
            .map((policy) => ({
            text: policy?.name ?? '',
            policyID: policy?.id,
            icons: [
                {
                    source: policy?.avatarURL ? policy.avatarURL : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy?.name),
                    fallbackIcon: Expensicons.FallbackWorkspaceAvatar,
                    name: policy?.name,
                    type: CONST_1.default.ICON_TYPE_WORKSPACE,
                    id: policy?.id,
                },
            ],
            keyForList: policy?.id,
            isPolicyAdmin: (0, PolicyUtils_1.isPolicyAdmin)(policy),
            shouldSyncFocus: true,
        }))
            .sort((a, b) => localeCompare(a.text, b.text));
    }, [policies, isOffline, currentUserPersonalDetails?.login, localeCompare]);
    const filteredAndSortedUserWorkspaces = (0, react_1.useMemo)(() => usersWorkspaces.filter((policy) => policy.text?.toLowerCase().includes(debouncedSearchTerm?.toLowerCase() ?? '')), [debouncedSearchTerm, usersWorkspaces]);
    const sections = (0, react_1.useMemo)(() => {
        const options = [
            {
                data: filteredAndSortedUserWorkspaces,
                shouldShow: true,
            },
        ];
        return options;
    }, [filteredAndSortedUserWorkspaces]);
    const areResultsFound = filteredAndSortedUserWorkspaces.length > 0;
    const headerMessage = (0, OptionsListUtils_1.getHeaderMessageForNonUserList)(areResultsFound, debouncedSearchTerm);
    return (<ScreenWrapper_1.default testID={NewReportWorkspaceSelectionPage.displayName} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            {({ didScreenTransitionEnd }) => (<>
                    <HeaderWithBackButton_1.default title={translate('report.newReport.createReport')} onBackButtonPress={Navigation_1.default.goBack}/>
                    {shouldShowLoadingIndicator ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<>
                            <Text_1.default style={[styles.ph5, styles.mb3]}>{translate('report.newReport.chooseWorkspace')}</Text_1.default>
                            <SelectionList_1.default ListItem={UserListItem_1.default} sections={sections} onSelectRow={(option) => selectPolicy(option.policyID)} textInputLabel={usersWorkspaces.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT ? translate('common.search') : undefined} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={headerMessage} showLoadingPlaceholder={fetchStatus.status === 'loading' || !didScreenTransitionEnd}/>
                        </>)}
                </>)}
        </ScreenWrapper_1.default>);
}
NewReportWorkspaceSelectionPage.displayName = 'NewReportWorkspaceSelectionPage';
exports.default = NewReportWorkspaceSelectionPage;
