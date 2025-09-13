"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const SpacerView_1 = require("@components/SpacerView");
const Text_1 = require("@components/Text");
const UnreadActionIndicator_1 = require("@components/UnreadActionIndicator");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const AnimatedEmptyStateBackground_1 = require("@pages/home/report/AnimatedEmptyStateBackground");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const Report_1 = require("@src/libs/actions/Report");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function MoneyReportView({ report, policy, isCombinedReport = false, shouldShowTotal = true, shouldHideThreadDividerLine, pendingAction }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const isSettled = (0, ReportUtils_1.isSettled)(report?.reportID);
    const isTotalUpdated = (0, ReportUtils_1.hasUpdatedTotal)(report, policy);
    const { totalDisplaySpend, nonReimbursableSpend, reimbursableSpend } = (0, ReportUtils_1.getMoneyRequestSpendBreakdown)(report);
    const shouldShowBreakdown = nonReimbursableSpend && reimbursableSpend && shouldShowTotal;
    const formattedTotalAmount = (0, CurrencyUtils_1.convertToDisplayString)(totalDisplaySpend, report?.currency);
    const formattedOutOfPocketAmount = (0, CurrencyUtils_1.convertToDisplayString)(reimbursableSpend, report?.currency);
    const formattedCompanySpendAmount = (0, CurrencyUtils_1.convertToDisplayString)(nonReimbursableSpend, report?.currency);
    const isPartiallyPaid = !!report?.pendingFields?.partial;
    const subAmountTextStyles = [
        styles.taskTitleMenuItem,
        styles.alignSelfCenter,
        StyleUtils.getFontSizeStyle(variables_1.default.fontSizeH1),
        StyleUtils.getColorStyle(theme.textSupporting),
    ];
    const [violations] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_VIOLATIONS}${report?.reportID}`, { canBeMissing: true });
    const sortedPolicyReportFields = (0, react_1.useMemo)(() => {
        const fields = (0, ReportUtils_1.getAvailableReportFields)(report, Object.values(policy?.fieldList ?? {}));
        return fields.filter((field) => field.target === report?.type).sort(({ orderWeight: firstOrderWeight }, { orderWeight: secondOrderWeight }) => firstOrderWeight - secondOrderWeight);
    }, [policy, report]);
    const enabledReportFields = sortedPolicyReportFields.filter((reportField) => !(0, ReportUtils_1.isReportFieldDisabled)(report, reportField, policy));
    const isOnlyTitleFieldEnabled = enabledReportFields.length === 1 && (0, ReportUtils_1.isReportFieldOfTypeTitle)(enabledReportFields.at(0));
    const isClosedExpenseReportWithNoExpenses = (0, ReportUtils_1.isClosedExpenseReportWithNoExpenses)(report);
    const isPaidGroupPolicyExpenseReport = (0, ReportUtils_1.isPaidGroupPolicyExpenseReport)(report);
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    const shouldHideSingleReportField = (reportField) => {
        const fieldValue = reportField.value ?? reportField.defaultValue;
        const hasEnableOption = reportField.type !== CONST_1.default.REPORT_FIELD_TYPES.LIST || reportField.disabledOptions.some((option) => !option);
        return (0, ReportUtils_1.isReportFieldOfTypeTitle)(reportField) || (!fieldValue && !hasEnableOption);
    };
    const shouldShowReportField = !isClosedExpenseReportWithNoExpenses &&
        (isPaidGroupPolicyExpenseReport || isInvoiceReport) &&
        (!isCombinedReport || !isOnlyTitleFieldEnabled) &&
        !sortedPolicyReportFields.every(shouldHideSingleReportField);
    const renderThreadDivider = (0, react_1.useMemo)(() => shouldHideThreadDividerLine ? (<UnreadActionIndicator_1.default reportActionID={report?.reportID} shouldHideThreadDividerLine={shouldHideThreadDividerLine}/>) : (<SpacerView_1.default shouldShow style={styles.reportHorizontalRule}/>), [shouldHideThreadDividerLine, report?.reportID, styles.reportHorizontalRule]);
    return (<>
            <react_native_1.View style={[styles.pRelative]}>
                <AnimatedEmptyStateBackground_1.default />
                {!isClosedExpenseReportWithNoExpenses && (<>
                        {(isPaidGroupPolicyExpenseReport || isInvoiceReport) &&
                policy?.areReportFieldsEnabled &&
                (!isCombinedReport || !isOnlyTitleFieldEnabled) &&
                sortedPolicyReportFields.map((reportField) => {
                    if (shouldHideSingleReportField(reportField)) {
                        return null;
                    }
                    const fieldValue = reportField.value ?? reportField.defaultValue;
                    const isFieldDisabled = (0, ReportUtils_1.isReportFieldDisabled)(report, reportField, policy);
                    const fieldKey = (0, ReportUtils_1.getReportFieldKey)(reportField.fieldID);
                    const violation = (0, ReportUtils_1.getFieldViolation)(violations, reportField);
                    const violationTranslation = (0, ReportUtils_1.getFieldViolationTranslation)(reportField, violation);
                    return (<OfflineWithFeedback_1.default 
                    // Need to return undefined when we have pendingAction to avoid the duplicate pending action
                    pendingAction={pendingAction ? undefined : report?.pendingFields?.[fieldKey]} errors={report?.errorFields?.[fieldKey]} errorRowStyles={styles.ph5} key={`menuItem-${fieldKey}`} onClose={() => (0, Report_1.clearReportFieldKeyErrors)(report?.reportID, fieldKey)}>
                                        <MenuItemWithTopDescription_1.default description={expensify_common_1.Str.UCFirst(reportField.name)} title={fieldValue} onPress={() => {
                            Navigation_1.default.navigate(ROUTES_1.default.EDIT_REPORT_FIELD_REQUEST.getRoute(report?.reportID, report?.policyID, reportField.fieldID, Navigation_1.default.getReportRHPActiveRoute()));
                        }} shouldShowRightIcon={!isFieldDisabled} wrapperStyle={[styles.pv2, styles.taskDescriptionMenuItem]} shouldGreyOutWhenDisabled={false} numberOfLinesTitle={0} interactive={!isFieldDisabled} shouldStackHorizontally={false} onSecondaryInteraction={() => { }} titleWithTooltips={[]} brickRoadIndicator={violation ? 'error' : undefined} errorText={violationTranslation}/>
                                    </OfflineWithFeedback_1.default>);
                })}
                        {shouldShowTotal && (<react_native_1.View style={[styles.flexRow, styles.pointerEventsNone, styles.containerWithSpaceBetween, styles.ph5, styles.pv2]}>
                                <react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
                                    <Text_1.default style={[styles.textLabelSupporting]} numberOfLines={1}>
                                        {translate('common.total')}
                                    </Text_1.default>
                                </react_native_1.View>
                                <react_native_1.View style={[styles.flexRow, styles.justifyContentCenter]}>
                                    {isSettled && !isPartiallyPaid && (<react_native_1.View style={[styles.defaultCheckmarkWrapper, styles.mh2]}>
                                            <Icon_1.default src={Expensicons.Checkmark} fill={theme.success}/>
                                        </react_native_1.View>)}
                                    {!isTotalUpdated && !isOffline ? (<react_native_1.ActivityIndicator size="small" style={[styles.moneyRequestLoadingHeight]} color={theme.textSupporting}/>) : (<Text_1.default numberOfLines={1} style={[styles.taskTitleMenuItem, styles.alignSelfCenter, !isTotalUpdated && styles.offlineFeedback.pending]}>
                                            {formattedTotalAmount}
                                        </Text_1.default>)}
                                </react_native_1.View>
                            </react_native_1.View>)}

                        {!!shouldShowBreakdown && (<>
                                <react_native_1.View style={[styles.flexRow, styles.pointerEventsNone, styles.containerWithSpaceBetween, styles.ph5, styles.pv1]}>
                                    <react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
                                        <Text_1.default style={[styles.textLabelSupporting]} numberOfLines={1}>
                                            {translate('cardTransactions.outOfPocket')}
                                        </Text_1.default>
                                    </react_native_1.View>
                                    <react_native_1.View style={[styles.flexRow, styles.justifyContentCenter]}>
                                        <Text_1.default numberOfLines={1} style={subAmountTextStyles}>
                                            {formattedOutOfPocketAmount}
                                        </Text_1.default>
                                    </react_native_1.View>
                                </react_native_1.View>
                                <react_native_1.View style={[styles.flexRow, styles.pointerEventsNone, styles.containerWithSpaceBetween, styles.ph5, styles.pv1]}>
                                    <react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
                                        <Text_1.default style={[styles.textLabelSupporting]} numberOfLines={1}>
                                            {translate('cardTransactions.companySpend')}
                                        </Text_1.default>
                                    </react_native_1.View>
                                    <react_native_1.View style={[styles.flexRow, styles.justifyContentCenter]}>
                                        <Text_1.default numberOfLines={1} style={subAmountTextStyles}>
                                            {formattedCompanySpendAmount}
                                        </Text_1.default>
                                    </react_native_1.View>
                                </react_native_1.View>
                            </>)}
                    </>)}
            </react_native_1.View>
            {(shouldShowReportField || shouldShowBreakdown || shouldShowTotal) && renderThreadDivider}
        </>);
}
MoneyReportView.displayName = 'MoneyReportView';
exports.default = MoneyReportView;
