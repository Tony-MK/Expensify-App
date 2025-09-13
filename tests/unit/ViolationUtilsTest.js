"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const react_native_onyx_1 = require("react-native-onyx");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Localize_1 = require("@libs/Localize");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const categoryOutOfPolicyViolation = {
    name: CONST_1.default.VIOLATIONS.CATEGORY_OUT_OF_POLICY,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
};
const missingCategoryViolation = {
    name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    showInReview: true,
};
const futureDateViolation = {
    name: CONST_1.default.VIOLATIONS.FUTURE_DATE,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    showInReview: true,
};
const receiptRequiredViolation = {
    name: CONST_1.default.VIOLATIONS.RECEIPT_REQUIRED,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    showInReview: true,
    data: {
        formattedLimit: (0, CurrencyUtils_1.convertAmountToDisplayString)(CONST_1.default.POLICY.DEFAULT_MAX_AMOUNT_NO_RECEIPT),
    },
};
const categoryReceiptRequiredViolation = {
    name: CONST_1.default.VIOLATIONS.RECEIPT_REQUIRED,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    showInReview: true,
    data: undefined,
};
const overLimitViolation = {
    name: CONST_1.default.VIOLATIONS.OVER_LIMIT,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    showInReview: true,
    data: {
        formattedLimit: (0, CurrencyUtils_1.convertAmountToDisplayString)(CONST_1.default.POLICY.DEFAULT_MAX_EXPENSE_AMOUNT),
    },
};
const categoryOverLimitViolation = {
    name: CONST_1.default.VIOLATIONS.OVER_CATEGORY_LIMIT,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    showInReview: true,
    data: {
        formattedLimit: (0, CurrencyUtils_1.convertAmountToDisplayString)(CONST_1.default.POLICY.DEFAULT_MAX_EXPENSE_AMOUNT),
    },
};
const categoryMissingCommentViolation = {
    name: CONST_1.default.VIOLATIONS.MISSING_COMMENT,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    showInReview: true,
};
const customUnitOutOfPolicyViolation = {
    name: CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
};
const missingTagViolation = {
    name: CONST_1.default.VIOLATIONS.MISSING_TAG,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
};
const tagOutOfPolicyViolation = {
    name: CONST_1.default.VIOLATIONS.TAG_OUT_OF_POLICY,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
};
const smartScanFailedViolation = {
    name: CONST_1.default.VIOLATIONS.SMARTSCAN_FAILED,
    type: CONST_1.default.VIOLATION_TYPES.WARNING,
};
const duplicatedTransactionViolation = {
    name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
    type: CONST_1.default.VIOLATION_TYPES.WARNING,
};
describe('getViolationsOnyxData', () => {
    let transaction;
    let transactionViolations;
    let policy;
    let policyTags;
    let policyCategories;
    (0, globals_1.beforeEach)(() => {
        transaction = {
            transactionID: '123',
            reportID: '1234',
            amount: 100,
            comment: { attendees: [{ email: 'text@expensify.com', displayName: 'Test User', avatarUrl: '' }] },
            created: '2023-07-24 13:46:20',
            merchant: 'United Airlines',
            currency: CONST_1.default.CURRENCY.USD,
        };
        transactionViolations = [];
        policy = { requiresTag: false, requiresCategory: false };
        policyTags = {};
        policyCategories = {};
    });
    it('should return an object with correct shape and with empty transactionViolations array', () => {
        const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
        expect(result).toEqual({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
            value: transactionViolations,
        });
    });
    it('should handle multiple violations', () => {
        policy.type = 'corporate';
        policy.maxExpenseAmountNoReceipt = 25;
        transaction.amount = 100;
        transactionViolations = [
            { name: 'duplicatedTransaction', type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
            { name: 'receiptRequired', type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
        ];
        const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
        expect(result.value).toEqual(expect.arrayContaining(transactionViolations));
    });
    describe('distance rate was modified', () => {
        (0, globals_1.beforeEach)(() => {
            transactionViolations = [customUnitOutOfPolicyViolation];
            const customUnitRateID = 'rate_id';
            transaction.comment = {
                ...transaction.comment,
                customUnit: {
                    ...(transaction?.comment?.customUnit ?? {}),
                    customUnitRateID,
                },
            };
            policy.customUnits = {
                unitId: {
                    attributes: { unit: 'mi' },
                    customUnitID: 'unitId',
                    defaultCategory: 'Car',
                    enabled: true,
                    name: 'Distance',
                    rates: {
                        [customUnitRateID]: {
                            currency: 'USD',
                            customUnitRateID,
                            enabled: true,
                            name: 'Default Rate',
                            rate: 65.5,
                        },
                    },
                },
            };
        });
        it('should remove the customUnitOutOfPolicy violation if the modified one belongs to the policy', () => {
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).not.toContainEqual(customUnitOutOfPolicyViolation);
        });
    });
    describe('controlPolicyViolations', () => {
        (0, globals_1.beforeEach)(() => {
            policy.type = 'corporate';
            policy.outputCurrency = CONST_1.default.CURRENCY.USD;
        });
        it('should not add futureDate violation if the policy is not corporate', () => {
            transaction.created = '9999-12-31T23:59:59Z';
            policy.type = 'personal';
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(transactionViolations);
        });
        it('should add futureDate violation if the transaction has a future date and policy is corporate', () => {
            transaction.created = '9999-12-31T23:59:59Z';
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([futureDateViolation, ...transactionViolations]));
        });
        it('should remove futureDate violation if the policy is downgraded', () => {
            transaction.created = '9999-12-31T23:59:59Z';
            policy.type = 'personal';
            transactionViolations = [futureDateViolation];
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).not.toContainEqual(futureDateViolation);
        });
        it('should add receiptRequired violation if the transaction has no receipt', () => {
            transaction.amount = 1000000;
            policy.maxExpenseAmountNoReceipt = 2500;
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([receiptRequiredViolation, ...transactionViolations]));
        });
        it('should not add receiptRequired violation if the transaction has different currency than the workspace currency', () => {
            transaction.amount = 1000000;
            transaction.modifiedCurrency = CONST_1.default.CURRENCY.CAD;
            policy.maxExpenseAmountNoReceipt = 2500;
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual([]);
        });
        it('should add overLimit violation if the transaction amount is over the policy limit', () => {
            transaction.amount = 1000000;
            policy.maxExpenseAmount = 200000;
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([overLimitViolation, ...transactionViolations]));
        });
        it('should not add overLimit violation if the transaction currency is different from the workspace currency', () => {
            transaction.amount = 1000000;
            transaction.modifiedCurrency = CONST_1.default.CURRENCY.NZD;
            policy.maxExpenseAmount = 200000;
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual([]);
        });
    });
    describe('policyCategoryRules', () => {
        (0, globals_1.beforeEach)(() => {
            policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
            policy.outputCurrency = CONST_1.default.CURRENCY.USD;
            policyCategories = {
                Food: {
                    name: 'Food',
                    enabled: true,
                    areCommentsRequired: true,
                    maxAmountNoReceipt: 0,
                    maxExpenseAmount: CONST_1.default.POLICY.DEFAULT_MAX_EXPENSE_AMOUNT,
                },
            };
            transaction.category = 'Food';
            transaction.amount = CONST_1.default.POLICY.DEFAULT_MAX_EXPENSE_AMOUNT + 1;
            transaction.comment = { comment: '' };
        });
        it('should add category specific violations', () => {
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([categoryOverLimitViolation, categoryReceiptRequiredViolation, categoryMissingCommentViolation, ...transactionViolations]));
        });
    });
    describe('policyRequiresCategories', () => {
        (0, globals_1.beforeEach)(() => {
            policy.requiresCategory = true;
            policyCategories = { Food: { name: 'Food', unencodedName: '', enabled: true, areCommentsRequired: false, externalID: '1234', origin: '12345' } };
            transaction.category = 'Food';
            transaction.amount = 100;
        });
        it('should add missingCategory violation if no category is included', () => {
            transaction.category = undefined;
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([missingCategoryViolation, ...transactionViolations]));
        });
        it('should add categoryOutOfPolicy violation when category is not in policy', () => {
            transaction.category = 'Bananas';
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([categoryOutOfPolicyViolation, ...transactionViolations]));
        });
        it('should not include a categoryOutOfPolicy violation when category is in policy', () => {
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).not.toContainEqual(categoryOutOfPolicyViolation);
        });
        it('should not add a category violation when the transaction is scanning', () => {
            const partialTransaction = {
                ...transaction,
                amount: 0,
                merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                category: undefined,
                receipt: { state: CONST_1.default.IOU.RECEIPT_STATE.SCANNING },
            };
            const result = ViolationsUtils_1.default.getViolationsOnyxData(partialTransaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).not.toContainEqual(missingCategoryViolation);
        });
        it('should add categoryOutOfPolicy violation to existing violations if they exist', () => {
            transaction.category = 'Bananas';
            transaction.amount = 1000000;
            transactionViolations = [{ name: 'duplicatedTransaction', type: CONST_1.default.VIOLATION_TYPES.VIOLATION }];
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([categoryOutOfPolicyViolation, ...transactionViolations]));
        });
        it('should add missingCategory violation to existing violations if they exist', () => {
            transaction.category = undefined;
            transaction.amount = 1000000;
            transactionViolations = [{ name: 'duplicatedTransaction', type: CONST_1.default.VIOLATION_TYPES.VIOLATION }];
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([missingCategoryViolation, ...transactionViolations]));
        });
        it('should only return smartscanFailed violation for smart scan failed transactions', () => {
            const partialTransaction = {
                ...transaction,
                amount: 0,
                merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                category: undefined,
                iouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
                receipt: { state: CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED },
            };
            const result = ViolationsUtils_1.default.getViolationsOnyxData(partialTransaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual([{ name: CONST_1.default.VIOLATIONS.SMARTSCAN_FAILED, type: CONST_1.default.VIOLATION_TYPES.WARNING, showInReview: true }]);
        });
    });
    describe('policy does not require Categories', () => {
        (0, globals_1.beforeEach)(() => {
            policy.requiresCategory = false;
        });
        it('should not add any violations when categories are not required', () => {
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).not.toContainEqual(categoryOutOfPolicyViolation);
            expect(result.value).not.toContainEqual(missingCategoryViolation);
        });
    });
    describe('policyRequiresTags', () => {
        (0, globals_1.beforeEach)(() => {
            policy.requiresTag = true;
            policyTags = {
                Meals: {
                    name: 'Meals',
                    required: true,
                    tags: {
                        Lunch: { name: 'Lunch', enabled: true },
                        Dinner: { name: 'Dinner', enabled: true },
                    },
                    orderWeight: 1,
                },
            };
            transaction.tag = 'Lunch';
        });
        it("shouldn't update the transactionViolations if the policy requires tags and the transaction has a tag from the policy", () => {
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(transactionViolations);
        });
        it('should add a missingTag violation if none is provided and policy requires tags', () => {
            transaction.tag = undefined;
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([{ ...missingTagViolation }]));
        });
        it('should add a tagOutOfPolicy violation when policy requires tags and tag is not in the policy', () => {
            policyTags = {};
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual([]);
        });
        it('should not add a tag violation when the transaction is scanning', () => {
            const partialTransaction = {
                ...transaction,
                amount: 0,
                merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
                tag: undefined,
                receipt: { state: CONST_1.default.IOU.RECEIPT_STATE.SCANNING },
            };
            const result = ViolationsUtils_1.default.getViolationsOnyxData(partialTransaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).not.toContainEqual(missingTagViolation);
        });
        it('should add tagOutOfPolicy violation to existing violations if transaction has tag that is not in the policy', () => {
            transaction.tag = 'Bananas';
            transactionViolations = [{ name: 'duplicatedTransaction', type: CONST_1.default.VIOLATION_TYPES.VIOLATION }];
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([{ ...tagOutOfPolicyViolation }, ...transactionViolations]));
        });
        it('should add missingTag violation to existing violations if transaction does not have a tag', () => {
            transaction.tag = undefined;
            transactionViolations = [{ name: 'duplicatedTransaction', type: CONST_1.default.VIOLATION_TYPES.VIOLATION }];
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual(expect.arrayContaining([{ ...missingTagViolation }, ...transactionViolations]));
        });
    });
    describe('policy does not require Tags', () => {
        (0, globals_1.beforeEach)(() => {
            policy.requiresTag = false;
        });
        it('should not add any violations when tags are not required', () => {
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).not.toContainEqual(tagOutOfPolicyViolation);
            expect(result.value).not.toContainEqual(missingTagViolation);
        });
    });
    describe('policy has multi level tags', () => {
        (0, globals_1.beforeEach)(() => {
            policy.requiresTag = true;
            policyTags = {
                Department: {
                    name: 'Department',
                    tags: {
                        Accounting: {
                            name: 'Accounting',
                            enabled: true,
                        },
                    },
                    required: true,
                    orderWeight: 2,
                },
                Region: {
                    name: 'Region',
                    tags: {
                        Africa: {
                            name: 'Africa',
                            enabled: true,
                        },
                    },
                    required: true,
                    orderWeight: 1,
                },
                Project: {
                    name: 'Project',
                    tags: {
                        Project1: {
                            name: 'Project1',
                            enabled: true,
                        },
                    },
                    required: true,
                    orderWeight: 3,
                },
            };
        });
        it('should return someTagLevelsRequired when a required tag is missing', () => {
            const someTagLevelsRequiredViolation = {
                name: 'someTagLevelsRequired',
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                data: {
                    errorIndexes: [0, 1, 2],
                },
            };
            // Test case where transaction has no tags
            let result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual([someTagLevelsRequiredViolation]);
            // Test case where transaction has 1 tag
            transaction.tag = 'Africa';
            someTagLevelsRequiredViolation.data = { errorIndexes: [1, 2] };
            result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual([someTagLevelsRequiredViolation]);
            // Test case where transaction has 2 tags
            transaction.tag = 'Africa::Project1';
            someTagLevelsRequiredViolation.data = { errorIndexes: [1] };
            result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual([someTagLevelsRequiredViolation]);
            // Test case where transaction has all tags
            transaction.tag = 'Africa:Accounting:Project1';
            result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            expect(result.value).toEqual([]);
        });
        it('should return tagOutOfPolicy when a tag is not enabled in the policy but is set in the transaction', () => {
            policyTags.Department.tags.Accounting.enabled = false;
            transaction.tag = 'Africa:Accounting:Project1';
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, false, false);
            const violation = { ...tagOutOfPolicyViolation, data: { tagName: 'Department' } };
            expect(result.value).toEqual([violation]);
        });
        it('should return missingTag when all dependent tags are enabled in the policy but are not set in the transaction', () => {
            const missingDepartmentTag = { ...missingTagViolation, data: { tagName: 'Department' } };
            const missingRegionTag = { ...missingTagViolation, data: { tagName: 'Region' } };
            const missingProjectTag = { ...missingTagViolation, data: { tagName: 'Project' } };
            transaction.tag = undefined;
            const result = ViolationsUtils_1.default.getViolationsOnyxData(transaction, transactionViolations, policy, policyTags, policyCategories, true, false);
            expect(result.value).toEqual(expect.arrayContaining([missingDepartmentTag, missingRegionTag, missingProjectTag]));
        });
    });
});
const getFakeTransaction = (transactionID, comment) => ({
    transactionID,
    attendees: [{ email: 'text@expensify.com' }],
    reportID: '1234',
    amount: 100,
    comment: comment ?? {},
    created: '2023-07-24 13:46:20',
    merchant: 'United Airlines',
    currency: 'USD',
});
const CARLOS_EMAIL = 'cmartins@expensifail.com';
const CARLOS_ACCOUNT_ID = 1;
describe('getViolations', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: {
                [ONYXKEYS_1.default.SESSION]: {
                    email: CARLOS_EMAIL,
                    accountID: CARLOS_ACCOUNT_ID,
                },
            },
        });
    });
    afterEach(() => react_native_onyx_1.default.clear());
    it('should check if violation is dismissed or not', async () => {
        const transaction = getFakeTransaction('123', {
            dismissedViolations: { smartscanFailed: { [CARLOS_EMAIL]: CARLOS_ACCOUNT_ID.toString() } },
        });
        const transactionCollectionDataSet = {
            [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: transaction,
        };
        await react_native_onyx_1.default.multiSet({ ...transactionCollectionDataSet });
        const isSmartScanDismissed = (0, TransactionUtils_1.isViolationDismissed)(transaction, smartScanFailedViolation);
        const isDuplicateViolationDismissed = (0, TransactionUtils_1.isViolationDismissed)(transaction, duplicatedTransactionViolation);
        expect(isSmartScanDismissed).toBeTruthy();
        expect(isDuplicateViolationDismissed).toBeFalsy();
    });
    it('should return filtered out dismissed violations', async () => {
        const transaction = getFakeTransaction('123', {
            dismissedViolations: { smartscanFailed: { [CARLOS_EMAIL]: CARLOS_ACCOUNT_ID.toString() } },
        });
        const transactionCollectionDataSet = {
            [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: transaction,
        };
        const transactionViolationsCollection = {
            [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`]: [duplicatedTransactionViolation, smartScanFailedViolation, tagOutOfPolicyViolation],
        };
        await react_native_onyx_1.default.multiSet({ ...transactionCollectionDataSet });
        // Should filter out the smartScanFailedViolation
        const filteredViolations = (0, TransactionUtils_1.getTransactionViolations)(transaction, transactionViolationsCollection);
        expect(filteredViolations).toEqual([duplicatedTransactionViolation, tagOutOfPolicyViolation]);
    });
    it('checks if transaction has warning type violation after filtering dismissed violations', async () => {
        const transaction = getFakeTransaction('123', {
            dismissedViolations: { smartscanFailed: { [CARLOS_EMAIL]: CARLOS_ACCOUNT_ID.toString() } },
        });
        const transactionCollectionDataSet = {
            [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`]: transaction,
        };
        const transactionViolationsCollection = {
            [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`]: [duplicatedTransactionViolation, smartScanFailedViolation, tagOutOfPolicyViolation],
        };
        await react_native_onyx_1.default.multiSet({ ...transactionCollectionDataSet });
        const hasWarningTypeViolationRes = (0, TransactionUtils_1.hasWarningTypeViolation)(transaction, transactionViolationsCollection);
        expect(hasWarningTypeViolationRes).toBeTruthy();
    });
});
const brokenCardConnectionViolation = {
    name: CONST_1.default.VIOLATIONS.RTER,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    data: {
        brokenBankConnection: true,
        isAdmin: true,
        rterType: CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION,
    },
};
const brokenCardConnection530Violation = {
    name: CONST_1.default.VIOLATIONS.RTER,
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    data: {
        brokenBankConnection: true,
        isAdmin: false,
        rterType: CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION_530,
    },
};
describe('getViolationTranslation', () => {
    it('should return the correct message for broken card connection violation', () => {
        const brokenCardConnectionViolationExpected = (0, Localize_1.translateLocal)('violations.rter', {
            brokenBankConnection: true,
            isAdmin: true,
            rterType: CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION,
            isTransactionOlderThan7Days: false,
        });
        expect(ViolationsUtils_1.default.getViolationTranslation(brokenCardConnectionViolation, Localize_1.translateLocal)).toBe(brokenCardConnectionViolationExpected);
        const brokenCardConnection530ViolationExpected = (0, Localize_1.translateLocal)('violations.rter', {
            brokenBankConnection: true,
            isAdmin: false,
            rterType: CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION_530,
            isTransactionOlderThan7Days: false,
        });
        expect(ViolationsUtils_1.default.getViolationTranslation(brokenCardConnection530Violation, Localize_1.translateLocal)).toBe(brokenCardConnection530ViolationExpected);
    });
});
describe('getRBRMessages', () => {
    const mockTransaction = {
        transactionID: 'test-transaction-id',
        reportID: 'test-report-id',
        amount: 100,
        currency: CONST_1.default.CURRENCY.USD,
        created: '2023-07-24 13:46:20',
        merchant: 'Test Merchant',
    };
    const mockViolations = [
        {
            name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
        },
        {
            name: CONST_1.default.VIOLATIONS.MISSING_TAG,
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
        },
    ];
    it('should return all violations and missing field error', () => {
        const missingFieldError = 'Missing required field';
        const result = ViolationsUtils_1.default.getRBRMessages(mockTransaction, mockViolations, Localize_1.translateLocal, missingFieldError, []);
        const expectedResult = `Missing required field. ${(0, Localize_1.translateLocal)('violations.missingCategory')}. ${(0, Localize_1.translateLocal)('violations.missingTag')}.`;
        expect(result).toBe(expectedResult);
    });
    it('should filter out empty strings', () => {
        const result = ViolationsUtils_1.default.getRBRMessages(mockTransaction, mockViolations, Localize_1.translateLocal, undefined, []);
        const expectedResult = `${(0, Localize_1.translateLocal)('violations.missingCategory')}. ${(0, Localize_1.translateLocal)('violations.missingTag')}.`;
        expect(result).toBe(expectedResult);
    });
});
