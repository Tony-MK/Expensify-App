"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PolicyDistanceRatesUtils_1 = require("@libs/PolicyDistanceRatesUtils");
describe('PolicyDistanceRatesUtils', () => {
    describe('validateTaxClaimableValue', () => {
        it('should return an error when taxClaimableValue is equal to tax rate', () => {
            // Given a tax claimable value inserted for a distance rate
            // When the taxClaimableValue is equal to the tax rate
            const validate = (0, PolicyDistanceRatesUtils_1.validateTaxClaimableValue)({ taxClaimableValue: '0.70' }, { rate: 70, customUnitRateID: '' });
            // Then validateTaxClaimableValue will return an error.
            expect(validate.taxClaimableValue).toBeDefined();
            // When the taxClaimableValue is greater than the tax rate
            const validate2 = (0, PolicyDistanceRatesUtils_1.validateTaxClaimableValue)({ taxClaimableValue: '0.72' }, { rate: 70, customUnitRateID: '' });
            // Then validateTaxClaimableValue will return an error.
            expect(validate2.taxClaimableValue).toBeDefined();
            // When the taxClaimableValue is less than the tax rate
            const validate3 = (0, PolicyDistanceRatesUtils_1.validateTaxClaimableValue)({ taxClaimableValue: '0.65' }, { rate: 70, customUnitRateID: '' });
            // Then validateTaxClaimableValue will not return an error.
            expect(validate3.taxClaimableValue).toBeUndefined();
        });
    });
});
