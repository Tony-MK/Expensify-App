"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var Text_1 = require("@components/Text");
var TextInput_1 = require("@components/TextInput");
var TextLink_1 = require("@components/TextLink");
var useDelayedAutoFocus_1 = require("@hooks/useDelayedAutoFocus");
var useLocalize_1 = require("@hooks/useLocalize");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ValidationUtils_1 = require("@libs/ValidationUtils");
var CONST_1 = require("@src/CONST");
function RegistrationNumberStep(_a) {
    var formID = _a.formID, onSubmit = _a.onSubmit, inputID = _a.inputID, defaultValue = _a.defaultValue, isEditing = _a.isEditing, country = _a.country, _b = _a.shouldDelayAutoFocus, shouldDelayAutoFocus = _b === void 0 ? false : _b;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var internalInputRef = (0, react_1.useRef)(null);
    (0, useDelayedAutoFocus_1.default)(internalInputRef, shouldDelayAutoFocus);
    var helpLink = (0, react_1.useMemo)(function () {
        var _a;
        return (_a = CONST_1.default.REGISTRATION_NUMBER_HELP_URL[country]) !== null && _a !== void 0 ? _a : CONST_1.default.REGISTRATION_NUMBER_HELP_URL.EU;
    }, [country]);
    var validate = (0, react_1.useCallback)(function (values) {
        var errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [inputID]);
        if (values[inputID] && !(0, ValidationUtils_1.isValidRegistrationNumber)(values[inputID], country)) {
            errors[inputID] = translate('businessInfoStep.error.registrationNumber');
        }
        return errors;
    }, [country, inputID, translate]);
    return (<FormProvider_1.default formID={formID} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={onSubmit} validate={validate} style={[styles.mh5, styles.flexGrow1]} shouldHideFixErrorsAlert>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL]}>{translate('businessInfoStep.whatsTheBusinessRegistrationNumber', { country: country })}</Text_1.default>
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
