"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const SageIntacct_1 = require("@userActions/connections/SageIntacct");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function getReimbursedAccountName(bankAccounts, reimbursementAccountID) {
    return bankAccounts.find((bankAccount) => bankAccount.id === reimbursementAccountID)?.name ?? reimbursementAccountID;
}
function SageIntacctAdvancedPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const { importEmployees, sync, pendingFields, errorFields } = policy?.connections?.intacct?.config ?? {};
    const { data, config } = policy?.connections?.intacct ?? {};
    const accountingMethod = config?.export?.accountingMethod ?? expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(!!sync?.syncReimbursedReports);
    const toggleSections = (0, react_1.useMemo)(() => [
        {
            label: translate('workspace.sageIntacct.inviteEmployees'),
            description: translate('workspace.sageIntacct.inviteEmployeesDescription'),
            isActive: !!importEmployees,
            onToggle: (enabled) => {
                if (!policyID) {
                    return;
                }
                (0, SageIntacct_1.updateSageIntacctImportEmployees)(policyID, enabled);
                (0, SageIntacct_1.updateSageIntacctApprovalMode)(policyID, enabled);
            },
            subscribedSettings: [CONST_1.default.SAGE_INTACCT_CONFIG.IMPORT_EMPLOYEES, CONST_1.default.SAGE_INTACCT_CONFIG.APPROVAL_MODE],
            error: (0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.IMPORT_EMPLOYEES) ?? (0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.APPROVAL_MODE),
            onCloseError: () => {
                (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.IMPORT_EMPLOYEES);
                (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.APPROVAL_MODE);
            },
        },
        {
            label: translate('workspace.sageIntacct.syncReimbursedReports'),
            description: translate('workspace.sageIntacct.syncReimbursedReportsDescription'),
            isActive: !!sync?.syncReimbursedReports,
            onToggle: (enabled) => {
                if (!policyID) {
                    return;
                }
                (0, SageIntacct_1.updateSageIntacctSyncReimbursedReports)(policyID, enabled);
                if (enabled && !sync?.reimbursementAccountID) {
                    const reimbursementAccountID = data?.bankAccounts[0]?.id;
                    (0, SageIntacct_1.updateSageIntacctSyncReimbursementAccountID)(policyID, reimbursementAccountID);
                }
            },
            subscribedSettings: [CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_REIMBURSED_REPORTS],
            error: (0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_REIMBURSED_REPORTS),
            onCloseError: () => {
                (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_REIMBURSED_REPORTS);
            },
        },
    ], [translate, config, importEmployees, sync?.syncReimbursedReports, sync?.reimbursementAccountID, policyID, data?.bankAccounts]);
    return (<ConnectionLayout_1.default displayName={SageIntacctAdvancedPage.displayName} headerTitle="workspace.accounting.advanced" headerSubtitle={(0, PolicyUtils_1.getCurrentSageIntacctEntityName)(policy, translate('workspace.common.topLevel'))} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID))}>
            <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED, CONST_1.default.SAGE_INTACCT_CONFIG.ACCOUNTING_METHOD], config?.pendingFields)}>
                <MenuItemWithTopDescription_1.default title={config?.autoSync?.enabled ? translate('common.enabled') : translate('common.disabled')} description={translate('workspace.accounting.autoSync')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_AUTO_SYNC.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC, CONST_1.default.SAGE_INTACCT_CONFIG.ACCOUNTING_METHOD], config?.errorFields)
            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
            : undefined} hintText={(() => {
            if (!config?.autoSync?.enabled) {
                return undefined;
            }
            return translate(`workspace.sageIntacct.accountingMethods.alternateText.${accountingMethod}`);
        })()}/>
            </OfflineWithFeedback_1.default>

            {toggleSections.map((section) => (<ToggleSettingsOptionRow_1.default key={section.label} title={section.label} subtitle={section.description} shouldPlaceSubtitleBelowSwitch switchAccessibilityLabel={section.label} isActive={section.isActive} onToggle={section.onToggle} wrapperStyle={[styles.ph5, styles.pv3]} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(section.subscribedSettings, pendingFields)} errors={section.error} onCloseError={section.onCloseError}/>))}

            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <OfflineWithFeedback_1.default key={translate('workspace.sageIntacct.paymentAccount')} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSEMENT_ACCOUNT_ID], pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={getReimbursedAccountName(data?.bankAccounts ?? [], sync?.reimbursementAccountID)} description={translate('workspace.sageIntacct.paymentAccount')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_PAYMENT_ACCOUNT.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSEMENT_ACCOUNT_ID], errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
SageIntacctAdvancedPage.displayName = 'SageIntacctAdvancedPage';
exports.default = (0, withPolicy_1.default)(SageIntacctAdvancedPage);
