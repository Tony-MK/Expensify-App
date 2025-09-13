"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function OpenWorkspacePlanPage(policyID) {
    if (!policyID) {
        Log_1.default.warn('OpenWorkspacePlanPage invalid params', { policyID });
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    const params = {
        policyID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_WORKSPACE_PLAN_PAGE, params, { optimisticData, successData, failureData });
}
exports.default = OpenWorkspacePlanPage;
