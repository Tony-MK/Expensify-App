"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPolicyAccountingPage = openPolicyAccountingPage;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function openPolicyAccountingPage(policyID) {
    const hasConnectionsDataBeenFetchedKey = `${ONYXKEYS_1.default.COLLECTION.POLICY_HAS_CONNECTIONS_DATA_BEEN_FETCHED}${policyID}`;
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: hasConnectionsDataBeenFetchedKey,
            value: true,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: hasConnectionsDataBeenFetchedKey,
            value: false,
        },
    ];
    const parameters = {
        policyID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_ACCOUNTING_PAGE, parameters, {
        successData,
        failureData,
    });
}
