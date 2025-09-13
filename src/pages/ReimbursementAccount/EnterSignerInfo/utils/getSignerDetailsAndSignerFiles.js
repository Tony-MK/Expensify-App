"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnterSignerInfoForm_1 = require("@src/types/form/EnterSignerInfoForm");
var signerDetailsFields = [
    EnterSignerInfoForm_1.default.SIGNER_FULL_NAME,
    EnterSignerInfoForm_1.default.SIGNER_EMAIL,
    EnterSignerInfoForm_1.default.SIGNER_JOB_TITLE,
    EnterSignerInfoForm_1.default.SIGNER_DATE_OF_BIRTH,
    EnterSignerInfoForm_1.default.SIGNER_STREET,
    EnterSignerInfoForm_1.default.SIGNER_CITY,
    EnterSignerInfoForm_1.default.SIGNER_STATE,
    EnterSignerInfoForm_1.default.SIGNER_ZIP_CODE,
    EnterSignerInfoForm_1.default.DOWNLOADED_PDS_AND_FSG,
];
var signerFilesFields = [EnterSignerInfoForm_1.default.PROOF_OF_DIRECTORS, EnterSignerInfoForm_1.default.SIGNER_ADDRESS_PROOF, EnterSignerInfoForm_1.default.SIGNER_COPY_OF_ID, EnterSignerInfoForm_1.default.SIGNER_CODICE_FISCALE];
function getSignerDetailsAndSignerFilesForSignerInfo(enterSignerInfoFormDraft, signerEmail) {
    var signerDetails = {};
    var signerFiles = {};
    signerDetailsFields.forEach(function (fieldName) {
        if (fieldName === EnterSignerInfoForm_1.default.SIGNER_EMAIL) {
            signerDetails[fieldName] = signerEmail;
            return;
        }
        if (!(enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[fieldName])) {
            return;
        }
        if (fieldName === EnterSignerInfoForm_1.default.SIGNER_STREET || fieldName === EnterSignerInfoForm_1.default.SIGNER_CITY || fieldName === EnterSignerInfoForm_1.default.SIGNER_STATE || fieldName === EnterSignerInfoForm_1.default.SIGNER_ZIP_CODE) {
            signerDetails[EnterSignerInfoForm_1.default.SIGNER_COMPLETE_RESIDENTIAL_ADDRESS] = signerDetails[EnterSignerInfoForm_1.default.SIGNER_COMPLETE_RESIDENTIAL_ADDRESS]
                ? "".concat(String(signerDetails[EnterSignerInfoForm_1.default.SIGNER_COMPLETE_RESIDENTIAL_ADDRESS]), ", ").concat(String(enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[fieldName]))
                : enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[fieldName];
            return;
        }
        var value = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[fieldName];
        if (typeof value === 'string' || typeof value === 'boolean' || Array.isArray(value)) {
            signerDetails[fieldName] = value;
        }
    });
    signerFilesFields.forEach(function (fieldName) {
        if (!(enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[fieldName])) {
            return;
        }
        // eslint-disable-next-line rulesdir/prefer-at
        signerFiles[fieldName] = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[fieldName][0];
    });
    return { signerDetails: signerDetails, signerFiles: signerFiles };
}
exports.default = getSignerDetailsAndSignerFilesForSignerInfo;
