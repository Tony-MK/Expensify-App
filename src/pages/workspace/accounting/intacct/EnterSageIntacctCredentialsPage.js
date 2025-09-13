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
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SageIntactCredentialsForm_1 = require("@src/types/form/SageIntactCredentialsForm");
function EnterSageIntacctCredentialsPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const policyID = route.params.policyID;
    const confirmCredentials = (0, react_1.useCallback)((values) => {
        (0, SageIntacct_1.connectToSageIntacct)(policyID, values);
        Navigation_1.default.dismissModal();
    }, [policyID]);
    const formItems = Object.values(SageIntactCredentialsForm_1.default);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        formItems.forEach((formItem) => {
            if (values[formItem]) {
                return;
            }
            (0, ErrorUtils_1.addErrorMessage)(errors, formItem, translate('common.error.fieldRequired'));
        });
        return errors;
    }, [formItems, translate]);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={EnterSageIntacctCredentialsPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.intacct.sageIntacctSetup')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.SAGE_INTACCT_CREDENTIALS_FORM} validate={validate} onSubmit={confirmCredentials} submitButtonText={translate('common.confirm')} enabledWhenOffline shouldValidateOnBlur shouldValidateOnChange addBottomSafeAreaPadding>
                <Text_1.default style={[styles.textHeadlineH1, styles.pb5, styles.pt3]}>{translate('workspace.intacct.enterCredentials')}</Text_1.default>
                {formItems.map((formItem, index) => (<react_native_1.View style={styles.mb4} key={formItem}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={formItem} ref={index === 0 ? inputCallbackRef : undefined} label={translate(`common.${formItem}`)} aria-label={translate(`common.${formItem}`)} role={CONST_1.default.ROLE.PRESENTATION} spellCheck={false} secureTextEntry={formItem === SageIntactCredentialsForm_1.default.PASSWORD} autoCorrect={false}/>
                    </react_native_1.View>))}
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
EnterSageIntacctCredentialsPage.displayName = 'EnterSageIntacctCredentialsPage';
exports.default = EnterSageIntacctCredentialsPage;
