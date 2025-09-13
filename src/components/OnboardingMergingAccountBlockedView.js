"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const Welcome_1 = require("@userActions/Welcome");
const ROUTES_1 = require("@src/ROUTES");
const BlockingView_1 = require("./BlockingViews/BlockingView");
const Button_1 = require("./Button");
const Illustrations_1 = require("./Icon/Illustrations");
function OnboardingMergingAccountBlockedView({ workEmail, isVsb }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<>
            <BlockingView_1.default icon={Illustrations_1.ToddBehindCloud} iconWidth={variables_1.default.modalTopIconWidth} iconHeight={variables_1.default.modalTopIconHeight} title={translate('onboarding.mergeBlockScreen.title')} subtitle={translate('onboarding.mergeBlockScreen.subtitle', { workEmail })} subtitleStyle={[styles.colorMuted]}/>
            <Button_1.default success large style={[styles.mb5]} text={translate('common.buttonConfirm')} onPress={() => {
            (0, Welcome_1.setOnboardingErrorMessage)('');
            if (isVsb) {
                Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute());
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_PURPOSE.getRoute());
        }}/>
        </>);
}
OnboardingMergingAccountBlockedView.displayName = 'OnboardingMergingAccountBlockedView';
exports.default = OnboardingMergingAccountBlockedView;
