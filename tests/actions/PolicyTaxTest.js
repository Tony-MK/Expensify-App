"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const TaxRate_1 = require("@libs/actions/TaxRate");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const Policy = require("@src/libs/actions/Policy/Policy");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
(0, OnyxUpdateManager_1.default)();
describe('actions/PolicyTax', () => {
    const fakePolicy = {
        ...(0, policies_1.default)(0),
        taxRates: CONST_1.default.DEFAULT_TAX,
        customUnits: {
            [CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE]: {
                name: CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE,
                customUnitID: 'id_CUSTOM_UNIT_1',
                enabled: true,
                rates: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    id_CUSTOM_UNIT_1: {
                        name: 'Distance',
                        customUnitRateID: 'id_CUSTOM_UNIT_1',
                        enabled: true,
                        currency: 'USD',
                        rate: 67,
                    },
                },
            },
        },
    };
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    let mockFetch;
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear()
            .then(() => react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy))
            .then(waitForBatchedUpdates_1.default);
    });
    describe('SetPolicyCustomTaxName', () => {
        it('Set policy`s custom tax name', () => {
            const customTaxName = 'Custom tag name';
            mockFetch?.pause?.();
            Policy.setPolicyCustomTaxName(fakePolicy.id, customTaxName);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.name).toBe(customTaxName);
                        expect(policy?.taxRates?.pendingFields?.name).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.pendingFields?.name).toBeFalsy();
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Reset policy`s custom tax name when API returns an error', () => {
            const customTaxName = 'Custom tag name';
            const originalCustomTaxName = fakePolicy?.taxRates?.name;
            mockFetch?.pause?.();
            Policy.setPolicyCustomTaxName(fakePolicy.id, customTaxName);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.name).toBe(customTaxName);
                        expect(policy?.taxRates?.pendingFields?.name).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.name).toBe(originalCustomTaxName);
                        expect(policy?.taxRates?.pendingFields?.name).toBeFalsy();
                        expect(policy?.taxRates?.errorFields?.name).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('SetPolicyCurrencyDefaultTax', () => {
        it('Set policy`s currency default tax', () => {
            const taxCode = 'id_TAX_RATE_1';
            mockFetch?.pause?.();
            Policy.setWorkspaceCurrencyDefault(fakePolicy.id, taxCode);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.defaultExternalID).toBe(taxCode);
                        expect(policy?.taxRates?.pendingFields?.defaultExternalID).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.pendingFields?.defaultExternalID).toBeFalsy();
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Reset policy`s currency default tax when API returns an error', () => {
            const taxCode = 'id_TAX_RATE_1';
            const originalDefaultExternalID = fakePolicy?.taxRates?.defaultExternalID;
            mockFetch?.pause?.();
            Policy.setWorkspaceCurrencyDefault(fakePolicy.id, taxCode);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.defaultExternalID).toBe(taxCode);
                        expect(policy?.taxRates?.pendingFields?.defaultExternalID).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.defaultExternalID).toBe(originalDefaultExternalID);
                        expect(policy?.taxRates?.pendingFields?.defaultExternalID).toBeFalsy();
                        expect(policy?.taxRates?.errorFields?.defaultExternalID).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('SetPolicyForeignCurrencyDefaultTax', () => {
        it('Set policy`s foreign currency default', () => {
            const taxCode = 'id_TAX_RATE_1';
            mockFetch?.pause?.();
            Policy.setForeignCurrencyDefault(fakePolicy.id, taxCode);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.foreignTaxDefault).toBe(taxCode);
                        expect(policy?.taxRates?.pendingFields?.foreignTaxDefault).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // Check if the policy pendingFields was cleared
                        expect(policy?.taxRates?.pendingFields?.foreignTaxDefault).toBeFalsy();
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Reset policy`s foreign currency default when API returns an error', () => {
            const taxCode = 'id_TAX_RATE_1';
            const originalDefaultForeignCurrencyID = fakePolicy?.taxRates?.foreignTaxDefault;
            mockFetch?.pause?.();
            Policy.setForeignCurrencyDefault(fakePolicy.id, taxCode);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.taxRates?.foreignTaxDefault).toBe(taxCode);
                        expect(policy?.taxRates?.pendingFields?.foreignTaxDefault).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policy?.taxRates?.errorFields).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        // Check if the policy pendingFields was cleared
                        expect(policy?.taxRates?.foreignTaxDefault).toBe(originalDefaultForeignCurrencyID);
                        expect(policy?.taxRates?.pendingFields?.foreignTaxDefault).toBeFalsy();
                        expect(policy?.taxRates?.errorFields?.foreignTaxDefault).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('CreatePolicyTax', () => {
        it('Create a new tax', () => {
            const newTaxRate = {
                name: 'Tax rate 2',
                value: '2%',
                code: 'id_TAX_RATE_2',
            };
            mockFetch?.pause?.();
            (0, TaxRate_1.createPolicyTax)(fakePolicy.id, newTaxRate);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const createdTax = policy?.taxRates?.taxes?.[newTaxRate.code ?? ''];
                        expect(createdTax?.code).toBe(newTaxRate.code);
                        expect(createdTax?.name).toBe(newTaxRate.name);
                        expect(createdTax?.value).toBe(newTaxRate.value);
                        expect(createdTax?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const createdTax = policy?.taxRates?.taxes?.[newTaxRate.code ?? ''];
                        expect(createdTax?.errors).toBeFalsy();
                        expect(createdTax?.pendingFields).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Remove the optimistic tax if the API returns an error', () => {
            const newTaxRate = {
                name: 'Tax rate 2',
                value: '2%',
                code: 'id_TAX_RATE_2',
            };
            mockFetch?.pause?.();
            (0, TaxRate_1.createPolicyTax)(fakePolicy.id, newTaxRate);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const createdTax = policy?.taxRates?.taxes?.[newTaxRate.code ?? ''];
                        expect(createdTax?.code).toBe(newTaxRate.code);
                        expect(createdTax?.name).toBe(newTaxRate.name);
                        expect(createdTax?.value).toBe(newTaxRate.value);
                        expect(createdTax?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const createdTax = policy?.taxRates?.taxes?.[newTaxRate.code ?? ''];
                        expect(createdTax?.errors).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('SetPolicyTaxesEnabled', () => {
        it('Disable policy`s taxes', () => {
            const disableTaxID = 'id_TAX_RATE_1';
            mockFetch?.pause?.();
            (0, TaxRate_1.setPolicyTaxesEnabled)(fakePolicy, [disableTaxID], false);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const disabledTax = policy?.taxRates?.taxes?.[disableTaxID];
                        expect(disabledTax?.isDisabled).toBeTruthy();
                        expect(disabledTax?.pendingFields?.isDisabled).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(disabledTax?.errorFields?.isDisabled).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const disabledTax = policy?.taxRates?.taxes?.[disableTaxID];
                        expect(disabledTax?.errorFields?.isDisabled).toBeFalsy();
                        expect(disabledTax?.pendingFields?.isDisabled).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Disable policy`s taxes but API returns an error, then enable policy`s taxes again', () => {
            const disableTaxID = 'id_TAX_RATE_1';
            mockFetch?.pause?.();
            (0, TaxRate_1.setPolicyTaxesEnabled)(fakePolicy, [disableTaxID], false);
            const originalTaxes = { ...fakePolicy?.taxRates?.taxes };
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const disabledTax = policy?.taxRates?.taxes?.[disableTaxID];
                        expect(disabledTax?.isDisabled).toBeTruthy();
                        expect(disabledTax?.pendingFields?.isDisabled).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(disabledTax?.errorFields?.isDisabled).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const disabledTax = policy?.taxRates?.taxes?.[disableTaxID];
                        expect(disabledTax?.isDisabled).toBe(!!originalTaxes[disableTaxID].isDisabled);
                        expect(disabledTax?.errorFields?.isDisabled).toBeTruthy();
                        expect(disabledTax?.pendingFields?.isDisabled).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('RenamePolicyTax', () => {
        it('Rename tax', () => {
            const taxID = 'id_TAX_RATE_1';
            const newTaxName = 'Tax rate 1 updated';
            mockFetch?.pause?.();
            // @ts-expect-error - we can send undefined tax rate here for testing
            (0, TaxRate_1.renamePolicyTax)(fakePolicy.id, taxID, newTaxName, fakePolicy?.taxRates?.taxes[taxID]);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedTax = policy?.taxRates?.taxes?.[taxID];
                        expect(updatedTax?.name).toBe(newTaxName);
                        expect(updatedTax?.pendingFields?.name).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(updatedTax?.errorFields?.name).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedTax = policy?.taxRates?.taxes?.[taxID];
                        expect(updatedTax?.errorFields?.name).toBeFalsy();
                        expect(updatedTax?.pendingFields?.name).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Rename tax but API returns an error, then recover the original tax`s name', () => {
            const taxID = 'id_TAX_RATE_1';
            const newTaxName = 'Tax rate 1 updated';
            const originalTaxRate = { ...fakePolicy?.taxRates?.taxes[taxID] };
            mockFetch?.pause?.();
            // @ts-expect-error - we can send undefined tax rate here for testing
            (0, TaxRate_1.renamePolicyTax)(fakePolicy.id, taxID, newTaxName, fakePolicy?.taxRates?.taxes[taxID]);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedTax = policy?.taxRates?.taxes?.[taxID];
                        expect(updatedTax?.name).toBe(newTaxName);
                        expect(updatedTax?.pendingFields?.name).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(updatedTax?.errorFields?.name).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedTax = policy?.taxRates?.taxes?.[taxID];
                        expect(updatedTax?.name).toBe(originalTaxRate.name);
                        expect(updatedTax?.errorFields?.name).toBeTruthy();
                        expect(updatedTax?.pendingFields?.name).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('UpdatePolicyTaxValue', () => {
        it('Update tax`s value', () => {
            const taxID = 'id_TAX_RATE_1';
            const newTaxValue = 10;
            const stringTaxValue = `${newTaxValue}%`;
            mockFetch?.pause?.();
            // @ts-expect-error - we can send undefined tax rate here for testing
            (0, TaxRate_1.updatePolicyTaxValue)(fakePolicy.id, taxID, newTaxValue, fakePolicy?.taxRates?.taxes[taxID]);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedTax = policy?.taxRates?.taxes?.[taxID];
                        expect(updatedTax?.value).toBe(stringTaxValue);
                        expect(updatedTax?.pendingFields?.value).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(updatedTax?.errorFields?.value).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedTax = policy?.taxRates?.taxes?.[taxID];
                        expect(updatedTax?.errorFields?.value).toBeFalsy();
                        expect(updatedTax?.pendingFields?.value).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Update tax`s value but API returns an error, then recover the original tax`s value', () => {
            const taxID = 'id_TAX_RATE_1';
            const newTaxValue = 10;
            const originalTaxRate = { ...fakePolicy?.taxRates?.taxes[taxID] };
            const stringTaxValue = `${newTaxValue}%`;
            mockFetch?.pause?.();
            // @ts-expect-error - we can send undefined tax rate here for testing
            (0, TaxRate_1.updatePolicyTaxValue)(fakePolicy.id, taxID, newTaxValue, fakePolicy?.taxRates?.taxes[taxID]);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedTax = policy?.taxRates?.taxes?.[taxID];
                        expect(updatedTax?.value).toBe(stringTaxValue);
                        expect(updatedTax?.pendingFields?.value).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(updatedTax?.errorFields?.value).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const updatedTax = policy?.taxRates?.taxes?.[taxID];
                        expect(updatedTax?.value).toBe(originalTaxRate.value);
                        expect(updatedTax?.errorFields?.value).toBeTruthy();
                        expect(updatedTax?.pendingFields?.value).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('DeletePolicyTaxes', () => {
        it('Delete tax that is not foreignTaxDefault', () => {
            const foreignTaxDefault = fakePolicy?.taxRates?.foreignTaxDefault;
            const taxID = 'id_TAX_RATE_1';
            mockFetch?.pause?.();
            (0, TaxRate_1.deletePolicyTaxes)(fakePolicy, [taxID], TestHelper.localeCompare);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const taxRates = policy?.taxRates;
                        const deletedTax = taxRates?.taxes?.[taxID];
                        expect(taxRates?.pendingFields?.foreignTaxDefault).toBeFalsy();
                        expect(taxRates?.foreignTaxDefault).toBe(foreignTaxDefault);
                        expect(deletedTax?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
                        expect(deletedTax?.errors).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const taxRates = policy?.taxRates;
                        const deletedTax = taxRates?.taxes?.[taxID];
                        expect(taxRates?.pendingFields?.foreignTaxDefault).toBeFalsy();
                        expect(deletedTax).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Delete tax that is foreignTaxDefault', () => {
            const taxID = 'id_TAX_RATE_1';
            const firstTaxID = 'id_TAX_EXEMPT';
            const fakePolicyWithForeignTaxDefault = {
                ...fakePolicy,
                taxRates: {
                    ...CONST_1.default.DEFAULT_TAX,
                    foreignTaxDefault: 'id_TAX_RATE_1',
                },
            };
            mockFetch?.pause?.();
            (0, TaxRate_1.deletePolicyTaxes)(fakePolicyWithForeignTaxDefault, [taxID], TestHelper.localeCompare);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicyWithForeignTaxDefault.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const taxRates = policy?.taxRates;
                        const deletedTax = taxRates?.taxes?.[taxID];
                        expect(taxRates?.pendingFields?.foreignTaxDefault).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(taxRates?.foreignTaxDefault).toBe(firstTaxID);
                        expect(deletedTax?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
                        expect(deletedTax?.errors).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(mockFetch?.resume)
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicyWithForeignTaxDefault.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const taxRates = policy?.taxRates;
                        const deletedTax = taxRates?.taxes?.[taxID];
                        expect(taxRates?.pendingFields?.foreignTaxDefault).toBeFalsy();
                        expect(deletedTax).toBeFalsy();
                        resolve();
                    },
                });
            }));
        });
        it('Delete tax that is not foreignTaxDefault but API return an error, then recover the deleted tax', () => {
            const foreignTaxDefault = fakePolicy?.taxRates?.foreignTaxDefault;
            const taxID = 'id_TAX_RATE_1';
            mockFetch?.pause?.();
            (0, TaxRate_1.deletePolicyTaxes)(fakePolicy, [taxID], TestHelper.localeCompare);
            return (0, waitForBatchedUpdates_1.default)()
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const taxRates = policy?.taxRates;
                        const deletedTax = taxRates?.taxes?.[taxID];
                        expect(taxRates?.pendingFields?.foreignTaxDefault).toBeFalsy();
                        expect(taxRates?.foreignTaxDefault).toBe(foreignTaxDefault);
                        expect(deletedTax?.pendingAction).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
                        expect(deletedTax?.errors).toBeFalsy();
                        resolve();
                    },
                });
            }))
                .then(() => {
                mockFetch?.fail?.();
                return mockFetch?.resume?.();
            })
                .then(waitForBatchedUpdates_1.default)
                .then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const taxRates = policy?.taxRates;
                        const deletedTax = taxRates?.taxes?.[taxID];
                        expect(taxRates?.pendingFields?.foreignTaxDefault).toBeFalsy();
                        expect(deletedTax?.pendingAction).toBeFalsy();
                        expect(deletedTax?.errors).toBeTruthy();
                        resolve();
                    },
                });
            }));
        });
    });
    describe('SetPolicyTaxCode', () => {
        const oldTaxCode = 'id_TAX_RATE_1';
        const newTaxCode = 'id_TAX_RATE_2';
        const oldTaxRateName = fakePolicy?.taxRates?.taxes[oldTaxCode]?.name;
        it('Set policy`s tax code', () => {
            mockFetch?.pause?.();
            const distanceRateCustomUnit = fakePolicy?.customUnits?.[CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE];
            (0, TaxRate_1.setPolicyTaxCode)(fakePolicy.id, oldTaxCode, newTaxCode, 
            // @ts-expect-error - we can send undefined tax rate here for testing
            fakePolicy?.taxRates?.taxes[oldTaxCode], fakePolicy?.taxRates?.foreignTaxDefault, fakePolicy?.taxRates?.defaultExternalID, distanceRateCustomUnit);
            return (0, waitForBatchedUpdates_1.default)().then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        const taxRates = policy?.taxRates;
                        const updatedTaxRate = taxRates?.taxes?.[newTaxCode];
                        // We expected to have a new tax rate with the new tax code
                        expect(updatedTaxRate).toBeDefined();
                        expect(updatedTaxRate?.previousTaxCode).toBe(oldTaxCode);
                        expect(updatedTaxRate?.name).toBe(oldTaxRateName);
                        resolve();
                    },
                });
            }));
        });
    });
});
