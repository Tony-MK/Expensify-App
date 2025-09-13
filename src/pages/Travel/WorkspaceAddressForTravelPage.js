"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AddressPage_1 = require("@pages/AddressPage");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceAddressForTravelPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(activePolicyID);
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const updatePolicyAddress = (values) => {
        if (!policy) {
            return;
        }
        (0, Policy_1.updateAddress)(policy?.id, {
            addressStreet: `${values.addressLine1?.trim() ?? ''}\n${values.addressLine2?.trim() ?? ''}`,
            city: values.city.trim(),
            state: values.state.trim(),
            zipCode: values?.zipPostCode?.trim().toUpperCase() ?? '',
            country: values.country,
        });
        if (!isUserValidated) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(ROUTES_1.default.TRAVEL_MY_TRIPS, ROUTES_1.default.TRAVEL_TCS.getRoute(route.params.domain) ?? CONST_1.default.TRAVEL.DEFAULT_DOMAIN));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_TCS.getRoute(route.params.domain ?? CONST_1.default.TRAVEL.DEFAULT_DOMAIN), { forceReplace: true });
    };
    return (<AddressPage_1.default isLoadingApp={false} updateAddress={updatePolicyAddress} title={translate('common.companyAddress')} backTo={route.params.backTo}/>);
}
WorkspaceAddressForTravelPage.displayName = 'WorkspaceAddressForTravelPage';
exports.default = WorkspaceAddressForTravelPage;
