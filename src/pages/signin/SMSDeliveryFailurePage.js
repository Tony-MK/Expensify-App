"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const Text_1 = require("@components/Text");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Session_1 = require("@userActions/Session");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ChangeExpensifyLoginLink_1 = require("./ChangeExpensifyLoginLink");
const Terms_1 = require("./Terms");
function SMSDeliveryFailurePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { isKeyboardShown } = (0, useKeyboardState_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const login = (0, react_1.useMemo)(() => {
        if (!credentials?.login) {
            return '';
        }
        return expensify_common_1.Str.isSMSLogin(credentials.login) ? expensify_common_1.Str.removeSMSDomain(credentials.login) : credentials.login;
    }, [credentials?.login]);
    const SMSDeliveryFailureMessage = account?.smsDeliveryFailureStatus?.message;
    const isResettingSMSDeliveryFailureStatus = account?.smsDeliveryFailureStatus?.isLoading;
    const timeData = (0, react_1.useMemo)(() => {
        if (!SMSDeliveryFailureMessage) {
            return null;
        }
        const parsedData = JSON.parse(SMSDeliveryFailureMessage);
        if (Array.isArray(parsedData) && !parsedData.length) {
            return null;
        }
        return parsedData;
    }, [SMSDeliveryFailureMessage]);
    const hasSMSDeliveryFailure = account?.smsDeliveryFailureStatus?.hasSMSDeliveryFailure;
    // We need to show two different messages after clicking validate button, based on API response for hasSMSDeliveryFailure.
    const [hasClickedValidate, setHasClickedValidate] = (0, react_1.useState)(false);
    const errorText = (0, react_1.useMemo)(() => (account ? (0, ErrorUtils_1.getLatestErrorMessage)(account) : ''), [account]);
    const shouldShowError = !!errorText;
    (0, react_1.useEffect)(() => {
        if (!isKeyboardShown) {
            return;
        }
        react_native_1.Keyboard.dismiss();
    }, [isKeyboardShown]);
    if (hasSMSDeliveryFailure && hasClickedValidate && !isResettingSMSDeliveryFailureStatus) {
        return (<>
                <react_native_1.View style={[styles.mv3, styles.flexRow]}>
                    <react_native_1.View style={[styles.flex1]}>
                        <Text_1.default>{translate('smsDeliveryFailurePage.validationFailed', { timeData })}</Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={[styles.mv4, styles.flexRow, styles.justifyContentBetween, styles.alignItemsEnd]}>
                    <Button_1.default success large text={translate('common.buttonConfirm')} onPress={() => (0, Session_1.clearSignInData)()} pressOnEnter style={styles.w100}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mt3, styles.mb2]}>
                    <ChangeExpensifyLoginLink_1.default onPress={() => (0, Session_1.clearSignInData)()}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mt4, styles.signInPageWelcomeTextContainer]}>
                    <Terms_1.default />
                </react_native_1.View>
            </>);
    }
    if (!hasSMSDeliveryFailure && hasClickedValidate) {
        return (<>
                <react_native_1.View style={[styles.mv3, styles.flexRow]}>
                    <react_native_1.View style={[styles.flex1]}>
                        <Text_1.default>{translate('smsDeliveryFailurePage.validationSuccess')}</Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={[styles.mv4, styles.flexRow, styles.justifyContentBetween, styles.alignItemsEnd]}>
                    <FormAlertWithSubmitButton_1.default buttonText={translate('common.send')} isLoading={account?.isLoading} onSubmit={() => (0, Session_1.beginSignIn)(login)} message={errorText} isAlertVisible={shouldShowError} containerStyles={[styles.w100, styles.mh0]}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mt3, styles.mb2]}>
                    <ChangeExpensifyLoginLink_1.default onPress={() => (0, Session_1.clearSignInData)()}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mt4, styles.signInPageWelcomeTextContainer]}>
                    <Terms_1.default />
                </react_native_1.View>
            </>);
    }
    return (<>
            <react_native_1.View style={[styles.mv3, styles.flexRow]}>
                <react_native_1.View style={[styles.flex1]}>
                    <Text_1.default>{translate('smsDeliveryFailurePage.smsDeliveryFailureMessage', { login })}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={[styles.mv4, styles.flexRow, styles.justifyContentBetween, styles.alignItemsEnd]}>
                <FormAlertWithSubmitButton_1.default buttonText={translate('common.validate')} isLoading={isResettingSMSDeliveryFailureStatus} onSubmit={() => {
            (0, Session_1.resetSMSDeliveryFailureStatus)(login);
            setHasClickedValidate(true);
        }} message={errorText} isAlertVisible={shouldShowError} containerStyles={[styles.w100, styles.mh0]}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.mt3, styles.mb2]}>
                <ChangeExpensifyLoginLink_1.default onPress={() => (0, Session_1.clearSignInData)()}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.mt4, styles.signInPageWelcomeTextContainer]}>
                <Terms_1.default />
            </react_native_1.View>
        </>);
}
SMSDeliveryFailurePage.displayName = 'SMSDeliveryFailurePage';
exports.default = SMSDeliveryFailurePage;
