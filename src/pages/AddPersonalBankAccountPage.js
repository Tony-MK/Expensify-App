"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AddPlaidBankAccount_1 = require("@components/AddPlaidBankAccount");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getPlaidOAuthReceivedRedirectURI_1 = require("@libs/getPlaidOAuthReceivedRedirectURI");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const Navigation_1 = require("@libs/Navigation/Navigation");
const BankAccounts_1 = require("@userActions/BankAccounts");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
function AddPersonalBankAccountPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [selectedPlaidAccountId, setSelectedPlaidAccountId] = (0, react_1.useState)('');
    const [personalBankAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, { canBeMissing: true });
    const [plaidData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_DATA, { canBeMissing: true });
    const shouldShowSuccess = personalBankAccount?.shouldShowSuccess ?? false;
    const topmostFullScreenRoute = Navigation_1.navigationRef.current?.getRootState()?.routes.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name));
    const goBack = (0, react_1.useCallback)(() => {
        switch (topmostFullScreenRoute?.name) {
            case NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR:
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET);
                break;
            case NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR:
                Navigation_1.default.closeRHPFlow();
                break;
            default:
                Navigation_1.default.goBack();
                break;
        }
    }, [topmostFullScreenRoute?.name]);
    const submitBankAccountForm = (0, react_1.useCallback)(() => {
        const bankAccounts = plaidData?.bankAccounts ?? [];
        const policyID = personalBankAccount?.policyID;
        const source = personalBankAccount?.source;
        const selectedPlaidBankAccount = bankAccounts.find((bankAccount) => bankAccount.plaidAccountID === selectedPlaidAccountId);
        if (selectedPlaidBankAccount) {
            (0, BankAccounts_1.addPersonalBankAccount)(selectedPlaidBankAccount, policyID, source);
        }
    }, [plaidData, selectedPlaidAccountId, personalBankAccount]);
    const exitFlow = (0, react_1.useCallback)((shouldContinue = false) => {
        const exitReportID = personalBankAccount?.exitReportID;
        const onSuccessFallbackRoute = personalBankAccount?.onSuccessFallbackRoute ?? '';
        if (exitReportID) {
            Navigation_1.default.dismissModalWithReport({ reportID: exitReportID });
        }
        else if (shouldContinue && onSuccessFallbackRoute) {
            (0, PaymentMethods_1.continueSetup)(onSuccessFallbackRoute);
        }
        else {
            goBack();
        }
    }, [personalBankAccount, goBack]);
    (0, react_1.useEffect)(() => BankAccounts_1.clearPersonalBankAccount, []);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={shouldShowSuccess} shouldEnablePickerAvoiding={false} shouldShowOfflineIndicator={false} testID={AddPersonalBankAccountPage.displayName}>
            <FullPageNotFoundView_1.default>
                <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                    <HeaderWithBackButton_1.default title={translate('bankAccount.addBankAccount')} onBackButtonPress={shouldShowSuccess ? exitFlow : Navigation_1.default.goBack}/>
                    {shouldShowSuccess ? (<ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                            <ConfirmationPage_1.default heading={translate('addPersonalBankAccountPage.successTitle')} description={translate('addPersonalBankAccountPage.successMessage')} shouldShowButton buttonText={translate('common.continue')} onButtonPress={() => exitFlow(true)} containerStyle={styles.h100}/>
                        </ScrollView_1.default>) : (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM} isSubmitButtonVisible={(plaidData?.bankAccounts ?? []).length > 0} submitButtonText={translate('common.saveAndContinue')} scrollContextEnabled onSubmit={submitBankAccountForm} validate={BankAccounts_1.validatePlaidSelection} style={[styles.mh5, styles.flex1]} shouldHideFixErrorsAlert>
                            <InputWrapper_1.default inputID={ReimbursementAccountForm_1.default.BANK_INFO_STEP.SELECTED_PLAID_ACCOUNT_ID} InputComponent={AddPlaidBankAccount_1.default} onSelect={setSelectedPlaidAccountId} text={translate('walletPage.chooseAccountBody')} plaidData={plaidData} isDisplayedInWalletFlow onExitPlaid={Navigation_1.default.goBack} receivedRedirectURI={(0, getPlaidOAuthReceivedRedirectURI_1.default)()} selectedPlaidAccountID={selectedPlaidAccountId}/>
                        </FormProvider_1.default>)}
                </DelegateNoAccessWrapper_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
AddPersonalBankAccountPage.displayName = 'AddPersonalBankAccountPage';
exports.default = AddPersonalBankAccountPage;
