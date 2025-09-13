"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
function getValuesForOwner(beneficialOwnerBeingModifiedID, reimbursementAccountDraft) {
    if (!reimbursementAccountDraft) {
        return {
            firstName: '',
            lastName: '',
            ownershipPercentage: '',
            dob: '',
            ssnLast4: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            proofOfOwnership: [],
            copyOfID: [],
            addressProof: [],
            codiceFiscale: [],
        };
    }
    const beneficialOwnerPrefix = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA.PREFIX;
    const beneficialOwnerInfoKey = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
    const INPUT_KEYS = {
        firstName: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.FIRST_NAME}`,
        lastName: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.LAST_NAME}`,
        ownershipPercentage: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.OWNERSHIP_PERCENTAGE}`,
        dob: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.DOB}`,
        ssnLast4: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.SSN_LAST_4}`,
        street: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.STREET}`,
        city: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.CITY}`,
        state: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.STATE}`,
        zipCode: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.ZIP_CODE}`,
        country: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.COUNTRY}`,
        proofOfOwnership: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.PROOF_OF_OWNERSHIP}`,
        copyOfID: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.COPY_OF_ID}`,
        addressProof: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.ADDRESS_PROOF}`,
        codiceFiscale: `${beneficialOwnerPrefix}_${beneficialOwnerBeingModifiedID}_${beneficialOwnerInfoKey.CODICE_FISCALE}`,
    };
    return {
        firstName: reimbursementAccountDraft[INPUT_KEYS.firstName] ?? '',
        lastName: reimbursementAccountDraft[INPUT_KEYS.lastName] ?? '',
        ownershipPercentage: reimbursementAccountDraft[INPUT_KEYS.ownershipPercentage] ?? '',
        dob: reimbursementAccountDraft[INPUT_KEYS.dob] ?? '',
        ssnLast4: reimbursementAccountDraft[INPUT_KEYS.ssnLast4] ?? '',
        street: reimbursementAccountDraft[INPUT_KEYS.street] ?? '',
        city: reimbursementAccountDraft[INPUT_KEYS.city] ?? '',
        state: reimbursementAccountDraft[INPUT_KEYS.state] ?? '',
        zipCode: reimbursementAccountDraft[INPUT_KEYS.zipCode] ?? '',
        country: reimbursementAccountDraft[INPUT_KEYS.country] ?? '',
        proofOfOwnership: reimbursementAccountDraft[INPUT_KEYS.proofOfOwnership] ?? [],
        copyOfID: reimbursementAccountDraft[INPUT_KEYS.copyOfID] ?? [],
        addressProof: reimbursementAccountDraft[INPUT_KEYS.addressProof] ?? [],
        codiceFiscale: reimbursementAccountDraft[INPUT_KEYS.codiceFiscale] ?? [],
    };
}
exports.default = getValuesForOwner;
