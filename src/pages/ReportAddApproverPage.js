"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const Badge_1 = require("@components/Badge");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const NotFoundPage_1 = require("./ErrorPage/NotFoundPage");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function ReportAddApproverPage({ report, isLoadingReportData, policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [selectedApproverEmail, setSelectedApproverEmail] = (0, react_1.useState)(undefined);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const currentUserDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [allApprovers, setAllApprovers] = (0, react_1.useState)([]);
    const shouldShowTextInput = allApprovers?.length >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    const employeeList = policy?.employeeList;
    const sections = (0, react_1.useMemo)(() => {
        const approvers = [];
        if (employeeList) {
            const policyMemberEmailsToAccountIDs = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(employeeList, true, false);
            const availableApprovers = Object.values(employeeList)
                .map((employee) => {
                const isAdmin = employee?.role === CONST_1.default.REPORT.ROLE.ADMIN;
                const email = employee.email;
                if (!email) {
                    return null;
                }
                const accountID = Number(policyMemberEmailsToAccountIDs[email] ?? CONST_1.default.DEFAULT_NUMBER_ID);
                const isPendingDelete = employeeList?.[accountID]?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
                // Filter the current report approver and members which are pending for deletion
                if (report.managerID === accountID || isPendingDelete || !(0, ReportUtils_1.isAllowedToApproveExpenseReport)(report, accountID, policy)) {
                    return null;
                }
                const { avatar } = personalDetails?.[accountID] ?? {};
                const displayName = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID, personalDetailsData: personalDetails });
                return {
                    text: displayName,
                    alternateText: email,
                    keyForList: email,
                    isSelected: selectedApproverEmail === email,
                    login: email,
                    value: accountID,
                    icons: [{ source: avatar ?? Expensicons_1.FallbackAvatar, type: CONST_1.default.ICON_TYPE_AVATAR, name: displayName, id: accountID }],
                    rightElement: isAdmin ? <Badge_1.default text={translate('common.admin')}/> : undefined,
                };
            })
                .filter((approver) => !!approver);
            approvers.push(...availableApprovers);
            // eslint-disable-next-line react-compiler/react-compiler
            setAllApprovers(approvers);
        }
        const filteredApprovers = debouncedSearchTerm !== ''
            ? (0, tokenizedSearch_1.default)(approvers, (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode), (option) => [option.text ?? '', option.login ?? ''])
            : approvers;
        const data = (0, OptionsListUtils_1.sortAlphabetically)(filteredApprovers, 'text', localeCompare);
        return [
            {
                title: undefined,
                data,
                shouldShow: true,
            },
        ];
    }, [employeeList, debouncedSearchTerm, countryCode, localeCompare, report, policy, personalDetails, selectedApproverEmail, translate]);
    const shouldShowListEmptyContent = !debouncedSearchTerm && !sections.at(0)?.data.length;
    const addApprover = (0, react_1.useCallback)(() => {
        const employeeAccountID = allApprovers.find((approver) => approver.login === selectedApproverEmail)?.value;
        if (!selectedApproverEmail || !employeeAccountID) {
            return;
        }
        (0, IOU_1.addReportApprover)(report, selectedApproverEmail, Number(employeeAccountID), currentUserDetails.accountID);
        Navigation_1.default.dismissModal();
    }, [allApprovers, selectedApproverEmail, report, currentUserDetails.accountID]);
    const button = (0, react_1.useMemo)(() => {
        return (<FormAlertWithSubmitButton_1.default isDisabled={!selectedApproverEmail} buttonText={translate('common.save')} onSubmit={addApprover} containerStyles={[styles.flexReset, styles.flexGrow0, styles.flexShrink0, styles.flexBasisAuto]} enabledWhenOffline shouldBlendOpacity/>);
    }, [addApprover, selectedApproverEmail, styles.flexBasisAuto, styles.flexGrow0, styles.flexReset, styles.flexShrink0, translate]);
    const toggleApprover = (0, react_1.useCallback)((approver) => (0, debounce_1.default)(() => {
        if (selectedApproverEmail === approver.login) {
            setSelectedApproverEmail(undefined);
            return;
        }
        setSelectedApproverEmail(approver.login);
    }, 200)(), [selectedApproverEmail]);
    const headerMessage = (0, react_1.useMemo)(() => (searchTerm && !sections.at(0)?.data?.length ? translate('common.noResultsFound') : ''), [searchTerm, sections, translate]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TurtleInShell} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workflowsPage.emptyContent.title')} subtitle={translate('workflowsPage.emptyContent.approverSubtitle')} subtitleStyle={styles.textSupporting} containerStyle={styles.pb10} contentFitImage="contain"/>), [translate, styles.textSupporting, styles.pb10]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundView = ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || !(0, PolicyUtils_1.isPolicyAdmin)(policy) || !(0, ReportUtils_1.isMoneyRequestReport)(report) || (0, ReportUtils_1.isMoneyRequestReportPendingDeletion)(report);
    if (shouldShowNotFoundView) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ReportAddApproverPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('iou.changeApprover.actions.addApprover')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.REPORT_CHANGE_APPROVER.getRoute(report.reportID), { compareParams: false });
        }}/>
            <Text_1.default style={[styles.ph5, styles.pb3]}>{translate('iou.changeApprover.addApprover.subtitle')}</Text_1.default>
            <SelectionList_1.default sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={shouldShowListEmptyContent ? undefined : translate('selectionList.findMember')} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={headerMessage} onSelectRow={toggleApprover} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} footerContent={button} listEmptyContent={listEmptyContent} shouldShowListEmptyContent={shouldShowListEmptyContent} initiallyFocusedOptionKey={selectedApproverEmail} shouldUpdateFocusedIndex shouldShowTextInput={shouldShowTextInput} addBottomSafeAreaPadding/>
        </ScreenWrapper_1.default>);
}
ReportAddApproverPage.displayName = 'ReportAddApproverPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportAddApproverPage);
