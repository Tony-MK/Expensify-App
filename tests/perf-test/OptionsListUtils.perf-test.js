"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const falso_1 = require("@ngneat/falso");
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const OptionsListUtils_2 = require("../../src/libs/OptionsListUtils");
const createCollection_1 = require("../utils/collections/createCollection");
const optionData_1 = require("../utils/collections/optionData");
const personalDetails_1 = require("../utils/collections/personalDetails");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const REPORTS_COUNT = 5000;
const PERSONAL_DETAILS_LIST_COUNT = 1000;
const SEARCH_VALUE = 'TestingValue';
const COUNTRY_CODE = 1;
const PERSONAL_DETAILS_COUNT = 1000;
const SELECTED_OPTIONS_COUNT = 1000;
const RECENT_REPORTS_COUNT = 100;
const reports = (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, (index) => ({
    ...(0, reports_1.createRandomReport)(index),
    type: (0, falso_1.rand)(Object.values(CONST_1.default.REPORT.TYPE)),
    lastVisibleActionCreated: (0, reportActions_1.getRandomDate)(),
}), REPORTS_COUNT);
const personalDetails = (0, createCollection_1.default)((item) => item.accountID, (index) => (0, personalDetails_1.default)(index), PERSONAL_DETAILS_LIST_COUNT);
const getMockedReports = (length = 500) => (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, (index) => ({
    ...(0, reports_1.createRandomReport)(index),
    type: (0, falso_1.rand)(Object.values(CONST_1.default.REPORT.TYPE)),
    lastVisibleActionCreated: (0, reportActions_1.getRandomDate)(),
}), length);
const getMockedPersonalDetails = (length = 500) => (0, createCollection_1.default)((item) => item.accountID, (index) => (0, personalDetails_1.default)(index), length);
const mockedReportsMap = getMockedReports(REPORTS_COUNT);
const mockedPersonalDetailsMap = getMockedPersonalDetails(PERSONAL_DETAILS_LIST_COUNT);
const mockedBetas = Object.values(CONST_1.default.BETAS);
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        createNavigationContainerRef: () => ({
            getState: () => jest.fn(),
        }),
    };
});
const options = (0, OptionsListUtils_1.createOptionList)(personalDetails, reports);
const ValidOptionsConfig = {
    betas: mockedBetas,
    includeRecentReports: true,
    includeTasks: true,
    includeThreads: true,
    includeMoneyRequests: true,
    includeMultipleParticipantReports: true,
    includeSelfDM: true,
    includeOwnedWorkspaceChats: true,
};
/* GetOption is the private function and is never called directly, we are testing the functions which call getOption with different params */
describe('OptionsListUtils', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        react_native_onyx_1.default.multiSet({
            ...mockedReportsMap,
            ...mockedPersonalDetailsMap,
        });
    });
    afterAll(() => {
        react_native_onyx_1.default.clear();
    });
    /* Testing getSearchOptions */
    test('[OptionsListUtils] getSearchOptions', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, OptionsListUtils_1.getSearchOptions)(options, mockedBetas));
    });
    /* Testing getShareLogOptions */
    test('[OptionsListUtils] getShareLogOptions', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, OptionsListUtils_1.getShareLogOptions)(options, mockedBetas));
    });
    /* Testing getFilteredOptions */
    test('[OptionsListUtils] getFilteredOptions with search value', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        const formattedOptions = (0, OptionsListUtils_1.getValidOptions)({ reports: options.reports, personalDetails: options.personalDetails }, ValidOptionsConfig);
        await (0, reassure_1.measureFunction)(() => {
            (0, OptionsListUtils_1.filterAndOrderOptions)(formattedOptions, SEARCH_VALUE, COUNTRY_CODE);
        });
    });
    test('[OptionsListUtils] getFilteredOptions with empty search value', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        const formattedOptions = (0, OptionsListUtils_1.getValidOptions)({ reports: options.reports, personalDetails: options.personalDetails }, ValidOptionsConfig);
        await (0, reassure_1.measureFunction)(() => {
            (0, OptionsListUtils_1.filterAndOrderOptions)(formattedOptions, '', COUNTRY_CODE);
        });
    });
    /* Testing getShareDestinationOptions */
    test('[OptionsListUtils] getShareDestinationOptions', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, OptionsListUtils_1.getShareDestinationOptions)(options.reports, options.personalDetails, mockedBetas));
    });
    /* Testing getMemberInviteOptions */
    test('[OptionsListUtils] getMemberInviteOptions', async () => {
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, OptionsListUtils_1.getMemberInviteOptions)(options.personalDetails, mockedBetas));
    });
    test('[OptionsListUtils] worst case scenario with a search term that matches a subset of selectedOptions, filteredRecentReports, and filteredPersonalDetails', async () => {
        const SELECTED_OPTION_TEXT = 'Selected Option';
        const RECENT_REPORT_TEXT = 'Recent Report';
        const PERSONAL_DETAIL_TEXT = 'Personal Detail';
        const SELECTED_OPTIONS_MATCH_FREQUENCY = 2;
        const RECENT_REPORTS_MATCH_FREQUENCY = 3;
        const PERSONAL_DETAILS_MATCH_FREQUENCY = 5;
        const selectedOptions = (0, createCollection_1.default)((item) => item.reportID, (index) => ({
            ...(0, optionData_1.default)(index),
            searchText: index % SELECTED_OPTIONS_MATCH_FREQUENCY === 0 ? SEARCH_VALUE : `${SELECTED_OPTION_TEXT} ${index}`,
        }), SELECTED_OPTIONS_COUNT);
        const filteredRecentReports = (0, createCollection_1.default)((item) => item.reportID, (index) => ({
            ...(0, optionData_1.default)(index + SELECTED_OPTIONS_COUNT),
            searchText: index % RECENT_REPORTS_MATCH_FREQUENCY === 0 ? SEARCH_VALUE : `${RECENT_REPORT_TEXT} ${index}`,
        }), RECENT_REPORTS_COUNT);
        const filteredPersonalDetails = (0, createCollection_1.default)((item) => item.reportID, (index) => ({
            ...(0, optionData_1.default)(index + SELECTED_OPTIONS_COUNT + RECENT_REPORTS_COUNT),
            searchText: index % PERSONAL_DETAILS_MATCH_FREQUENCY === 0 ? SEARCH_VALUE : `${PERSONAL_DETAIL_TEXT} ${index}`,
        }), PERSONAL_DETAILS_COUNT);
        const mockedPersonalDetails = getMockedPersonalDetails(PERSONAL_DETAILS_COUNT);
        await (0, reassure_1.measureFunction)(() => (0, OptionsListUtils_2.formatSectionsFromSearchTerm)(SEARCH_VALUE, Object.values(selectedOptions), Object.values(filteredRecentReports), Object.values(filteredPersonalDetails), mockedPersonalDetails, true));
    });
    test('[OptionsListUtils] empty search term with selected options and mocked personal details', async () => {
        const selectedOptions = (0, createCollection_1.default)((item) => item.reportID, optionData_1.default, SELECTED_OPTIONS_COUNT);
        const mockedPersonalDetails = getMockedPersonalDetails(PERSONAL_DETAILS_COUNT);
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureFunction)(() => (0, OptionsListUtils_2.formatSectionsFromSearchTerm)('', Object.values(selectedOptions), [], [], mockedPersonalDetails, true));
    });
});
