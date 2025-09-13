"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const mapCurrencyToCountry_1 = require("@libs/mapCurrencyToCountry");
const getNeededDocumentsStatusForSignerInfo_1 = require("@pages/ReimbursementAccount/utils/getNeededDocumentsStatusForSignerInfo");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnterSignerInfoForm_1 = require("@src/types/form/EnterSignerInfoForm");
function Confirmation({ onNext, onMove, isEditing, policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [enterSignerInfoForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM, { canBeMissing: true });
    const [enterSignerInfoFormDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: false });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const currency = policy?.outputCurrency ?? '';
    const country = (0, mapCurrencyToCountry_1.default)(currency);
    const isDocumentNeededStatus = (0, getNeededDocumentsStatusForSignerInfo_1.default)(currency, country);
    const copyOfID = enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_COPY_OF_ID] ?? [];
    const addressProof = enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_ADDRESS_PROOF] ?? [];
    const proofOfDirectors = enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.PROOF_OF_DIRECTORS] ?? [];
    const codiceFiscale = enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_CODICE_FISCALE] ?? [];
    const summaryItems = [
        {
            title: enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_FULL_NAME] ?? '',
            description: translate('signerInfoStep.legalName'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(0);
            },
        },
        {
            title: enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_JOB_TITLE] ?? '',
            description: translate('signerInfoStep.jobTitle'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(1);
            },
        },
        {
            title: enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_DATE_OF_BIRTH] ?? '',
            description: translate('common.dob'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(2);
            },
        },
        {
            title: `${enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_STREET]}, ${enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_CITY]}, ${enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_STATE]}, ${enterSignerInfoFormDraft?.[EnterSignerInfoForm_1.default.SIGNER_ZIP_CODE]}`,
            description: translate('ownershipInfoStep.address'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(3);
            },
        },
    ];
    if (isDocumentNeededStatus.isCopyOfIDNeeded && copyOfID.length > 0) {
        summaryItems.push({
            title: copyOfID.map((id) => id.name).join(', '),
            description: translate('signerInfoStep.id'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isAddressProofNeeded && addressProof.length > 0) {
        summaryItems.push({
            title: addressProof.map((proof) => proof.name).join(', '),
            description: translate('signerInfoStep.proofOf'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isProofOfDirectorsNeeded && proofOfDirectors.length > 0) {
        summaryItems.push({
            title: proofOfDirectors.map((proof) => proof.name).join(', '),
            description: translate('signerInfoStep.proofOfDirectors'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        });
    }
    if (isDocumentNeededStatus.isCodiceFiscaleNeeded && codiceFiscale.length > 0) {
        summaryItems.push({
            title: codiceFiscale.map((fiscale) => fiscale.name).join(', '),
            description: translate('signerInfoStep.codiceFiscale'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        });
    }
    return (<ConfirmationStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} pageTitle={translate('signerInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks={false} isLoading={enterSignerInfoForm?.isSavingSignerInformation} error={Object.values(enterSignerInfoForm?.errors ?? []).at(0) ?? ''}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
