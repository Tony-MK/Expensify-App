"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const getBankInfoStepValues_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getBankInfoStepValues");
const getInitialSubStepForBankInfoStep_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getInitialSubStepForBankInfoStep");
const getInputKeysForBankInfoStep_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getInputKeysForBankInfoStep");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const AccountHolderDetails_1 = require("./subSteps/AccountHolderDetails");
const BankAccountDetails_1 = require("./subSteps/BankAccountDetails");
const Confirmation_1 = require("./subSteps/Confirmation");
const { COUNTRY } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA;
function BankInfo({ onBackButtonPress, onSubmit, policyID, stepNames }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const [corpayFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_FIELDS, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const currency = policy?.outputCurrency ?? '';
    const country = reimbursementAccountDraft?.[COUNTRY] ?? reimbursementAccount?.achData?.[COUNTRY] ?? '';
    const inputKeys = (0, getInputKeysForBankInfoStep_1.default)(corpayFields);
    const values = (0, react_1.useMemo)(() => (0, getBankInfoStepValues_1.getBankInfoStepValues)(inputKeys, reimbursementAccountDraft, reimbursementAccount), [inputKeys, reimbursementAccount, reimbursementAccountDraft]);
    const startFrom = (0, react_1.useMemo)(() => (0, getInitialSubStepForBankInfoStep_1.default)(values, corpayFields), [corpayFields, values]);
    const submit = () => {
        const { formFields, isLoading, isSuccess, ...corpayData } = corpayFields ?? {};
        (0, BankAccounts_1.createCorpayBankAccount)({ ...values, ...corpayData }, policyID);
    };
    (0, useNetwork_1.default)({
        onReconnect: () => {
            (0, BankAccounts_1.getCorpayBankAccountFields)(country, currency);
        },
    });
    (0, react_1.useEffect)(() => {
        if (reimbursementAccount?.isLoading === true || !!reimbursementAccount?.errors) {
            return;
        }
        if (reimbursementAccount?.isSuccess === true) {
            onSubmit();
            (0, BankAccounts_1.clearReimbursementAccountBankCreation)();
        }
    }, [corpayFields?.bankCurrency, country, currency, onSubmit, reimbursementAccount?.errors, reimbursementAccount?.isLoading, reimbursementAccount?.isSuccess]);
    (0, react_1.useEffect)(() => {
        // No fetching when there is no country
        if (country === '') {
            return;
        }
        // When workspace currency is set to EUR we need to refetch if country from Step 1 doesn't match country inside fetched Corpay data
        if (currency === CONST_1.default.CURRENCY.EUR && country !== corpayFields?.bankCountry) {
            (0, BankAccounts_1.getCorpayBankAccountFields)(country, currency);
            return;
        }
        // No fetching when workspace currency matches the currency inside fetched Corpay
        if (currency === corpayFields?.bankCurrency) {
            return;
        }
        (0, BankAccounts_1.getCorpayBankAccountFields)(country, currency);
    }, [corpayFields?.bankCurrency, corpayFields?.bankCountry, country, currency]);
    const bodyContent = [BankAccountDetails_1.default, AccountHolderDetails_1.default, Confirmation_1.default];
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep, } = (0, useSubStep_1.default)({ bodyContent, startFrom, onFinished: submit });
    const handleBackButtonPress = () => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (screenIndex === 0) {
            onBackButtonPress();
        }
        else {
            prevScreen();
        }
    };
    if (corpayFields !== undefined && corpayFields?.isLoading === false && corpayFields?.isSuccess !== undefined && corpayFields?.isSuccess === false) {
        return <NotFoundPage_1.default />;
    }
    return (<InteractiveStepWrapper_1.default wrapperID={BankInfo.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('bankAccount.bankInfo')} stepNames={stepNames} startStepIndex={1}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo} corpayFields={corpayFields}/>
        </InteractiveStepWrapper_1.default>);
}
BankInfo.displayName = 'BankInfo';
exports.default = BankInfo;
