"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Category_1 = require("@userActions/Policy/Category");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
function CategorySettingsPage({ route: { params: { backTo, policyID, categoryName }, name, }, navigation, }) {
    const [allTransactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true });
    const [policyTagLists] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: false });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [deleteCategoryConfirmModalVisible, setDeleteCategoryConfirmModalVisible] = (0, react_1.useState)(false);
    const policy = (0, usePolicy_1.default)(policyID);
    const { environmentURL } = (0, useEnvironment_1.default)();
    const policyCategory = policyCategories?.[categoryName] ?? Object.values(policyCategories ?? {}).find((category) => category.previousCategoryName === categoryName);
    const policyCurrency = policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    const policyCategoryExpenseLimitType = policyCategory?.expenseLimitType ?? CONST_1.default.POLICY.EXPENSE_LIMIT_TYPES.EXPENSE;
    const [isCannotDeleteOrDisableLastCategoryModalVisible, setIsCannotDeleteOrDisableLastCategoryModalVisible] = (0, react_1.useState)(false);
    const shouldPreventDisableOrDelete = (0, OptionsListUtils_1.isDisablingOrDeletingLastEnabledCategory)(policy, policyCategories, [policyCategory]);
    const areCommentsRequired = policyCategory?.areCommentsRequired ?? false;
    const isQuickSettingsFlow = name === SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_SETTINGS;
    const navigateBack = () => {
        Navigation_1.default.goBack(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORIES_ROOT.getRoute(policyID, backTo) : undefined);
    };
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        if (policyCategory?.name === categoryName || !isFocused) {
            return;
        }
        navigation.setParams({ categoryName: policyCategory?.name });
    }, [categoryName, navigation, policyCategory?.name, isFocused]);
    const flagAmountsOverText = (0, react_1.useMemo)(() => {
        if (policyCategory?.maxExpenseAmount === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE || !policyCategory?.maxExpenseAmount) {
            return '';
        }
        return `${(0, CurrencyUtils_1.convertToDisplayString)(policyCategory?.maxExpenseAmount, policyCurrency)} ${CONST_1.default.DOT_SEPARATOR} ${translate(`workspace.rules.categoryRules.expenseLimitTypes.${policyCategoryExpenseLimitType}`)}`;
    }, [policyCategory?.maxExpenseAmount, policyCategoryExpenseLimitType, policyCurrency, translate]);
    const approverText = (0, react_1.useMemo)(() => {
        const categoryApprover = (0, CategoryUtils_1.getCategoryApproverRule)(policy?.rules?.approvalRules ?? [], categoryName)?.approver ?? '';
        const approver = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(categoryApprover);
        return approver?.displayName ?? categoryApprover;
    }, [categoryName, policy?.rules?.approvalRules]);
    const defaultTaxRateText = (0, react_1.useMemo)(() => {
        const taxID = (0, CategoryUtils_1.getCategoryDefaultTaxRate)(policy?.rules?.expenseRules ?? [], categoryName, policy?.taxRates?.defaultExternalID);
        if (!taxID) {
            return '';
        }
        const taxRate = policy?.taxRates?.taxes[taxID];
        if (!taxRate) {
            return '';
        }
        return (0, CategoryUtils_1.formatDefaultTaxRateText)(translate, taxID, taxRate, policy?.taxRates);
    }, [categoryName, policy?.rules?.expenseRules, policy?.taxRates, translate]);
    const requireReceiptsOverText = (0, react_1.useMemo)(() => {
        if (!policy) {
            return '';
        }
        return (0, CategoryUtils_1.formatRequireReceiptsOverText)(translate, policy, policyCategory?.maxAmountNoReceipt);
    }, [policy, policyCategory?.maxAmountNoReceipt, translate]);
    if (!policyCategory) {
        return <NotFoundPage_1.default />;
    }
    const updateWorkspaceCategoryEnabled = (value) => {
        if (shouldPreventDisableOrDelete) {
            setIsCannotDeleteOrDisableLastCategoryModalVisible(true);
            return;
        }
        (0, Category_1.setWorkspaceCategoryEnabled)(policyID, { [policyCategory.name]: { name: policyCategory.name, enabled: value } }, policyTagLists, allTransactionViolations);
    };
    const navigateToEditCategory = () => {
        Navigation_1.default.navigate(isQuickSettingsFlow ? ROUTES_1.default.SETTINGS_CATEGORY_EDIT.getRoute(policyID, policyCategory.name, backTo) : ROUTES_1.default.WORKSPACE_CATEGORY_EDIT.getRoute(policyID, policyCategory.name));
    };
    const deleteCategory = () => {
        (0, Category_1.deleteWorkspaceCategories)(policyID, [categoryName], policyTagLists, allTransactionViolations);
        setDeleteCategoryConfirmModalVisible(false);
        navigateBack();
    };
    const isThereAnyAccountingConnection = Object.keys(policy?.connections ?? {}).length !== 0;
    const workflowApprovalsUnavailable = (0, PolicyUtils_1.getWorkflowApprovalsUnavailable)(policy);
    const approverDisabled = !policy?.areWorkflowsEnabled || workflowApprovalsUnavailable;
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CategorySettingsPage.displayName}>
                <HeaderWithBackButton_1.default title={categoryName} onBackButtonPress={navigateBack}/>
                <ConfirmModal_1.default isVisible={deleteCategoryConfirmModalVisible} onConfirm={deleteCategory} onCancel={() => setDeleteCategoryConfirmModalVisible(false)} title={translate('workspace.categories.deleteCategory')} prompt={translate('workspace.categories.deleteCategoryPrompt')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                <ConfirmModal_1.default isVisible={isCannotDeleteOrDisableLastCategoryModalVisible} onConfirm={() => setIsCannotDeleteOrDisableLastCategoryModalVisible(false)} onCancel={() => setIsCannotDeleteOrDisableLastCategoryModalVisible(false)} title={translate('workspace.categories.cannotDeleteOrDisableAllCategories.title')} prompt={translate('workspace.categories.cannotDeleteOrDisableAllCategories.description')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
                <ScrollView_1.default contentContainerStyle={[styles.flexGrow1]} addBottomSafeAreaPadding>
                    <OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorMessageField)(policyCategory)} pendingAction={policyCategory?.pendingFields?.enabled} errorRowStyles={styles.mh5} onClose={() => (0, Category_1.clearCategoryErrors)(policyID, categoryName)}>
                        <react_native_1.View style={[styles.mt2, styles.mh5]}>
                            <react_native_1.View style={[styles.flexRow, styles.mb5, styles.mr2, styles.alignItemsCenter, styles.justifyContentBetween]}>
                                <Text_1.default style={[styles.flexShrink1, styles.mr2]}>{translate('workspace.categories.enableCategory')}</Text_1.default>
                                <Switch_1.default isOn={policyCategory.enabled} accessibilityLabel={translate('workspace.categories.enableCategory')} onToggle={updateWorkspaceCategoryEnabled} showLockIcon={shouldPreventDisableOrDelete}/>
                            </react_native_1.View>
                        </react_native_1.View>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={policyCategory.pendingFields?.name}>
                        <MenuItemWithTopDescription_1.default title={policyCategory.name} description={translate('common.name')} onPress={navigateToEditCategory} shouldShowRightIcon/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={policyCategory.pendingFields?.['GL Code']}>
                        <MenuItemWithTopDescription_1.default title={policyCategory['GL Code']} description={translate('workspace.categories.glCode')} onPress={() => {
            if (!(0, PolicyUtils_1.isControlPolicy)(policy)) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.glAndPayrollCodes.alias, isQuickSettingsFlow
                    ? ROUTES_1.default.SETTINGS_CATEGORY_GL_CODE.getRoute(policyID, policyCategory.name, backTo)
                    : ROUTES_1.default.WORKSPACE_CATEGORY_GL_CODE.getRoute(policyID, policyCategory.name)));
                return;
            }
            Navigation_1.default.navigate(isQuickSettingsFlow
                ? ROUTES_1.default.SETTINGS_CATEGORY_GL_CODE.getRoute(policyID, policyCategory.name, backTo)
                : ROUTES_1.default.WORKSPACE_CATEGORY_GL_CODE.getRoute(policyID, policyCategory.name));
        }} shouldShowRightIcon/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={policyCategory.pendingFields?.['Payroll Code']}>
                        <MenuItemWithTopDescription_1.default title={policyCategory['Payroll Code']} description={translate('workspace.categories.payrollCode')} onPress={() => {
            if (!(0, PolicyUtils_1.isControlPolicy)(policy)) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.glAndPayrollCodes.alias, ROUTES_1.default.WORKSPACE_CATEGORY_PAYROLL_CODE.getRoute(policyID, policyCategory.name)));
                return;
            }
            Navigation_1.default.navigate(isQuickSettingsFlow
                ? ROUTES_1.default.SETTINGS_CATEGORY_PAYROLL_CODE.getRoute(policyID, policyCategory.name, backTo)
                : ROUTES_1.default.WORKSPACE_CATEGORY_PAYROLL_CODE.getRoute(policyID, policyCategory.name));
        }} shouldShowRightIcon/>
                    </OfflineWithFeedback_1.default>

                    {!!policy?.areRulesEnabled && (<>
                            <react_native_1.View style={[styles.mh5, styles.pt3, styles.borderTop]}>
                                <Text_1.default style={[styles.textNormal, styles.textStrong, styles.mv3]}>{translate('workspace.rules.categoryRules.title')}</Text_1.default>
                            </react_native_1.View>
                            <OfflineWithFeedback_1.default pendingAction={policyCategory?.pendingFields?.areCommentsRequired}>
                                <react_native_1.View style={[styles.mt2, styles.mh5]}>
                                    <react_native_1.View style={[styles.flexRow, styles.mb5, styles.mr2, styles.alignItemsCenter, styles.justifyContentBetween]}>
                                        <Text_1.default style={[styles.flexShrink1, styles.mr2]}>{translate('workspace.rules.categoryRules.requireDescription')}</Text_1.default>
                                        <Switch_1.default isOn={policyCategory?.areCommentsRequired ?? false} accessibilityLabel={translate('workspace.rules.categoryRules.requireDescription')} onToggle={() => {
                if (policyCategory.commentHint && areCommentsRequired) {
                    (0, Category_1.setWorkspaceCategoryDescriptionHint)(policyID, categoryName, '');
                }
                (0, Category_1.setPolicyCategoryDescriptionRequired)(policyID, categoryName, !areCommentsRequired);
            }}/>
                                    </react_native_1.View>
                                </react_native_1.View>
                            </OfflineWithFeedback_1.default>
                            {!!policyCategory?.areCommentsRequired && (<OfflineWithFeedback_1.default pendingAction={policyCategory.pendingFields?.commentHint}>
                                    <MenuItemWithTopDescription_1.default title={policyCategory?.commentHint} description={translate('workspace.rules.categoryRules.descriptionHint')} onPress={() => {
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CATEGORY_DESCRIPTION_HINT.getRoute(policyID, policyCategory.name));
                }} shouldShowRightIcon/>
                                </OfflineWithFeedback_1.default>)}
                            <MenuItemWithTopDescription_1.default title={approverText} description={translate('workspace.rules.categoryRules.approver')} onPress={() => {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CATEGORY_APPROVER.getRoute(policyID, policyCategory.name));
            }} shouldShowRightIcon disabled={approverDisabled} helperText={approverDisabled
                ? translate('workspace.rules.categoryRules.enableWorkflows', {
                    moreFeaturesLink: `${environmentURL}/${ROUTES_1.default.WORKSPACE_MORE_FEATURES.getRoute(policyID)}`,
                })
                : undefined} shouldParseHelperText/>
                            {!!policy?.tax?.trackingEnabled && (<MenuItemWithTopDescription_1.default title={defaultTaxRateText} description={translate('workspace.rules.categoryRules.defaultTaxRate')} onPress={() => {
                    Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CATEGORY_DEFAULT_TAX_RATE.getRoute(policyID, policyCategory.name));
                }} shouldShowRightIcon/>)}

                            <OfflineWithFeedback_1.default pendingAction={policyCategory.pendingFields?.maxExpenseAmount}>
                                <MenuItemWithTopDescription_1.default title={flagAmountsOverText} description={translate('workspace.rules.categoryRules.flagAmountsOver')} onPress={() => {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CATEGORY_FLAG_AMOUNTS_OVER.getRoute(policyID, policyCategory.name));
            }} shouldShowRightIcon/>
                            </OfflineWithFeedback_1.default>
                            <OfflineWithFeedback_1.default pendingAction={policyCategory.pendingFields?.maxAmountNoReceipt}>
                                <MenuItemWithTopDescription_1.default title={requireReceiptsOverText} description={translate(`workspace.rules.categoryRules.requireReceiptsOver`)} onPress={() => {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_CATEGORY_REQUIRE_RECEIPTS_OVER.getRoute(policyID, policyCategory.name));
            }} shouldShowRightIcon/>
                            </OfflineWithFeedback_1.default>
                        </>)}
                    {!isThereAnyAccountingConnection && (<MenuItem_1.default icon={Expensicons_1.Trashcan} title={translate('common.delete')} onPress={() => {
                if (shouldPreventDisableOrDelete) {
                    setIsCannotDeleteOrDisableLastCategoryModalVisible(true);
                    return;
                }
                setDeleteCategoryConfirmModalVisible(true);
            }}/>)}
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CategorySettingsPage.displayName = 'CategorySettingsPage';
exports.default = CategorySettingsPage;
