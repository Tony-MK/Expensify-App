"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const LottieAnimations_1 = require("@components/LottieAnimations");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Link_1 = require("@userActions/Link");
const TwoFactorAuthActions_1 = require("@userActions/TwoFactorAuthActions");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const TwoFactorAuthWrapper_1 = require("./TwoFactorAuthWrapper");
function SuccessPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const goBack = (0, react_1.useCallback)(() => {
        if (route.params?.backTo === ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH) {
            Navigation_1.default.dismissModal();
            return;
        }
        (0, TwoFactorAuthActions_1.quitAndNavigateBack)(route.params?.backTo ?? ROUTES_1.default.SETTINGS_2FA_ROOT.getRoute());
    }, [route.params?.backTo]);
    (0, react_1.useEffect)(() => {
        return () => {
            // When the 2FA RHP is closed, we want to remove the 2FA required page from the navigation stack too.
            if (route.params?.backTo !== ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH) {
                return;
            }
            Navigation_1.default.popRootToTop();
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return (<TwoFactorAuthWrapper_1.default stepName={CONST_1.default.TWO_FACTOR_AUTH_STEPS.SUCCESS} title={translate('twoFactorAuth.headerTitle')} stepCounter={{
            step: 3,
            text: translate('twoFactorAuth.stepSuccess'),
        }} onBackButtonPress={goBack}>
            <ConfirmationPage_1.default illustration={LottieAnimations_1.default.Fireworks} heading={translate('twoFactorAuth.enabled')} description={translate('twoFactorAuth.congrats')} shouldShowButton buttonText={translate('common.buttonConfirm')} onButtonPress={() => {
            goBack();
            if (route.params?.forwardTo) {
                (0, Link_1.openLink)(route.params.forwardTo, environmentURL);
            }
        }} containerStyle={styles.flex1}/>
        </TwoFactorAuthWrapper_1.default>);
}
SuccessPage.displayName = 'SuccessPage';
exports.default = SuccessPage;
