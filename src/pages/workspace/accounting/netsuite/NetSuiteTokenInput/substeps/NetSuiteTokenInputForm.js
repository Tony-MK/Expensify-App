"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Parser_1 = require("@libs/Parser");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const NetSuiteTokenInputForm_1 = require("@src/types/form/NetSuiteTokenInputForm");
function NetSuiteTokenInputForm({ onNext, policyID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const formInputs = Object.values(NetSuiteTokenInputForm_1.default);
    const validate = (0, react_1.useCallback)((formValues) => {
        const errors = {};
        formInputs.forEach((formInput) => {
            if (formValues[formInput]) {
                return;
            }
            (0, ErrorUtils_1.addErrorMessage)(errors, formInput, translate('common.error.fieldRequired'));
        });
        return errors;
    }, [formInputs, translate]);
    const connectPolicy = (0, react_1.useCallback)((formValues) => {
        if (!policyID) {
            return;
        }
        (0, NetSuiteCommands_1.connectPolicyToNetSuite)(policyID, formValues);
        onNext();
    }, [onNext, policyID]);
    return (<react_native_1.View style={[styles.flexGrow1, styles.ph5]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate(`workspace.netsuite.tokenInput.formSteps.enterCredentials.title`)}</Text_1.default>

            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NETSUITE_TOKEN_INPUT_FORM} style={styles.flexGrow1} validate={validate} onSubmit={connectPolicy} submitButtonText={translate('common.confirm')} shouldValidateOnBlur shouldValidateOnChange addBottomSafeAreaPadding={false}>
                {formInputs.map((formInput, index) => (<react_native_1.View style={styles.mb4} key={formInput}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={formInput} ref={index === 0 ? inputCallbackRef : undefined} label={translate(`workspace.netsuite.tokenInput.formSteps.enterCredentials.formInputs.${formInput}`)} aria-label={translate(`workspace.netsuite.tokenInput.formSteps.enterCredentials.formInputs.${formInput}`)} role={CONST_1.default.ROLE.PRESENTATION} spellCheck={false}/>
                        {formInput === NetSuiteTokenInputForm_1.default.NETSUITE_ACCOUNT_ID && (<react_native_1.View style={[styles.flexRow, styles.pt2]}>
                                <RenderHTML_1.default html={`<comment><muted-text>${Parser_1.default.replace(translate(`workspace.netsuite.tokenInput.formSteps.enterCredentials.${formInput}Description`))}</muted-text></comment>`}/>
                            </react_native_1.View>)}
                    </react_native_1.View>))}
            </FormProvider_1.default>
        </react_native_1.View>);
}
NetSuiteTokenInputForm.displayName = 'NetSuiteTokenInputForm';
exports.default = NetSuiteTokenInputForm;
