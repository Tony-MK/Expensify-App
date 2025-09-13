"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomUnitID = getCustomUnitID;
exports.getDestinationListSections = getDestinationListSections;
exports.getDestinationForDisplay = getDestinationForDisplay;
exports.getSubratesFields = getSubratesFields;
exports.getSubratesForDisplay = getSubratesForDisplay;
exports.getTimeForDisplay = getTimeForDisplay;
exports.getTimeDifferenceIntervals = getTimeDifferenceIntervals;
const date_fns_1 = require("date-fns");
const sortBy_1 = require("lodash/sortBy");
const CONST_1 = require("@src/CONST");
const Localize_1 = require("./Localize");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportUtils_1 = require("./ReportUtils");
const tokenizedSearch_1 = require("./tokenizedSearch");
/**
 * Returns custom unit ID for the per diem transaction
 */
function getCustomUnitID(report, parentReport) {
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = (0, PolicyUtils_1.getPolicy)(report?.policyID ?? parentReport?.policyID);
    let customUnitID = CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID;
    let category;
    if ((0, ReportUtils_1.isPolicyExpenseChat)(report) || (0, ReportUtils_1.isPolicyExpenseChat)(parentReport)) {
        const perDiemUnit = Object.values(policy?.customUnits ?? {}).find((unit) => unit.name === CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL);
        if (perDiemUnit) {
            customUnitID = perDiemUnit.customUnitID;
            category = perDiemUnit.defaultCategory;
        }
    }
    return { customUnitID, category };
}
/**
 * Builds the options for the category tree hierarchy via indents
 *
 * @param options - an initial object array
 * @param options[].enabled - a flag to enable/disable option in a list
 * @param options[].name - a name of an option
 * @param options[].rateID - a rateID of an option
 */
function getDestinationOptionTree(options) {
    const optionCollection = new Map();
    Object.values(options).forEach((option) => {
        if (optionCollection.has(option.rateID)) {
            return;
        }
        optionCollection.set(option.rateID, {
            text: option.name,
            keyForList: option.rateID,
            searchText: option.name,
            tooltipText: option.name,
            isDisabled: false,
            isSelected: !!option.isSelected,
            currency: option.currency,
        });
    });
    return Array.from(optionCollection.values());
}
/**
 * Builds the section list for destinations
 */
