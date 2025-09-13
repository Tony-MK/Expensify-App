"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const Navigation_1 = require("@navigation/Navigation");
const BankAccounts = require("@userActions/BankAccounts");
const Wallet = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const FeesStep_1 = require("./substeps/FeesStep");
const TermsStep_1 = require("./substeps/TermsStep");
const termsAndFeesSubsteps = [FeesStep_1.default, TermsStep_1.default];
function FeesAndTerms() {
    const { translate } = (0, useLocalize_1.default)();
    const [walletTerms] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS);
    const submit = () => {
        BankAccounts.acceptWalletTerms({
            hasAcceptedTerms: true,
            reportID: walletTerms?.chatReportID ?? '',
        });
        BankAccounts.clearPersonalBankAccount();
        Wallet.resetWalletAdditionalDetailsDraft();
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET);
    };
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo } = (0, useSubStep_1.default)({ bodyContent: termsAndFeesSubsteps, startFrom: 0, onFinished: submit });
    const handleBackButtonPress = () => {
        if (screenIndex === 0) {
            Wallet.updateCurrentStep(CONST_1.default.WALLET.STEP.ONFIDO);
            return;
        }
        prevScreen();
    };
    return (<InteractiveStepWrapper_1.default wrapperID={FeesAndTerms.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('termsStep.headerTitleRefactor')} handleBackButtonPress={handleBackButtonPress} startStepIndex={3} stepNames={CONST_1.default.WALLET.STEP_NAMES}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo}/>
        </InteractiveStepWrapper_1.default>);
}
FeesAndTerms.displayName = 'TermsAndFees';
exports.default = FeesAndTerms;
