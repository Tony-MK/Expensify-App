"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const MergeAccounts_1 = require("@userActions/MergeAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const MergeAccountDetailsForm_1 = require("@src/types/form/MergeAccountDetailsForm");
const getValidateCodeErrorKey = (err) => {
    if (err.includes('403')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.TOO_MANY_ATTEMPTS;
    }
    if (err.includes('404')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_NO_EXIST;
    }
    if (err.includes('401')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_PRIMARY_LOGIN;
    }
    if (err.includes('402')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_NOT_SUPPORTED;
    }
    if (err.includes('400 Cannot merge account into itself')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_MERGE_SELF;
    }
    return null;
};
function AccountDetailsPage() {
    const formRef = (0, react_1.useRef)(null);
    const navigation = (0, native_1.useNavigation)();
    const [userEmailOrPhone] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: true });
    const [getValidateCodeForAccountMerge] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.getValidateCodeForAccountMerge, canBeMissing: true });
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const { params } = (0, native_1.useRoute)();
    const [email, setEmail] = (0, react_1.useState)(params?.email ?? '');
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const validateCodeSent = getValidateCodeForAccountMerge?.validateCodeSent;
    const latestError = (0, ErrorUtils_1.getLatestErrorMessage)(getValidateCodeForAccountMerge);
    const errorKey = getValidateCodeErrorKey(latestError);
    const genericError = !errorKey ? latestError : undefined;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        const task = react_native_1.InteractionManager.runAfterInteractions(() => {
            if (!validateCodeSent || !email) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_MAGIC_CODE.getRoute(email.trim()));
        });
        return () => task.cancel();
    }, [validateCodeSent, email]));
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        const task = react_native_1.InteractionManager.runAfterInteractions(() => {
            if (!errorKey || !email) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_RESULT.getRoute(email.trim(), errorKey));
        });
        return () => task.cancel();
    }, [errorKey, email]));
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        const task = react_native_1.InteractionManager.runAfterInteractions(() => {
            if (privateSubscription?.type !== CONST_1.default.SUBSCRIPTION.TYPE.INVOICING) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_RESULT.getRoute(currentUserPersonalDetails.login ?? '', CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_INVOICING, ROUTES_1.default.SETTINGS_SECURITY));
        });
        return () => task.cancel();
    }, [privateSubscription?.type, currentUserPersonalDetails.login]));
    (0, react_1.useEffect)(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            (0, MergeAccounts_1.clearGetValidateCodeForAccountMerge)();
        });
        return unsubscribe;
    }, [navigation]);
    const validate = (values) => {
        const errors = {};
        const login = values[MergeAccountDetailsForm_1.default.PHONE_OR_EMAIL];
        if (!login) {
            (0, ErrorUtils_1.addErrorMessage)(errors, MergeAccountDetailsForm_1.default.PHONE_OR_EMAIL, translate('common.pleaseEnterEmailOrPhoneNumber'));
        }
        else if (login.trim() === userEmailOrPhone) {
            (0, ErrorUtils_1.addErrorMessage)(errors, MergeAccountDetailsForm_1.default.PHONE_OR_EMAIL, translate('common.error.email'));
        }
        else {
            const phoneLogin = (0, LoginUtils_1.getPhoneLogin)(login);
            const validateIfNumber = (0, LoginUtils_1.validateNumber)(phoneLogin);
            if (!expensify_common_1.Str.isValidEmail(login) && !validateIfNumber) {
                if ((0, ValidationUtils_1.isNumericWithSpecialChars)(login)) {
                    (0, ErrorUtils_1.addErrorMessage)(errors, MergeAccountDetailsForm_1.default.PHONE_OR_EMAIL, translate('common.error.phoneNumber'));
                }
                else {
                    (0, ErrorUtils_1.addErrorMessage)(errors, MergeAccountDetailsForm_1.default.PHONE_OR_EMAIL, translate('loginForm.error.invalidFormatEmailLogin'));
                }
            }
        }
        if (!values[MergeAccountDetailsForm_1.default.CONSENT]) {
            (0, ErrorUtils_1.addErrorMessage)(errors, MergeAccountDetailsForm_1.default.CONSENT, translate('common.error.fieldRequired'));
        }
        return errors;
    };
    return (<ScreenWrapper_1.default shouldEnableMaxHeight includeSafeAreaPaddingBottom testID={AccountDetailsPage.displayName} shouldShowOfflineIndicator={false}>
            <HeaderWithBackButton_1.default title={translate('mergeAccountsPage.mergeAccount')} onBackButtonPress={() => Navigation_1.default.dismissModal()} shouldDisplayHelpButton={false}/>
            <FullPageOfflineBlockingView_1.default>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.MERGE_ACCOUNT_DETAILS_FORM} onSubmit={(values) => {
            (0, MergeAccounts_1.requestValidationCodeForAccountMerge)(values[MergeAccountDetailsForm_1.default.PHONE_OR_EMAIL]);
        }} style={[styles.flexGrow1, styles.mh5]} shouldTrimValues validate={validate} submitButtonText={translate('common.next')} isSubmitButtonVisible={false} ref={formRef}>
                    <react_native_1.View style={[styles.flexGrow1, styles.mt3]}>
                        <react_native_1.View>
                            <Text_1.default>
                                {translate('mergeAccountsPage.accountDetails.accountToMergeInto')}
                                <Text_1.default style={styles.textStrong}>{userEmailOrPhone}</Text_1.default>
                            </Text_1.default>
                        </react_native_1.View>
                        <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} inputID={MergeAccountDetailsForm_1.default.PHONE_OR_EMAIL} autoCapitalize="none" label={translate('loginForm.phoneOrEmail')} aria-label={translate('loginForm.phoneOrEmail')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mt8]} autoCorrect={false} onChangeText={setEmail} value={email} inputMode={CONST_1.default.INPUT_MODE.EMAIL}/>
                        <InputWrapper_1.default style={[styles.mt8]} InputComponent={CheckboxWithLabel_1.default} inputID={MergeAccountDetailsForm_1.default.CONSENT} label={translate('mergeAccountsPage.accountDetails.notReversibleConsent')} aria-label={translate('mergeAccountsPage.accountDetails.notReversibleConsent')}/>
                    </react_native_1.View>
                    <FormAlertWithSubmitButton_1.default isAlertVisible={!!genericError} onSubmit={() => {
            formRef.current?.submit();
        }} message={genericError} buttonText={translate('common.next')} enabledWhenOffline={false} containerStyles={styles.mt3} isLoading={getValidateCodeForAccountMerge?.isLoading}/>
                </FormProvider_1.default>
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
AccountDetailsPage.displayName = 'AccountDetailsPage';
exports.default = AccountDetailsPage;
