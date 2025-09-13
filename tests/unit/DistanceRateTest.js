"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const DistanceRate_1 = require("@libs/actions/Policy/DistanceRate");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const transaction_1 = require("../utils/collections/transaction");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
describe('DistanceRate', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        return (0, waitForBatchedUpdates_1.default)();
    });
    describe('deletePolicyDistanceRates', () => {
        it('should set customUnitOutOfPolicy violation only for transactions that have the deleted custom unit rate', async () => {
            const customUnitID = '5A55C2B68DDCB';
            const customUnitRateID1 = '7255CA72C7E7B';
            const customUnitRateID2 = '7255CA72C7E72';
            const transaction1 = {
                ...(0, transaction_1.default)(1),
                comment: {
                    customUnit: {
                        customUnitID,
                        customUnitRateID: customUnitRateID1,
                    },
                },
            };
            const transaction2 = {
                ...(0, transaction_1.default)(2),
                comment: {
                    customUnit: {
                        customUnitID,
                        customUnitRateID: customUnitRateID2,
                    },
                },
            };
            const policy = {
                ...(0, policies_1.default)(3),
                ...{
                    areDistanceRatesEnabled: true,
                    customUnits: {
                        [customUnitID]: {
                            attributes: {
                                unit: CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES,
                            },
                            customUnitID,
                            defaultCategory: 'Car',
                            enabled: true,
                            name: 'Distance',
                            rates: {
                                [customUnitRateID1]: {
                                    currency: 'ETB',
                                    customUnitRateID: customUnitRateID1,
                                    enabled: true,
                                    name: 'Default Rate',
                                    rate: 70,
                                    subRates: [],
                                },
                                [customUnitRateID2]: {
                                    currency: 'ETB',
                                    customUnitRateID: customUnitRateID2,
                                    enabled: true,
                                    name: 'Default Rate',
                                    rate: 71,
                                    subRates: [],
                                },
                            },
                        },
                    },
                },
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction1.transactionID}`, transaction1);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction2.transactionID}`, transaction2);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            if (policy.customUnits) {
                (0, DistanceRate_1.deletePolicyDistanceRates)(policy.id, policy.customUnits[customUnitID], [customUnitRateID1], [transaction1.transactionID], undefined);
            }
            await (0, waitForBatchedUpdates_1.default)();
            const transactionViolations = await new Promise((resolve) => {
                react_native_onyx_1.default.connect({
                    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
                    callback: resolve,
                    waitForCollectionCallback: true,
                });
            });
            expect(transactionViolations).toEqual({
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction1.transactionID}`]: [
                    { name: CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY, showInReview: true, type: CONST_1.default.VIOLATION_TYPES.VIOLATION },
                ],
            });
        });
    });
    describe('enablePolicyDistanceRates', () => {
        it('should disable all rates except the default rate when the we disable the feature', async () => {
            const customUnitID = '5A55C2B68DDCB';
            const customUnitRateID1 = '7255CA72C7E7B';
            const customUnitRateID2 = '7255CA72C7E72';
            const policy = {
                ...(0, policies_1.default)(3),
                ...{
                    areDistanceRatesEnabled: true,
                    customUnits: {
                        [customUnitID]: {
                            attributes: {
                                unit: CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES,
                            },
                            customUnitID,
                            defaultCategory: 'Car',
                            enabled: true,
                            name: 'Distance',
                            rates: {
                                [customUnitRateID1]: {
                                    currency: 'ETB',
                                    customUnitRateID: customUnitRateID1,
                                    enabled: true,
                                    name: 'Default Rate',
                                    rate: 70,
                                    subRates: [],
                                },
                                [customUnitRateID2]: {
                                    currency: 'ETB',
                                    customUnitRateID: customUnitRateID2,
                                    enabled: true,
                                    name: 'Default Rate',
                                    rate: 71,
                                    subRates: [],
                                },
                            },
                        },
                    },
                },
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
            if (policy.customUnits) {
                (0, DistanceRate_1.enablePolicyDistanceRates)(policy.id, false, policy.customUnits[customUnitID]);
            }
            await (0, waitForBatchedUpdates_1.default)();
            const onyxPolicy = await new Promise((resolve) => {
                react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                    // eslint-disable-next-line rulesdir/prefer-early-return
                    callback: (value) => {
                        if (value !== undefined) {
                            resolve(value);
                        }
                    },
                });
            });
            if (!policy || !policy.customUnits) {
                return;
            }
            expect(onyxPolicy).toEqual({
                ...policy,
                areDistanceRatesEnabled: false,
                pendingFields: {
                    areDistanceRatesEnabled: 'update',
                },
                customUnits: {
                    [customUnitID]: {
                        ...policy.customUnits[customUnitID],
                        rates: {
                            [customUnitRateID1]: {
                                ...policy.customUnits[customUnitID].rates[customUnitRateID1],
                                enabled: true,
                            },
                            [customUnitRateID2]: {
                                ...policy.customUnits[customUnitID].rates[customUnitRateID2],
                                enabled: false,
                            },
                        },
                    },
                },
            });
        });
    });
});
