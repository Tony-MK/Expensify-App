"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaxRatesSection = getTaxRatesSection;
exports.getTaxRatesOptions = getTaxRatesOptions;
const CONST_1 = require("@src/CONST");
const tokenizedSearch_1 = require("./tokenizedSearch");
const TransactionUtils_1 = require("./TransactionUtils");
/**
 * Sorts tax rates alphabetically by name.
 */
function sortTaxRates(taxRates, localeCompare) {
    const sortedTaxRates = Object.values(taxRates).sort((a, b) => localeCompare(a.name, b.name));
    return sortedTaxRates;
}
/**
 * Builds the options for taxRates
 */
function getTaxRatesOptions(taxRates) {
    return taxRates.map(({ code, modifiedName, isDisabled, isSelected, pendingAction }) => ({
        code,
        text: modifiedName,
        keyForList: modifiedName,
        searchText: modifiedName,
        tooltipText: modifiedName,
        isDisabled: !!isDisabled || pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
        isSelected,
        pendingAction,
    }));
}
/**
 * Builds the section list for tax rates
 */
function getTaxRatesSection({ policy, searchValue, localeCompare, selectedOptions = [], transaction, }) {
    const policyRatesSections = [];
    const taxes = (0, TransactionUtils_1.transformedTaxRates)(policy, transaction);
    const sortedTaxRates = sortTaxRates(taxes, localeCompare);
    const selectedOptionNames = selectedOptions.map((selectedOption) => selectedOption.modifiedName);
    const enabledTaxRates = sortedTaxRates.filter((taxRate) => !taxRate.isDisabled);
    const enabledTaxRatesNames = enabledTaxRates.map((tax) => tax.modifiedName);
    const enabledTaxRatesWithoutSelectedOptions = enabledTaxRates.filter((tax) => tax.modifiedName && !selectedOptionNames.includes(tax.modifiedName));
    const selectedTaxRateWithDisabledState = [];
    const numberOfTaxRates = enabledTaxRates.length;
    selectedOptions.forEach((tax) => {
        if (enabledTaxRatesNames.includes(tax.modifiedName)) {
            selectedTaxRateWithDisabledState.push({ ...tax, isDisabled: false, isSelected: true });
            return;
        }
        selectedTaxRateWithDisabledState.push({ ...tax, isDisabled: true, isSelected: true });
    });
    // If all tax are disabled but there's a previously selected tag, show only the selected tag
    if (numberOfTaxRates === 0 && selectedOptions.length > 0) {
        policyRatesSections.push({
            // "Selected" section
            title: '',
            shouldShow: false,
            data: getTaxRatesOptions(selectedTaxRateWithDisabledState),
        });
        return policyRatesSections;
    }
    if (searchValue) {
        const taxesForSearch = [
            ...(0, tokenizedSearch_1.default)(selectedTaxRateWithDisabledState, searchValue, (taxRate) => [taxRate.modifiedName ?? '']),
            ...(0, tokenizedSearch_1.default)(enabledTaxRatesWithoutSelectedOptions, searchValue, (taxRate) => [taxRate.modifiedName ?? '']),
        ];
        policyRatesSections.push({
            // "Search" section
            title: '',
            shouldShow: true,
            data: getTaxRatesOptions(taxesForSearch),
        });
        return policyRatesSections;
    }
    if (numberOfTaxRates < CONST_1.default.STANDARD_LIST_ITEM_LIMIT) {
        policyRatesSections.push({
            // "All" section when items amount less than the threshold
            title: '',
            shouldShow: false,
            data: getTaxRatesOptions([...selectedTaxRateWithDisabledState, ...enabledTaxRatesWithoutSelectedOptions]),
        });
        return policyRatesSections;
    }
    if (selectedOptions.length > 0) {
        policyRatesSections.push({
            // "Selected" section
            title: '',
            shouldShow: true,
            data: getTaxRatesOptions(selectedTaxRateWithDisabledState),
        });
    }
    policyRatesSections.push({
        // "All" section when number of items are more than the threshold
        title: '',
        shouldShow: true,
        data: getTaxRatesOptions(enabledTaxRatesWithoutSelectedOptions),
    });
    return policyRatesSections;
}
