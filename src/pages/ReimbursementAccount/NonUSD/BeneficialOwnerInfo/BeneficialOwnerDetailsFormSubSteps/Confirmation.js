"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const getNeededDocumentsStatusForBeneficialOwner_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getNeededDocumentsStatusForBeneficialOwner");
const getValuesForBeneficialOwner_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getValuesForBeneficialOwner");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { PREFIX, COUNTRY } = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
function Confirmation({ onNext, onMove, isEditing, ownerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const values = (0, react_1.useMemo)(() => (0, getValuesForBeneficialOwner_1.default)(ownerBeingModifiedID, reimbursementAccountDraft), [ownerBeingModifiedID, reimbursementAccountDraft]);
    const beneficialOwnerCountryInputID = `${PREFIX}_${ownerBeingModifiedID}_${COUNTRY}`;
    const beneficialOwnerCountry = String(reimbursementAccountDraft?.[beneficialOwnerCountryInputID] ?? '');
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const currency = policy?.outputCurrency ?? '';
    const countryStepCountryValue = reimbursementAccountDraft?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '';
    const isDocumentNeededStatus = (0, getNeededDocumentsStatusForBeneficialOwner_1.default)(currency, countryStepCountryValue, beneficialOwnerCountry);
    const summaryItems = (0, react_1.useMemo)(() => [
        {
            title: `${values.firstName} ${values.lastName}`,
            description: translate('ownershipInfoStep.legalName'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(0);
            },
        },
        {
            title: values.ownershipPercentage,
            description: translate('ownershipInfoStep.ownershipPercentage'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(1);
            },
        },
        {
            title: values.dob,
            description: translate('common.dob'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(2);
            },
        },
        ...(beneficialOwnerCountry === CONST_1.default.COUNTRY.US
            ? [
                {
                    title: values.ssnLast4,
                    description: translate('ownershipInfoStep.last4'),
                    shouldShowRightIcon: true,
                    onPress: () => {
                        onMove(4);
                    },
                },
            ]
            : []),
        {
            title: `${values.street}, ${values.city}, ${values.state} ${values.zipCode}`,
            description: translate('ownershipInfoStep.address'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(3);
            },
        },
        ...(isDocumentNeededStatus.isProofOfOwnershipNeeded
            ? [
                {
                    title: values.proofOfOwnership.map((file) => file.name).join(', '),
                    description: translate('ownershipInfoStep.proofOfBeneficialOwner'),
                    shouldShowRightIcon: true,
                    onPress: () => {
                        onMove(5);
                    },
                },
            ]
            : []),
        ...(isDocumentNeededStatus.isCopyOfIDNeeded
            ? [
                {
                    title: values.copyOfID.map((file) => file.name).join(', '),
                    description: translate('ownershipInfoStep.copyOfID'),
                    shouldShowRightIcon: true,
                    onPress: () => {
                        onMove(5);
                    },
                },
            ]
            : []),
        ...(isDocumentNeededStatus.isProofOfAddressNeeded
            ? [
                {
                    title: values.addressProof.map((file) => file.name).join(', '),
                    description: translate('ownershipInfoStep.proofOfAddress'),
                    shouldShowRightIcon: true,
                    onPress: () => {
                        onMove(5);
                    },
                },
            ]
            : []),
        ...(isDocumentNeededStatus.isCodiceFiscaleNeeded
            ? [
                {
                    title: values.codiceFiscale.map((file) => file.name).join(', '),
                    description: translate('ownershipInfoStep.codiceFiscale'),
                    shouldShowRightIcon: true,
                    onPress: () => {
                        onMove(5);
                    },
                },
            ]
            : []),
    ], [
        beneficialOwnerCountry,
        isDocumentNeededStatus.isCodiceFiscaleNeeded,
        isDocumentNeededStatus.isCopyOfIDNeeded,
        isDocumentNeededStatus.isProofOfAddressNeeded,
        isDocumentNeededStatus.isProofOfOwnershipNeeded,
        onMove,
        translate,
        values.addressProof,
        values.city,
        values.codiceFiscale,
        values.copyOfID,
        values.dob,
        values.firstName,
        values.lastName,
        values.ownershipPercentage,
        values.proofOfOwnership,
        values.ssnLast4,
        values.state,
        values.street,
        values.zipCode,
    ]);
    return (<ConfirmationStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} pageTitle={translate('ownershipInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks={false}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
