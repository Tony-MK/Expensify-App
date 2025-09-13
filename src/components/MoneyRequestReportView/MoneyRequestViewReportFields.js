"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ReportFieldView(reportField, report, styles, pendingAction) {
    return (<OfflineWithFeedback_1.default 
    // Need to return undefined when we have pendingAction to avoid the duplicate pending action
    pendingAction={pendingAction ? undefined : report?.pendingFields?.[reportField.fieldKey]} errorRowStyles={styles.ph5} key={`menuItem-${reportField.fieldKey}`} onClose={() => (0, Report_1.clearReportFieldKeyErrors)(report?.reportID, reportField.fieldKey)}>
            <MenuItemWithTopDescription_1.default description={expensify_common_1.Str.UCFirst(reportField.name)} title={reportField.fieldValue} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.EDIT_REPORT_FIELD_REQUEST.getRoute(report?.reportID, report?.policyID, reportField.fieldID, Navigation_1.default.getActiveRoute()));
        }} shouldShowRightIcon={!reportField.isFieldDisabled} wrapperStyle={[styles.pv2, styles.taskDescriptionMenuItem]} shouldGreyOutWhenDisabled={false} numberOfLinesTitle={0} interactive={!reportField.isFieldDisabled} shouldStackHorizontally={false} onSecondaryInteraction={() => { }} titleWithTooltips={[]} brickRoadIndicator={reportField.violation ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={reportField.violationTranslation}/>
        </OfflineWithFeedback_1.default>);
}
function MoneyRequestViewReportFields({ report, policy, isCombinedReport = false, pendingAction }) {
    const styles = (0, useThemeStyles_1.default)();
    const [violations] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_VIOLATIONS}${report?.reportID}`, { canBeMissing: true });
    const shouldHideSingleReportField = (reportField) => {
        const fieldValue = reportField.value ?? reportField.defaultValue;
        const hasEnableOption = reportField.type !== CONST_1.default.REPORT_FIELD_TYPES.LIST || reportField.disabledOptions.some((option) => !option);
        return (0, ReportUtils_1.isReportFieldOfTypeTitle)(reportField) || (!fieldValue && !hasEnableOption);
    };
    const sortedPolicyReportFields = (0, react_1.useMemo)(() => {
        const fields = (0, ReportUtils_1.getAvailableReportFields)(report, Object.values(policy?.fieldList ?? {}));
        return fields
            .filter((field) => field.target === report?.type)
            .filter((reportField) => !shouldHideSingleReportField(reportField))
            .sort(({ orderWeight: firstOrderWeight }, { orderWeight: secondOrderWeight }) => firstOrderWeight - secondOrderWeight)
            .map((field) => {
            const fieldValue = field.value ?? field.defaultValue;
            const isFieldDisabled = (0, ReportUtils_1.isReportFieldDisabled)(report, field, policy);
            const fieldKey = (0, ReportUtils_1.getReportFieldKey)(field.fieldID);
            const violation = (0, ReportUtils_1.getFieldViolation)(violations, field);
            const violationTranslation = (0, ReportUtils_1.getFieldViolationTranslation)(field, violation);
            return {
                ...field,
                fieldValue,
                isFieldDisabled,
                fieldKey,
                violation,
                violationTranslation,
            };
        });
    }, [policy, report, violations]);
    const enabledReportFields = sortedPolicyReportFields.filter((reportField) => !(0, ReportUtils_1.isReportFieldDisabled)(report, reportField, policy));
    const isOnlyTitleFieldEnabled = enabledReportFields.length === 1 && (0, ReportUtils_1.isReportFieldOfTypeTitle)(enabledReportFields.at(0));
    const isPaidGroupPolicyExpenseReport = (0, ReportUtils_1.isPaidGroupPolicyExpenseReport)(report);
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    const shouldDisplayReportFields = (isPaidGroupPolicyExpenseReport || isInvoiceReport) && policy?.areReportFieldsEnabled && (!isOnlyTitleFieldEnabled || !isCombinedReport);
    return (shouldDisplayReportFields &&
        sortedPolicyReportFields.map((reportField) => {
            return ReportFieldView(reportField, report, styles, pendingAction);
        }));
}
MoneyRequestViewReportFields.displayName = 'MoneyRequestViewReportFields';
exports.default = MoneyRequestViewReportFields;
