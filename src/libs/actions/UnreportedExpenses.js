"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUnreportedExpenses = fetchUnreportedExpenses;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function fetchUnreportedExpenses(offset) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_UNREPORTED_TRANSACTIONS,
            value: true,
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_UNREPORTED_TRANSACTIONS,
            value: false,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_UNREPORTED_TRANSACTIONS,
            value: false,
        },
    ];
    API.read(types_1.READ_COMMANDS.OPEN_UNREPORTED_EXPENSES_PAGE, { offset }, { optimisticData, successData, failureData });
}
