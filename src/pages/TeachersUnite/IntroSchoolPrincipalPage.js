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
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
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
const IntroSchoolPrincipalForm_1 = require("@src/types/form/IntroSchoolPrincipalForm");
function IntroSchoolPrincipalPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isProduction } = (0, useEnvironment_1.default)();
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const { localCurrencyCode, login, accountID } = (0, useCurrentUserPersonalDetails_1.default)();
    /**
     * Submit form to pass firstName, partnerUserID and lastName
     */
    const onSubmit = (values) => {
        const policyID = isProduction ? CONST_1.default.TEACHERS_UNITE.PROD_POLICY_ID : CONST_1.default.TEACHERS_UNITE.TEST_POLICY_ID;
        TeachersUnite_1.default.addSchoolPrincipal(values.firstName.trim(), values.partnerUserID.trim(), values.lastName.trim(), policyID, localCurrencyCode, login ?? '', accountID);
    };
    /**
     * @returns - An object containing the errors for each inputID
     */
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (!values.firstName || !(0, ValidationUtils_1.isValidPersonName)(values.firstName)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('bankAccount.error.firstName'));
        }
        else if (values.firstName.length > CONST_1.default.NAME.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'firstName', translate('common.error.characterLimitExceedCounter', {
                length: values.firstName.length,
                limit: CONST_1.default.NAME.MAX_LENGTH,
            }));
        }
        if (!values.lastName || !(0, ValidationUtils_1.isValidPersonName)(values.lastName)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('bankAccount.error.lastName'));
        }
        else if (values.lastName.length > CONST_1.default.NAME.MAX_LENGTH) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'lastName', translate('common.error.characterLimitExceedCounter', {
                length: values.lastName.length,
                limit: CONST_1.default.NAME.MAX_LENGTH,
            }));
        }
        if (!values.partnerUserID) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'partnerUserID', translate('teachersUnitePage.error.enterEmail'));
        }
        if (values.partnerUserID && loginList?.[values.partnerUserID.toLowerCase()]) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'partnerUserID', translate('teachersUnitePage.error.tryDifferentEmail'));
        }
        if (values.partnerUserID && !expensify_common_1.Str.isValidEmail(values.partnerUserID)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'partnerUserID', translate('teachersUnitePage.error.enterValidEmail'));
        }
        if (values.partnerUserID && (0, LoginUtils_1.isEmailPublicDomain)(values.partnerUserID)) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'partnerUserID', translate('teachersUnitePage.error.tryDifferentEmail'));
        }
        return errors;
    }, [loginList, translate]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={IntroSchoolPrincipalPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('teachersUnitePage.introSchoolPrincipal')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <FormProvider_1.default enabledWhenOffline style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.INTRO_SCHOOL_PRINCIPAL_FORM} validate={validate} onSubmit={onSubmit} submitButtonText={translate('common.letsStart')}>
                <Text_1.default style={[styles.mb6]}>{translate('teachersUnitePage.schoolPrincipalVerifyExpense')}</Text_1.default>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={IntroSchoolPrincipalForm_1.default.FIRST_NAME} name={IntroSchoolPrincipalForm_1.default.FIRST_NAME} label={translate('teachersUnitePage.principalFirstName')} accessibilityLabel={translate('teachersUnitePage.principalFirstName')} role={CONST_1.default.ROLE.PRESENTATION} autoCapitalize="words"/>
                </react_native_1.View>
                <react_native_1.View style={styles.mv4}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={IntroSchoolPrincipalForm_1.default.LAST_NAME} name={IntroSchoolPrincipalForm_1.default.LAST_NAME} label={translate('teachersUnitePage.principalLastName')} accessibilityLabel={translate('teachersUnitePage.principalLastName')} role={CONST_1.default.ROLE.PRESENTATION} autoCapitalize="words"/>
                </react_native_1.View>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={IntroSchoolPrincipalForm_1.default.PARTNER_USER_ID} name={IntroSchoolPrincipalForm_1.default.PARTNER_USER_ID} label={translate('teachersUnitePage.principalWorkEmail')} accessibilityLabel={translate('teachersUnitePage.principalWorkEmail')} role={CONST_1.default.ROLE.PRESENTATION} inputMode={CONST_1.default.INPUT_MODE.EMAIL} autoCapitalize="none"/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
IntroSchoolPrincipalPage.displayName = 'IntroSchoolPrincipalPage';
exports.default = IntroSchoolPrincipalPage;
