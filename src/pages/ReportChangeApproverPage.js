"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const NotFoundPage_1 = require("./ErrorPage/NotFoundPage");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
const APPROVER_TYPE = {
    ADD_APPROVER: 'addApprover',
    BYPASS_APPROVER: 'bypassApprover',
};
function ReportChangeApproverPage({ report, policy, isLoadingReportData }) {
    const reportID = report?.reportID;
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const currentUserDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [selectedApproverType, setSelectedApproverType] = (0, react_1.useState)();
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const changeApprover = (0, react_1.useCallback)(() => {
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
    const sections = (0, react_1.useMemo)(() => {
        const data = [
            {
                text: translate('iou.changeApprover.actions.addApprover'),
                keyForList: APPROVER_TYPE.ADD_APPROVER,
                alternateText: translate('iou.changeApprover.actions.addApproverSubtitle'),
                isSelected: selectedApproverType === APPROVER_TYPE.ADD_APPROVER,
            },
        ];
        // Only show the bypass option if current approver is not a policy admin and prevent self-approval is not enabled
        if (!(0, PolicyUtils_1.isMemberPolicyAdmin)(policy, (0, PersonalDetailsUtils_1.getLoginByAccountID)(report.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID)) && (0, ReportUtils_1.isAllowedToApproveExpenseReport)(report, currentUserDetails.accountID, policy)) {
            data.push({
                text: translate('iou.changeApprover.actions.bypassApprovers'),
                keyForList: APPROVER_TYPE.BYPASS_APPROVER,
                alternateText: translate('iou.changeApprover.actions.bypassApproversSubtitle'),
                isSelected: selectedApproverType === APPROVER_TYPE.BYPASS_APPROVER,
            });
        }
        return [{ data }];
    }, [translate, selectedApproverType, policy, report, currentUserDetails.accountID]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundView = ((0, EmptyObject_1.isEmptyObject)(policy) && !isLoadingReportData) || !(0, PolicyUtils_1.isPolicyAdmin)(policy) || !(0, ReportUtils_1.isMoneyRequestReport)(report) || (0, ReportUtils_1.isMoneyRequestReportPendingDeletion)(report);
    if (shouldShowNotFoundView) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ReportChangeApproverPage.displayName} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('iou.changeApprover.title')} onBackButtonPress={Navigation_1.default.goBack}/>
            <SelectionList_1.default ListItem={RadioListItem_1.default} sections={sections} isAlternateTextMultilineSupported onSelectRow={(option) => {
            if (!option.keyForList) {
                return;
            }
            setSelectedApproverType(option.keyForList);
            setHasError(false);
        }} showConfirmButton confirmButtonText={translate('iou.changeApprover.title')} onConfirm={changeApprover} customListHeader={<>
                        <Text_1.default style={[styles.ph5, styles.mb5]}>{translate('iou.changeApprover.subtitle')}</Text_1.default>
                        <react_native_1.View style={[styles.ph5, styles.mb5, styles.renderHTML, styles.flexRow]}>
                            <RenderHTML_1.default html={translate('iou.changeApprover.description', { workflowSettingLink: `${environmentURL}/${ROUTES_1.default.WORKSPACE_WORKFLOWS.getRoute(policy?.id)}` })}/>
                        </react_native_1.View>
                    </>}>
                {hasError && (<FormHelpMessage_1.default isError style={[styles.ph5, styles.mb3]} message={translate('common.error.pleaseSelectOne')}/>)}
            </SelectionList_1.default>
        </ScreenWrapper_1.default>);
}
ReportChangeApproverPage.displayName = 'ReportChangeApproverPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportChangeApproverPage);
