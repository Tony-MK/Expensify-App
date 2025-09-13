"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBankInfoStepValues = getBankInfoStepValues;
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
/** Some values are send under certain key and saved under different key by BE.
 * This is forced on BE side which is asking us to send it under certain keys but then saves it and returns under different keys.
 * This is why we need a separate util just for this step, so we can correctly gather default values for such cases */
function getBankInfoStepValues(inputKeys, reimbursementAccountDraft, reimbursementAccount) {
    return Object.entries(inputKeys).reduce((acc, [, value]) => {
        switch (value) {
            case ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ROUTING_CODE:
                acc[value] = (reimbursementAccountDraft?.[value] ??
                    reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.BANK_INFO_STEP.ROUTING_NUMBER] ??
                    '');
                break;
            case ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.SWIFT_BIC_CODE:
                acc[value] = (reimbursementAccountDraft?.[value] ??
                    reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.BANK_INFO_STEP.ROUTING_NUMBER] ??
                    '');
                break;
            case ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ACCOUNT_HOLDER_NAME:
                acc[value] = (reimbursementAccountDraft?.[value] ??
                    reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ADDRESS_NAME] ??
                    '');
                break;
            case ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ACCOUNT_HOLDER_ADDRESS_1:
                acc[value] = (reimbursementAccountDraft?.[value] ??
                    reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ADDRESS_STREET] ??
                    '');
                break;
            case ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ACCOUNT_HOLDER_CITY:
                acc[value] = (reimbursementAccountDraft?.[value] ??
                    reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ADDRESS_CITY] ??
                    '');
                break;
            case ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ACCOUNT_HOLDER_REGION:
                acc[value] = (reimbursementAccountDraft?.[value] ??
                    reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ADDRESS_STATE] ??
                    '');
                break;
            case ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ACCOUNT_HOLDER_POSTAL:
                acc[value] = (reimbursementAccountDraft?.[value] ??
                    reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.ADDRESS_ZIP_CODE] ??
                    '');
                break;
            default:
                acc[value] = (reimbursementAccountDraft?.[value] ??
                    reimbursementAccount?.achData?.[value] ??
                    reimbursementAccount?.achData?.corpay?.[value] ??
                    '');
                break;
        }
        return acc;
    }, {});
}
