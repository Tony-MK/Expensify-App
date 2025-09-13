"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const getValuesForSignerInfo_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getValuesForSignerInfo");
const getNeededDocumentsStatusForSignerInfo_1 = require("@pages/ReimbursementAccount/utils/getNeededDocumentsStatusForSignerInfo");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { OWNS_MORE_THAN_25_PERCENT } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
function Confirmation({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const isUserOwner = reimbursementAccount?.achData?.corpay?.[OWNS_MORE_THAN_25_PERCENT] ?? reimbursementAccountDraft?.[OWNS_MORE_THAN_25_PERCENT] ?? false;
    const values = (0, react_1.useMemo)(() => (0, getValuesForSignerInfo_1.default)(reimbursementAccountDraft), [reimbursementAccountDraft]);
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const currency = policy?.outputCurrency ?? '';
    const countryStepCountryValue = reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '';
    const isDocumentNeededStatus = (0, getNeededDocumentsStatusForSignerInfo_1.default)(currency, countryStepCountryValue);
    const summaryItems = [
        {
            title: values.jobTitle,
            description: translate('signerInfoStep.jobTitle'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(1);
            },
        },
    ];
    if (isDocumentNeededStatus.isCopyOfIDNeeded && values.copyOfId.length > 0) {
        summaryItems.push({
            title: values.copyOfId.map((id) => id.name).join(', '),
            description: translate('signerInfoStep.id'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isAddressProofNeeded && values.addressProof.length > 0) {
        summaryItems.push({
            title: values.addressProof.map((proof) => proof.name).join(', '),
            description: translate('signerInfoStep.proofOf'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isProofOfDirectorsNeeded && values.proofOfDirectors.length > 0) {
        summaryItems.push({
            title: values.proofOfDirectors.map((proof) => proof.name).join(', '),
            description: translate('signerInfoStep.proofOfDirectors'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isCodiceFiscaleNeeded && values.codiceFiscale.length > 0) {
        summaryItems.push({
            title: values.codiceFiscale.map((fiscale) => fiscale.name).join(', '),
            description: translate('signerInfoStep.codiceFiscale'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        });
    }
    if (!isUserOwner) {
        summaryItems.unshift({
            title: values.fullName,
            description: translate('signerInfoStep.legalName'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(0);
            },
        });
        summaryItems.splice(2, 0, {
            title: values.dateOfBirth,
            description: translate('common.dob'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(2);
            },
        });
        summaryItems.splice(3, 0, {
            title: `${values.street}, ${values.city}, ${values.state}, ${values.zipCode}`,
            description: translate('ownershipInfoStep.address'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(3);
            },
        });
    }
    return (<ConfirmationStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} pageTitle={translate('signerInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks={false} isLoading={reimbursementAccount?.isSavingCorpayOnboardingDirectorInformation} error={Object.values(reimbursementAccount?.errors ?? []).at(0) ?? ''}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
