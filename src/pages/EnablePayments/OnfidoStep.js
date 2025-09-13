"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Onfido_1 = require("@components/Onfido");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Growl_1 = require("@libs/Growl");
const Navigation_1 = require("@libs/Navigation/Navigation");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Wallet_1 = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const OnfidoPrivacy_1 = require("./OnfidoPrivacy");
function OnfidoStep() {
    const { translate } = (0, useLocalize_1.default)();
    const [walletOnfidoData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ONFIDO, {
        canBeMissing: true,
        // Let's get a new onfido token each time the user hits this flow (as it should only be once)
        initWithStoredValues: false,
    });
    const shouldShowOnfido = walletOnfidoData?.hasAcceptedPrivacyPolicy && !walletOnfidoData?.isLoading && !walletOnfidoData?.errors && walletOnfidoData?.sdkToken;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack();
    }, []);
    const goToPreviousStep = (0, react_1.useCallback)(() => {
        (0, Wallet_1.updateCurrentStep)(CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS);
    }, []);
    const reportError = (0, react_1.useCallback)(() => {
        Growl_1.default.error(translate('onfidoStep.genericError'), 10000);
    }, [translate]);
    const verifyIdentity = (0, react_1.useCallback)((data) => {
        (0, BankAccounts_1.verifyIdentity)({
            onfidoData: JSON.stringify({
                ...data,
                applicantID: walletOnfidoData?.applicantID,
            }),
        });
    }, [walletOnfidoData?.applicantID]);
    return (<>
            <HeaderWithBackButton_1.default title={translate('onfidoStep.verifyIdentity')} onBackButtonPress={goToPreviousStep}/>
            <FullPageOfflineBlockingView_1.default>
                {shouldShowOnfido ? (<Onfido_1.default sdkToken={walletOnfidoData.sdkToken ?? ''} onUserExit={goBack} onError={reportError} onSuccess={verifyIdentity}/>) : (<OnfidoPrivacy_1.default walletOnfidoData={walletOnfidoData}/>)}
            </FullPageOfflineBlockingView_1.default>
        </>);
}
OnfidoStep.displayName = 'OnfidoStep';
exports.default = OnfidoStep;
