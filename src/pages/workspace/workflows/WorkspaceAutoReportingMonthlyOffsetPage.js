"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const DAYS_OF_MONTH = 28;
function WorkspaceAutoReportingMonthlyOffsetPage({ policy, route }) {
    const { translate, toLocaleOrdinal } = (0, useLocalize_1.default)();
    const offset = policy?.autoReportingOffset ?? 0;
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const trimmedText = searchText.trim().toLowerCase();
    const daysOfMonth = Array.from({ length: DAYS_OF_MONTH }, (value, index) => {
        const day = index + 1;
        return {
            text: toLocaleOrdinal(day),
            keyForList: day.toString(), // we have to cast it as string for <ListItem> to work
            isSelected: day === offset,
            isNumber: true,
        };
    }).concat([
        {
            keyForList: 'lastDayOfMonth',
            text: translate('workflowsPage.frequencies.lastDayOfMonth'),
            isSelected: offset === CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_DAY_OF_MONTH,
            isNumber: false,
        },
        {
            keyForList: 'lastBusinessDayOfMonth',
            text: translate('workflowsPage.frequencies.lastBusinessDayOfMonth'),
            isSelected: offset === CONST_1.default.POLICY.AUTO_REPORTING_OFFSET.LAST_BUSINESS_DAY_OF_MONTH,
            isNumber: false,
        },
    ]);
    const filteredDaysOfMonth = daysOfMonth.filter((dayItem) => dayItem.text.toLowerCase().includes(trimmedText));
    const headerMessage = searchText.trim() && !filteredDaysOfMonth.length ? translate('common.noResultsFound') : '';
    const onSelectDayOfMonth = (item) => {
        Policy.setWorkspaceAutoReportingMonthlyOffset(policy?.id ?? '-1', item.isNumber ? parseInt(item.keyForList, 10) : item.keyForList);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_WORKFLOWS_AUTOREPORTING_FREQUENCY.getRoute(policy?.id ?? ''));
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_WORKFLOWS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceAutoReportingMonthlyOffsetPage.displayName}>
                <FullPageNotFoundView_1.default onBackButtonPress={PolicyUtils.goBackFromInvalidPolicy} onLinkPress={PolicyUtils.goBackFromInvalidPolicy} shouldShow={(0, EmptyObject_1.isEmptyObject)(policy) || !PolicyUtils.isPolicyAdmin(policy) || PolicyUtils.isPendingDeletePolicy(policy) || !PolicyUtils.isPaidGroupPolicy(policy)} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) ? undefined : 'workspace.common.notAuthorized'} addBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={translate('workflowsPage.submissionFrequency')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_WORKFLOWS_AUTOREPORTING_FREQUENCY.getRoute(policy?.id ?? ''))}/>

                    <SelectionList_1.default sections={[{ data: filteredDaysOfMonth }]} textInputLabel={translate('workflowsPage.submissionFrequencyDateOfMonth')} textInputValue={searchText} onChangeText={setSearchText} headerMessage={headerMessage} ListItem={RadioListItem_1.default} onSelectRow={onSelectDayOfMonth} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={offset.toString()} showScrollIndicator addBottomSafeAreaPadding/>
                </FullPageNotFoundView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceAutoReportingMonthlyOffsetPage.displayName = 'WorkspaceAutoReportingMonthlyOffsetPage';
exports.default = (0, withPolicy_1.default)(WorkspaceAutoReportingMonthlyOffsetPage);
