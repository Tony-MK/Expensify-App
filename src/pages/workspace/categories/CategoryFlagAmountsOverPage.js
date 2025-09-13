"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AmountForm_1 = require("@components/AmountForm");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Category_1 = require("@userActions/Policy/Category");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceCategoryFlagAmountsOverForm_1 = require("@src/types/form/WorkspaceCategoryFlagAmountsOverForm");
const ExpenseLimitTypeSelector_1 = require("./ExpenseLimitTypeSelector/ExpenseLimitTypeSelector");
function CategoryFlagAmountsOverPage({ route: { params: { policyID, categoryName }, }, }) {
    const policy = (0, usePolicy_1.default)(policyID);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const [expenseLimitType, setExpenseLimitType] = (0, react_1.useState)(policyCategories?.[categoryName]?.expenseLimitType ?? CONST_1.default.POLICY.EXPENSE_LIMIT_TYPES.EXPENSE);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const policyCategoryMaxExpenseAmount = policyCategories?.[categoryName]?.maxExpenseAmount;
    const defaultValue = policyCategoryMaxExpenseAmount === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE || !policyCategoryMaxExpenseAmount
        ? ''
        : (0, CurrencyUtils_1.convertToFrontendAmountAsString)(policyCategoryMaxExpenseAmount, policy?.outputCurrency);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={CategoryFlagAmountsOverPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.categoryRules.flagAmountsOver')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName))}/>
                <FormProvider_1.default style={[styles.flexGrow1]} formID={ONYXKEYS_1.default.FORMS.WORKSPACE_CATEGORY_FLAG_AMOUNTS_OVER_FORM} onSubmit={({ maxExpenseAmount }) => {
            (0, Category_1.setPolicyCategoryMaxAmount)(policyID, categoryName, maxExpenseAmount, expenseLimitType);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.getRoute(policyID, categoryName)));
        }} submitButtonText={translate('workspace.editor.save')} enabledWhenOffline submitButtonStyles={styles.ph5} shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={[styles.mb4, styles.pt3, styles.ph5]}>
                        <Text_1.default style={styles.pb5}>{translate('workspace.rules.categoryRules.flagAmountsOverDescription', { categoryName })}</Text_1.default>
                        <InputWrapper_1.default label={translate('iou.amount')} InputComponent={AmountForm_1.default} inputID={WorkspaceCategoryFlagAmountsOverForm_1.default.MAX_EXPENSE_AMOUNT} currency={policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD} defaultValue={defaultValue} isCurrencyPressable={false} ref={inputCallbackRef} displayAsTextInput/>
                        <Text_1.default style={[styles.mutedTextLabel, styles.mt2]}>{translate('workspace.rules.categoryRules.flagAmountsOverSubtitle')}</Text_1.default>
                    </react_native_1.View>
                    <ExpenseLimitTypeSelector_1.default label={translate('common.type')} defaultValue={expenseLimitType} wrapperStyle={[styles.ph5, styles.mt3]} setNewExpenseLimitType={setExpenseLimitType}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
CategoryFlagAmountsOverPage.displayName = 'CategoryFlagAmountsOverPage';
exports.default = CategoryFlagAmountsOverPage;
