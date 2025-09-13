"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FormHelpMessage_1 = require("@components/FormHelpMessage");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var RenderHTML_1 = require("@components/RenderHTML");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SelectionList_1 = require("@components/SelectionList");
var RadioListItem_1 = require("@components/SelectionList/RadioListItem");
var Text_1 = require("@components/Text");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var IOU_1 = require("@libs/actions/IOU");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var NotFoundPage_1 = require("./ErrorPage/NotFoundPage");
var withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
var APPROVER_TYPE = {
    ADD_APPROVER: 'addApprover',
    BYPASS_APPROVER: 'bypassApprover',
};
function ReportChangeApproverPage(_a) {
    var report = _a.report, policy = _a.policy, isLoadingReportData = _a.isLoadingReportData;
    var reportID = report === null || report === void 0 ? void 0 : report.reportID;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var currentUserDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var _b = (0, react_1.useState)(), selectedApproverType = _b[0], setSelectedApproverType = _b[1];
    var _c = (0, react_1.useState)(false), hasError = _c[0], setHasError = _c[1];
    var changeApprover = (0, react_1.useCallback)(function () {
        if (!selectedApproverType) {
            setHasError(true);
            return;
        }
        if (selectedApproverType === APPROVER_TYPE.ADD_APPROVER) {
            if (policy && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policy.id, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.multiApprovalLevels.alias, ROUTES_1.default.REPORT_CHANGE_APPROVER_ADD_APPROVER.getRoute(report.reportID)));
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_CHANGE_APPROVER_ADD_APPROVER.getRoute(report.reportID));
            return;
        }
        (0, IOU_1.assignReportToMe)(report, currentUserDetails.accountID);
        Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
    }, [selectedApproverType, report, currentUserDetails.accountID, reportID, policy]);
    var sections = (0, react_1.useMemo)(function () {
        var _a;
        var data = [
            {
                text: translate('iou.changeApprover.actions.addApprover'),
                keyForList: APPROVER_TYPE.ADD_APPROVER,
                alternateText: translate('iou.changeApprover.actions.addApproverSubtitle'),
                isSelected: selectedApproverType === APPROVER_TYPE.ADD_APPROVER,
            },
        ];
        // Only show the bypass option if current approver is not a policy admin and prevent self-approval is not enabled
        if (!(0, PolicyUtils_1.isMemberPolicyAdmin)(policy, (0, PersonalDetailsUtils_1.getLoginByAccountID)((_a = report.managerID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID)) && (0, ReportUtils_1.isAllowedToApproveExpenseReport)(report, currentUserDetails.accountID, policy)) {
            data.push({
                text: translate('iou.changeApprover.actions.bypassApprovers'),
                keyForList: APPROVER_TYPE.BYPASS_APPROVER,
                alternateText: translate('iou.changeApprover.actions.bypassApproversSubtitle'),
                isSelected: selectedApproverType === APPROVER_TYPE.BYPASS_APPROVER,
            });
        }
        return [{ data: data }];
    }, [translate, selectedApproverType, policy, report, currentUserDetails.accountID]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFoundView = ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || !(0, PolicyUtils_1.isPolicyAdmin)(policy) || !(0, ReportUtils_1.isMoneyRequestReport)(report) || (0, ReportUtils_1.isMoneyRequestReportPendingDeletion)(report);
    if (shouldShowNotFoundView) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ReportChangeApproverPage.displayName} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('iou.changeApprover.title')} onBackButtonPress={Navigation_1.default.goBack}/>
            <SelectionList_1.default ListItem={RadioListItem_1.default} sections={sections} isAlternateTextMultilineSupported onSelectRow={function (option) {
            if (!option.keyForList) {
                return;
            }
            setSelectedApproverType(option.keyForList);
            setHasError(false);
        }} showConfirmButton confirmButtonText={translate('iou.changeApprover.title')} onConfirm={changeApprover} customListHeader={<>
                        <Text_1.default style={[styles.ph5, styles.mb5]}>{translate('iou.changeApprover.subtitle')}</Text_1.default>
                        <react_native_1.View style={[styles.ph5, styles.mb5, styles.renderHTML, styles.flexRow]}>
                            <RenderHTML_1.default html={translate('iou.changeApprover.description', { workflowSettingLink: "".concat(environmentURL, "/").concat(ROUTES_1.default.WORKSPACE_WORKFLOWS.getRoute(policy === null || policy === void 0 ? void 0 : policy.id)) })}/>
                        </react_native_1.View>
                    </>}>
                {hasError && (<FormHelpMessage_1.default isError style={[styles.ph5, styles.mb3]} message={translate('common.error.pleaseSelectOne')}/>)}
            </SelectionList_1.default>
        </ScreenWrapper_1.default>);
}
ReportChangeApproverPage.displayName = 'ReportChangeApproverPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportChangeApproverPage);
