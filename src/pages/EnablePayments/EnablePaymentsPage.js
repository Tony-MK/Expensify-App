"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Wallet_1 = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ActivateStep_1 = require("./ActivateStep");
const AdditionalDetailsStep_1 = require("./AdditionalDetailsStep");
const FailedKYC_1 = require("./FailedKYC");
// Steps
const OnfidoStep_1 = require("./OnfidoStep");
const TermsStep_1 = require("./TermsStep");
function EnablePaymentsPage() {
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, {
        canBeMissing: true,
        // We want to refresh the wallet each time the user attempts to activate the wallet so we won't use the
        // stored values here.
        initWithStoredValues: false,
    });
    const { isPendingOnfidoResult, hasFailedOnfido } = userWallet ?? {};
    (0, react_1.useEffect)(() => {
        if (isOffline) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (isPendingOnfidoResult || hasFailedOnfido) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET, { forceReplace: true });
            return;
        }
        (0, Wallet_1.openEnablePaymentsPage)();
    }, [isOffline, isPendingOnfidoResult, hasFailedOnfido]);
    if ((0, EmptyObject_1.isEmptyObject)(userWallet)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator={userWallet?.currentStep !== CONST_1.default.WALLET.STEP.ONFIDO} includeSafeAreaPaddingBottom testID={EnablePaymentsPage.displayName} forwardedFSClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
            {() => {
            if (userWallet?.errorCode === CONST_1.default.WALLET.ERROR.KYC) {
                return (<>
                            <HeaderWithBackButton_1.default title={translate('additionalDetailsStep.headerTitle')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET)}/>
                            <FailedKYC_1.default />
                        </>);
            }
            const currentStep = userWallet?.currentStep || CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS;
            switch (currentStep) {
                case CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS:
                case CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS_KBA:
                    return <AdditionalDetailsStep_1.default />;
                case CONST_1.default.WALLET.STEP.ONFIDO:
                    return <OnfidoStep_1.default />;
                case CONST_1.default.WALLET.STEP.TERMS:
                    return <TermsStep_1.default userWallet={userWallet}/>;
                case CONST_1.default.WALLET.STEP.ACTIVATE:
                    return <ActivateStep_1.default userWallet={userWallet}/>;
                default:
                    return null;
            }
        }}
        </ScreenWrapper_1.default>);
}
EnablePaymentsPage.displayName = 'EnablePaymentsPage';
exports.default = EnablePaymentsPage;
