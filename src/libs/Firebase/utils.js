"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We have opted for `Onyx.connectWithoutView` here as this logic is strictly non-UI in nature.
var react_native_onyx_1 = require("react-native-onyx");
var SessionUtils = require("@libs/SessionUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var reportsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: function (value) {
        reportsCount = Object.keys(value !== null && value !== void 0 ? value : {}).length;
    },
});
var reportActionsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: function (value) {
        reportActionsCount = Object.keys(value !== null && value !== void 0 ? value : {}).length;
    },
});
var transactionViolationsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    waitForCollectionCallback: true,
    callback: function (value) {
        transactionViolationsCount = Object.keys(value !== null && value !== void 0 ? value : {}).length;
    },
});
var transactionsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
    waitForCollectionCallback: true,
    callback: function (value) {
        transactionsCount = Object.keys(value !== null && value !== void 0 ? value : {}).length;
    },
});
var policiesCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    waitForCollectionCallback: true,
    callback: function (value) {
        policiesCount = Object.keys(value !== null && value !== void 0 ? value : {}).length;
    },
});
var personalDetailsCount = 0;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: function (value) {
        personalDetailsCount = Object.keys(value !== null && value !== void 0 ? value : {}).length;
    },
});
function getAttributes(attributes) {
    var _a, _b;
    var session = SessionUtils.getSession();
    var allAttributes = {
        accountId: (_b = (_a = session === null || session === void 0 ? void 0 : session.accountID) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'N/A',
        reportsLength: reportsCount.toString(),
        reportActionsLength: reportActionsCount.toString(),
        personalDetailsLength: personalDetailsCount.toString(),
        transactionViolationsLength: transactionViolationsCount.toString(),
        policiesLength: policiesCount.toString(),
        transactionsLength: transactionsCount.toString(),
    };
    if (attributes && attributes.length > 0) {
        var selectedAttributes_1 = {};
        attributes.forEach(function (attribute) {
            selectedAttributes_1[attribute] = allAttributes[attribute];
        });
        return selectedAttributes_1;
    }
    return allAttributes;
}
exports.default = {
    getAttributes: getAttributes,
};
