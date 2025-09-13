"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Text_1 = require("@components/Text");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctImportTaxPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policy = (0, usePolicy_1.default)(route.params.policyID);
    const policyID = policy?.id;
    const sageIntacctConfig = policy?.connections?.intacct?.config;
    const sageIntacctData = policy?.connections?.intacct?.data;
    const isImportTaxEnabled = sageIntacctConfig?.tax?.syncTax ?? false;
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(isImportTaxEnabled);
    return (<ConnectionLayout_1.default displayName={SageIntacctImportTaxPage.displayName} headerTitleAlreadyTranslated={translate('common.tax')} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT.getRoute(policyID))}>
            <Text_1.default style={[styles.flexRow, styles.alignItemsCenter, styles.w100, styles.mb5, styles.ph5]}>
                <Text_1.default style={[styles.textNormal]}>{translate('workspace.intacct.importTaxDescription')}</Text_1.default>
            </Text_1.default>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.intacct.importTaxDescription')} shouldPlaceSubtitleBelowSwitch wrapperStyle={[styles.mv3, styles.mh5]} isActive={sageIntacctConfig?.tax?.syncTax ?? false} onToggle={() => (0, SageIntacct_1.updateSageIntacctSyncTaxConfiguration)(policyID, !sageIntacctConfig?.tax?.syncTax)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.TAX, CONST_1.default.SAGE_INTACCT_CONFIG.TAX_SOLUTION_ID], sageIntacctConfig?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(sageIntacctConfig ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.TAX)} onCloseError={() => (0, SageIntacct_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.TAX)}/>
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.TAX, CONST_1.default.SAGE_INTACCT_CONFIG.TAX_SOLUTION_ID], sageIntacctConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={sageIntacctConfig?.tax?.taxSolutionID ?? sageIntacctData?.taxSolutionIDs?.at(0)} description={translate('workspace.sageIntacct.taxSolution')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT_TAX_MAPPING.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.SAGE_INTACCT_CONFIG.TAX_SOLUTION_ID], sageIntacctConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
SageIntacctImportTaxPage.displayName = 'SageIntacctImportTaxPage';
exports.default = SageIntacctImportTaxPage;
