"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldHideReimbursedReportsSection = void 0;
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const utils_1 = require("@pages/workspace/accounting/netsuite/utils");
Object.defineProperty(exports, "shouldHideReimbursedReportsSection", { enumerable: true, get: function () { return utils_1.shouldHideReimbursedReportsSection; } });
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteAdvancedPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? `${CONST_1.default.DEFAULT_NUMBER_ID}`;
    const config = policy?.connections?.netsuite?.options?.config;
    const autoSyncConfig = policy?.connections?.netsuite?.config;
    const accountingMethod = policy?.connections?.netsuite?.options?.config?.accountingMethod;
    const { payableList } = policy?.connections?.netsuite?.options?.data ?? {};
    const shouldShowCustomFormIDOptions = (0, react_native_reanimated_1.useSharedValue)(!(0, utils_1.shouldHideCustomFormIDOptions)(config));
    const shouldAnimateAccordionSection = (0, react_native_reanimated_1.useSharedValue)(false);
    const selectedReimbursementAccount = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedBankAccountWithDefaultSelect)((0, PolicyUtils_1.getFilteredReimbursableAccountOptions)(payableList), config?.reimbursementAccountID), [payableList, config?.reimbursementAccountID]);
    const selectedCollectionAccount = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedBankAccountWithDefaultSelect)((0, PolicyUtils_1.getFilteredCollectionAccountOptions)(payableList), config?.collectionAccount), [payableList, config?.collectionAccount]);
    const selectedApprovalAccount = (0, react_1.useMemo)(() => {
        if (config?.approvalAccount === CONST_1.default.NETSUITE_APPROVAL_ACCOUNT_DEFAULT) {
            return {
                id: CONST_1.default.NETSUITE_APPROVAL_ACCOUNT_DEFAULT,
                name: translate('workspace.netsuite.advancedConfig.defaultApprovalAccount'),
            };
        }
        return (0, PolicyUtils_1.findSelectedBankAccountWithDefaultSelect)((0, PolicyUtils_1.getFilteredApprovalAccountOptions)(payableList), config?.approvalAccount);
    }, [config?.approvalAccount, payableList, translate]);
    const renderDefaultMenuItem = (item) => {
        return (<OfflineWithFeedback_1.default key={item.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(item.subscribedSettings, config?.pendingFields) ?? (0, PolicyUtils_1.settingsPendingAction)(item.subscribedSettings, autoSyncConfig?.pendingFields)}>
                <MenuItemWithTopDescription_1.default title={item.title} description={item.description} shouldShowRightIcon onPress={item?.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(item.subscribedSettings, config?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} hintText={item.hintText}/>
            </OfflineWithFeedback_1.default>);
    };
    const menuItems = [
        {
            type: 'menuitem',
            title: autoSyncConfig?.autoSync?.enabled ? translate('common.enabled') : translate('common.disabled'),
            description: translate('workspace.accounting.autoSync'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_AUTO_SYNC.getRoute(policyID)),
            hintText: (() => {
                if (!autoSyncConfig?.autoSync?.enabled) {
                    return undefined;
                }
                return translate(`workspace.netsuite.advancedConfig.accountingMethods.alternateText.${accountingMethod ?? expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH}`);
            })(),
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.AUTO_SYNC, CONST_1.default.NETSUITE_CONFIG.ACCOUNTING_METHOD],
        },
        {
            type: 'divider',
            key: 'divider1',
        },
        {
            type: 'toggle',
            title: translate('workspace.accounting.reimbursedReports'),
            subtitle: translate('workspace.netsuite.advancedConfig.reimbursedReportsDescription'),
            isActive: !!config?.syncOptions.syncReimbursedReports,
            switchAccessibilityLabel: translate('workspace.netsuite.advancedConfig.reimbursedReportsDescription'),
            shouldPlaceSubtitleBelowSwitch: true,
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_REIMBURSED_REPORTS),
            onToggle: (isEnabled) => (0, NetSuiteCommands_1.updateNetSuiteSyncReimbursedReports)(policyID, isEnabled),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_REIMBURSED_REPORTS], config?.pendingFields),
            errors: (0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_REIMBURSED_REPORTS),
            shouldHide: (0, utils_1.shouldHideReimbursedReportsSection)(config),
        },
        {
            type: 'menuitem',
            description: translate('workspace.netsuite.advancedConfig.reimbursementsAccount'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_REIMBURSEMENT_ACCOUNT_SELECT.getRoute(policyID)),
            title: selectedReimbursementAccount ? selectedReimbursementAccount.name : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.REIMBURSEMENT_ACCOUNT_ID],
            shouldHide: (0, utils_1.shouldHideReimbursedReportsSection)(config),
        },
        {
            type: 'menuitem',
            description: translate('workspace.netsuite.advancedConfig.collectionsAccount'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_COLLECTION_ACCOUNT_SELECT.getRoute(policyID)),
            title: selectedCollectionAccount ? selectedCollectionAccount.name : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.COLLECTION_ACCOUNT],
            shouldHide: (0, utils_1.shouldHideReimbursedReportsSection)(config),
        },
        {
            type: 'divider',
            key: 'divider2',
            shouldHide: (0, utils_1.shouldHideReimbursedReportsSection)(config),
        },
        {
            type: 'toggle',
            title: translate('workspace.netsuite.advancedConfig.inviteEmployees'),
            subtitle: translate('workspace.netsuite.advancedConfig.inviteEmployeesDescription'),
            isActive: !!config?.syncOptions.syncPeople,
            switchAccessibilityLabel: translate('workspace.netsuite.advancedConfig.inviteEmployeesDescription'),
            shouldPlaceSubtitleBelowSwitch: true,
            shouldParseSubtitle: true,
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_PEOPLE),
            onToggle: (isEnabled) => (0, NetSuiteCommands_1.updateNetSuiteSyncPeople)(policyID, isEnabled),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_PEOPLE], config?.pendingFields),
            errors: (0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_PEOPLE),
        },
        {
            type: 'toggle',
            title: translate('workspace.netsuite.advancedConfig.autoCreateEntities'),
            isActive: !!config?.autoCreateEntities,
            switchAccessibilityLabel: translate('workspace.netsuite.advancedConfig.autoCreateEntities'),
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.AUTO_CREATE_ENTITIES),
            onToggle: (isEnabled) => (0, NetSuiteCommands_1.updateNetSuiteAutoCreateEntities)(policyID, isEnabled),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.AUTO_CREATE_ENTITIES], config?.pendingFields),
            errors: (0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.AUTO_CREATE_ENTITIES),
        },
        {
            type: 'divider',
            key: 'divider3',
        },
        {
            type: 'toggle',
            title: translate('workspace.netsuite.advancedConfig.enableCategories'),
            isActive: !!config?.syncOptions.enableNewCategories,
            switchAccessibilityLabel: translate('workspace.netsuite.advancedConfig.enableCategories'),
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.ENABLE_NEW_CATEGORIES),
            onToggle: (isEnabled) => (0, NetSuiteCommands_1.updateNetSuiteEnableNewCategories)(policyID, isEnabled),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.ENABLE_NEW_CATEGORIES], config?.pendingFields),
            errors: (0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.ENABLE_NEW_CATEGORIES),
        },
        {
            type: 'divider',
            key: 'divider4',
        },
        {
            type: 'menuitem',
            description: translate('workspace.netsuite.advancedConfig.exportReportsTo.label'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPENSE_REPORT_APPROVAL_LEVEL_SELECT.getRoute(policyID)),
            title: config?.syncOptions.exportReportsTo ? translate(`workspace.netsuite.advancedConfig.exportReportsTo.values.${config.syncOptions.exportReportsTo}`) : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_REPORTS_TO],
            shouldHide: (0, utils_1.shouldHideReportsExportTo)(config),
        },
        {
            type: 'menuitem',
            description: translate('workspace.netsuite.advancedConfig.exportVendorBillsTo.label'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_VENDOR_BILL_APPROVAL_LEVEL_SELECT.getRoute(policyID)),
            title: config?.syncOptions.exportVendorBillsTo ? translate(`workspace.netsuite.advancedConfig.exportVendorBillsTo.values.${config.syncOptions.exportVendorBillsTo}`) : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_VENDOR_BILLS_TO],
            shouldHide: (0, utils_1.shouldHideExportVendorBillsTo)(config),
        },
        {
            type: 'menuitem',
            description: translate('workspace.netsuite.advancedConfig.exportJournalsTo.label'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_JOURNAL_ENTRY_APPROVAL_LEVEL_SELECT.getRoute(policyID)),
            title: config?.syncOptions.exportJournalsTo ? translate(`workspace.netsuite.advancedConfig.exportJournalsTo.values.${config.syncOptions.exportJournalsTo}`) : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_JOURNALS_TO],
            shouldHide: (0, utils_1.shouldHideExportJournalsTo)(config),
        },
        {
            type: 'menuitem',
            description: translate('workspace.netsuite.advancedConfig.approvalAccount'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_APPROVAL_ACCOUNT_SELECT.getRoute(policyID)),
            title: selectedApprovalAccount ? selectedApprovalAccount.name : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.APPROVAL_ACCOUNT],
        },
        {
            type: 'divider',
            key: 'divider5',
        },
        {
            type: 'toggle',
            title: translate('workspace.netsuite.advancedConfig.customFormID'),
            subtitle: translate('workspace.netsuite.advancedConfig.customFormIDDescription'),
            isActive: !!config?.customFormIDOptions?.enabled,
            switchAccessibilityLabel: translate('workspace.netsuite.advancedConfig.customFormIDDescription'),
            shouldPlaceSubtitleBelowSwitch: true,
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_ENABLED),
            onToggle: (isEnabled) => {
                (0, NetSuiteCommands_1.updateNetSuiteCustomFormIDOptionsEnabled)(policyID, isEnabled);
                shouldShowCustomFormIDOptions.set(isEnabled);
                shouldAnimateAccordionSection.set(true);
            },
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_ENABLED], config?.pendingFields),
            errors: (0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_ENABLED),
        },
        {
            type: 'accordion',
            children: [
                {
                    type: 'menuitem',
                    description: translate('workspace.netsuite.advancedConfig.customFormIDReimbursable'),
                    onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_CUSTOM_FORM_ID.getRoute(policyID, CONST_1.default.NETSUITE_EXPENSE_TYPE.REIMBURSABLE)),
                    title: config?.customFormIDOptions?.reimbursable?.[CONST_1.default.NETSUITE_MAP_EXPORT_DESTINATION[config.reimbursableExpensesExportDestination]],
                    subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_TYPE.REIMBURSABLE],
                    shouldHide: (0, utils_1.shouldHideCustomFormIDOptions)(config),
                },
                {
                    type: 'menuitem',
                    description: translate('workspace.netsuite.advancedConfig.customFormIDNonReimbursable'),
                    onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_CUSTOM_FORM_ID.getRoute(policyID, CONST_1.default.NETSUITE_EXPENSE_TYPE.NON_REIMBURSABLE)),
                    title: config?.customFormIDOptions?.nonReimbursable?.[CONST_1.default.NETSUITE_MAP_EXPORT_DESTINATION[config.nonreimbursableExpensesExportDestination]],
                    subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_TYPE.NON_REIMBURSABLE],
                    shouldHide: (0, utils_1.shouldHideCustomFormIDOptions)(config),
                },
            ],
            shouldHide: false,
            shouldExpand: shouldShowCustomFormIDOptions,
            shouldAnimateSection: shouldAnimateAccordionSection,
        },
    ];
    return (<ConnectionLayout_1.default displayName={NetSuiteAdvancedPage.displayName} headerTitle="workspace.accounting.advanced" headerSubtitle={config?.subsidiary ?? ''} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE}>
            {menuItems
            .filter((item) => !item?.shouldHide)
            .map((item) => {
            switch (item.type) {
                case 'divider':
                    return (<react_native_1.View key={item.key} style={styles.dividerLine}/>);
                case 'toggle':
                    // eslint-disable-next-line no-case-declarations
                    const { type, shouldHide, ...rest } = item;
                    return (<ToggleSettingsOptionRow_1.default key={rest.title} 
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest} wrapperStyle={[styles.mv3, styles.ph5]}/>);
                case 'accordion':
                    return (<Accordion_1.default isExpanded={item.shouldExpand} isToggleTriggered={item.shouldAnimateSection}>
                                    {item.children.map((child) => {
                            return renderDefaultMenuItem(child);
                        })}
                                </Accordion_1.default>);
                default:
                    return renderDefaultMenuItem(item);
            }
        })}
        </ConnectionLayout_1.default>);
}
NetSuiteAdvancedPage.displayName = 'NetSuiteAdvancedPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteAdvancedPage);
