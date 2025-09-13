"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubstepValues = getSubstepValues;
exports.getInitialSubstep = getInitialSubstep;
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const CONST_1 = require("@src/CONST");
const PersonalDetailsForm_1 = require("@src/types/form/PersonalDetailsForm");
function getSubstepValues(privatePersonalDetails, personalDetailsDraft) {
    const address = PersonalDetailsUtils.getCurrentAddress(privatePersonalDetails);
    const { street } = address ?? {};
    const [street1, street2] = street ? street.split('\n') : [undefined, undefined];
    return {
        [PersonalDetailsForm_1.default.LEGAL_FIRST_NAME]: personalDetailsDraft?.[PersonalDetailsForm_1.default.LEGAL_FIRST_NAME] ?? privatePersonalDetails?.legalFirstName ?? '',
        [PersonalDetailsForm_1.default.LEGAL_LAST_NAME]: personalDetailsDraft?.[PersonalDetailsForm_1.default.LEGAL_LAST_NAME] ?? privatePersonalDetails?.legalLastName ?? '',
        [PersonalDetailsForm_1.default.DATE_OF_BIRTH]: personalDetailsDraft?.[PersonalDetailsForm_1.default.DATE_OF_BIRTH] ?? privatePersonalDetails?.dob ?? '',
        [PersonalDetailsForm_1.default.PHONE_NUMBER]: personalDetailsDraft?.[PersonalDetailsForm_1.default.PHONE_NUMBER] ?? privatePersonalDetails?.phoneNumber ?? '',
        [PersonalDetailsForm_1.default.ADDRESS_LINE_1]: personalDetailsDraft?.[PersonalDetailsForm_1.default.ADDRESS_LINE_1] ?? street1 ?? '',
        [PersonalDetailsForm_1.default.ADDRESS_LINE_2]: personalDetailsDraft?.[PersonalDetailsForm_1.default.ADDRESS_LINE_2] ?? street2 ?? '',
        [PersonalDetailsForm_1.default.CITY]: personalDetailsDraft?.[PersonalDetailsForm_1.default.CITY] ?? address?.city ?? '',
        [PersonalDetailsForm_1.default.STATE]: personalDetailsDraft?.[PersonalDetailsForm_1.default.STATE] ?? address?.state ?? '',
        [PersonalDetailsForm_1.default.ZIP_POST_CODE]: personalDetailsDraft?.[PersonalDetailsForm_1.default.ZIP_POST_CODE] ?? address?.zip ?? '',
        [PersonalDetailsForm_1.default.COUNTRY]: personalDetailsDraft?.[PersonalDetailsForm_1.default.COUNTRY] ?? address?.country ?? '',
    };
}
function getInitialSubstep(values) {
    if (values[PersonalDetailsForm_1.default.LEGAL_FIRST_NAME] === '' || values[PersonalDetailsForm_1.default.LEGAL_LAST_NAME] === '') {
        return CONST_1.default.MISSING_PERSONAL_DETAILS_INDEXES.MAPPING.LEGAL_NAME;
    }
    if (values[PersonalDetailsForm_1.default.DATE_OF_BIRTH] === '') {
        return CONST_1.default.MISSING_PERSONAL_DETAILS_INDEXES.MAPPING.DATE_OF_BIRTH;
    }
    if (values[PersonalDetailsForm_1.default.ADDRESS_LINE_1] === '' ||
        values[PersonalDetailsForm_1.default.CITY] === '' ||
        values[PersonalDetailsForm_1.default.STATE] === '' ||
        values[PersonalDetailsForm_1.default.ZIP_POST_CODE] === '' ||
        values[PersonalDetailsForm_1.default.COUNTRY] === '') {
        return CONST_1.default.MISSING_PERSONAL_DETAILS_INDEXES.MAPPING.ADDRESS;
    }
    if (values[PersonalDetailsForm_1.default.PHONE_NUMBER] === '') {
        return CONST_1.default.MISSING_PERSONAL_DETAILS_INDEXES.MAPPING.PHONE_NUMBER;
    }
    return CONST_1.default.MISSING_PERSONAL_DETAILS_INDEXES.MAPPING.CONFIRM;
}
