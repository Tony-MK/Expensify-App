"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const LottieAnimations_1 = require("@components/LottieAnimations");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ActivateStep({ userWallet }) {
    const { translate } = (0, useLocalize_1.default)();
    const [walletTerms] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS);
    const isActivatedWallet = userWallet?.tierName && [CONST_1.default.WALLET.TIER_NAME.GOLD, CONST_1.default.WALLET.TIER_NAME.PLATINUM].some((name) => name === userWallet.tierName);
    const animation = isActivatedWallet ? LottieAnimations_1.default.Fireworks : LottieAnimations_1.default.ReviewingBankInfo;
    let continueButtonText = '';
    if (walletTerms?.chatReportID) {
        continueButtonText = translate('activateStep.continueToPayment');
    }
    else if (walletTerms?.source === CONST_1.default.KYC_WALL_SOURCE.ENABLE_WALLET) {
        continueButtonText = translate('common.continue');
    }
    else {
        continueButtonText = translate('activateStep.continueToTransfer');
    }
    return (<>
            <HeaderWithBackButton_1.default title={translate('activateStep.headerTitle')}/>
            <ConfirmationPage_1.default illustration={animation} heading={translate(`activateStep.${isActivatedWallet ? 'activated' : 'checkBackLater'}Title`)} description={translate(`activateStep.${isActivatedWallet ? 'activated' : 'checkBackLater'}Message`)} shouldShowButton={isActivatedWallet} buttonText={continueButtonText} onButtonPress={() => (0, PaymentMethods_1.continueSetup)()}/>
        </>);
}
ActivateStep.displayName = 'ActivateStep';
exports.default = ActivateStep;
