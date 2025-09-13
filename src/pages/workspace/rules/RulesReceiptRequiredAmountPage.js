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
const RulesRequiredReceiptAmountForm_1 = require("@src/types/form/RulesRequiredReceiptAmountForm");
function RulesReceiptRequiredAmountPage({ route: { params: { policyID }, }, }) {
    const policy = (0, usePolicy_1.default)(policyID);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const defaultValue = policy?.maxExpenseAmountNoReceipt === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE || !policy?.maxExpenseAmountNoReceipt
        ? ''
        : (0, CurrencyUtils_1.convertToFrontendAmountAsString)(policy?.maxExpenseAmountNoReceipt, policy?.outputCurrency);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={RulesReceiptRequiredAmountPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.individualExpenseRules.receiptRequiredAmount')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.RULES_REQUIRED_RECEIPT_AMOUNT_FORM} onSubmit={({ maxExpenseAmountNoReceipt }) => {
            (0, Policy_1.setPolicyMaxExpenseAmountNoReceipt)(policyID, maxExpenseAmountNoReceipt);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
        }} submitButtonText={translate('workspace.editor.save')} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default label={translate('iou.amount')} InputComponent={AmountForm_1.default} inputID={RulesRequiredReceiptAmountForm_1.default.MAX_EXPENSE_AMOUNT_NO_RECEIPT} currency={policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD} defaultValue={defaultValue} isCurrencyPressable={false} ref={inputCallbackRef} displayAsTextInput/>
                        <Text_1.default style={[styles.mutedTextLabel, styles.mt2]}>{translate('workspace.rules.individualExpenseRules.receiptRequiredAmountDescription')}</Text_1.default>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
RulesReceiptRequiredAmountPage.displayName = 'RulesReceiptRequiredAmountPage';
exports.default = RulesReceiptRequiredAmountPage;
