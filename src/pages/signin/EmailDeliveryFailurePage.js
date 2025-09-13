"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function EmailDeliveryFailurePage() {
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS);
    const styles = (0, useThemeStyles_1.default)();
    const { isKeyboardShown } = (0, useKeyboardState_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const login = (0, react_1.useMemo)(() => {
        if (!credentials?.login) {
            return '';
        }
        return expensify_common_1.Str.isSMSLogin(credentials.login) ? expensify_common_1.Str.removeSMSDomain(credentials.login) : credentials.login;
    }, [credentials?.login]);
    // This view doesn't have a field for user input, so dismiss the device keyboard if shown
    (0, react_1.useEffect)(() => {
        if (!isKeyboardShown) {
            return;
        }
        react_native_1.Keyboard.dismiss();
    }, [isKeyboardShown]);
    return (<>
            <react_native_1.View style={[styles.mv3, styles.flexRow]}>
                <react_native_1.View style={[styles.flex1]}>
                    <Text_1.default>{translate('emailDeliveryFailurePage.ourEmailProvider', { login })}</Text_1.default>
                    <Text_1.default style={[styles.mt5]}>
                        <Text_1.default style={[styles.textStrong]}>{translate('emailDeliveryFailurePage.confirmThat', { login })}</Text_1.default>
                        {translate('emailDeliveryFailurePage.emailAliases')}
                    </Text_1.default>
                    <Text_1.default style={[styles.mt5]}>
                        <Text_1.default style={[styles.textStrong]}>{translate('emailDeliveryFailurePage.ensureYourEmailClient')}</Text_1.default>
                        {translate('emailDeliveryFailurePage.youCanFindDirections')}
                        <TextLink_1.default href={CONST_1.default.SET_NOTIFICATION_LINK} style={[styles.link]}>
                            {translate('common.here')}
                        </TextLink_1.default>
                        {translate('emailDeliveryFailurePage.helpConfigure')}
                    </Text_1.default>
                    <Text_1.default style={styles.mt5}>
                        {translate('emailDeliveryFailurePage.onceTheAbove')}
                        <TextLink_1.default href={`mailto:${CONST_1.default.EMAIL.CONCIERGE}`} style={[styles.link]}>
                            {CONST_1.default.EMAIL.CONCIERGE}
                        </TextLink_1.default>
                        {translate('emailDeliveryFailurePage.toUnblock')}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={[styles.mv4, styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter]}>
                <PressableWithFeedback_1.default onPress={() => Session.clearSignInData()} role="button" accessibilityLabel={translate('common.back')} 
    // disable hover dim for switch
    hoverDimmingValue={1} pressDimmingValue={0.2}>
                    <Text_1.default style={[styles.link]}>{translate('common.back')}</Text_1.default>
                </PressableWithFeedback_1.default>
            </react_native_1.View>
        </>);
}
EmailDeliveryFailurePage.displayName = 'EmailDeliveryFailurePage';
exports.default = EmailDeliveryFailurePage;
