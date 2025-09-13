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
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const RulesAutoPayReportsUnderModalForm_1 = require("@src/types/form/RulesAutoPayReportsUnderModalForm");
function RulesAutoPayReportsUnderPage({ route }) {
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const currency = policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    const currencySymbol = (0, CurrencyUtils_1.getCurrencySymbol)(currency);
    const autoPayApprovedReportsUnavailable = policy?.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO;
    const defaultValue = (0, CurrencyUtils_1.convertToFrontendAmountAsString)(policy?.autoReimbursement?.limit ?? CONST_1.default.POLICY.AUTO_REIMBURSEMENT_LIMIT_DEFAULT_CENTS, policy?.outputCurrency);
    const validateLimit = ({ maxExpenseAutoPayAmount }) => {
        const errors = {};
        if ((0, CurrencyUtils_1.convertToBackendAmount)(parseFloat(maxExpenseAutoPayAmount)) > CONST_1.default.POLICY.AUTO_REIMBURSEMENT_MAX_LIMIT_CENTS) {
            errors[RulesAutoPayReportsUnderModalForm_1.default.MAX_EXPENSE_AUTO_PAY_AMOUNT] = translate('workspace.rules.expenseReportRules.autoPayApprovedReportsLimitError', { currency: currencySymbol });
        }
        return errors;
    };
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED} shouldBeBlocked={!policy?.shouldShowAutoReimbursementLimitOption || autoPayApprovedReportsUnavailable}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={RulesAutoPayReportsUnderPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.expenseReportRules.autoPayReportsUnderTitle')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.mh5]} formID={ONYXKEYS_1.default.FORMS.RULES_AUTO_PAY_REPORTS_UNDER_MODAL_FORM} validate={validateLimit} onSubmit={({ maxExpenseAutoPayAmount }) => {
            (0, Policy_1.setPolicyAutoReimbursementLimit)(policyID, maxExpenseAutoPayAmount);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
        }} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default label={translate('iou.amount')} InputComponent={AmountForm_1.default} inputID={RulesAutoPayReportsUnderModalForm_1.default.MAX_EXPENSE_AUTO_PAY_AMOUNT} currency={currency} defaultValue={defaultValue} isCurrencyPressable={false} ref={inputCallbackRef} displayAsTextInput/>
                        <Text_1.default style={[styles.mutedNormalTextLabel, styles.mt2]}>{translate('workspace.rules.expenseReportRules.autoPayReportsUnderDescription')}</Text_1.default>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
RulesAutoPayReportsUnderPage.displayName = 'RulesAutoPayReportsUnderPage';
exports.default = RulesAutoPayReportsUnderPage;
