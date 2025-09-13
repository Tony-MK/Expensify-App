"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const UserUtils_1 = require("@libs/UserUtils");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NewContactMethodForm_1 = require("@src/types/form/NewContactMethodForm");
function NewContactMethodPage({ route }) {
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const contactMethod = (0, UserUtils_1.getContactMethod)(account?.primaryLogin, session?.email);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const loginInputRef = (0, react_1.useRef)(null);
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, react_1.useState)(false);
    const [pendingContactAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PENDING_CONTACT_ACTION, { canBeMissing: true });
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const loginData = loginList?.[pendingContactAction?.contactMethod ?? contactMethod];
    const validateLoginError = (0, ErrorUtils_1.getLatestErrorField)(loginData, 'addedLogin');
    const navigateBackTo = route?.params?.backTo;
    const hasFailedToSendVerificationCode = !!pendingContactAction?.errorFields?.actionVerified;
    const handleValidateMagicCode = (0, react_1.useCallback)((values) => {
        const phoneLogin = (0, LoginUtils_1.getPhoneLogin)(values.phoneOrEmail);
        const validateIfNumber = (0, LoginUtils_1.validateNumber)(phoneLogin);
        const submitDetail = (validateIfNumber || values.phoneOrEmail).trim().toLowerCase();
        (0, User_1.resetValidateActionCodeSent)();
        (0, User_1.addPendingContactMethod)(submitDetail);
        setIsValidateCodeActionModalVisible(true);
    }, []);
    const addNewContactMethod = (0, react_1.useCallback)((magicCode) => {
        (0, User_1.addNewContactMethod)((0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(pendingContactAction?.contactMethod ?? ''), magicCode);
    }, [pendingContactAction?.contactMethod]);
    const prevPendingContactAction = (0, usePrevious_1.default)(pendingContactAction);
    (0, useBeforeRemove_1.default)(() => setIsValidateCodeActionModalVisible(false));
    (0, react_1.useEffect)(() => {
        if (!pendingContactAction?.actionVerified || !prevPendingContactAction?.contactMethod) {
            return;
        }
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONTACT_METHOD_DETAILS.getRoute((0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(prevPendingContactAction?.contactMethod ?? ''), navigateBackTo, true));
        (0, User_1.clearUnvalidatedNewContactMethodAction)();
    }, [pendingContactAction?.actionVerified, prevPendingContactAction?.contactMethod, navigateBackTo]);
    const validate = (0, react_1.useCallback)((values) => {
        const phoneLogin = (0, LoginUtils_1.getPhoneLogin)(values.phoneOrEmail);
        const validateIfNumber = (0, LoginUtils_1.validateNumber)(phoneLogin);
        const errors = {};
        if (!values.phoneOrEmail) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'phoneOrEmail', translate('contacts.genericFailureMessages.contactMethodRequired'));
        }
        else if (values.phoneOrEmail.length > CONST_1.default.LOGIN_CHARACTER_LIMIT) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'phoneOrEmail', translate('common.error.characterLimitExceedCounter', {
                length: values.phoneOrEmail.length,
                limit: CONST_1.default.LOGIN_CHARACTER_LIMIT,
            }));
        }
        if (!!values.phoneOrEmail && !(validateIfNumber || expensify_common_1.Str.isValidEmail(values.phoneOrEmail))) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'phoneOrEmail', translate('contacts.genericFailureMessages.invalidContactMethod'));
        }
        if (!!values.phoneOrEmail && loginList?.[validateIfNumber || values.phoneOrEmail.toLowerCase()]) {
            (0, ErrorUtils_1.addErrorMessage)(errors, 'phoneOrEmail', translate('contacts.genericFailureMessages.enteredMethodIsAlreadySubmitted'));
        }
        return errors;
    }, 
    // We don't need `loginList` because when submitting this form
    // the loginList gets updated, causing this function to run again.
    // https://github.com/Expensify/App/issues/20610
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [translate]);
    const onBackButtonPress = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(navigateBackTo));
    }, [navigateBackTo]);
    return (<ScreenWrapper_1.default onEntryTransitionEnd={() => loginInputRef.current?.focus()} includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={NewContactMethodPage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('contacts.newContactMethod')} onBackButtonPress={onBackButtonPress}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NEW_CONTACT_METHOD_FORM} validate={validate} onSubmit={handleValidateMagicCode} submitButtonText={translate('common.add')} style={[styles.flexGrow1, styles.mh5]} shouldHideFixErrorsAlert>
                    <Text_1.default style={styles.mb5}>{translate('common.pleaseEnterEmailOrPhoneNumber')}</Text_1.default>
                    <react_native_1.View style={styles.mb6}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} label={`${translate('common.email')}/${translate('common.phoneNumber')}`} aria-label={`${translate('common.email')}/${translate('common.phoneNumber')}`} role={CONST_1.default.ROLE.PRESENTATION} inputMode={CONST_1.default.INPUT_MODE.EMAIL} ref={loginInputRef} inputID={NewContactMethodForm_1.default.PHONE_OR_EMAIL} autoCapitalize="none" enterKeyHint="done"/>
                    </react_native_1.View>
                    {hasFailedToSendVerificationCode && (<DotIndicatorMessage_1.default messages={(0, ErrorUtils_1.getLatestErrorField)(pendingContactAction, 'actionVerified')} type="error"/>)}
                </FormProvider_1.default>
                <ValidateCodeActionModal_1.default validateCodeActionErrorField="addedLogin" validateError={validateLoginError} handleSubmitForm={addNewContactMethod} clearError={() => {
            if (!loginData) {
                return;
            }
            (0, User_1.clearContactMethodErrors)((0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(pendingContactAction?.contactMethod ?? contactMethod), 'addedLogin');
            (0, User_1.clearPendingContactActionErrors)();
        }} onClose={() => {
            if (pendingContactAction?.contactMethod) {
                (0, User_1.clearContactMethod)(pendingContactAction?.contactMethod);
                (0, User_1.clearUnvalidatedNewContactMethodAction)();
            }
            setIsValidateCodeActionModalVisible(false);
        }} isVisible={isValidateCodeActionModalVisible} title={translate('delegate.makeSureItIsYou')} sendValidateCode={() => (0, User_1.requestValidateCodeAction)()} descriptionPrimary={translate('contacts.enterMagicCode', { contactMethod })}/>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
NewContactMethodPage.displayName = 'NewContactMethodPage';
exports.default = NewContactMethodPage;
