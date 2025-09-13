"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_logo_round_transparent_png_1 = require("@assets/images/expensify-logo-round-transparent.png");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithDelayToggle_1 = require("@components/Pressable/PressableWithDelayToggle");
const QRCode_1 = require("@components/QRCode");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Clipboard_1 = require("@libs/Clipboard");
const Navigation_1 = require("@libs/Navigation/Navigation");
const UserUtils_1 = require("@libs/UserUtils");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const TwoFactorAuthForm_1 = require("./TwoFactorAuthForm");
const TwoFactorAuthWrapper_1 = require("./TwoFactorAuthWrapper");
const TROUBLESHOOTING_LINK = 'https://help.expensify.com/articles/new-expensify/settings/Enable-Two-Factor-Authentication';
function VerifyPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const contactMethod = (0, UserUtils_1.getContactMethod)(account?.primaryLogin, session?.email);
    const formRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        (0, Session_1.clearAccountMessages)();
        return () => {
            (0, Session_1.clearAccountMessages)();
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!account?.requiresTwoFactorAuth || !account.codesAreCopied) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_SUCCESS.getRoute(route.params?.backTo, route.params?.forwardTo), { forceReplace: true });
    }, [account?.codesAreCopied, account?.requiresTwoFactorAuth, route.params?.backTo, route.params?.forwardTo]);
    /**
     * Splits the two-factor auth secret key in 4 chunks
     */
    function splitSecretInChunks(secret) {
        if (secret.length !== 16) {
            return secret;
        }
        return `${secret.slice(0, 4)} ${secret.slice(4, 8)} ${secret.slice(8, 12)} ${secret.slice(12, secret.length)}`;
    }
    /**
     * Builds the URL string to generate the QRCode, using the otpauth:// protocol,
     * so it can be detected by authenticator apps
     */
    function buildAuthenticatorUrl() {
        return `otpauth://totp/Expensify:${contactMethod}?secret=${account?.twoFactorAuthSecretKey}&issuer=Expensify`;
    }
    const scrollViewRef = (0, react_1.useRef)(null);
    const handleInputFocus = (0, react_1.useCallback)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            requestAnimationFrame(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            });
        });
    }, []);
    return (<TwoFactorAuthWrapper_1.default stepName={CONST_1.default.TWO_FACTOR_AUTH_STEPS.VERIFY} title={translate('twoFactorAuth.headerTitle')} stepCounter={{
            step: 2,
            text: translate('twoFactorAuth.stepVerify'),
            total: 3,
        }} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_2FA_ROOT.getRoute(route.params?.backTo, route.params?.forwardTo))} shouldEnableViewportOffsetTop>
            <ScrollView_1.default ref={scrollViewRef} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.flexGrow1}>
                <react_native_1.View style={[styles.ph5, styles.mt3]}>
                    <Text_1.default>
                        {translate('twoFactorAuth.scanCode')}
                        <TextLink_1.default href={TROUBLESHOOTING_LINK}> {translate('twoFactorAuth.authenticatorApp')}</TextLink_1.default>.
                    </Text_1.default>
                    <react_native_1.View style={[styles.alignItemsCenter, styles.mt5]}>
                        <QRCode_1.default url={buildAuthenticatorUrl()} logo={expensify_logo_round_transparent_png_1.default} logoRatio={CONST_1.default.QR.EXPENSIFY_LOGO_SIZE_RATIO} logoMarginRatio={CONST_1.default.QR.EXPENSIFY_LOGO_MARGIN_RATIO}/>
                    </react_native_1.View>
                    <Text_1.default style={styles.mt5}>{translate('twoFactorAuth.addKey')}</Text_1.default>
                    <react_native_1.View style={[styles.mt11, styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween]}>
                        {!!account?.twoFactorAuthSecretKey && <Text_1.default>{splitSecretInChunks(account?.twoFactorAuthSecretKey ?? '')}</Text_1.default>}
                        <PressableWithDelayToggle_1.default text={translate('twoFactorAuth.copy')} textChecked={translate('common.copied')} tooltipText="" tooltipTextChecked="" icon={Expensicons.Copy} inline={false} onPress={() => Clipboard_1.default.setString(account?.twoFactorAuthSecretKey ?? '')} styles={[styles.button, styles.buttonMedium, styles.twoFactorAuthCopyCodeButton]} textStyles={[styles.buttonMediumText]} accessible={false}/>
                    </react_native_1.View>
                    <Text_1.default style={styles.mt11}>{translate('twoFactorAuth.enterCode')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mh5, styles.mb4, styles.mt3]}>
                    <TwoFactorAuthForm_1.default innerRef={formRef} shouldAutoFocusOnMobile={false} onFocus={handleInputFocus}/>
                </react_native_1.View>
            </ScrollView_1.default>
            <FixedFooter_1.default style={[styles.mt2, styles.pt2]}>
                <Button_1.default success large text={translate('common.next')} isLoading={account?.isLoading} onPress={() => {
            if (!formRef.current) {
                return;
            }
            formRef.current.validateAndSubmitForm();
        }}/>
            </FixedFooter_1.default>
        </TwoFactorAuthWrapper_1.default>);
}
VerifyPage.displayName = 'VerifyPage';
exports.default = VerifyPage;
