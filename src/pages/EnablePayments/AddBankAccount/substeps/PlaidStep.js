"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const AddPlaidBankAccount_1 = require("@components/AddPlaidBankAccount");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccounts_1 = require("@userActions/BankAccounts");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PersonalBankAccountForm_1 = require("@src/types/form/PersonalBankAccountForm");
const BANK_INFO_STEP_KEYS = PersonalBankAccountForm_1.default.BANK_INFO_STEP;
function PlaidStep({ onNext }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const [personalBankAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM_DRAFT);
    const [plaidData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_DATA);
    const selectedPlaidAccountID = personalBankAccountDraft?.[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID] ?? '';
    const handleNextPress = (0, react_1.useCallback)(() => {
        const selectedPlaidBankAccount = (plaidData?.bankAccounts ?? []).find((account) => account.plaidAccountID === personalBankAccountDraft?.[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID]);
        const bankAccountData = {
            [BANK_INFO_STEP_KEYS.ROUTING_NUMBER]: selectedPlaidBankAccount?.[BANK_INFO_STEP_KEYS.ROUTING_NUMBER],
            [BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER]: selectedPlaidBankAccount?.[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER],
            [BANK_INFO_STEP_KEYS.PLAID_MASK]: selectedPlaidBankAccount?.mask,
            [BANK_INFO_STEP_KEYS.IS_SAVINGS]: selectedPlaidBankAccount?.[BANK_INFO_STEP_KEYS.IS_SAVINGS],
            [BANK_INFO_STEP_KEYS.BANK_NAME]: plaidData?.[BANK_INFO_STEP_KEYS.BANK_NAME] ?? '',
            [BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID]: selectedPlaidBankAccount?.[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID],
            [BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN]: plaidData?.[BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN] ?? '',
        };
        (0, BankAccounts_1.updateAddPersonalBankAccountDraft)(bankAccountData);
        onNext();
    }, [onNext, personalBankAccountDraft, plaidData]);
    const handleSelectPlaidAccount = (plaidAccountID) => {
        (0, BankAccounts_1.updateAddPersonalBankAccountDraft)({ plaidAccountID });
    };
    (0, react_1.useEffect)(() => {
        const plaidBankAccounts = plaidData?.bankAccounts ?? [];
        if (isFocused || plaidBankAccounts.length) {
            return;
        }
        (0, BankAccounts_1.clearPersonalBankAccountSetupType)();
    }, [isFocused, plaidData]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM} validate={BankAccounts_1.validatePlaidSelection} onSubmit={handleNextPress} scrollContextEnabled submitButtonText={translate('common.next')} style={[styles.mh5, styles.flexGrow1]} isSubmitButtonVisible={(plaidData?.bankAccounts ?? []).length > 0} shouldHideFixErrorsAlert>
            <InputWrapper_1.default InputComponent={AddPlaidBankAccount_1.default} text={translate('walletPage.chooseAccountBody')} onSelect={handleSelectPlaidAccount} plaidData={plaidData} onExitPlaid={BankAccounts_1.clearPersonalBankAccountSetupType} allowDebit isDisplayedInWalletFlow selectedPlaidAccountID={selectedPlaidAccountID} inputID={BANK_INFO_STEP_KEYS.SELECTED_PLAID_ACCOUNT_ID} defaultValue={selectedPlaidAccountID}/>
        </FormProvider_1.default>);
}
PlaidStep.displayName = 'PlaidStep';
exports.default = PlaidStep;
