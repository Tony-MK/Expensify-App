"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const SageIntacct_1 = require("@userActions/connections/SageIntacct");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const utils_1 = require("./utils");
function SageIntacctNonReimbursableExpensesPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const { data: intacctData, config } = policy?.connections?.intacct ?? {};
    const activeDefaultVendor = (0, PolicyUtils_1.getSageIntacctNonReimbursableActiveDefaultVendor)(policy);
    const defaultVendorName = (0, utils_1.getDefaultVendorName)(activeDefaultVendor, intacctData?.vendors);
    const expandedCondition = !(!config?.export.nonReimbursable ||
        (config?.export.nonReimbursable === CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE && !config?.export.nonReimbursableCreditCardChargeDefaultVendor));
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(expandedCondition);
    const renderDefault = (item) => {
        return (<OfflineWithFeedback_1.default key={item.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(item.subscribedSettings, config?.pendingFields)}>
                <MenuItemWithTopDescription_1.default key={item.title} title={item.title} description={item.description} shouldShowRightIcon onPress={item?.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(item.subscribedSettings, config?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
            </OfflineWithFeedback_1.default>);
    };
    const menuItems = [
        {
            type: 'menuitem',
            title: config?.export.nonReimbursable ? translate(`workspace.sageIntacct.nonReimbursableExpenses.values.${config?.export.nonReimbursable}`) : undefined,
            description: translate('workspace.accounting.exportAs'),
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_DESTINATION.getRoute(policyID, Navigation_1.default.getActiveRoute()));
            },
            subscribedSettings: [CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE],
        },
        {
            type: 'menuitem',
            title: config?.export.nonReimbursableAccount ? config.export.nonReimbursableAccount : undefined,
            description: translate('workspace.sageIntacct.creditCardAccount'),
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_CREDIT_CARD_ACCOUNT.getRoute(policyID, Navigation_1.default.getActiveRoute()));
            },
            subscribedSettings: [CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_ACCOUNT],
            shouldHide: config?.export.nonReimbursable !== CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE,
        },
        {
            type: 'toggle',
            title: translate('workspace.sageIntacct.defaultVendor'),
            key: 'Default vendor toggle',
            subtitle: translate('workspace.sageIntacct.defaultVendorDescription', { isReimbursable: false }),
            shouldPlaceSubtitleBelowSwitch: true,
            isActive: !!config?.export.nonReimbursableCreditCardChargeDefaultVendor,
            switchAccessibilityLabel: translate('workspace.sageIntacct.defaultVendor'),
            onToggle: (enabled) => {
                if (!policyID) {
                    return;
                }
                const vendor = enabled ? policy?.connections?.intacct?.data?.vendors?.[0].id : '';
                (0, SageIntacct_1.updateSageIntacctDefaultVendor)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR, vendor ?? '', config?.export.nonReimbursableCreditCardChargeDefaultVendor);
                isAccordionExpanded.set(enabled);
                shouldAnimateAccordionSection.set(true);
            },
            onCloseError: () => (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR], config?.pendingFields),
            errors: (0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR),
            shouldHide: config?.export.nonReimbursable !== CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE,
        },
        {
            type: 'accordion',
            children: [
                {
                    type: 'menuitem',
                    title: defaultVendorName && defaultVendorName !== '' ? defaultVendorName : undefined,
                    description: translate('workspace.sageIntacct.defaultVendor'),
                    onPress: () => {
                        if (!policyID) {
                            return;
                        }
                        Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_DEFAULT_VENDOR.getRoute(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE.toLowerCase(), Navigation_1.default.getActiveRoute()));
                    },
                    subscribedSettings: [
                        config?.export.nonReimbursable === CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL
                            ? CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_VENDOR
                            : CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR,
                    ],
                    shouldHide: !config?.export.nonReimbursable ||
                        (config?.export.nonReimbursable === CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE &&
                            !config?.export.nonReimbursableCreditCardChargeDefaultVendor),
                },
            ],
            shouldHide: false,
            shouldExpand: isAccordionExpanded,
            shouldAnimateSection: shouldAnimateAccordionSection,
        },
    ];
    return (<ConnectionLayout_1.default displayName={SageIntacctNonReimbursableExpensesPage.displayName} headerTitle="workspace.accounting.exportCompanyCard" title="workspace.sageIntacct.nonReimbursableExpenses.description" onBackButtonPress={() => Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT.getRoute(policyID)))} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT}>
            {menuItems
            .filter((item) => !item.shouldHide)
            .map((item) => {
            switch (item.type) {
                case 'toggle':
                    // eslint-disable-next-line no-case-declarations
                    const { type, shouldHide, key, ...rest } = item;
                    return (<ToggleSettingsOptionRow_1.default key={key} 
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest} wrapperStyle={[styles.mv3, styles.ph5]}/>);
                case 'accordion':
                    return (<Accordion_1.default isExpanded={item.shouldExpand} isToggleTriggered={item.shouldAnimateSection}>
                                    {item.children.map((child) => renderDefault(child))}
                                </Accordion_1.default>);
                default:
                    return renderDefault(item);
            }
        })}
        </ConnectionLayout_1.default>);
}
SageIntacctNonReimbursableExpensesPage.displayName = 'SageIntacctNonReimbursableExpensesPage';
exports.default = (0, withPolicyConnections_1.default)(SageIntacctNonReimbursableExpensesPage);
