"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EditReportFieldDate_1 = require("./EditReportFieldDate");
const EditReportFieldDropdown_1 = require("./EditReportFieldDropdown");
const EditReportFieldText_1 = require("./EditReportFieldText");
function EditReportFieldPage({ route }) {
    const { backTo, reportID, policyID } = route.params;
    const fieldKey = (0, ReportUtils_1.getReportFieldKey)(route.params.fieldID);
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: false });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const reportField = report?.fieldList?.[fieldKey] ?? policy?.fieldList?.[fieldKey];
    const policyField = policy?.fieldList?.[fieldKey] ?? reportField;
    const isDisabled = (0, ReportUtils_1.isReportFieldDisabled)(report, reportField, policy);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const { translate } = (0, useLocalize_1.default)();
    const isReportFieldTitle = (0, ReportUtils_1.isReportFieldOfTypeTitle)(reportField);
    const reportFieldsEnabled = (((0, ReportUtils_1.isPaidGroupPolicyExpenseReport)(report) || (0, ReportUtils_1.isInvoiceReport)(report)) && !!policy?.areReportFieldsEnabled) || isReportFieldTitle;
    const hasOtherViolations = report?.fieldList && Object.entries(report.fieldList).some(([key, field]) => key !== fieldKey && field.value === '' && !(0, ReportUtils_1.isReportFieldDisabled)(report, reportField, policy));
    if (!reportFieldsEnabled || !reportField || !policyField || !report || isDisabled) {
        return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableMaxHeight testID={EditReportFieldPage.displayName}>
                <FullPageNotFoundView_1.default shouldShow/>
            </ScreenWrapper_1.default>);
    }
    const goBack = () => {
        if (isReportFieldTitle) {
            Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID, backTo));
            return;
        }
        Navigation_1.default.goBack(backTo);
    };
    const handleReportFieldChange = (form) => {
        const value = form[fieldKey];
        if (isReportFieldTitle) {
            (0, Report_1.updateReportName)(report.reportID, value, report.reportName ?? '');
            goBack();
        }
        else {
            if (value !== '') {
                (0, Report_1.updateReportField)({ ...report, reportID: report.reportID }, { ...reportField, value }, reportField, policy, hasOtherViolations);
            }
            goBack();
        }
    };
    const handleReportFieldDelete = () => {
        (0, Report_1.deleteReportField)(report.reportID, reportField);
        setIsDeleteModalVisible(false);
        goBack();
    };
    const fieldValue = isReportFieldTitle ? (report.reportName ?? '') : (reportField.value ?? reportField.defaultValue);
    const menuItems = [];
    const isReportFieldDeletable = reportField.deletable && reportField?.fieldID !== CONST_1.default.REPORT_FIELD_TITLE_FIELD_ID;
    if (isReportFieldDeletable) {
        menuItems.push({ icon: Expensicons.Trashcan, text: translate('common.delete'), onSelected: () => setIsDeleteModalVisible(true), shouldCallAfterModalHide: true });
    }
    const fieldName = expensify_common_1.Str.UCFirst(reportField.name);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={EditReportFieldPage.displayName}>
            <HeaderWithBackButton_1.default title={fieldName} threeDotsMenuItems={menuItems} shouldShowThreeDotsButton={!!menuItems?.length} onBackButtonPress={goBack}/>

            <ConfirmModal_1.default title={translate('workspace.reportFields.delete')} isVisible={isDeleteModalVisible} onConfirm={handleReportFieldDelete} onCancel={() => setIsDeleteModalVisible(false)} prompt={translate('workspace.reportFields.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>

            {(reportField.type === 'text' || isReportFieldTitle) && (<EditReportFieldText_1.default fieldName={expensify_common_1.Str.UCFirst(reportField.name)} fieldKey={fieldKey} fieldValue={fieldValue} isRequired={!isReportFieldDeletable} onSubmit={handleReportFieldChange}/>)}

            {reportField.type === 'date' && (<EditReportFieldDate_1.default fieldName={expensify_common_1.Str.UCFirst(reportField.name)} fieldKey={fieldKey} fieldValue={fieldValue} isRequired={!reportField.deletable} onSubmit={handleReportFieldChange}/>)}

            {reportField.type === 'dropdown' && (<EditReportFieldDropdown_1.default fieldKey={fieldKey} fieldValue={fieldValue} fieldOptions={policyField.values.filter((_value, index) => !policyField.disabledOptions.at(index))} onSubmit={handleReportFieldChange}/>)}
        </ScreenWrapper_1.default>);
}
EditReportFieldPage.displayName = 'EditReportFieldPage';
exports.default = EditReportFieldPage;
