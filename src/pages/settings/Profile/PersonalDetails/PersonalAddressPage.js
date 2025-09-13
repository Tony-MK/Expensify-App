"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const AddressPage_1 = require("@pages/AddressPage");
const PersonalDetails_1 = require("@src/libs/actions/PersonalDetails");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
/**
 * Submit form to update user's first and last legal name
 * @param values - form input values
 */
function updateAddress(values, addresses) {
    (0, PersonalDetails_1.updateAddress)(addresses, values.addressLine1?.trim() ?? '', values.addressLine2?.trim() ?? '', values.city.trim(), values.state.trim(), values?.zipPostCode?.trim().toUpperCase() ?? '', values.country);
}
function PersonalAddressPage() {
    const { translate } = (0, useLocalize_1.default)();
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [defaultCountry, defaultCountryStatus] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY, { canBeMissing: true });
    const isLoading = (0, isLoadingOnyxValue_1.default)(defaultCountryStatus);
    const address = (0, react_1.useMemo)(() => (0, PersonalDetailsUtils_1.getCurrentAddress)(privatePersonalDetails), [privatePersonalDetails]);
    if (isLoading) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<AddressPage_1.default defaultCountry={defaultCountry} address={address} isLoadingApp={isLoadingApp} updateAddress={(values) => updateAddress(values, privatePersonalDetails?.addresses ?? [])} title={translate('privatePersonalDetails.address')}/>);
}
PersonalAddressPage.displayName = 'PersonalAddressPage';
exports.default = PersonalAddressPage;
