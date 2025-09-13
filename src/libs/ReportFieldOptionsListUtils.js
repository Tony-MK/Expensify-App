"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportFieldOptionsSection = getReportFieldOptionsSection;
exports.getReportFieldOptions = getReportFieldOptions;
const Localize_1 = require("./Localize");
const tokenizedSearch_1 = require("./tokenizedSearch");
/**
 * Transforms the provided report field options into option objects.
 *
 * @param reportFieldOptions - an initial report field options array
 */
function getReportFieldOptions(reportFieldOptions) {
    return reportFieldOptions.map((name) => ({
        text: name,
        keyForList: name,
        searchText: name,
        tooltipText: name,
        isDisabled: false,
    }));
}
/**
 * Build the section list for report field options
 */
function getReportFieldOptionsSection({ options, recentlyUsedOptions, selectedOptions, searchValue, }) {
    const reportFieldOptionsSections = [];
    const selectedOptionKeys = selectedOptions.map(({ text, keyForList, name }) => text ?? keyForList ?? name ?? '').filter((o) => !!o);
    let indexOffset = 0;
    if (searchValue) {
        const searchOptions = (0, tokenizedSearch_1.default)(options, searchValue, (option) => [option]);
        reportFieldOptionsSections.push({
            // "Search" section
            title: '',
            shouldShow: true,
            indexOffset,
            data: getReportFieldOptions(searchOptions),
        });
        return reportFieldOptionsSections;
    }
    const filteredRecentlyUsedOptions = recentlyUsedOptions.filter((recentlyUsedOption) => !selectedOptionKeys.includes(recentlyUsedOption));
    const filteredOptions = options.filter((option) => !selectedOptionKeys.includes(option));
    if (selectedOptionKeys.length) {
        reportFieldOptionsSections.push({
            // "Selected" section
            title: '',
            shouldShow: true,
            indexOffset,
            data: getReportFieldOptions(selectedOptionKeys),
        });
        indexOffset += selectedOptionKeys.length;
    }
    if (filteredRecentlyUsedOptions.length > 0) {
        reportFieldOptionsSections.push({
            // "Recent" section
            title: (0, Localize_1.translateLocal)('common.recent'),
            shouldShow: true,
            indexOffset,
            data: getReportFieldOptions(filteredRecentlyUsedOptions),
        });
        indexOffset += filteredRecentlyUsedOptions.length;
    }
    reportFieldOptionsSections.push({
        // "All" section when items amount more than the threshold
        title: (0, Localize_1.translateLocal)('common.all'),
        shouldShow: true,
        indexOffset,
        data: getReportFieldOptions(filteredOptions),
    });
    return reportFieldOptionsSections;
}
