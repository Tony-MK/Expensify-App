"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const Text_1 = require("@components/Text");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ChangeExpensifyLoginLink_1 = require("./ChangeExpensifyLoginLink");
const Terms_1 = require("./Terms");
function ChooseSSOOrMagicCode({ setIsUsingMagicCode }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isKeyboardShown } = (0, useKeyboardState_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    // This view doesn't have a field for user input, so dismiss the device keyboard if shown
    (0, react_1.useEffect)(() => {
        if (!isKeyboardShown) {
            return;
        }
        react_native_1.Keyboard.dismiss();
    }, [isKeyboardShown]);
    return (<>
            <react_native_1.View>
                <Text_1.default style={[styles.loginHeroBody, styles.mb5, styles.textNormal, !shouldUseNarrowLayout ? styles.textAlignLeft : {}]}>{translate('samlSignIn.welcomeSAMLEnabled')}</Text_1.default>
                <Button_1.default isDisabled={isOffline} success large style={[styles.mv3]} text={translate('samlSignIn.useSingleSignOn')} isLoading={account?.isLoading} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.SAML_SIGN_IN);
        }}/>

                <react_native_1.View style={[styles.mt5]}>
                    <Text_1.default style={[styles.loginHeroBody, styles.mb5, styles.textNormal, !shouldUseNarrowLayout ? styles.textAlignLeft : {}]}>
                        {translate('samlSignIn.orContinueWithMagicCode')}
                    </Text_1.default>
                </react_native_1.View>

                <Button_1.default isDisabled={isOffline} style={[styles.mv3]} large text={translate('samlSignIn.useMagicCode')} isLoading={account?.isLoading && account?.loadingForm === (account?.requiresTwoFactorAuth ? CONST_1.default.FORMS.VALIDATE_TFA_CODE_FORM : CONST_1.default.FORMS.VALIDATE_CODE_FORM)} onPress={() => {
            (0, Session_1.resendValidateCode)(credentials?.login);
            setIsUsingMagicCode(true);
        }}/>
                {!!account && !(0, EmptyObject_1.isEmptyObject)(account.errors) && <FormHelpMessage_1.default message={(0, ErrorUtils_1.getLatestErrorMessage)(account)}/>}
                <ChangeExpensifyLoginLink_1.default onPress={() => (0, Session_1.clearSignInData)()}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.mt5, styles.signInPageWelcomeTextContainer]}>
                <Terms_1.default />
            </react_native_1.View>
        </>);
}
ChooseSSOOrMagicCode.displayName = 'ChooseSSOOrMagicCode';
exports.default = ChooseSSOOrMagicCode;
