"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const InternationalDepositAccountContent_1 = require("./InternationalDepositAccountContent");
function InternationalDepositAccount() {
    const [privatePersonalDetails, privatePersonalDetailsMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS);
    const [corpayFields, corpayFieldsMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_FIELDS);
    const [bankAccountList, bankAccountListMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST);
    const [draftValues, draftValuesMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM_DRAFT);
    const [country, countryMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY);
    const [isAccountLoading, isLoadingMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, { selector: (personalBankAccount) => personalBankAccount?.isLoading });
    const isLoading = (0, isLoadingOnyxValue_1.default)(privatePersonalDetailsMetadata, corpayFieldsMetadata, bankAccountListMetadata, draftValuesMetadata, countryMetadata, isLoadingMetadata);
    if (isLoading) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<InternationalDepositAccountContent_1.default privatePersonalDetails={privatePersonalDetails} corpayFields={corpayFields} bankAccountList={bankAccountList} draftValues={draftValues} country={country} isAccountLoading={isAccountLoading ?? false}/>);
}
InternationalDepositAccount.displayName = 'InternationalDepositAccount';
exports.default = InternationalDepositAccount;
