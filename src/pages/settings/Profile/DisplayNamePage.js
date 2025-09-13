"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const DisplayNameForm_1 = require("@src/types/form/DisplayNameForm");
/**
 * Submit form to update user's first and last name (and display name)
 */
const updateDisplayName = (values, formatPhoneNumber) => {
    (0, PersonalDetails_1.updateDisplayName)(values.firstName.trim(), values.lastName.trim(), formatPhoneNumber);
    Navigation_1.default.goBack();
};
function DisplayNamePage({ currentUserPersonalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const currentUserDetails = currentUserPersonalDetails ?? {};
    const validate = (values) => {
        const errors = {};
        // First we validate the first name field
        if (!(0, ValidationUtils_1.isValidDisplayName)(values.firstName)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('personalDetails.error.hasInvalidCharacter'));
        }
        else if (values.firstName.length > CONST_1.default.DISPLAY_NAME.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('common.error.characterLimitExceedCounter', { length: values.firstName.length, limit: CONST_1.default.DISPLAY_NAME.MAX_LENGTH }));
        }
        else if (values.firstName.length === 0) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('personalDetails.error.requiredFirstName'));
        }
        if ((0, ValidationUtils_1.doesContainReservedWord)(values.firstName, CONST_1.default.DISPLAY_NAME.RESERVED_NAMES)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('personalDetails.error.containsReservedWord'));
        }
        // Then we validate the last name field
        if (!(0, ValidationUtils_1.isValidDisplayName)(values.lastName)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('personalDetails.error.hasInvalidCharacter'));
        }
        else if (values.lastName.length > CONST_1.default.DISPLAY_NAME.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('common.error.characterLimitExceedCounter', { length: values.lastName.length, limit: CONST_1.default.DISPLAY_NAME.MAX_LENGTH }));
        }
        if ((0, ValidationUtils_1.doesContainReservedWord)(values.lastName, CONST_1.default.DISPLAY_NAME.RESERVED_NAMES)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('personalDetails.error.containsReservedWord'));
        }
        return errors;
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={DisplayNamePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('displayNamePage.headerTitle')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            {isLoadingApp ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.DISPLAY_NAME_FORM} validate={validate} onSubmit={(values) => updateDisplayName(values, formatPhoneNumber)} submitButtonText={translate('common.save')} enabledWhenOffline shouldValidateOnBlur shouldValidateOnChange>
                    <Text_1.default style={[styles.mb6]}>{translate('displayNamePage.isShownOnProfile')}</Text_1.default>
                    <react_native_1.View style={styles.mb4}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={DisplayNameForm_1.default.FIRST_NAME} name="fname" label={translate('common.firstName')} aria-label={translate('common.firstName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={currentUserDetails.firstName ?? ''} spellCheck={false} autoCapitalize="words"/>
                    </react_native_1.View>
                    <react_native_1.View>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={DisplayNameForm_1.default.LAST_NAME} name="lname" label={translate('common.lastName')} aria-label={translate('common.lastName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={currentUserDetails.lastName ?? ''} spellCheck={false} autoCapitalize="words"/>
                    </react_native_1.View>
                </FormProvider_1.default>)}
        </ScreenWrapper_1.default>);
}
DisplayNamePage.displayName = 'DisplayNamePage';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(DisplayNamePage);
