"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var expensify_logo_round_transparent_png_1 = require("@assets/images/expensify-logo-round-transparent.png");
var Button_1 = require("@components/Button");
var FixedFooter_1 = require("@components/FixedFooter");
var Expensicons = require("@components/Icon/Expensicons");
var PressableWithDelayToggle_1 = require("@components/Pressable/PressableWithDelayToggle");
var QRCode_1 = require("@components/QRCode");
var ScrollView_1 = require("@components/ScrollView");
var Text_1 = require("@components/Text");
var TextLink_1 = require("@components/TextLink");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Clipboard_1 = require("@libs/Clipboard");
var Navigation_1 = require("@libs/Navigation/Navigation");
var UserUtils_1 = require("@libs/UserUtils");
var Session_1 = require("@userActions/Session");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var TwoFactorAuthForm_1 = require("./TwoFactorAuthForm");
var TwoFactorAuthWrapper_1 = require("./TwoFactorAuthWrapper");
var TROUBLESHOOTING_LINK = 'https://help.expensify.com/articles/new-expensify/settings/Enable-Two-Factor-Authentication';
function VerifyPage(_a) {
    var _b, _c, _d;
    var route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false })[0];
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true })[0];
    var contactMethod = (0, UserUtils_1.getContactMethod)(account === null || account === void 0 ? void 0 : account.primaryLogin, session === null || session === void 0 ? void 0 : session.email);
    var formRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        (0, Session_1.clearAccountMessages)();
        return function () {
            (0, Session_1.clearAccountMessages)();
        };
    }, []);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (!(account === null || account === void 0 ? void 0 : account.requiresTwoFactorAuth) || !account.codesAreCopied) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_SUCCESS.getRoute((_a = route.params) === null || _a === void 0 ? void 0 : _a.backTo, (_b = route.params) === null || _b === void 0 ? void 0 : _b.forwardTo), { forceReplace: true });
    }, [account === null || account === void 0 ? void 0 : account.codesAreCopied, account === null || account === void 0 ? void 0 : account.requiresTwoFactorAuth, (_b = route.params) === null || _b === void 0 ? void 0 : _b.backTo, (_c = route.params) === null || _c === void 0 ? void 0 : _c.forwardTo]);
    /**
     * Splits the two-factor auth secret key in 4 chunks
     */
    function splitSecretInChunks(secret) {
        if (secret.length !== 16) {
            return secret;
        }
        return "".concat(secret.slice(0, 4), " ").concat(secret.slice(4, 8), " ").concat(secret.slice(8, 12), " ").concat(secret.slice(12, secret.length));
    }
    /**
     * Builds the URL string to generate the QRCode, using the otpauth:// protocol,
     * so it can be detected by authenticator apps
     */
    function buildAuthenticatorUrl() {
        return "otpauth://totp/Expensify:".concat(contactMethod, "?secret=").concat(account === null || account === void 0 ? void 0 : account.twoFactorAuthSecretKey, "&issuer=Expensify");
    }
    var scrollViewRef = (0, react_1.useRef)(null);
    var handleInputFocus = (0, react_1.useCallback)(function () {
        react_native_1.InteractionManager.runAfterInteractions(function () {
            requestAnimationFrame(function () {
                var _a;
                (_a = scrollViewRef.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd({ animated: true });
            });
        });
    }, []);
    return (<TwoFactorAuthWrapper_1.default stepName={CONST_1.default.TWO_FACTOR_AUTH_STEPS.VERIFY} title={translate('twoFactorAuth.headerTitle')} stepCounter={{
            step: 2,
            text: translate('twoFactorAuth.stepVerify'),
            total: 3,
        }} onBackButtonPress={function () { var _a, _b; return Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_2FA_ROOT.getRoute((_a = route.params) === null || _a === void 0 ? void 0 : _a.backTo, (_b = route.params) === null || _b === void 0 ? void 0 : _b.forwardTo)); }} shouldEnableViewportOffsetTop>
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
                        {!!(account === null || account === void 0 ? void 0 : account.twoFactorAuthSecretKey) && <Text_1.default>{splitSecretInChunks((_d = account === null || account === void 0 ? void 0 : account.twoFactorAuthSecretKey) !== null && _d !== void 0 ? _d : '')}</Text_1.default>}
                        <PressableWithDelayToggle_1.default text={translate('twoFactorAuth.copy')} textChecked={translate('common.copied')} tooltipText="" tooltipTextChecked="" icon={Expensicons.Copy} inline={false} onPress={function () { var _a; return Clipboard_1.default.setString((_a = account === null || account === void 0 ? void 0 : account.twoFactorAuthSecretKey) !== null && _a !== void 0 ? _a : ''); }} styles={[styles.button, styles.buttonMedium, styles.twoFactorAuthCopyCodeButton]} textStyles={[styles.buttonMediumText]} accessible={false}/>
                    </react_native_1.View>
                    <Text_1.default style={styles.mt11}>{translate('twoFactorAuth.enterCode')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mh5, styles.mb4, styles.mt3]}>
                    <TwoFactorAuthForm_1.default innerRef={formRef} shouldAutoFocusOnMobile={false} onFocus={handleInputFocus}/>
                </react_native_1.View>
            </ScrollView_1.default>
            <FixedFooter_1.default style={[styles.mt2, styles.pt2]}>
                <Button_1.default success large text={translate('common.next')} isLoading={account === null || account === void 0 ? void 0 : account.isLoading} onPress={function () {
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
