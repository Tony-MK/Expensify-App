"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var FormHelpMessage_1 = require("@components/FormHelpMessage");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var HybridApp_1 = require("@userActions/HybridApp");
var Session_1 = require("@userActions/Session");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ChangeExpensifyLoginLink_1 = require("./ChangeExpensifyLoginLink");
var Terms_1 = require("./Terms");
function SignUpWelcomeForm() {
    var network = (0, useNetwork_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false })[0];
    var serverErrorText = (0, react_1.useMemo)(function () { return (account ? (0, ErrorUtils_1.getLatestErrorMessage)(account) : ''); }, [account]);
    return (<>
            <react_native_1.View style={[styles.mt3, styles.mb2]}>
                <Button_1.default isDisabled={network.isOffline || !!(account === null || account === void 0 ? void 0 : account.message)} success large text={translate('welcomeSignUpForm.join')} isLoading={account === null || account === void 0 ? void 0 : account.isLoading} onPress={function () {
            (0, Session_1.signUpUser)();
            (0, HybridApp_1.setReadyToShowAuthScreens)(true);
        }} pressOnEnter style={[styles.mb2]}/>
                {!!serverErrorText && (<FormHelpMessage_1.default isError message={serverErrorText}/>)}
                <ChangeExpensifyLoginLink_1.default onPress={function () { return (0, Session_1.clearSignInData)(); }}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.mt4, styles.signInPageWelcomeTextContainer]}>
                <Terms_1.default />
            </react_native_1.View>
        </>);
}
SignUpWelcomeForm.displayName = 'SignUpWelcomeForm';
exports.default = SignUpWelcomeForm;
