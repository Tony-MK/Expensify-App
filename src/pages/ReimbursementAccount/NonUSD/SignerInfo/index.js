"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const YesNoStep_1 = require("@components/SubStepForms/YesNoStep");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useSubStep_1 = require("@hooks/useSubStep");
const Navigation_1 = require("@navigation/Navigation");
const getSignerDetailsAndSignerFilesForSignerInfo_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getSignerDetailsAndSignerFilesForSignerInfo");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const EnterEmail_1 = require("./EnterEmail");
const HangTight_1 = require("./HangTight");
const Address_1 = require("./subSteps/Address");
const Confirmation_1 = require("./subSteps/Confirmation");
const DateOfBirth_1 = require("./subSteps/DateOfBirth");
const JobTitle_1 = require("./subSteps/JobTitle");
const Name_1 = require("./subSteps/Name");
const UploadDocuments_1 = require("./subSteps/UploadDocuments");
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
const SUBSTEP = CONST_1.default.NON_USD_BANK_ACCOUNT.SIGNER_INFO_STEP.SUBSTEP;
const { OWNS_MORE_THAN_25_PERCENT, COMPANY_NAME } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const fullBodyContent = [Name_1.default, JobTitle_1.default, DateOfBirth_1.default, Address_1.default, UploadDocuments_1.default, Confirmation_1.default];
const userIsOwnerBodyContent = [JobTitle_1.default, UploadDocuments_1.default, Confirmation_1.default];
function SignerInfo({ onBackButtonPress, onSubmit, stepNames }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isProduction } = (0, useEnvironment_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const currency = policy?.outputCurrency ?? '';
    const isUserOwner = reimbursementAccount?.achData?.corpay?.[OWNS_MORE_THAN_25_PERCENT] ?? reimbursementAccountDraft?.[OWNS_MORE_THAN_25_PERCENT] ?? false;
    const companyName = reimbursementAccount?.achData?.corpay?.[COMPANY_NAME] ?? reimbursementAccountDraft?.[COMPANY_NAME] ?? '';
    const bankAccountID = reimbursementAccount?.achData?.bankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [currentSubStep, setCurrentSubStep] = (0, react_1.useState)(SUBSTEP.IS_DIRECTOR);
    const [isUserDirector, setIsUserDirector] = (0, react_1.useState)(false);
    const primaryLogin = account?.primaryLogin ?? '';
    // Corpay does not accept emails with a "+" character and will not let us connect account at the end of whole flow
    const signerEmail = !isProduction && isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND) ? expensify_common_1.Str.replaceAll(primaryLogin, '+', '') : primaryLogin;
    const submit = (0, react_1.useCallback)(() => {
        const { signerDetails, signerFiles } = (0, getSignerDetailsAndSignerFilesForSignerInfo_1.default)(reimbursementAccountDraft, signerEmail, isUserOwner);
        (0, BankAccounts_1.saveCorpayOnboardingDirectorInformation)({
            inputs: JSON.stringify(signerDetails),
            ...signerFiles,
            bankAccountID,
        });
    }, [bankAccountID, isUserOwner, reimbursementAccountDraft, signerEmail]);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (reimbursementAccount?.errors || reimbursementAccount?.isSavingCorpayOnboardingDirectorInformation || !reimbursementAccount?.isSuccess) {
            return;
        }
        if (reimbursementAccount?.isSuccess && currentSubStep !== SUBSTEP.HANG_TIGHT) {
            if (currency === CONST_1.default.CURRENCY.AUD) {
                setCurrentSubStep(SUBSTEP.ENTER_EMAIL);
                (0, BankAccounts_1.clearReimbursementAccountSaveCorpayOnboardingDirectorInformation)();
                return;
            }
            onSubmit();
            (0, BankAccounts_1.clearReimbursementAccountSaveCorpayOnboardingDirectorInformation)();
        }
        return () => {
            (0, BankAccounts_1.clearReimbursementAccountSaveCorpayOnboardingDirectorInformation)();
        };
    }, [reimbursementAccount, onSubmit, currency, currentSubStep]);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (reimbursementAccount?.errors || reimbursementAccount?.isAskingForCorpaySignerInformation || !reimbursementAccount?.isAskingForCorpaySignerInformationSuccess) {
            return;
        }
        if (reimbursementAccount?.isAskingForCorpaySignerInformationSuccess) {
            setCurrentSubStep(SUBSTEP.HANG_TIGHT);
        }
    }, [reimbursementAccount]);
    const bodyContent = (0, react_1.useMemo)(() => {
        if (isUserOwner) {
            return userIsOwnerBodyContent;
        }
        return fullBodyContent;
    }, [isUserOwner]);
    const { componentToRender: SignerDetailsForm, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep, } = (0, useSubStep_1.default)({ bodyContent, startFrom: 0, onFinished: submit });
    const handleNextSubStep = (0, react_1.useCallback)((value) => {
        if (currentSubStep === SUBSTEP.IS_DIRECTOR) {
            // user is director so we gather their data
            if (value) {
                setIsUserDirector(value);
                setCurrentSubStep(SUBSTEP.SIGNER_DETAILS_FORM);
                return;
            }
            setIsUserDirector(value);
            setCurrentSubStep(SUBSTEP.ENTER_EMAIL);
            return;
        }
        setIsUserDirector(value);
        setCurrentSubStep(SUBSTEP.ENTER_EMAIL);
    }, [currentSubStep]);
    const handleBackButtonPress = (0, react_1.useCallback)(() => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (currentSubStep === SUBSTEP.IS_DIRECTOR) {
            onBackButtonPress();
        }
        else if (currentSubStep === SUBSTEP.ENTER_EMAIL && isUserDirector) {
            setCurrentSubStep(SUBSTEP.SIGNER_DETAILS_FORM);
        }
        else if (currentSubStep === SUBSTEP.SIGNER_DETAILS_FORM && screenIndex > 0) {
            prevScreen();
        }
        else if (currentSubStep === SUBSTEP.SIGNER_DETAILS_FORM && screenIndex === 0) {
            setCurrentSubStep(SUBSTEP.IS_DIRECTOR);
        }
        else if (currentSubStep === SUBSTEP.HANG_TIGHT) {
            Navigation_1.default.goBack();
        }
        else if (currentSubStep === SUBSTEP.ARE_YOU_DIRECTOR) {
            setCurrentSubStep(SUBSTEP.SIGNER_DETAILS_FORM);
        }
        else {
            setCurrentSubStep((subStep) => subStep - 1);
        }
    }, [currentSubStep, goToTheLastStep, isEditing, isUserDirector, onBackButtonPress, prevScreen, screenIndex]);
    const handleEmailSubmit = (0, react_1.useCallback)((values) => {
        (0, BankAccounts_1.askForCorpaySignerInformation)({
            signerEmail: values.signerEmail,
            secondSignerEmail: values.secondSignerEmail,
            policyID: String(policyID),
            bankAccountID,
        });
    }, [bankAccountID, policyID]);
    return (<InteractiveStepWrapper_1.default wrapperID={SignerInfo.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('signerInfoStep.signerInfo')} stepNames={stepNames} startStepIndex={4}>
            {currentSubStep === SUBSTEP.IS_DIRECTOR && (<YesNoStep_1.default title={translate('signerInfoStep.areYouDirector', { companyName })} description={translate('signerInfoStep.regulationRequiresUs')} defaultValue={isUserDirector} onSelectedValue={handleNextSubStep}/>)}

            {currentSubStep === SUBSTEP.SIGNER_DETAILS_FORM && (<SignerDetailsForm isEditing={isEditing} onNext={nextScreen} onMove={moveTo}/>)}

            {currentSubStep === SUBSTEP.ENTER_EMAIL && (<EnterEmail_1.default onSubmit={handleEmailSubmit} isUserDirector={isUserDirector} isLoading={reimbursementAccount?.isAskingForCorpaySignerInformation}/>)}

            {currentSubStep === SUBSTEP.HANG_TIGHT && (<HangTight_1.default policyID={policyID} bankAccountID={bankAccountID}/>)}
        </InteractiveStepWrapper_1.default>);
}
SignerInfo.displayName = 'SignerInfo';
exports.default = SignerInfo;
