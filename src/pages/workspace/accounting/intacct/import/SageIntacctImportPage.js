"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function getDisplayTypeTranslationKey(displayType) {
    switch (displayType) {
        case CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT: {
            return 'workspace.intacct.employeeDefault';
        }
        case CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG: {
            return 'workspace.accounting.importTypes.TAG';
        }
        case CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.REPORT_FIELD: {
            return 'workspace.accounting.importTypes.REPORT_FIELD';
        }
        default: {
            return 'workspace.accounting.notImported';
        }
    }
}
const checkForUserDimensionWithError = (config) => config?.mappings?.dimensions?.some((dimension) => !!config?.errorFields?.[`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${dimension.dimension}`]);
const checkForUserDimensionWithPendingAction = (config) => config?.mappings?.dimensions?.some((dimension) => !!config?.pendingFields?.[`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${dimension.dimension}`]);
function SageIntacctImportPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const sageIntacctConfig = policy?.connections?.intacct?.config;
    const sageIntacctData = policy?.connections?.intacct?.data;
    const mappingItems = (0, react_1.useMemo)(() => Object.values(CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS).map((mapping) => {
        const menuItemTitleKey = getDisplayTypeTranslationKey(sageIntacctConfig?.mappings?.[mapping]);
        return {
            description: expensify_common_1.Str.recapitalize(translate('workspace.intacct.mappingTitle', { mappingName: mapping })),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_TOGGLE_MAPPINGS.getRoute(policyID, mapping)),
            title: menuItemTitleKey ? translate(menuItemTitleKey) : undefined,
            subscribedSettings: [mapping],
        };
    }), [policyID, sageIntacctConfig?.mappings, translate]);
    const isExpenseType = sageIntacctConfig?.export.reimbursable === CONST_1.default.SAGE_INTACCT_REIMBURSABLE_EXPENSE_TYPE.EXPENSE_REPORT;
    return (<ConnectionLayout_1.default displayName={SageIntacctImportPage.displayName} headerTitle="workspace.accounting.import" headerSubtitle={(0, PolicyUtils_1.getCurrentSageIntacctEntityName)(policy, translate('workspace.common.topLevel'))} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT}>
            <ToggleSettingsOptionRow_1.default title={translate(isExpenseType ? 'workspace.intacct.expenseTypes' : 'workspace.accounting.accounts')} subtitle={translate(isExpenseType ? 'workspace.intacct.expenseTypesDescription' : 'workspace.intacct.accountTypesDescription')} switchAccessibilityLabel={translate(isExpenseType ? 'workspace.intacct.expenseTypesDescription' : 'workspace.intacct.accountTypesDescription')} shouldPlaceSubtitleBelowSwitch wrapperStyle={[styles.mv3, styles.mh5]} isActive onToggle={() => { }} disabled/>
            <ToggleSettingsOptionRow_1.default title={translate('common.billable')} switchAccessibilityLabel={translate('common.billable')} shouldPlaceSubtitleBelowSwitch wrapperStyle={[styles.mv3, styles.mh5]} isActive={sageIntacctConfig?.mappings?.syncItems ?? false} onToggle={() => (0, SageIntacct_1.updateSageIntacctBillable)(policyID, !sageIntacctConfig?.mappings?.syncItems)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_ITEMS], sageIntacctConfig?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(sageIntacctConfig ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_ITEMS)} onCloseError={() => (0, SageIntacct_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_ITEMS)}/>

            {mappingItems.map((section) => (<OfflineWithFeedback_1.default key={section.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(section.subscribedSettings, sageIntacctConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} shouldShowRightIcon onPress={section.action} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(section.subscribedSettings, sageIntacctConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>))}

            {!!sageIntacctData?.taxSolutionIDs && sageIntacctData?.taxSolutionIDs?.length > 0 && (<OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.TAX, CONST_1.default.SAGE_INTACCT_CONFIG.TAX_SOLUTION_ID], sageIntacctConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={sageIntacctConfig?.tax?.syncTax ? sageIntacctConfig?.tax?.taxSolutionID || sageIntacctData?.taxSolutionIDs?.at(0) : translate('workspace.accounting.notImported')} description={translate('common.tax')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT_TAX.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.SAGE_INTACCT_CONFIG.TAX, CONST_1.default.SAGE_INTACCT_CONFIG.TAX_SOLUTION_ID], sageIntacctConfig?.errorFields)
                ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                : undefined}/>
                </OfflineWithFeedback_1.default>)}

            <OfflineWithFeedback_1.default pendingAction={checkForUserDimensionWithPendingAction(sageIntacctConfig) ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : undefined}>
                <MenuItemWithTopDescription_1.default title={sageIntacctConfig?.mappings?.dimensions && sageIntacctConfig?.mappings?.dimensions?.length > 0
            ? translate('workspace.intacct.userDimensionsAdded', { count: sageIntacctConfig?.mappings?.dimensions?.length })
            : undefined} description={translate('workspace.intacct.userDefinedDimensions')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_USER_DIMENSIONS.getRoute(policyID))} brickRoadIndicator={checkForUserDimensionWithError(sageIntacctConfig) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
            </OfflineWithFeedback_1.default>
        </ConnectionLayout_1.default>);
}
SageIntacctImportPage.displayName = 'SageIntacctImportPage';
exports.default = (0, withPolicy_1.default)(SageIntacctImportPage);
