"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const RulesCustomForm_1 = require("@src/types/form/RulesCustomForm");
function RulesCustomPage({ route: { params: { policyID }, }, }) {
    const policy = (0, usePolicy_1.default)(policyID);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [customRulesValue, setCustomRulesValue] = (0, react_1.useState)(() => Parser_1.default.htmlToMarkdown(policy?.customRules ?? ''));
    const onChangeCustomRules = (0, react_1.useCallback)((newValue) => {
        setCustomRulesValue(newValue);
    }, []);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={RulesCustomPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.rules.customRules.title')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.RULES_CUSTOM_FORM} onSubmit={({ customRules }) => {
            (0, Policy_1.updateCustomRules)(policyID, customRules);
            Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
        }} submitButtonText={translate('workspace.editor.save')} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={RulesCustomForm_1.default.CUSTOM_RULES} label={translate('workspace.rules.customRules.title')} role={CONST_1.default.ROLE.PRESENTATION} value={customRulesValue} onChangeText={onChangeCustomRules} ref={inputCallbackRef} type="markdown" autoGrowHeight maxLength={CONST_1.default.DESCRIPTION_LIMIT}/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
RulesCustomPage.displayName = 'RulesCustomPage';
exports.default = RulesCustomPage;
