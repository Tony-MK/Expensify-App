"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const YesNoStep_1 = require("@components/SubStepForms/YesNoStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AddressUBO_1 = require("./subSteps/BeneficialOwnerDetailsFormSubSteps/AddressUBO");
const ConfirmationUBO_1 = require("./subSteps/BeneficialOwnerDetailsFormSubSteps/ConfirmationUBO");
const DateOfBirthUBO_1 = require("./subSteps/BeneficialOwnerDetailsFormSubSteps/DateOfBirthUBO");
const LegalNameUBO_1 = require("./subSteps/BeneficialOwnerDetailsFormSubSteps/LegalNameUBO");
const SocialSecurityNumberUBO_1 = require("./subSteps/BeneficialOwnerDetailsFormSubSteps/SocialSecurityNumberUBO");
const CompanyOwnersListUBO_1 = require("./subSteps/CompanyOwnersListUBO");
const SUBSTEP = CONST_1.default.BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.SUBSTEP;
const MAX_NUMBER_OF_UBOS = 4;
const bodyContent = [LegalNameUBO_1.default, DateOfBirthUBO_1.default, SocialSecurityNumberUBO_1.default, AddressUBO_1.default, ConfirmationUBO_1.default];
function BeneficialOwnersStep({ onBackButtonPress }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const companyName = reimbursementAccount?.achData?.companyName ?? '';
    const policyID = reimbursementAccount?.achData?.policyID;
    const defaultValues = {
        ownsMoreThan25Percent: reimbursementAccount?.achData?.ownsMoreThan25Percent ?? reimbursementAccountDraft?.ownsMoreThan25Percent ?? false,
        hasOtherBeneficialOwners: reimbursementAccount?.achData?.hasOtherBeneficialOwners ?? reimbursementAccountDraft?.hasOtherBeneficialOwners ?? false,
        beneficialOwnerKeys: reimbursementAccount?.achData?.beneficialOwnerKeys ?? reimbursementAccountDraft?.beneficialOwnerKeys ?? [],
    };
    // We're only reading beneficialOwnerKeys from draft values because there is not option to remove UBO
    // if we were to set them based on values saved in BE then there would be no option to enter different UBOs
    // user would always see the same UBOs that was saved in BE when returning to this step and trying to change something
    const [beneficialOwnerKeys, setBeneficialOwnerKeys] = (0, react_1.useState)(defaultValues.beneficialOwnerKeys);
    const [beneficialOwnerBeingModifiedID, setBeneficialOwnerBeingModifiedID] = (0, react_1.useState)('');
    const [isEditingCreatedBeneficialOwner, setIsEditingCreatedBeneficialOwner] = (0, react_1.useState)(false);
    const [isUserUBO, setIsUserUBO] = (0, react_1.useState)(defaultValues.ownsMoreThan25Percent);
    const [isAnyoneElseUBO, setIsAnyoneElseUBO] = (0, react_1.useState)(defaultValues.hasOtherBeneficialOwners);
    const [currentUBOSubStep, setCurrentUBOSubStep] = (0, react_1.useState)(1);
    const canAddMoreUBOS = beneficialOwnerKeys.length < (isUserUBO ? MAX_NUMBER_OF_UBOS - 1 : MAX_NUMBER_OF_UBOS);
    const submit = () => {
        const beneficialOwnerFields = ['firstName', 'lastName', 'dob', 'ssnLast4', 'street', 'city', 'state', 'zipCode'];
        const beneficialOwners = beneficialOwnerKeys.map((ownerKey) => beneficialOwnerFields.reduce((acc, fieldName) => {
            acc[fieldName] = reimbursementAccountDraft ? String(reimbursementAccountDraft[`beneficialOwner_${ownerKey}_${fieldName}`]) : undefined;
            return acc;
        }, {}));
        (0, BankAccounts_1.updateBeneficialOwnersForBankAccount)(Number(reimbursementAccount?.achData?.bankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID), {
            ownsMoreThan25Percent: isUserUBO,
            beneficialOwners: JSON.stringify(beneficialOwners),
            beneficialOwnerKeys,
        }, policyID);
    };
    const addBeneficialOwner = (beneficialOwnerID) => {
        // Each beneficial owner is assigned a unique key that will connect it to values in saved ONYX.
        // That way we can dynamically render each Identity Form based on which keys are present in the beneficial owners array.
        const newBeneficialOwners = [...beneficialOwnerKeys, beneficialOwnerID];
        setBeneficialOwnerKeys(newBeneficialOwners);
        (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { beneficialOwners: JSON.stringify(newBeneficialOwners) });
    };
    const handleBeneficialOwnerDetailsFormSubmit = () => {
        const shouldAddBeneficialOwner = !beneficialOwnerKeys.find((beneficialOwnerID) => beneficialOwnerID === beneficialOwnerBeingModifiedID) && canAddMoreUBOS;
        if (shouldAddBeneficialOwner) {
            addBeneficialOwner(beneficialOwnerBeingModifiedID);
        }
        // Because beneficialOwnerKeys array is not yet updated at this point we need to check against lower MAX_NUMBER_OF_UBOS (account for the one that is being added)
        const isLastUBOThatCanBeAdded = beneficialOwnerKeys.length === (isUserUBO ? MAX_NUMBER_OF_UBOS - 2 : MAX_NUMBER_OF_UBOS - 1);
        setCurrentUBOSubStep(isEditingCreatedBeneficialOwner || isLastUBOThatCanBeAdded ? SUBSTEP.UBOS_LIST : SUBSTEP.ARE_THERE_MORE_UBOS);
        setIsEditingCreatedBeneficialOwner(false);
    };
    const { componentToRender: BeneficialOwnerDetailsForm, isEditing, screenIndex, nextScreen, prevScreen, moveTo, resetScreenIndex, goToTheLastStep, } = (0, useSubStep_1.default)({
        bodyContent,
        startFrom: 0,
        onFinished: handleBeneficialOwnerDetailsFormSubmit,
    });
    const prepareBeneficialOwnerDetailsForm = () => {
        const beneficialOwnerID = expensify_common_1.Str.guid();
        setBeneficialOwnerBeingModifiedID(beneficialOwnerID);
        // Reset Beneficial Owner Details Form to first subStep
        resetScreenIndex();
        setCurrentUBOSubStep(SUBSTEP.UBO_DETAILS_FORM);
    };
    const handleNextUBOSubstep = (value) => {
        if (currentUBOSubStep === SUBSTEP.IS_USER_UBO) {
            setIsUserUBO(value);
            // User is an owner but there are 4 other owners already added, so we remove last one
            if (value && beneficialOwnerKeys.length === 4) {
                setBeneficialOwnerKeys((previousBeneficialOwners) => previousBeneficialOwners.slice(0, 3));
            }
            setCurrentUBOSubStep(SUBSTEP.IS_ANYONE_ELSE_UBO);
            return;
        }
        if (currentUBOSubStep === SUBSTEP.IS_ANYONE_ELSE_UBO) {
            setIsAnyoneElseUBO(value);
            if (!canAddMoreUBOS && value) {
                setCurrentUBOSubStep(SUBSTEP.UBOS_LIST);
                return;
            }
            if (canAddMoreUBOS && value) {
                prepareBeneficialOwnerDetailsForm();
                return;
            }
            // User is not an owner and no one else is an owner
            if (!isUserUBO && !value) {
                submit();
                return;
            }
            // User is an owner and no one else is an owner
            if (isUserUBO && !value) {
                setCurrentUBOSubStep(SUBSTEP.UBOS_LIST);
                return;
            }
        }
        // Are there more UBOs
        if (currentUBOSubStep === SUBSTEP.ARE_THERE_MORE_UBOS) {
            if (value) {
                prepareBeneficialOwnerDetailsForm();
                return;
            }
            setCurrentUBOSubStep(SUBSTEP.UBOS_LIST);
            return;
        }
        // User reached the limit of UBOs
        if (currentUBOSubStep === SUBSTEP.UBO_DETAILS_FORM && !canAddMoreUBOS) {
            setCurrentUBOSubStep(SUBSTEP.UBOS_LIST);
        }
    };
    const handleBackButtonPress = () => {
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        // User goes back to previous step
        if (currentUBOSubStep === SUBSTEP.IS_USER_UBO) {
            onBackButtonPress();
            // User reached limit of UBOs and goes back to initial question about additional UBOs
        }
        else if (currentUBOSubStep === SUBSTEP.UBOS_LIST && !canAddMoreUBOS) {
            setCurrentUBOSubStep(SUBSTEP.IS_ANYONE_ELSE_UBO);
            // User goes back to last radio button
        }
        else if (currentUBOSubStep === SUBSTEP.UBOS_LIST && isAnyoneElseUBO) {
            setCurrentUBOSubStep(SUBSTEP.ARE_THERE_MORE_UBOS);
        }
        else if (currentUBOSubStep === SUBSTEP.UBOS_LIST && isUserUBO && !isAnyoneElseUBO) {
            setCurrentUBOSubStep(SUBSTEP.IS_ANYONE_ELSE_UBO);
            // User moves between subSteps of beneficial owner details form
        }
        else if (currentUBOSubStep === SUBSTEP.UBO_DETAILS_FORM && screenIndex > 0) {
            prevScreen();
        }
        else {
            setCurrentUBOSubStep((currentSubstep) => currentSubstep - 1);
        }
    };
    const handleUBOEdit = (beneficialOwnerID) => {
        setBeneficialOwnerBeingModifiedID(beneficialOwnerID);
        setIsEditingCreatedBeneficialOwner(true);
        setCurrentUBOSubStep(SUBSTEP.UBO_DETAILS_FORM);
    };
    return (<InteractiveStepWrapper_1.default wrapperID={BeneficialOwnersStep.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('beneficialOwnerInfoStep.companyOwner')} handleBackButtonPress={handleBackButtonPress} startStepIndex={5} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}>
            {currentUBOSubStep === SUBSTEP.IS_USER_UBO && (<YesNoStep_1.default title={translate('beneficialOwnerInfoStep.doYouOwn25percent', { companyName })} description={translate('beneficialOwnerInfoStep.regulationRequiresUsToVerifyTheIdentity')} submitButtonStyles={[styles.mb0]} defaultValue={isUserUBO} onSelectedValue={handleNextUBOSubstep}/>)}

            {currentUBOSubStep === SUBSTEP.IS_ANYONE_ELSE_UBO && (<YesNoStep_1.default title={translate('beneficialOwnerInfoStep.doAnyIndividualOwn25percent', { companyName })} description={translate('beneficialOwnerInfoStep.regulationRequiresUsToVerifyTheIdentity')} submitButtonStyles={[styles.mb0]} defaultValue={isAnyoneElseUBO} onSelectedValue={handleNextUBOSubstep}/>)}

            {currentUBOSubStep === SUBSTEP.UBO_DETAILS_FORM && (<BeneficialOwnerDetailsForm isEditing={isEditing} beneficialOwnerBeingModifiedID={beneficialOwnerBeingModifiedID} setBeneficialOwnerBeingModifiedID={setBeneficialOwnerBeingModifiedID} onNext={nextScreen} onMove={moveTo}/>)}

            {currentUBOSubStep === SUBSTEP.ARE_THERE_MORE_UBOS && (<YesNoStep_1.default title={translate('beneficialOwnerInfoStep.areThereMoreIndividualsWhoOwn25percent', { companyName })} description={translate('beneficialOwnerInfoStep.regulationRequiresUsToVerifyTheIdentity')} submitButtonStyles={[styles.mb0]} onSelectedValue={handleNextUBOSubstep} defaultValue={false}/>)}

            {currentUBOSubStep === SUBSTEP.UBOS_LIST && (<CompanyOwnersListUBO_1.default beneficialOwnerKeys={beneficialOwnerKeys} handleUBOsConfirmation={submit} handleUBOEdit={handleUBOEdit} isUserUBO={isUserUBO} isAnyoneElseUBO={isAnyoneElseUBO}/>)}
        </InteractiveStepWrapper_1.default>);
}
BeneficialOwnersStep.displayName = 'BeneficialOwnersStep';
exports.default = BeneficialOwnersStep;
