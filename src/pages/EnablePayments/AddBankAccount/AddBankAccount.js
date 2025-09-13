"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const InteractiveStepSubHeader_1 = require("@components/InteractiveStepSubHeader");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccounts_1 = require("@libs/actions/BankAccounts");
const PaymentMethods_1 = require("@libs/actions/PaymentMethods");
const Wallet_1 = require("@libs/actions/Wallet");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SetupMethod_1 = require("./SetupMethod");
const ConfirmationStep_1 = require("./substeps/ConfirmationStep");
const PlaidStep_1 = require("./substeps/PlaidStep");
const plaidSubsteps = [PlaidStep_1.default, ConfirmationStep_1.default];
function AddBankAccount() {
    const [plaidData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_DATA);
    const [personalBankAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT);
    const [personalBankAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM_DRAFT);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const submit = (0, react_1.useCallback)(() => {
        const bankAccounts = plaidData?.bankAccounts ?? [];
        const selectedPlaidBankAccount = bankAccounts.find((bankAccount) => bankAccount.plaidAccountID === personalBankAccountDraft?.plaidAccountID);
        if (selectedPlaidBankAccount) {
            (0, BankAccounts_1.addPersonalBankAccount)(selectedPlaidBankAccount);
        }
    }, [personalBankAccountDraft?.plaidAccountID, plaidData?.bankAccounts]);
    const isSetupTypeChosen = personalBankAccountDraft?.setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID;
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo } = (0, useSubStep_1.default)({ bodyContent: plaidSubsteps, startFrom: 0, onFinished: submit });
    const exitFlow = (shouldContinue = false) => {
        const exitReportID = personalBankAccount?.exitReportID;
        const onSuccessFallbackRoute = personalBankAccount?.onSuccessFallbackRoute ?? '';
        if (exitReportID) {
            Navigation_1.default.dismissModalWithReport({ reportID: exitReportID });
            return;
        }
        if (shouldContinue && onSuccessFallbackRoute) {
            (0, PaymentMethods_1.continueSetup)(onSuccessFallbackRoute);
            return;
        }
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET);
    };
    const handleBackButtonPress = () => {
        if (!isSetupTypeChosen) {
            exitFlow();
            return;
        }
        if (screenIndex === 0) {
            (0, BankAccounts_1.clearPersonalBankAccount)();
            (0, Wallet_1.updateCurrentStep)(null);
            Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET);
            return;
        }
        prevScreen();
    };
    return (<ScreenWrapper_1.default testID={AddBankAccount.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldShowOfflineIndicator>
            <HeaderWithBackButton_1.default shouldShowBackButton onBackButtonPress={handleBackButtonPress} title={translate('bankAccount.addBankAccount')}/>
            <react_native_1.View style={styles.flex1}>
                {isSetupTypeChosen ? (<>
                        <react_native_1.View style={[styles.ph5, styles.mb5, styles.mt3, { height: CONST_1.default.BANK_ACCOUNT.STEPS_HEADER_HEIGHT }]}>
                            <InteractiveStepSubHeader_1.default startStepIndex={0} stepNames={CONST_1.default.WALLET.STEP_NAMES}/>
                        </react_native_1.View>
                        <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo}/>
                    </>) : (<SetupMethod_1.default />)}
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
AddBankAccount.displayName = 'AddBankAccountPage';
exports.default = AddBankAccount;
