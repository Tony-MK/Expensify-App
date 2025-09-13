"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const FixedFooter_1 = require("@components/FixedFooter");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const InteractiveStepSubHeader_1 = require("@components/InteractiveStepSubHeader");
const Onfido_1 = require("@components/Onfido");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils = require("@libs/ErrorUtils");
const Growl_1 = require("@libs/Growl");
const BankAccounts = require("@userActions/BankAccounts");
const Wallet = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ONFIDO_ERROR_DISPLAY_DURATION = 10000;
function VerifyIdentity() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [walletOnfidoData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ONFIDO, { initWithStoredValues: false });
    const openOnfidoFlow = () => {
        BankAccounts.openOnfidoFlow();
    };
    const handleOnfidoSuccess = (0, react_1.useCallback)((onfidoData) => {
        BankAccounts.verifyIdentity({
            onfidoData: JSON.stringify({
                ...onfidoData,
                applicantID: walletOnfidoData?.applicantID,
            }),
        });
        BankAccounts.updateAddPersonalBankAccountDraft({ isOnfidoSetupComplete: true });
    }, [walletOnfidoData?.applicantID]);
    const onfidoError = ErrorUtils.getLatestErrorMessage(walletOnfidoData) ?? '';
    const handleOnfidoError = () => {
        Growl_1.default.error(translate('onfidoStep.genericError'), ONFIDO_ERROR_DISPLAY_DURATION);
    };
    const goBack = () => {
        Wallet.updateCurrentStep(CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS);
    };
    return (<ScreenWrapper_1.default testID={VerifyIdentity.displayName}>
            <HeaderWithBackButton_1.default title={translate('onfidoStep.verifyIdentity')} onBackButtonPress={goBack}/>
            <react_native_1.View style={[styles.ph5, styles.mt3, { height: CONST_1.default.BANK_ACCOUNT.STEPS_HEADER_HEIGHT }]}>
                <InteractiveStepSubHeader_1.default startStepIndex={2} stepNames={CONST_1.default.WALLET.STEP_NAMES}/>
            </react_native_1.View>
            <FullPageOfflineBlockingView_1.default>
                <ScrollView_1.default contentContainerStyle={styles.flex1}>
                    {walletOnfidoData?.hasAcceptedPrivacyPolicy ? (<Onfido_1.default sdkToken={walletOnfidoData?.sdkToken ?? ''} onUserExit={goBack} onError={handleOnfidoError} onSuccess={handleOnfidoSuccess}/>) : (<>
                            <react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter, styles.m5, styles.ph5]}>
                                <Icon_1.default src={Illustrations.ToddBehindCloud} width={100} height={100}/>
                                <Text_1.default style={[styles.textHeadline, styles.mb2]}>{translate('onfidoStep.letsVerifyIdentity')}</Text_1.default>
                                <Text_1.default style={[styles.textAlignCenter, styles.textSupporting]}>{translate('onfidoStep.butFirst')}</Text_1.default>
                            </react_native_1.View>
                            <FixedFooter_1.default>
                                <FormAlertWithSubmitButton_1.default isAlertVisible={!!onfidoError} onSubmit={openOnfidoFlow} message={onfidoError} isLoading={walletOnfidoData?.isLoading} buttonText={onfidoError ? translate('onfidoStep.tryAgain') : translate('common.continue')} containerStyles={[styles.mh0, styles.mv0, styles.mb0]}/>
                            </FixedFooter_1.default>
                        </>)}
                </ScrollView_1.default>
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
VerifyIdentity.displayName = 'VerifyIdentity';
exports.default = VerifyIdentity;
