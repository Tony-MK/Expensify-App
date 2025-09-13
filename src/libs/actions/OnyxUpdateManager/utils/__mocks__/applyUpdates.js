"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockValues = exports.applyUpdates = void 0;
const OnyxUpdates = require("@userActions/OnyxUpdates");
const createProxyForObject_1 = require("@src/utils/createProxyForObject");
jest.mock('@userActions/OnyxUpdates');
const mockValues = {
    beforeApplyUpdates: undefined,
};
const mockValuesProxy = (0, createProxyForObject_1.default)(mockValues);
exports.mockValues = mockValuesProxy;
const applyUpdates = jest.fn((updates) => {
    const createChain = () => {
        let chain = Promise.resolve();
        Object.values(updates).forEach((update) => {
            chain = chain.then(() => {
                return OnyxUpdates.apply(update).then(() => undefined);
            });
        });
        return chain;
    };
    if (mockValuesProxy.beforeApplyUpdates === undefined) {
        return createChain();
    }
    return mockValuesProxy.beforeApplyUpdates(updates).then(() => createChain());
});
exports.applyUpdates = applyUpdates;
