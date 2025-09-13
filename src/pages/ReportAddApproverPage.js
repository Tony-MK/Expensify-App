"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debounce_1 = require("lodash/debounce");
var react_1 = require("react");
var Badge_1 = require("@components/Badge");
var BlockingView_1 = require("@components/BlockingViews/BlockingView");
var FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons_1 = require("@components/Icon/Expensicons");
var Illustrations = require("@components/Icon/Illustrations");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SelectionList_1 = require("@components/SelectionList");
var InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
var Text_1 = require("@components/Text");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var IOU_1 = require("@libs/actions/IOU");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var tokenizedSearch_1 = require("@libs/tokenizedSearch");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var NotFoundPage_1 = require("./ErrorPage/NotFoundPage");
var withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
function ReportAddApproverPage(_a) {
    var _b;
    var report = _a.report, isLoadingReportData = _a.isLoadingReportData, policy = _a.policy;
    var styles = (0, useThemeStyles_1.default)();
    var _c = (0, useLocalize_1.default)(), translate = _c.translate, localeCompare = _c.localeCompare;
    var _d = (0, useDebouncedState_1.default)(''), searchTerm = _d[0], debouncedSearchTerm = _d[1], setSearchTerm = _d[2];
    var _e = (0, react_1.useState)(undefined), selectedApproverEmail = _e[0], setSelectedApproverEmail = _e[1];
    var personalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false })[0];
    var countryCode = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false })[0];
    var currentUserDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var _f = (0, react_1.useState)([]), allApprovers = _f[0], setAllApprovers = _f[1];
    var shouldShowTextInput = (allApprovers === null || allApprovers === void 0 ? void 0 : allApprovers.length) >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    var employeeList = policy === null || policy === void 0 ? void 0 : policy.employeeList;
    var sections = (0, react_1.useMemo)(function () {
        var approvers = [];
        if (employeeList) {
            var policyMemberEmailsToAccountIDs_1 = (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(employeeList, true, false);
            var availableApprovers = Object.values(employeeList)
                .map(function (employee) {
                var _a, _b, _c;
                var isAdmin = (employee === null || employee === void 0 ? void 0 : employee.role) === CONST_1.default.REPORT.ROLE.ADMIN;
                var email = employee.email;
                if (!email) {
                    return null;
                }
                var accountID = Number((_a = policyMemberEmailsToAccountIDs_1[email]) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID);
                var isPendingDelete = ((_b = employeeList === null || employeeList === void 0 ? void 0 : employeeList[accountID]) === null || _b === void 0 ? void 0 : _b.pendingAction) === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
                // Filter the current report approver and members which are pending for deletion
                if (report.managerID === accountID || isPendingDelete || !(0, ReportUtils_1.isAllowedToApproveExpenseReport)(report, accountID, policy)) {
                    return null;
                }
                var avatar = ((_c = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[accountID]) !== null && _c !== void 0 ? _c : {}).avatar;
                var displayName = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: accountID, personalDetailsData: personalDetails });
                return {
                    text: displayName,
                    alternateText: email,
                    keyForList: email,
                    isSelected: selectedApproverEmail === email,
                    login: email,
                    value: accountID,
                    icons: [{ source: avatar !== null && avatar !== void 0 ? avatar : Expensicons_1.FallbackAvatar, type: CONST_1.default.ICON_TYPE_AVATAR, name: displayName, id: accountID }],
                    rightElement: isAdmin ? <Badge_1.default text={translate('common.admin')}/> : undefined,
                };
            })
                .filter(function (approver) { return !!approver; });
            approvers.push.apply(approvers, availableApprovers);
            // eslint-disable-next-line react-compiler/react-compiler
            setAllApprovers(approvers);
        }
        var filteredApprovers = debouncedSearchTerm !== ''
            ? (0, tokenizedSearch_1.default)(approvers, (0, OptionsListUtils_1.getSearchValueForPhoneOrEmail)(debouncedSearchTerm, countryCode), function (option) { var _a, _b; return [(_a = option.text) !== null && _a !== void 0 ? _a : '', (_b = option.login) !== null && _b !== void 0 ? _b : '']; })
            : approvers;
        var data = (0, OptionsListUtils_1.sortAlphabetically)(filteredApprovers, 'text', localeCompare);
        return [
            {
                title: undefined,
                data: data,
                shouldShow: true,
            },
        ];
    }, [employeeList, debouncedSearchTerm, countryCode, localeCompare, report, policy, personalDetails, selectedApproverEmail, translate]);
    var shouldShowListEmptyContent = !debouncedSearchTerm && !((_b = sections.at(0)) === null || _b === void 0 ? void 0 : _b.data.length);
    var addApprover = (0, react_1.useCallback)(function () {
        var _a;
        var employeeAccountID = (_a = allApprovers.find(function (approver) { return approver.login === selectedApproverEmail; })) === null || _a === void 0 ? void 0 : _a.value;
        if (!selectedApproverEmail || !employeeAccountID) {
            return;
        }
        (0, IOU_1.addReportApprover)(report, selectedApproverEmail, Number(employeeAccountID), currentUserDetails.accountID);
        Navigation_1.default.dismissModal();
    }, [allApprovers, selectedApproverEmail, report, currentUserDetails.accountID]);
    var button = (0, react_1.useMemo)(function () {
        return (<FormAlertWithSubmitButton_1.default isDisabled={!selectedApproverEmail} buttonText={translate('common.save')} onSubmit={addApprover} containerStyles={[styles.flexReset, styles.flexGrow0, styles.flexShrink0, styles.flexBasisAuto]} enabledWhenOffline shouldBlendOpacity/>);
    }, [addApprover, selectedApproverEmail, styles.flexBasisAuto, styles.flexGrow0, styles.flexReset, styles.flexShrink0, translate]);
    var toggleApprover = (0, react_1.useCallback)(function (approver) {
        return (0, debounce_1.default)(function () {
            if (selectedApproverEmail === approver.login) {
                setSelectedApproverEmail(undefined);
                return;
            }
            setSelectedApproverEmail(approver.login);
        }, 200)();
    }, [selectedApproverEmail]);
    var headerMessage = (0, react_1.useMemo)(function () { var _a, _b; return (searchTerm && !((_b = (_a = sections.at(0)) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.length) ? translate('common.noResultsFound') : ''); }, [searchTerm, sections, translate]);
    var listEmptyContent = (0, react_1.useMemo)(function () { return (<BlockingView_1.default icon={Illustrations.TurtleInShell} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workflowsPage.emptyContent.title')} subtitle={translate('workflowsPage.emptyContent.approverSubtitle')} subtitleStyle={styles.textSupporting} containerStyle={styles.pb10} contentFitImage="contain"/>); }, [translate, styles.textSupporting, styles.pb10]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFoundView = ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || !(0, PolicyUtils_1.isPolicyAdmin)(policy) || !(0, ReportUtils_1.isMoneyRequestReport)(report) || (0, ReportUtils_1.isMoneyRequestReportPendingDeletion)(report);
    if (shouldShowNotFoundView) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ReportAddApproverPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('iou.changeApprover.actions.addApprover')} onBackButtonPress={function () {
            Navigation_1.default.goBack(ROUTES_1.default.REPORT_CHANGE_APPROVER.getRoute(report.reportID), { compareParams: false });
        }}/>
            <Text_1.default style={[styles.ph5, styles.pb3]}>{translate('iou.changeApprover.addApprover.subtitle')}</Text_1.default>
            <SelectionList_1.default sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={shouldShowListEmptyContent ? undefined : translate('selectionList.findMember')} textInputValue={searchTerm} onChangeText={setSearchTerm} headerMessage={headerMessage} onSelectRow={toggleApprover} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} footerContent={button} listEmptyContent={listEmptyContent} shouldShowListEmptyContent={shouldShowListEmptyContent} initiallyFocusedOptionKey={selectedApproverEmail} shouldUpdateFocusedIndex shouldShowTextInput={shouldShowTextInput} addBottomSafeAreaPadding/>
        </ScreenWrapper_1.default>);
}
ReportAddApproverPage.displayName = 'ReportAddApproverPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportAddApproverPage);
