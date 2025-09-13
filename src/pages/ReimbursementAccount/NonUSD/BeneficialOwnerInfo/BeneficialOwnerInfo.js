"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const YesNoStep_1 = require("@components/SubStepForms/YesNoStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useSubStep_1 = require("@hooks/useSubStep");
const getOwnerDetailsAndOwnerFilesForBeneficialOwners_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getOwnerDetailsAndOwnerFilesForBeneficialOwners");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const Address_1 = require("./BeneficialOwnerDetailsFormSubSteps/Address");
const Confirmation_1 = require("./BeneficialOwnerDetailsFormSubSteps/Confirmation");
const DateOfBirth_1 = require("./BeneficialOwnerDetailsFormSubSteps/DateOfBirth");
const Documents_1 = require("./BeneficialOwnerDetailsFormSubSteps/Documents");
const Last4SSN_1 = require("./BeneficialOwnerDetailsFormSubSteps/Last4SSN");
const Name_1 = require("./BeneficialOwnerDetailsFormSubSteps/Name");
const OwnershipPercentage_1 = require("./BeneficialOwnerDetailsFormSubSteps/OwnershipPercentage");
const BeneficialOwnersList_1 = require("./BeneficialOwnersList");
const { OWNS_MORE_THAN_25_PERCENT, ANY_INDIVIDUAL_OWN_25_PERCENT_OR_MORE, BENEFICIAL_OWNERS, COMPANY_NAME } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const { COUNTRY, PREFIX } = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
const SUBSTEP = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.SUBSTEP;
const bodyContent = [Name_1.default, OwnershipPercentage_1.default, DateOfBirth_1.default, Address_1.default, Last4SSN_1.default, Documents_1.default, Confirmation_1.default];
function BeneficialOwnerInfo({ onBackButtonPress, onSubmit, stepNames }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const [ownerKeys, setOwnerKeys] = (0, react_1.useState)([]);
    const [ownerBeingModifiedID, setOwnerBeingModifiedID] = (0, react_1.useState)(CONST_1.default.NON_USD_BANK_ACCOUNT.CURRENT_USER_KEY);
    const [isEditingCreatedOwner, setIsEditingCreatedOwner] = (0, react_1.useState)(false);
    const [isUserEnteringHisOwnData, setIsUserEnteringHisOwnData] = (0, react_1.useState)(false);
    const [isUserOwner, setIsUserOwner] = (0, react_1.useState)(false);
    const [isAnyoneElseOwner, setIsAnyoneElseOwner] = (0, react_1.useState)(false);
    const [currentSubStep, setCurrentSubStep] = (0, react_1.useState)(SUBSTEP.IS_USER_BENEFICIAL_OWNER);
    const previousSubStep = (0, usePrevious_1.default)(currentSubStep);
    const [totalOwnedPercentage, setTotalOwnedPercentage] = (0, react_1.useState)({});
    const companyName = reimbursementAccount?.achData?.corpay?.[COMPANY_NAME] ?? reimbursementAccountDraft?.[COMPANY_NAME] ?? '';
    const bankAccountID = reimbursementAccount?.achData?.bankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const totalOwnedPercentageSum = Object.values(totalOwnedPercentage).reduce((acc, value) => acc + value, 0);
    const canAddMoreOwners = totalOwnedPercentageSum <= 75;
    const submit = ({ anyIndividualOwn25PercentOrMore }) => {
        const { ownerDetails, ownerFiles } = (0, getOwnerDetailsAndOwnerFilesForBeneficialOwners_1.default)(ownerKeys, reimbursementAccountDraft);
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, {
            [OWNS_MORE_THAN_25_PERCENT]: isUserOwner,
            [ANY_INDIVIDUAL_OWN_25_PERCENT_OR_MORE]: isAnyoneElseOwner,
            [BENEFICIAL_OWNERS]: JSON.stringify(ownerDetails),
        });
        (0, BankAccounts_1.saveCorpayOnboardingBeneficialOwners)({
            inputs: JSON.stringify({ ...ownerDetails, anyIndividualOwn25PercentOrMore }),
            ...ownerFiles,
            beneficialOwnerIDs: ownerKeys.length > 0 ? ownerKeys.join(',') : undefined,
            bankAccountID,
        });
    };
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (reimbursementAccount?.errors || reimbursementAccount?.isSavingCorpayOnboardingBeneficialOwnersFields || !reimbursementAccount?.isSuccess) {
            return;
        }
        if (reimbursementAccount?.isSuccess) {
            onSubmit();
            (0, BankAccounts_1.clearReimbursementAccountSaveCorpayOnboardingBeneficialOwners)();
        }
        return () => {
            (0, BankAccounts_1.clearReimbursementAccountSaveCorpayOnboardingBeneficialOwners)();
        };
    }, [reimbursementAccount, onSubmit]);
    const addOwner = (ownerID) => {
        const newOwners = [...ownerKeys, ownerID];
        setOwnerKeys(newOwners);
    };
    const handleOwnerDetailsFormSubmit = () => {
        const isFreshOwner = ownerKeys.find((ownerID) => ownerID === ownerBeingModifiedID) === undefined;
        if (isFreshOwner) {
            addOwner(ownerBeingModifiedID);
        }
        let nextSubStep;
        if (isEditingCreatedOwner || !canAddMoreOwners) {
            nextSubStep = SUBSTEP.BENEFICIAL_OWNERS_LIST;
        }
        else {
            nextSubStep = isUserEnteringHisOwnData ? SUBSTEP.IS_ANYONE_ELSE_BENEFICIAL_OWNER : SUBSTEP.ARE_THERE_MORE_BENEFICIAL_OWNERS;
        }
        setCurrentSubStep(nextSubStep);
        setIsEditingCreatedOwner(false);
    };
    const { componentToRender: BeneficialOwnerDetailsForm, isEditing, screenIndex, nextScreen, prevScreen, moveTo, resetScreenIndex, goToTheLastStep, } = (0, useSubStep_1.default)({ bodyContent, startFrom: 0, onFinished: handleOwnerDetailsFormSubmit });
    const prepareOwnerDetailsForm = () => {
        const ownerID = expensify_common_1.Str.guid();
        setOwnerBeingModifiedID(ownerID);
        resetScreenIndex();
        setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM);
    };
    const handleOwnerEdit = (ownerID) => {
        setOwnerBeingModifiedID(ownerID);
        setIsEditingCreatedOwner(true);
        setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM);
    };
    const countryStepCountryValue = reimbursementAccountDraft?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '';
    const beneficialOwnerAddressCountryInputID = `${PREFIX}_${ownerBeingModifiedID}_${COUNTRY}`;
    const beneficialOwnerAddressCountryValue = reimbursementAccountDraft?.[beneficialOwnerAddressCountryInputID] ?? '';
    const handleBackButtonPress = () => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (currentSubStep === SUBSTEP.IS_USER_BENEFICIAL_OWNER) {
            onBackButtonPress();
        }
        else if (currentSubStep === SUBSTEP.BENEFICIAL_OWNERS_LIST && !canAddMoreOwners) {
            setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM);
        }
        else if (currentSubStep === SUBSTEP.BENEFICIAL_OWNERS_LIST && isAnyoneElseOwner) {
            setCurrentSubStep(SUBSTEP.ARE_THERE_MORE_BENEFICIAL_OWNERS);
        }
        else if (currentSubStep === SUBSTEP.BENEFICIAL_OWNERS_LIST && isUserOwner && !isAnyoneElseOwner) {
            setCurrentSubStep(SUBSTEP.IS_ANYONE_ELSE_BENEFICIAL_OWNER);
        }
        else if (currentSubStep === SUBSTEP.IS_ANYONE_ELSE_BENEFICIAL_OWNER) {
            setCurrentSubStep(SUBSTEP.IS_USER_BENEFICIAL_OWNER);
        }
        else if (currentSubStep === SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM && screenIndex > 0) {
            if (screenIndex === 5) {
                // User is on documents sub step and is not from US (no SSN needed)
                if (beneficialOwnerAddressCountryValue !== CONST_1.default.COUNTRY.US) {
                    moveTo(3, false);
                    return;
                }
            }
            if (screenIndex === 6) {
                // User is on confirmation screen and is GB (no SSN or documents needed)
                if (countryStepCountryValue === CONST_1.default.COUNTRY.GB && beneficialOwnerAddressCountryValue === CONST_1.default.COUNTRY.GB) {
                    moveTo(3, false);
                    return;
                }
            }
            prevScreen();
        }
        else if (currentSubStep === SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM && previousSubStep === SUBSTEP.IS_USER_BENEFICIAL_OWNER) {
            setCurrentSubStep(SUBSTEP.IS_USER_BENEFICIAL_OWNER);
        }
        else if (currentSubStep === SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM && previousSubStep === SUBSTEP.IS_ANYONE_ELSE_BENEFICIAL_OWNER) {
            setCurrentSubStep(SUBSTEP.IS_ANYONE_ELSE_BENEFICIAL_OWNER);
        }
        else {
            setCurrentSubStep((subStep) => subStep - 1);
        }
    };
    const handleNextSubStep = (value) => {
        if (currentSubStep === SUBSTEP.IS_USER_BENEFICIAL_OWNER) {
            // User is owner so we gather his data
            if (value) {
                setIsUserOwner(value);
                setIsUserEnteringHisOwnData(value);
                setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM);
                return;
            }
            setIsUserOwner(value);
            setIsUserEnteringHisOwnData(value);
            setOwnerKeys((currentOwnersKeys) => currentOwnersKeys.filter((key) => key !== CONST_1.default.NON_USD_BANK_ACCOUNT.CURRENT_USER_KEY));
            // User is an owner but there are 4 other owners already added, so we remove last one
            if (value && ownerKeys.length === 4) {
                setOwnerKeys((previousBeneficialOwners) => previousBeneficialOwners.slice(0, 3));
            }
            setCurrentSubStep(SUBSTEP.IS_ANYONE_ELSE_BENEFICIAL_OWNER);
            return;
        }
        if (currentSubStep === SUBSTEP.IS_ANYONE_ELSE_BENEFICIAL_OWNER) {
            setIsAnyoneElseOwner(value);
            setIsUserEnteringHisOwnData(false);
            // Someone else is an owner so we gather his data
            if (canAddMoreOwners && value) {
                prepareOwnerDetailsForm();
                return;
            }
            // User went back in the flow, but he cannot add more owners, so we send him back to owners list
            if (!canAddMoreOwners && value) {
                setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNERS_LIST);
                return;
            }
            // User is not an owner and no one else is an owner
            if (!isUserOwner && !value) {
                setOwnerKeys([]);
                submit({ anyIndividualOwn25PercentOrMore: false });
                return;
            }
            // User is an owner and no one else is an owner
            if (isUserOwner && !value) {
                setOwnerKeys([CONST_1.default.NON_USD_BANK_ACCOUNT.CURRENT_USER_KEY]);
                setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNERS_LIST);
                return;
            }
        }
        // Are there more UBOs
        if (currentSubStep === SUBSTEP.ARE_THERE_MORE_BENEFICIAL_OWNERS) {
            setIsUserEnteringHisOwnData(false);
            // User went back in the flow, but he cannot add more owners, so we send him back to owners list
            if (!canAddMoreOwners && value) {
                setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNERS_LIST);
                return;
            }
            // Gather data of another owner
            if (value) {
                setIsAnyoneElseOwner(true);
                prepareOwnerDetailsForm();
                return;
            }
            // No more owners and no need to gather entity chart, so we send user to owners list
            setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNERS_LIST);
            return;
        }
        // User reached the limit of UBOs
        if (currentSubStep === SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM && !canAddMoreOwners) {
            setCurrentSubStep(SUBSTEP.BENEFICIAL_OWNERS_LIST);
        }
    };
    return (<InteractiveStepWrapper_1.default wrapperID={BeneficialOwnerInfo.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('ownershipInfoStep.ownerInfo')} stepNames={stepNames} startStepIndex={3}>
            {currentSubStep === SUBSTEP.IS_USER_BENEFICIAL_OWNER && (<YesNoStep_1.default title={translate('ownershipInfoStep.doYouOwn', { companyName })} description={translate('ownershipInfoStep.regulationsRequire')} defaultValue={isUserOwner} onSelectedValue={handleNextSubStep} isLoading={reimbursementAccount?.isSavingCorpayOnboardingBeneficialOwnersFields}/>)}

            {currentSubStep === SUBSTEP.IS_ANYONE_ELSE_BENEFICIAL_OWNER && (<YesNoStep_1.default title={translate('ownershipInfoStep.doesAnyoneOwn', { companyName })} description={translate('ownershipInfoStep.regulationsRequire')} defaultValue={isAnyoneElseOwner} onSelectedValue={handleNextSubStep} isLoading={reimbursementAccount?.isSavingCorpayOnboardingBeneficialOwnersFields}/>)}

            {currentSubStep === SUBSTEP.BENEFICIAL_OWNER_DETAILS_FORM && (<BeneficialOwnerDetailsForm isEditing={isEditing} onNext={nextScreen} onMove={moveTo} ownerBeingModifiedID={ownerBeingModifiedID} setOwnerBeingModifiedID={setOwnerBeingModifiedID} isUserEnteringHisOwnData={isUserEnteringHisOwnData} totalOwnedPercentage={totalOwnedPercentage} setTotalOwnedPercentage={setTotalOwnedPercentage}/>)}

            {currentSubStep === SUBSTEP.ARE_THERE_MORE_BENEFICIAL_OWNERS && (<YesNoStep_1.default title={translate('ownershipInfoStep.areThereOther', { companyName })} description={translate('ownershipInfoStep.regulationsRequire')} defaultValue={false} onSelectedValue={handleNextSubStep} isLoading={reimbursementAccount?.isSavingCorpayOnboardingBeneficialOwnersFields}/>)}

            {currentSubStep === SUBSTEP.BENEFICIAL_OWNERS_LIST && (<BeneficialOwnersList_1.default handleConfirmation={submit} handleOwnerEdit={handleOwnerEdit} ownerKeys={ownerKeys}/>)}
        </InteractiveStepWrapper_1.default>);
}
BeneficialOwnerInfo.displayName = 'BeneficialOwnerInfo';
exports.default = BeneficialOwnerInfo;
