"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const ErrorUtils = require("@libs/ErrorUtils");
const getValuesForBeneficialOwner_1 = require("@pages/ReimbursementAccount/USD/utils/getValuesForBeneficialOwner");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const UBO_STEP_INDEXES = CONST_1.default.REIMBURSEMENT_ACCOUNT.SUBSTEP_INDEX.UBO;
function ConfirmationUBO({ onNext, onMove, isEditing, beneficialOwnerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const values = (0, getValuesForBeneficialOwner_1.default)(beneficialOwnerBeingModifiedID, reimbursementAccountDraft);
    const error = reimbursementAccount ? ErrorUtils.getLatestErrorMessage(reimbursementAccount) : '';
    const summaryItems = [
        {
            description: translate('beneficialOwnerInfoStep.legalName'),
            title: `${values.firstName} ${values.lastName}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(UBO_STEP_INDEXES.LEGAL_NAME);
            },
        },
        {
            description: translate('common.dob'),
            title: values.dob,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(UBO_STEP_INDEXES.DATE_OF_BIRTH);
            },
        },
        {
            description: translate('beneficialOwnerInfoStep.last4SSN'),
            title: values.ssnLast4,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(UBO_STEP_INDEXES.SSN);
            },
        },
        {
            description: translate('beneficialOwnerInfoStep.address'),
            title: `${values.street}, ${values.city}, ${values.state} ${values.zipCode}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(UBO_STEP_INDEXES.ADDRESS);
            },
        },
    ];
    return (<ConfirmationStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} pageTitle={translate('beneficialOwnerInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks onfidoLinksTitle={`${translate('beneficialOwnerInfoStep.byAddingThisBankAccount')} `} error={error}/>);
}
ConfirmationUBO.displayName = 'ConfirmationUBO';
exports.default = ConfirmationUBO;
