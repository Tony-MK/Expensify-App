"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const utils_1 = require("@libs/Firebase/utils");
describe('getAttributes', () => {
    const allAttributes = [
        'accountId',
        'personalDetailsLength',
        'reportActionsLength',
        'reportsLength',
        'policiesLength',
        'transactionsLength',
        'transactionViolationsLength',
    ];
    const checkAttributes = (attributes, expectedAttributes) => {
        expectedAttributes.forEach((attr) => {
            (0, globals_1.expect)(attributes).toHaveProperty(attr);
        });
        (0, globals_1.expect)(Object.keys(attributes).length).toEqual(expectedAttributes.length);
    };
    it('should return 5 specific attributes', () => {
        const requestedAttributes = ['accountId', 'personalDetailsLength', 'reportActionsLength', 'reportsLength', 'policiesLength'];
        const attributes = utils_1.default.getAttributes(requestedAttributes);
        checkAttributes(attributes, requestedAttributes);
    });
    it('should return all attributes when no array is passed', () => {
        const attributes = utils_1.default.getAttributes();
        checkAttributes(attributes, allAttributes);
    });
    it('should return all attributes when an empty array is passed', () => {
        const attributes = utils_1.default.getAttributes([]);
        checkAttributes(attributes, allAttributes);
    });
});
