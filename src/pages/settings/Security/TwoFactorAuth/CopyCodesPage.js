"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const PressableWithDelayToggle_1 = require("@components/Pressable/PressableWithDelayToggle");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const types_1 = require("@libs/API/types");
const Clipboard_1 = require("@libs/Clipboard");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const localFileDownload_1 = require("@libs/localFileDownload");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Session_1 = require("@userActions/Session");
const TwoFactorAuthActions_1 = require("@userActions/TwoFactorAuthActions");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const TwoFactorAuthWrapper_1 = require("./TwoFactorAuthWrapper");
function CopyCodesPage({ route }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use correct style
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isExtraSmallScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [error, setError] = (0, react_1.useState)('');
    const [account, accountMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const isUserValidated = account?.validated ?? false;
    const contactMethod = account?.primaryLogin ?? '';
    const loginData = (0, react_1.useMemo)(() => loginList?.[contactMethod], [loginList, contactMethod]);
    const validateLoginError = (0, ErrorUtils_1.getEarliestErrorField)(loginData, 'validateLogin');
    const [isValidateModalVisible, setIsValidateModalVisible] = (0, react_1.useState)(!isUserValidated);
    (0, react_1.useEffect)(() => {
        setIsValidateModalVisible(!isUserValidated);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if ((0, isLoadingOnyxValue_1.default)(accountMetadata) || account?.requiresTwoFactorAuth || account?.recoveryCodes || !isUserValidated) {
            return;
        }
        (0, Session_1.toggleTwoFactorAuth)(true);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- We want to run this when component mounts
    }, [isUserValidated, accountMetadata.status]);
    (0, useBeforeRemove_1.default)(() => setIsValidateModalVisible(false));
    return (<TwoFactorAuthWrapper_1.default title={translate('twoFactorAuth.headerTitle')} stepCounter={{
            step: 1,
            text: translate('twoFactorAuth.stepCodes'),
            total: 3,
        }} shouldEnableKeyboardAvoidingView={false} stepName={CONST_1.default.TWO_FACTOR_AUTH_STEPS.COPY_CODES} 
    // When the 2FA code step is open from Xero flow, we don't need to pass backTo because we build the necessary root route
    // from the backTo param in the route (in getMatchingRootRouteForRHPRoute) and goBack will not need a fallbackRoute.
    onBackButtonPress={() => (0, TwoFactorAuthActions_1.quitAndNavigateBack)(route?.params?.forwardTo?.includes(types_1.READ_COMMANDS.CONNECT_POLICY_TO_XERO) ? undefined : route?.params?.backTo)}>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                {!!isUserValidated && (<Section_1.default title={translate('twoFactorAuth.keepCodesSafe')} icon={Illustrations.ShieldYellow} containerStyles={[styles.twoFactorAuthSection]} iconContainerStyles={[styles.ml6]}>
                        <react_native_1.View style={styles.mv3}>
                            <Text_1.default>{translate('twoFactorAuth.codesLoseAccess')}</Text_1.default>
                        </react_native_1.View>
                        <react_native_1.View style={styles.twoFactorAuthCodesBox({ isExtraSmallScreenWidth, isSmallScreenWidth })}>
                            {account?.isLoading ? (<react_native_1.View style={styles.twoFactorLoadingContainer}>
                                    <react_native_1.ActivityIndicator color={theme.spinner}/>
                                </react_native_1.View>) : (<>
                                    <react_native_1.View style={styles.twoFactorAuthCodesContainer}>
                                        {!!account?.recoveryCodes &&
                    account?.recoveryCodes?.split(', ').map((code) => (<Text_1.default style={styles.twoFactorAuthCode} key={code}>
                                                    {code}
                                                </Text_1.default>))}
                                    </react_native_1.View>
                                    <react_native_1.View style={styles.twoFactorAuthCodesButtonsContainer}>
                                        <PressableWithDelayToggle_1.default text={translate('twoFactorAuth.copy')} textChecked={translate('common.copied')} icon={Expensicons.Copy} inline={false} onPress={() => {
                    Clipboard_1.default.setString(account?.recoveryCodes ?? '');
                    setError('');
                    (0, TwoFactorAuthActions_1.setCodesAreCopied)();
                }} styles={[styles.button, styles.buttonMedium, styles.twoFactorAuthCodesButton]} textStyles={[styles.buttonMediumText]} accessible={false} tooltipText="" tooltipTextChecked=""/>
                                        <PressableWithDelayToggle_1.default text={translate('common.download')} icon={Expensicons.Download} onPress={() => {
                    (0, localFileDownload_1.default)('two-factor-auth-codes', account?.recoveryCodes ?? '');
                    setError('');
                    (0, TwoFactorAuthActions_1.setCodesAreCopied)();
                }} inline={false} styles={[styles.button, styles.buttonMedium, styles.twoFactorAuthCodesButton]} textStyles={[styles.buttonMediumText]} accessible={false} tooltipText="" tooltipTextChecked=""/>
                                    </react_native_1.View>
                                </>)}
                        </react_native_1.View>
                    </Section_1.default>)}
                <FixedFooter_1.default style={[styles.mtAuto, styles.pt5]}>
                    {!!error && (<FormHelpMessage_1.default isError message={error} style={[styles.mb3]}/>)}
                    <Button_1.default success large isDisabled={!isUserValidated} text={translate('common.next')} onPress={() => {
            if (!account?.codesAreCopied) {
                return setError(translate('twoFactorAuth.errorStepCodes'));
            }
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_VERIFY.getRoute(route.params?.backTo, route.params?.forwardTo));
        }}/>
                </FixedFooter_1.default>
            </ScrollView_1.default>
            <ValidateCodeActionModal_1.default title={translate('contacts.validateAccount')} descriptionPrimary={translate('contacts.featureRequiresValidate')} descriptionSecondary={translate('contacts.enterMagicCode', { contactMethod })} isVisible={isValidateModalVisible} validateCodeActionErrorField="validateLogin" validatePendingAction={loginData?.pendingFields?.validateCodeSent} sendValidateCode={() => (0, User_1.requestValidateCodeAction)()} handleSubmitForm={(validateCode) => (0, User_1.validateSecondaryLogin)(loginList, contactMethod, validateCode, formatPhoneNumber, true)} validateError={!(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? validateLoginError : (0, ErrorUtils_1.getLatestErrorField)(loginData, 'validateCodeSent')} clearError={() => (0, User_1.clearContactMethodErrors)(contactMethod, !(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? 'validateLogin' : 'validateCodeSent')} onClose={() => {
            setIsValidateModalVisible(false);
            (0, TwoFactorAuthActions_1.quitAndNavigateBack)();
        }}/>
        </TwoFactorAuthWrapper_1.default>);
}
CopyCodesPage.displayName = 'CopyCodesPage';
exports.default = CopyCodesPage;
