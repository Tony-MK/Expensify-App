"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const { FIRST_NAME, LAST_NAME, OWNERSHIP_PERCENTAGE, DOB, SSN_LAST_4, STREET, CITY, COUNTRY, STATE, ZIP_CODE, PROOF_OF_OWNERSHIP, COPY_OF_ID, ADDRESS_PROOF, CODICE_FISCALE, RESIDENTIAL_ADDRESS, FULL_NAME, PREFIX, } = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
const ownerDetailsFields = [FIRST_NAME, LAST_NAME, OWNERSHIP_PERCENTAGE, DOB, SSN_LAST_4, STREET, CITY, STATE, ZIP_CODE, COUNTRY];
const ownerFilesFields = [PROOF_OF_OWNERSHIP, COPY_OF_ID, ADDRESS_PROOF, CODICE_FISCALE];
function getOwnerDetailsAndOwnerFilesForBeneficialOwners(ownerKeys, reimbursementAccountDraft) {
    const ownerDetails = {};
    const ownerFiles = {};
    ownerKeys.forEach((ownerKey) => {
        const ownerDetailsFullNameKey = `${PREFIX}_${ownerKey}_${FULL_NAME}`;
        const ownerDetailsResidentialAddressKey = `${PREFIX}_${ownerKey}_${RESIDENTIAL_ADDRESS}`;
        const ownerDetailsNationalityKey = `${PREFIX}_${ownerKey}_${COUNTRY}`;
        ownerDetailsFields.forEach((fieldName) => {
            const ownerDetailsKey = `${PREFIX}_${ownerKey}_${fieldName}`;
            if (!reimbursementAccountDraft?.[ownerDetailsKey]) {
                return;
            }
            if (fieldName === SSN_LAST_4 && String(reimbursementAccountDraft?.[ownerDetailsNationalityKey]) !== CONST_1.default.COUNTRY.US) {
                return;
            }
            if (fieldName === OWNERSHIP_PERCENTAGE) {
                ownerDetails[ownerDetailsKey] = String(reimbursementAccountDraft?.[ownerDetailsKey]);
                return;
            }
            if (fieldName === FIRST_NAME || fieldName === LAST_NAME) {
                ownerDetails[ownerDetailsFullNameKey] = ownerDetails[ownerDetailsFullNameKey]
                    ? `${String(ownerDetails[ownerDetailsFullNameKey])} ${String(reimbursementAccountDraft[ownerDetailsKey])}`
                    : reimbursementAccountDraft[ownerDetailsKey];
                return;
            }
            if (fieldName === STREET || fieldName === CITY || fieldName === STATE || fieldName === ZIP_CODE) {
                ownerDetails[ownerDetailsResidentialAddressKey] = ownerDetails[ownerDetailsResidentialAddressKey]
                    ? `${String(ownerDetails[ownerDetailsResidentialAddressKey])}, ${String(reimbursementAccountDraft[ownerDetailsKey])}`
                    : reimbursementAccountDraft[ownerDetailsKey];
                return;
            }
            ownerDetails[ownerDetailsKey] = reimbursementAccountDraft?.[ownerDetailsKey];
        });
        ownerFilesFields.forEach((fieldName) => {
            const ownerFilesKey = `${PREFIX}_${ownerKey}_${fieldName}`;
            if (!reimbursementAccountDraft?.[ownerFilesKey]) {
                return;
            }
            // User can only upload one file per each field
            const [uploadedFile] = reimbursementAccountDraft?.[ownerFilesKey] || [];
            ownerFiles[ownerFilesKey] = uploadedFile;
        });
    });
    return { ownerDetails, ownerFiles };
}
exports.default = getOwnerDetailsAndOwnerFilesForBeneficialOwners;
