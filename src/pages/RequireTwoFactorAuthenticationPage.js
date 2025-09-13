"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Illustrations_1 = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const ROUTES_1 = require("@src/ROUTES");
function RequireTwoFactorAuthenticationPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<ScreenWrapper_1.default testID={RequireTwoFactorAuthenticationPage.displayName}>
            <react_native_1.View style={styles.twoFARequiredContainer}>
                <react_native_1.View style={[styles.twoFAIllustration, styles.alignItemsCenter]}>
                    <Icon_1.default src={Illustrations_1.Encryption} width={variables_1.default.twoFAIconHeight} height={variables_1.default.twoFAIconHeight}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mt2, styles.mh5, styles.dFlex, styles.alignItemsCenter]}>
                    <react_native_1.View style={styles.mb5}>
                        <Text_1.default style={[styles.textHeadlineH1, styles.textAlignCenter, styles.mv2]}>{translate('twoFactorAuth.twoFactorAuthIsRequiredForAdminsHeader')}</Text_1.default>
                        <Text_1.default style={[styles.textSupporting, styles.textAlignCenter]}>{translate('twoFactorAuth.twoFactorAuthIsRequiredForAdminsDescription')}</Text_1.default>
                    </react_native_1.View>
                    <Button_1.default large success pressOnEnter onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_ROOT.getRoute(ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH))} text={translate('twoFactorAuth.enableTwoFactorAuth')}/>
                </react_native_1.View>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
RequireTwoFactorAuthenticationPage.displayName = 'RequireTwoFactorAuthenticationPage';
exports.default = RequireTwoFactorAuthenticationPage;
