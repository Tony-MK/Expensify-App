"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Session_1 = require("@userActions/Session");
const SignInRedirect_1 = require("@userActions/SignInRedirect");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function UnlinkLoginForm() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS, { canBeMissing: true });
    const unlinkMessage = account?.message === 'unlinkLoginForm.linkSent' || account?.message === 'unlinkLoginForm.successfullyUnlinkedLogin' ? translate(account?.message) : account?.message;
    const primaryLogin = (0, react_1.useMemo)(() => {
        if (!account?.primaryLogin) {
            return '';
        }
        return expensify_common_1.Str.isSMSLogin(account.primaryLogin) ? expensify_common_1.Str.removeSMSDomain(account.primaryLogin) : account.primaryLogin;
    }, [account?.primaryLogin]);
    const secondaryLogin = (0, react_1.useMemo)(() => {
        if (!credentials?.login) {
            return '';
        }
        return expensify_common_1.Str.isSMSLogin(credentials.login) ? expensify_common_1.Str.removeSMSDomain(credentials.login) : credentials.login;
    }, [credentials?.login]);
    return (<>
            <react_native_1.View style={[styles.mt5]}>
                <Text_1.default>{translate('unlinkLoginForm.toValidateLogin', { primaryLogin, secondaryLogin })}</Text_1.default>
            </react_native_1.View>
            <react_native_1.View style={[styles.mv5]}>
                <Text_1.default>{translate('unlinkLoginForm.noLongerHaveAccess', { primaryLogin })}</Text_1.default>
            </react_native_1.View>
            {!!unlinkMessage && (
        // DotIndicatorMessage mostly expects onyxData errors, so we need to mock an object so that the messages looks similar to prop.account.errors
        <DotIndicatorMessage_1.default style={[styles.mb5, styles.flex0]} type="success" 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        messages={{ 0: unlinkMessage }}/>)}
            {!!account?.errors && !(0, EmptyObject_1.isEmptyObject)(account.errors) && (<DotIndicatorMessage_1.default style={[styles.mb5]} type="error" messages={(0, ErrorUtils_1.getErrorsWithTranslationData)(account.errors)}/>)}
            <react_native_1.View style={[styles.mb4, styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter]}>
                <PressableWithFeedback_1.default accessibilityLabel={translate('common.back')} onPress={() => (0, SignInRedirect_1.default)()}>
                    <Text_1.default style={[styles.link]}>{translate('common.back')}</Text_1.default>
                </PressableWithFeedback_1.default>
                <Button_1.default success text={translate('unlinkLoginForm.unlink')} isLoading={account?.isLoading && account.loadingForm === CONST_1.default.FORMS.UNLINK_LOGIN_FORM} onPress={() => (0, Session_1.requestUnlinkValidationLink)()} isDisabled={!!isOffline || !!account?.message}/>
            </react_native_1.View>
        </>);
}
UnlinkLoginForm.displayName = 'UnlinkLoginForm';
exports.default = UnlinkLoginForm;
