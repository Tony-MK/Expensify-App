"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const LegalNameForm_1 = require("@src/types/form/LegalNameForm");
const updateLegalName = (values, formatPhoneNumber, currentUserPersonalDetail) => {
    (0, PersonalDetails_1.updateLegalName)(values.legalFirstName?.trim() ?? '', values.legalLastName?.trim() ?? '', formatPhoneNumber, currentUserPersonalDetail);
};
function LegalNamePage() {
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const legalFirstName = privatePersonalDetails?.legalFirstName ?? '';
    const legalLastName = privatePersonalDetails?.legalLastName ?? '';
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (typeof values.legalFirstName === 'string') {
            if (!values.legalFirstName) {
                errors.legalFirstName = translate('common.error.fieldRequired');
            }
            else if (!(0, ValidationUtils_1.isValidLegalName)(values.legalFirstName)) {
                (0, ErrorUtils_1.addErrorMessage)(errors, 'legalFirstName', translate('privatePersonalDetails.error.hasInvalidCharacter'));
            }
            else if (values.legalFirstName.length > CONST_1.default.LEGAL_NAME.MAX_LENGTH) {
                (0, ErrorUtils_1.addErrorMessage)(errors, 'legalFirstName', translate('common.error.characterLimitExceedCounter', { length: values.legalFirstName.length, limit: CONST_1.default.LEGAL_NAME.MAX_LENGTH }));
            }
            if ((0, ValidationUtils_1.doesContainReservedWord)(values.legalFirstName, CONST_1.default.DISPLAY_NAME.RESERVED_NAMES)) {
                (0, ErrorUtils_1.addErrorMessage)(errors, 'legalFirstName', translate('personalDetails.error.containsReservedWord'));
            }
        }
        if (typeof values.legalLastName === 'string') {
            if (!values.legalLastName) {
                errors.legalLastName = translate('common.error.fieldRequired');
            }
            else if (!(0, ValidationUtils_1.isValidLegalName)(values.legalLastName)) {
                (0, ErrorUtils_1.addErrorMessage)(errors, 'legalLastName', translate('privatePersonalDetails.error.hasInvalidCharacter'));
            }
            else if (values.legalLastName.length > CONST_1.default.LEGAL_NAME.MAX_LENGTH) {
                (0, ErrorUtils_1.addErrorMessage)(errors, 'legalLastName', translate('common.error.characterLimitExceedCounter', { length: values.legalLastName.length, limit: CONST_1.default.LEGAL_NAME.MAX_LENGTH }));
            }
            if ((0, ValidationUtils_1.doesContainReservedWord)(values.legalLastName, CONST_1.default.DISPLAY_NAME.RESERVED_NAMES)) {
                (0, ErrorUtils_1.addErrorMessage)(errors, 'legalLastName', translate('personalDetails.error.containsReservedWord'));
            }
        }
        return errors;
    }, [translate]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={LegalNamePage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('privatePersonalDetails.legalName')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                {isLoadingApp ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.LEGAL_NAME_FORM} validate={validate} onSubmit={(values) => updateLegalName(values, formatPhoneNumber, { firstName: currentUserPersonalDetails.firstName, lastName: currentUserPersonalDetails.lastName })} submitButtonText={translate('common.save')} enabledWhenOffline>
                        <react_native_1.View style={[styles.mb4]}>
                            <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={LegalNameForm_1.default.LEGAL_FIRST_NAME} name="legalFirstName" label={translate('privatePersonalDetails.legalFirstName')} aria-label={translate('privatePersonalDetails.legalFirstName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={legalFirstName} spellCheck={false} autoCapitalize="words"/>
                        </react_native_1.View>
                        <react_native_1.View>
                            <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={LegalNameForm_1.default.LEGAL_LAST_NAME} name="legalLastName" label={translate('privatePersonalDetails.legalLastName')} aria-label={translate('privatePersonalDetails.legalLastName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={legalLastName} spellCheck={false} autoCapitalize="words"/>
                        </react_native_1.View>
                    </FormProvider_1.default>)}
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
LegalNamePage.displayName = 'LegalNamePage';
exports.default = LegalNamePage;
