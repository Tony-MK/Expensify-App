"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reassure_1 = require("reassure");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const createCollection_1 = require("../utils/collections/createCollection");
const policyEmployeeList_1 = require("../utils/collections/policyEmployeeList");
describe('PolicyUtils', () => {
    describe('getMemberAccountIDsForWorkspace', () => {
        test('500 policy members with personal details', async () => {
            const policyEmployeeList = (0, createCollection_1.default)((_, index) => index, () => (0, policyEmployeeList_1.default)());
            await (0, reassure_1.measureFunction)(() => (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policyEmployeeList));
        });
        test('500 policy members with errors and personal details', async () => {
            const policyEmployeeList = (0, createCollection_1.default)((_, index) => index, () => ({
                ...(0, policyEmployeeList_1.default)(),
                errors: { error: 'Error message' },
            }));
            await (0, reassure_1.measureFunction)(() => (0, PolicyUtils_1.getMemberAccountIDsForWorkspace)(policyEmployeeList));
        });
    });
});
