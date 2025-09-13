"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const HybridApp_1 = require("@userActions/HybridApp");
const Session_1 = require("@userActions/Session");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ChangeExpensifyLoginLink_1 = require("./ChangeExpensifyLoginLink");
const Terms_1 = require("./Terms");
function SignUpWelcomeForm() {
    const network = (0, useNetwork_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const serverErrorText = (0, react_1.useMemo)(() => (account ? (0, ErrorUtils_1.getLatestErrorMessage)(account) : ''), [account]);
    return (<>
            <react_native_1.View style={[styles.mt3, styles.mb2]}>
                <Button_1.default isDisabled={network.isOffline || !!account?.message} success large text={translate('welcomeSignUpForm.join')} isLoading={account?.isLoading} onPress={() => {
            (0, Session_1.signUpUser)();
            (0, HybridApp_1.setReadyToShowAuthScreens)(true);
        }} pressOnEnter style={[styles.mb2]}/>
                {!!serverErrorText && (<FormHelpMessage_1.default isError message={serverErrorText}/>)}
                <ChangeExpensifyLoginLink_1.default onPress={() => (0, Session_1.clearSignInData)()}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.mt4, styles.signInPageWelcomeTextContainer]}>
                <Terms_1.default />
            </react_native_1.View>
        </>);
}
SignUpWelcomeForm.displayName = 'SignUpWelcomeForm';
exports.default = SignUpWelcomeForm;
