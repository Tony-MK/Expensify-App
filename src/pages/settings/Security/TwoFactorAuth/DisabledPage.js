"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const Illustrations = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const TwoFactorAuthActions_1 = require("@userActions/TwoFactorAuthActions");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const TwoFactorAuthWrapper_1 = require("./TwoFactorAuthWrapper");
function DisabledPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<TwoFactorAuthWrapper_1.default stepName={CONST_1.default.TWO_FACTOR_AUTH_STEPS.DISABLED} title={translate('twoFactorAuth.disableTwoFactorAuth')}>
            <BlockingView_1.default icon={Illustrations.LockOpen} iconWidth={variables_1.default.modalTopIconWidth} iconHeight={variables_1.default.modalTopIconHeight} title={translate('twoFactorAuth.disabled')} subtitle={translate('twoFactorAuth.noAuthenticatorApp')}/>
            <FixedFooter_1.default style={[styles.flexGrow0]}>
                <Button_1.default success large text={translate('common.buttonConfirm')} onPress={() => (0, TwoFactorAuthActions_1.quitAndNavigateBack)(ROUTES_1.default.SETTINGS_SECURITY)}/>
            </FixedFooter_1.default>
        </TwoFactorAuthWrapper_1.default>);
}
DisabledPage.displayName = 'DisabledPage';
exports.default = DisabledPage;
