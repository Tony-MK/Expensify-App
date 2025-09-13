"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We have opted for `Onyx.connectWithoutView` here as this logic is strictly non-UI in nature.
const react_native_onyx_1 = require("react-native-onyx");
const SessionUtils = require("@libs/SessionUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let reportsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        reportsCount = Object.keys(value ?? {}).length;
    },
});
let reportActionsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (value) => {
        reportActionsCount = Object.keys(value ?? {}).length;
    },
});
let transactionViolationsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    waitForCollectionCallback: true,
    callback: (value) => {
        transactionViolationsCount = Object.keys(value ?? {}).length;
    },
});
let transactionsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
    waitForCollectionCallback: true,
    callback: (value) => {
        transactionsCount = Object.keys(value ?? {}).length;
    },
});
let policiesCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    waitForCollectionCallback: true,
    callback: (value) => {
        policiesCount = Object.keys(value ?? {}).length;
    },
});
let personalDetailsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => {
        personalDetailsCount = Object.keys(value ?? {}).length;
    },
});
function getAttributes(attributes) {
    const session = SessionUtils.getSession();
    const allAttributes = {
        accountId: session?.accountID?.toString() ?? 'N/A',
        reportsLength: reportsCount.toString(),
        reportActionsLength: reportActionsCount.toString(),
        personalDetailsLength: personalDetailsCount.toString(),
        transactionViolationsLength: transactionViolationsCount.toString(),
        policiesLength: policiesCount.toString(),
        transactionsLength: transactionsCount.toString(),
    };
    if (attributes && attributes.length > 0) {
        const selectedAttributes = {};
        attributes.forEach((attribute) => {
            selectedAttributes[attribute] = allAttributes[attribute];
        });
        return selectedAttributes;
    }
    return allAttributes;
}
exports.default = {
    getAttributes,
};
