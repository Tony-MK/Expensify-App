"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Section_1 = require("@components/Section");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function ExpenseReportRulesSection({ policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const { environmentURL } = (0, useEnvironment_1.default)();
    const workflowApprovalsUnavailable = (0, PolicyUtils_1.getWorkflowApprovalsUnavailable)(policy);
    const autoPayApprovedReportsUnavailable = !policy?.areWorkflowsEnabled || policy?.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES || !(0, PolicyUtils_1.hasVBBA)(policyID);
    const renderFallbackSubtitle = ({ featureName, variant = 'unlock' }) => {
        const moreFeaturesLink = `${environmentURL}/${ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)}`;
        if (variant === 'unlock') {
            return translate('workspace.rules.expenseReportRules.unlockFeatureEnableWorkflowsSubtitle', { featureName, moreFeaturesLink });
        }
        return translate('workspace.rules.expenseReportRules.enableFeatureSubtitle', { featureName, moreFeaturesLink });
    };
    const optionItems = [
        {
            title: translate('workspace.rules.expenseReportRules.preventSelfApprovalsTitle'),
            subtitle: workflowApprovalsUnavailable
                ? renderFallbackSubtitle({ featureName: translate('common.approvals').toLowerCase() })
                : translate('workspace.rules.expenseReportRules.preventSelfApprovalsSubtitle'),
            shouldParseSubtitle: workflowApprovalsUnavailable,
            switchAccessibilityLabel: translate('workspace.rules.expenseReportRules.preventSelfApprovalsTitle'),
            isActive: policy?.preventSelfApproval && !workflowApprovalsUnavailable,
            disabled: workflowApprovalsUnavailable,
            showLockIcon: workflowApprovalsUnavailable,
            pendingAction: policy?.pendingFields?.preventSelfApproval,
            onToggle: (isEnabled) => (0, Policy_1.setPolicyPreventSelfApproval)(policyID, isEnabled),
        },
        {
            title: translate('workspace.rules.expenseReportRules.autoApproveCompliantReportsTitle'),
            subtitle: workflowApprovalsUnavailable
                ? renderFallbackSubtitle({ featureName: translate('common.approvals').toLowerCase() })
                : translate('workspace.rules.expenseReportRules.autoApproveCompliantReportsSubtitle'),
            shouldParseSubtitle: workflowApprovalsUnavailable,
            switchAccessibilityLabel: translate('workspace.rules.expenseReportRules.autoApproveCompliantReportsTitle'),
            isActive: policy?.shouldShowAutoApprovalOptions && !workflowApprovalsUnavailable,
            disabled: workflowApprovalsUnavailable,
            showLockIcon: workflowApprovalsUnavailable,
            pendingAction: policy?.pendingFields?.shouldShowAutoApprovalOptions,
            onToggle: (isEnabled) => {
                (0, Policy_1.enableAutoApprovalOptions)(policyID, isEnabled);
            },
            subMenuItems: [
                <OfflineWithFeedback_1.default pendingAction={!policy?.pendingFields?.shouldShowAutoApprovalOptions && policy?.autoApproval?.pendingFields?.limit ? policy?.autoApproval?.pendingFields?.limit : null} key="autoApproveReportsUnder">
                    <MenuItemWithTopDescription_1.default description={translate('workspace.rules.expenseReportRules.autoApproveReportsUnderTitle')} title={(0, CurrencyUtils_1.convertToDisplayString)(policy?.autoApproval?.limit ?? CONST_1.default.POLICY.AUTO_APPROVE_REPORTS_UNDER_DEFAULT_CENTS, policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD)} shouldShowRightIcon style={[styles.sectionMenuItemTopDescription, styles.mt6, styles.mbn3]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.RULES_AUTO_APPROVE_REPORTS_UNDER.getRoute(policyID))}/>
                </OfflineWithFeedback_1.default>,
                <OfflineWithFeedback_1.default pendingAction={!policy?.pendingFields?.shouldShowAutoApprovalOptions && policy?.autoApproval?.pendingFields?.auditRate ? policy?.autoApproval?.pendingFields?.auditRate : null} key="randomReportAuditTitle">
                    <MenuItemWithTopDescription_1.default description={translate('workspace.rules.expenseReportRules.randomReportAuditTitle')} title={`${Math.round((policy?.autoApproval?.auditRate ?? CONST_1.default.POLICY.RANDOM_AUDIT_DEFAULT_PERCENTAGE) * 100)}%`} shouldShowRightIcon style={[styles.sectionMenuItemTopDescription, styles.mt6, styles.mbn3]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.RULES_RANDOM_REPORT_AUDIT.getRoute(policyID))}/>
                </OfflineWithFeedback_1.default>,
            ],
        },
        {
            title: translate('workspace.rules.expenseReportRules.autoPayApprovedReportsTitle'),
            subtitle: autoPayApprovedReportsUnavailable
                ? renderFallbackSubtitle({ featureName: translate('common.payments').toLowerCase() })
                : translate('workspace.rules.expenseReportRules.autoPayApprovedReportsSubtitle'),
            shouldParseSubtitle: autoPayApprovedReportsUnavailable,
            switchAccessibilityLabel: translate('workspace.rules.expenseReportRules.autoPayApprovedReportsTitle'),
            onToggle: (isEnabled) => {
                (0, Policy_1.enablePolicyAutoReimbursementLimit)(policyID, isEnabled);
            },
            disabled: autoPayApprovedReportsUnavailable,
            showLockIcon: autoPayApprovedReportsUnavailable,
            isActive: policy?.shouldShowAutoReimbursementLimitOption && !autoPayApprovedReportsUnavailable,
            pendingAction: policy?.pendingFields?.shouldShowAutoReimbursementLimitOption,
            subMenuItems: [
                <OfflineWithFeedback_1.default pendingAction={!policy?.pendingFields?.shouldShowAutoReimbursementLimitOption && policy?.autoReimbursement?.pendingFields?.limit
                        ? policy?.autoReimbursement?.pendingFields?.limit
                        : null} key="autoPayReportsUnder">
                    <MenuItemWithTopDescription_1.default description={translate('workspace.rules.expenseReportRules.autoPayReportsUnderTitle')} title={(0, CurrencyUtils_1.convertToDisplayString)(policy?.autoReimbursement?.limit ?? CONST_1.default.POLICY.AUTO_REIMBURSEMENT_LIMIT_DEFAULT_CENTS, policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD)} shouldShowRightIcon style={[styles.sectionMenuItemTopDescription, styles.mt6, styles.mbn3]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.RULES_AUTO_PAY_REPORTS_UNDER.getRoute(policyID))}/>
                </OfflineWithFeedback_1.default>,
            ],
        },
    ];
    return (<Section_1.default isCentralPane title={translate('workspace.rules.expenseReportRules.title')} subtitle={translate('workspace.rules.expenseReportRules.subtitle')} titleStyles={styles.accountSettingsSectionTitle} subtitleMuted>
            {optionItems.map(({ title, subtitle, shouldParseSubtitle, isActive, subMenuItems, showLockIcon, disabled, onToggle, pendingAction }, index) => {
            const showBorderBottom = index !== optionItems.length - 1;
            return (<ToggleSettingsOptionRow_1.default key={title} title={title} subtitle={subtitle} switchAccessibilityLabel={title} wrapperStyle={[styles.pv6, showBorderBottom && styles.borderBottom]} shouldPlaceSubtitleBelowSwitch titleStyle={styles.pv2} subtitleStyle={styles.pt1} isActive={!!isActive} showLockIcon={showLockIcon} disabled={disabled} subMenuItems={subMenuItems} onToggle={onToggle} pendingAction={pendingAction} shouldParseSubtitle={shouldParseSubtitle}/>);
        })}
        </Section_1.default>);
}
exports.default = ExpenseReportRulesSection;
