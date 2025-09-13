"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const TeachersUnite_1 = require("@userActions/TeachersUnite");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const IKnowTeacherForm_1 = require("@src/types/form/IKnowTeacherForm");
function KnowATeacherPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isProduction } = (0, useEnvironment_1.default)();
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    /**
     * Submit form to pass firstName, partnerUserID and lastName
     */
    const onSubmit = (values) => {
        const phoneLogin = (0, LoginUtils_1.getPhoneLogin)(values.partnerUserID);
        const validateIfNumber = (0, LoginUtils_1.validateNumber)(phoneLogin);
        const contactMethod = (validateIfNumber || values.partnerUserID).trim().toLowerCase();
        const firstName = values.firstName.trim();
        const lastName = values.lastName.trim();
        const policyID = isProduction ? CONST_1.default.TEACHERS_UNITE.PROD_POLICY_ID : CONST_1.default.TEACHERS_UNITE.TEST_POLICY_ID;
        const publicRoomReportID = isProduction ? CONST_1.default.TEACHERS_UNITE.PROD_PUBLIC_ROOM_ID : CONST_1.default.TEACHERS_UNITE.TEST_PUBLIC_ROOM_ID;
        TeachersUnite_1.default.referTeachersUniteVolunteer(contactMethod, firstName, lastName, policyID, publicRoomReportID);
    };
    /**
     * @returns - An object containing the errors for each inputID
     */
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [IKnowTeacherForm_1.default.FIRST_NAME, IKnowTeacherForm_1.default.LAST_NAME]);
        const phoneLogin = (0, LoginUtils_1.getPhoneLogin)(values.partnerUserID);
        const validateIfNumber = (0, LoginUtils_1.validateNumber)(phoneLogin);
        if (!(0, ValidationUtils_1.isValidDisplayName)(values.firstName)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('personalDetails.error.hasInvalidCharacter'));
        }
        else if (values.firstName.length > CONST_1.default.NAME.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('common.error.characterLimitExceedCounter', {
                length: values.firstName.length,
                limit: CONST_1.default.NAME.MAX_LENGTH,
            }));
        }
        if (!(0, ValidationUtils_1.isValidDisplayName)(values.lastName)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('personalDetails.error.hasInvalidCharacter'));
        }
        else if (values.lastName.length > CONST_1.default.NAME.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('common.error.characterLimitExceedCounter', {
                length: values.lastName.length,
                limit: CONST_1.default.NAME.MAX_LENGTH,
            }));
        }
        if (!values.partnerUserID) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'partnerUserID', translate('teachersUnitePage.error.enterPhoneEmail'));
        }
        if (values.partnerUserID && loginList?.[validateIfNumber || values.partnerUserID.toLowerCase()]) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'partnerUserID', translate('teachersUnitePage.error.tryDifferentEmail'));
        }
        if (values.partnerUserID && !(validateIfNumber || expensify_common_1.Str.isValidEmail(values.partnerUserID))) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'partnerUserID', translate('contacts.genericFailureMessages.invalidContactMethod'));
        }
        return errors;
    }, [loginList, translate]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={KnowATeacherPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('teachersUnitePage.iKnowATeacher')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <FormProvider_1.default enabledWhenOffline style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.I_KNOW_A_TEACHER_FORM} validate={validate} onSubmit={onSubmit} submitButtonText={translate('common.letsDoThis')}>
                <Text_1.default style={[styles.mb6]}>{translate('teachersUnitePage.getInTouch')}</Text_1.default>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={IKnowTeacherForm_1.default.FIRST_NAME} name="fname" label={translate('common.firstName')} accessibilityLabel={translate('common.firstName')} role={CONST_1.default.ROLE.PRESENTATION} autoCapitalize="words"/>
                </react_native_1.View>
                <react_native_1.View style={styles.mv4}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={IKnowTeacherForm_1.default.LAST_NAME} name="lname" label={translate('common.lastName')} accessibilityLabel={translate('common.lastName')} role={CONST_1.default.ROLE.PRESENTATION} autoCapitalize="words"/>
                </react_native_1.View>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={IKnowTeacherForm_1.default.PARTNER_USER_ID} name="partnerUserID" label={`${translate('common.email')}/${translate('common.phoneNumber')}`} accessibilityLabel={`${translate('common.email')}/${translate('common.phoneNumber')}`} role={CONST_1.default.ROLE.PRESENTATION} inputMode={CONST_1.default.INPUT_MODE.EMAIL} autoCapitalize="none"/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
KnowATeacherPage.displayName = 'KnowATeacherPage';
exports.default = KnowATeacherPage;
