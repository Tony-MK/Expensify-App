"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const TextLink_1 = require("@components/TextLink");
const useDelayedAutoFocus_1 = require("@hooks/useDelayedAutoFocus");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
function RegistrationNumberStep({ formID, onSubmit, inputID, defaultValue, isEditing, country, shouldDelayAutoFocus = false, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const internalInputRef = (0, react_1.useRef)(null);
    (0, useDelayedAutoFocus_1.default)(internalInputRef, shouldDelayAutoFocus);
    const helpLink = (0, react_1.useMemo)(() => {
        return CONST_1.default.REGISTRATION_NUMBER_HELP_URL[country] ?? CONST_1.default.REGISTRATION_NUMBER_HELP_URL.EU;
    }, [country]);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [inputID]);
        if (values[inputID] && !(0, ValidationUtils_1.isValidRegistrationNumber)(values[inputID], country)) {
            errors[inputID] = translate('businessInfoStep.error.registrationNumber');
        }
        return errors;
    }, [country, inputID, translate]);
    return (<FormProvider_1.default formID={formID} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={onSubmit} validate={validate} style={[styles.mh5, styles.flexGrow1]} shouldHideFixErrorsAlert>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL]}>{translate('businessInfoStep.whatsTheBusinessRegistrationNumber', { country })}</Text_1.default>
            <InputWrapper_1.default InputComponent={TextInput_1.default} label={translate('businessInfoStep.registrationNumber')} aria-label={translate('businessInfoStep.registrationNumber')} role={CONST_1.default.ROLE.PRESENTATION} inputID={inputID} containerStyles={[styles.mt6]} defaultValue={defaultValue} shouldSaveDraft={!isEditing} autoFocus={!shouldDelayAutoFocus} ref={internalInputRef}/>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mt6]}>
                <Icon_1.default src={Expensicons.QuestionMark} width={12} height={12} fill={theme.icon}/>
                <react_native_1.View style={[styles.ml2, styles.dFlex, styles.flexRow]}>
                    <TextLink_1.default style={[styles.textMicro]} href={helpLink}>
                        {translate('businessInfoStep.whatsThisNumber')}
                    </TextLink_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </FormProvider_1.default>);
}
RegistrationNumberStep.displayName = 'RegistrationNumberStep';
exports.default = RegistrationNumberStep;
