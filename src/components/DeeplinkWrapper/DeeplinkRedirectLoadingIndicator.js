"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function DeeplinkRedirectLoadingIndicator({ openLinkInBrowser }) {
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email });
    return (<react_native_1.View style={styles.deeplinkWrapperContainer}>
            <react_native_1.View style={styles.deeplinkWrapperMessage}>
                <react_native_1.View style={styles.mb2}>
                    <Icon_1.default width={200} height={164} src={Illustrations.RocketBlue}/>
                </react_native_1.View>
                <Text_1.default style={[styles.textHeadline, styles.textXXLarge]}>{translate('deeplinkWrapper.launching')}</Text_1.default>
                <react_native_1.View style={[styles.mt2, styles.textAlignCenter]}>
                    <Text_1.default>{translate('deeplinkWrapper.loggedInAs', { email: currentUserLogin ?? '' })}</Text_1.default>
                    <Text_1.default style={[styles.textAlignCenter]}>
                        {translate('deeplinkWrapper.doNotSeePrompt')} <TextLink_1.default onPress={() => openLinkInBrowser(true)}>{translate('deeplinkWrapper.tryAgain')}</TextLink_1.default>
                        {translate('deeplinkWrapper.or')} <TextLink_1.default onPress={() => Navigation_1.default.goBack()}>{translate('deeplinkWrapper.continueInWeb')}</TextLink_1.default>.
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.deeplinkWrapperFooter}>
                <Icon_1.default width={154} height={34} fill={theme.success} src={Expensicons.ExpensifyWordmark}/>
            </react_native_1.View>
        </react_native_1.View>);
}
DeeplinkRedirectLoadingIndicator.displayName = 'DeeplinkRedirectLoadingIndicator';
exports.default = DeeplinkRedirectLoadingIndicator;
