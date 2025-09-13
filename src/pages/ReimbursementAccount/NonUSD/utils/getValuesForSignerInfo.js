"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
function getValuesForSignerInfo(reimbursementAccountDraft) {
    if (!reimbursementAccountDraft) {
        return {
            dateOfBirth: '',
            fullName: '',
            jobTitle: '',
            city: '',
            state: '',
            street: '',
            zipCode: '',
            proofOfDirectors: [],
            copyOfId: [],
            addressProof: [],
            codiceFiscale: [],
            downloadedPdsAndFSG: false,
        };
    }
    const signerInfoKeys = CONST_1.default.NON_USD_BANK_ACCOUNT.SIGNER_INFO_STEP.SIGNER_INFO_DATA;
    return {
        dateOfBirth: reimbursementAccountDraft[signerInfoKeys.DATE_OF_BIRTH] ?? '',
        fullName: reimbursementAccountDraft[signerInfoKeys.FULL_NAME] ?? '',
        jobTitle: reimbursementAccountDraft[signerInfoKeys.JOB_TITLE] ?? '',
        city: reimbursementAccountDraft[signerInfoKeys.CITY] ?? '',
        state: reimbursementAccountDraft[signerInfoKeys.STATE] ?? '',
        street: reimbursementAccountDraft[signerInfoKeys.STREET] ?? '',
        zipCode: reimbursementAccountDraft[signerInfoKeys.ZIP_CODE] ?? '',
        proofOfDirectors: reimbursementAccountDraft[signerInfoKeys.PROOF_OF_DIRECTORS] ?? [],
        copyOfId: reimbursementAccountDraft[signerInfoKeys.COPY_OF_ID] ?? [],
        addressProof: reimbursementAccountDraft[signerInfoKeys.ADDRESS_PROOF] ?? [],
        codiceFiscale: reimbursementAccountDraft[signerInfoKeys.CODICE_FISCALE] ?? [],
        downloadedPdsAndFSG: reimbursementAccountDraft[signerInfoKeys.DOWNLOADED_PDS_AND_FSG] ?? false,
    };
}
exports.default = getValuesForSignerInfo;