function getDestinationListSections({ destinations, searchValue, selectedOptions = [], recentlyUsedDestinations = [], maxRecentReportsToShow = CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW, }) {
    const sortedDestinations = (0, sortBy_1.default)(destinations, 'name').map((rate) => ({
        name: rate.name ?? '',
        rateID: rate.customUnitRateID,
        currency: rate.currency ?? CONST_1.default.CURRENCY.USD,
    }));
    const destinationSections = [];
    if (searchValue) {
        const searchDestinations = (0, tokenizedSearch_1.default)(sortedDestinations, searchValue, (destination) => [destination.name]).map((destination) => ({
            ...destination,
            isSelected: selectedOptions.some((selectedOption) => selectedOption.rateID === destination.rateID),
        }));
        const data = getDestinationOptionTree(searchDestinations);
        destinationSections.push({
            // "Search" section
            title: '',
            shouldShow: true,
            data,
            indexOffset: data.length,
        });
        return destinationSections;
    }
    if (selectedOptions.length > 0) {
        const data = getDestinationOptionTree(selectedOptions);
        destinationSections.push({
            // "Selected" section
            title: '',
            shouldShow: false,
            data,
            indexOffset: data.length,
        });
    }
    const selectedOptionRateIDs = selectedOptions.map((selectedOption) => selectedOption.rateID);
    if (sortedDestinations.length < CONST_1.default.STANDARD_LIST_ITEM_LIMIT) {
        const filteredNonSelectedDestinations = sortedDestinations.filter(({ rateID }) => !selectedOptionRateIDs.includes(rateID));
        if (filteredNonSelectedDestinations.length === 0) {
            return destinationSections;
        }
        const data = getDestinationOptionTree(filteredNonSelectedDestinations);
        destinationSections.push({
            // "All" section when items amount less than the threshold
            title: '',
            shouldShow: false,
            data,
            indexOffset: data.length,
        });
        return destinationSections;
    }
    const filteredRecentlyUsedDestinations = sortedDestinations.filter(({ rateID }) => recentlyUsedDestinations.includes(rateID) && !selectedOptionRateIDs.includes(rateID));
    if (filteredRecentlyUsedDestinations.length > 0) {
        const cutRecentlyUsedDestinations = filteredRecentlyUsedDestinations.slice(0, maxRecentReportsToShow);
        const data = getDestinationOptionTree(cutRecentlyUsedDestinations);
        destinationSections.push({
            // "Recent" section
            title: (0, Localize_1.translateLocal)('common.recent'),
            shouldShow: true,
            data,
            indexOffset: data.length,
        });
    }
    const data = getDestinationOptionTree(sortedDestinations);
    destinationSections.push({
        // "All" section when items amount more than the threshold
        title: (0, Localize_1.translateLocal)('common.all'),
        shouldShow: true,
        data,
        indexOffset: data.length,
    });
    return destinationSections;
}
function getDestinationForDisplay(customUnit, transaction) {
    const customUnitRateID = transaction?.comment?.customUnit?.customUnitRateID;
    if (!customUnitRateID) {
        return '';
    }
    const selectedDestination = customUnit?.rates?.[customUnitRateID];
    return selectedDestination?.name ?? '';
}
function getSubratesFields(customUnit, transaction) {
    const customUnitRateID = transaction?.comment?.customUnit?.customUnitRateID;
    if (!customUnitRateID) {
        return [];
    }
    const selectedDestination = customUnit?.rates?.[customUnitRateID];
    const countSubrates = selectedDestination?.subRates?.length ?? 0;
    const currentSubrates = transaction?.comment?.customUnit?.subRates ?? [];
    if (currentSubrates.length === countSubrates) {
        return currentSubrates;
    }
    return [...currentSubrates, undefined];
}
function getSubratesForDisplay(subrate, qtyText) {
    if (!subrate) {
        return undefined;
    }
    return `${subrate.name}, ${qtyText}: ${subrate.quantity}`;
}
/**
 * param {string} dateTimeString
 * returns {string} example: 2023-05-16 11:10 PM
 */
function formatDateTimeTo12Hour(dateTimeString) {
    if (!dateTimeString) {
        return '';
    }
    const date = new Date(dateTimeString);
    return (0, date_fns_1.format)(date, 'hh:mm a, yyyy-MM-dd');
}
function getTimeForDisplay(transaction) {
    const customUnitRateDate = transaction?.comment?.customUnit?.attributes?.dates ?? { start: '', end: '' };
    return `${formatDateTimeTo12Hour(customUnitRateDate.start)} - ${formatDateTimeTo12Hour(customUnitRateDate.end)}`;
}
function getTimeDifferenceIntervals(transaction) {
    const customUnitRateDate = transaction?.comment?.customUnit?.attributes?.dates ?? { start: '', end: '' };
    const startDate = new Date(customUnitRateDate.start);
    const endDate = new Date(customUnitRateDate.end);
    if ((0, date_fns_1.isSameDay)(startDate, endDate)) {
        const hourDiff = (0, date_fns_1.differenceInMinutes)(endDate, startDate) / 60;
        return {
            firstDay: hourDiff,
            tripDays: 0,
            lastDay: undefined,
        };
    }
    const firstDayDiff = (0, date_fns_1.differenceInMinutes)((0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(startDate, 1)), startDate);
    const tripDaysDiff = (0, date_fns_1.differenceInDays)((0, date_fns_1.startOfDay)(endDate), (0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(startDate, 1)));
    const lastDayDiff = (0, date_fns_1.differenceInMinutes)(endDate, (0, date_fns_1.startOfDay)(endDate));
    return {
        firstDay: firstDayDiff === 1440 ? undefined : firstDayDiff / 60,
        tripDays: firstDayDiff === 1440 ? tripDaysDiff + 1 : tripDaysDiff,
        lastDay: lastDayDiff === 0 ? undefined : lastDayDiff / 60,
    };
}
