"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const LoginUtils_1 = require("@libs/LoginUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const variables_1 = require("@styles/variables");
const CloseAccount_1 = require("@userActions/CloseAccount");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CloseAccountForm_1 = require("@src/types/form/CloseAccountForm");
function CloseAccountPage() {
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, {
        canBeMissing: false,
    });
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [isConfirmModalVisible, setConfirmModalVisibility] = (0, react_1.useState)(false);
    const [reasonForLeaving, setReasonForLeaving] = (0, react_1.useState)('');
    // If you are new to hooks this might look weird but basically it is something that only runs when the component unmounts
    // nothing runs on mount and we pass empty dependencies to prevent this from running on every re-render.
    // TODO: We should refactor this so that the data in instead passed directly as a prop instead of "side loading" the data
    // here, we left this as is during refactor to limit the breaking changes.
    (0, react_1.useEffect)(() => () => (0, CloseAccount_1.clearError)(), []);
    const hideConfirmModal = () => {
        setConfirmModalVisibility(false);
    };
    const onConfirm = () => {
        (0, User_1.closeAccount)(reasonForLeaving);
        hideConfirmModal();
    };
    const showConfirmModal = (values) => {
        setConfirmModalVisibility(true);
        setReasonForLeaving(values.reasonForLeaving);
    };
    const userEmailOrPhone = session?.email ? formatPhoneNumber(session.email) : null;
    /**
     * Removes spaces and transform the input string to lowercase.
     * @param phoneOrEmail - The input string to be sanitized.
     * @returns The sanitized string
     */
    const sanitizePhoneOrEmail = (phoneOrEmail) => phoneOrEmail.replace(/\s+/g, '').toLowerCase();
    const validate = (values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, ['phoneOrEmail']);
        if (values.phoneOrEmail && userEmailOrPhone) {
            let isValid = false;
            if (expensify_common_1.Str.isValidEmail(userEmailOrPhone)) {
                // Email comparison - use existing sanitization
                isValid = sanitizePhoneOrEmail(userEmailOrPhone) === sanitizePhoneOrEmail(values.phoneOrEmail);
            }
            else {
                // Phone number comparison - normalize to E.164
                const storedE164Phone = (0, LoginUtils_1.formatE164PhoneNumber)((0, LoginUtils_1.getPhoneNumberWithoutSpecialChars)(userEmailOrPhone));
                const inputE164Phone = (0, LoginUtils_1.formatE164PhoneNumber)((0, LoginUtils_1.getPhoneNumberWithoutSpecialChars)(values.phoneOrEmail));
                // Only compare if both numbers could be formatted to E.164
                if (storedE164Phone && inputE164Phone) {
                    isValid = storedE164Phone === inputE164Phone;
                }
            }
            if (!isValid) {
                errors.phoneOrEmail = translate('closeAccountPage.enterYourDefaultContactMethod');
            }
        }
        return errors;
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={CloseAccountPage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.SUBMITTER]}>
                <HeaderWithBackButton_1.default title={translate('closeAccountPage.closeAccount')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.CLOSE_ACCOUNT_FORM} validate={validate} onSubmit={showConfirmModal} submitButtonText={translate('closeAccountPage.closeAccount')} style={[styles.flexGrow1, styles.mh5]} isSubmitActionDangerous>
                    <react_native_1.View fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK} style={[styles.flexGrow1]}>
                        <Text_1.default>{translate('closeAccountPage.reasonForLeavingPrompt')}</Text_1.default>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={CloseAccountForm_1.default.REASON_FOR_LEAVING} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} label={translate('closeAccountPage.enterMessageHere')} aria-label={translate('closeAccountPage.enterMessageHere')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mt5]} forwardedFSClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}/>
                        <Text_1.default style={[styles.mt5]}>
                            {translate('closeAccountPage.enterDefaultContactToConfirm')} <Text_1.default style={[styles.textStrong]}>{userEmailOrPhone}</Text_1.default>
                        </Text_1.default>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={CloseAccountForm_1.default.PHONE_OR_EMAIL} autoCapitalize="none" label={translate('closeAccountPage.enterDefaultContact')} aria-label={translate('closeAccountPage.enterDefaultContact')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mt5]} autoCorrect={false} inputMode={userEmailOrPhone && expensify_common_1.Str.isValidEmail(userEmailOrPhone) ? CONST_1.default.INPUT_MODE.EMAIL : CONST_1.default.INPUT_MODE.TEXT} forwardedFSClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}/>
                        <ConfirmModal_1.default danger title={translate('closeAccountPage.closeAccountWarning')} onConfirm={onConfirm} onCancel={hideConfirmModal} isVisible={isConfirmModalVisible} prompt={translate('closeAccountPage.closeAccountPermanentlyDeleteData')} confirmText={translate('common.yesContinue')} cancelText={translate('common.cancel')} shouldDisableConfirmButtonWhenOffline shouldShowCancelButton/>
                    </react_native_1.View>
                </FormProvider_1.default>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
CloseAccountPage.displayName = 'CloseAccountPage';
exports.default = CloseAccountPage;
