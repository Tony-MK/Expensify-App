"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const RulesMaxExpenseAgeForm_1 = require("@src/types/form/RulesMaxExpenseAgeForm");
function RulesMaxExpenseAgePage({ route: { params: { policyID }, }, }) {
    const policy = (0, usePolicy_1.default)(policyID);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const maxExpenseAgeDefaultValue = policy?.maxExpenseAge === CONST_1.default.DISABLED_MAX_EXPENSE_VALUE || !policy?.maxExpenseAge ? '' : `${policy?.maxExpenseAge}`;
    const [maxExpenseAgeValue, setMaxExpenseAgeValue] = (0, react_1.useState)(maxExpenseAgeDefaultValue);
    const onChangeMaxExpenseAge = (0, react_1.useCallback)((newValue) => {
        // replace all characters that are not spaces or digits
        let validMaxExpenseAge = newValue.replace(/[^0-9]/g, '');
        validMaxExpenseAge = validMaxExpenseAge.match(/(?:\d *){1,5}/)?.[0] ?? '';
        setMaxExpenseAgeValue(validMaxExpenseAge);
    }, []);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_RULES_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={RulesMaxExpenseAgePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.individualExpenseRules.maxExpenseAge')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.RULES_MAX_EXPENSE_AGE_FORM} onSubmit={({ maxExpenseAge }) => {
            (0, Policy_1.setPolicyMaxExpenseAge)(policyID, maxExpenseAge);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
        }} submitButtonText={translate('workspace.editor.save')} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={RulesMaxExpenseAgeForm_1.default.MAX_EXPENSE_AGE} label={translate('workspace.rules.individualExpenseRules.maxAge')} suffixCharacter={translate('common.days')} suffixStyle={styles.colorMuted} role={CONST_1.default.ROLE.PRESENTATION} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} value={maxExpenseAgeValue} onChangeText={onChangeMaxExpenseAge} ref={inputCallbackRef}/>
                        <Text_1.default style={[styles.mutedTextLabel, styles.mt2]}>{translate('workspace.rules.individualExpenseRules.maxExpenseAgeDescription')}</Text_1.default>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
RulesMaxExpenseAgePage.displayName = 'RulesMaxExpenseAgePage';
exports.default = RulesMaxExpenseAgePage;
