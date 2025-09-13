"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AddressPage_1 = require("@pages/AddressPage");
const Policy_1 = require("@userActions/Policy/Policy");
const withPolicy_1 = require("./withPolicy");
function WorkspaceOverviewAddressPage({ policy, route }) {
    const { translate } = (0, useLocalize_1.default)();
    const backTo = route.params.backTo;
    const address = (0, react_1.useMemo)(() => {
        const tempAddress = policy?.address;
        const result = {
            street: tempAddress?.addressStreet ?? '',
            city: tempAddress?.city?.trim() ?? '',
            state: tempAddress?.state?.trim() ?? '',
            zip: tempAddress?.zipCode?.trim().toUpperCase() ?? '',
            country: tempAddress?.country ?? '',
        };
        return result;
    }, [policy]);
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
        Navigation_1.default.goBack(backTo);
    };
    return (<AddressPage_1.default backTo={backTo} address={address} isLoadingApp={false} updateAddress={updatePolicyAddress} title={translate('common.companyAddress')}/>);
}
WorkspaceOverviewAddressPage.displayName = 'WorkspaceOverviewAddressPage';
exports.default = (0, withPolicy_1.default)(WorkspaceOverviewAddressPage);
