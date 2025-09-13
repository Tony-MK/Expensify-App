"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockValues = exports.validateAndApplyDeferredUpdates = exports.detectGapsAndSplit = exports.applyUpdates = void 0;
const createProxyForObject_1 = require("@src/utils/createProxyForObject");
const applyUpdates_1 = require("./applyUpdates");
Object.defineProperty(exports, "applyUpdates", { enumerable: true, get: function () { return applyUpdates_1.applyUpdates; } });
const UtilsImplementation = jest.requireActual('@libs/actions/OnyxUpdateManager/utils');
const mockValues = {
    beforeValidateAndApplyDeferredUpdates: undefined,
};
const mockValuesProxy = (0, createProxyForObject_1.default)(mockValues);
exports.mockValues = mockValuesProxy;
const detectGapsAndSplit = jest.fn(UtilsImplementation.detectGapsAndSplit);
exports.detectGapsAndSplit = detectGapsAndSplit;
const validateAndApplyDeferredUpdates = jest.fn((clientLastUpdateID) => {
    if (mockValuesProxy.beforeValidateAndApplyDeferredUpdates === undefined) {
        return UtilsImplementation.validateAndApplyDeferredUpdates(clientLastUpdateID);
    }
    return mockValuesProxy.beforeValidateAndApplyDeferredUpdates(clientLastUpdateID).then(() => UtilsImplementation.validateAndApplyDeferredUpdates(clientLastUpdateID));
});
exports.validateAndApplyDeferredUpdates = validateAndApplyDeferredUpdates;
