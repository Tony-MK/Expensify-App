"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useGeographicalStateAndCountryFromRoute;
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const CONST_1 = require("@src/CONST");
/**
 * Extracts the 'state' and 'country' query parameters from the route/ url and validates it against COMMON_CONST.STATES and CONST.ALL_COUNTRIES.
 * Example 1: Url: https://new.expensify.com/settings/profile/address?state=MO Returns: state=MO
 * Example 2: Url: https://new.expensify.com/settings/profile/address?state=ASDF Returns: state=undefined
 * Example 3: Url: https://new.expensify.com/settings/profile/address Returns: state=undefined
 * Example 4: Url: https://new.expensify.com/settings/profile/address?state=MO-hash-a12341 Returns: state=MO
 * Similarly for country parameter.
 */
function useGeographicalStateAndCountryFromRoute(stateParamName = 'state', countryParamName = 'country') {
    const routeParams = (0, native_1.useRoute)().params;
    const stateFromUrlTemp = routeParams?.[stateParamName];
    const countryFromUrlTemp = routeParams?.[countryParamName];
    return {
        state: expensify_common_1.CONST.STATES[stateFromUrlTemp]?.stateISO,
        country: Object.keys(CONST_1.default.ALL_COUNTRIES).find((country) => country === countryFromUrlTemp),
    };
}
