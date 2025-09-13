"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const wrapInActHelper_1 = require("../utils/wrapInActHelper");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
jest.mock('@libs/Permissions');
jest.mock('../../src/libs/Navigation/Navigation', () => ({
    navigate: jest.fn(),
    isActiveRoute: jest.fn(),
    getTopmostReportId: jest.fn(),
    getActiveRoute: jest.fn(),
    getTopmostReportActionId: jest.fn(),
    isNavigationReady: jest.fn(() => Promise.resolve()),
    isDisplayedInModal: jest.fn(() => false),
}));
jest.mock('../../src/libs/Navigation/navigationRef', () => ({
    getState: () => ({
        routes: [{ name: 'Report' }],
    }),
    getRootState: () => ({
        routes: [],
    }),
    addListener: () => () => { },
}));
jest.mock('@components/Icon/Expensicons');
jest.mock('@react-navigation/native');
jest.mock('@src/hooks/useLHNEstimatedListSize/index.native.ts');
const getMockedReportsMap = (length = 100) => {
    const mockReports = Object.fromEntries(Array.from({ length }, (value, index) => {
        const reportID = index + 1;
        const participants = [1, 2];
        const reportKey = `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`;
        const report = { ...LHNTestUtils.getFakeReport(participants, 1, true), lastMessageText: 'hey' };
        return [reportKey, report];
    }));
    return mockReports;
};
const mockedResponseMap = getMockedReportsMap(500);
describe('SidebarLinks', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
    });
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        // Initialize the network key for OfflineWithFeedback
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
        TestHelper.signInWithTestUser(1, 'email1@test.com', undefined, undefined, 'One').then(waitForBatchedUpdates_1.default);
    });
    afterEach(() => {
        react_native_onyx_1.default.clear();
    });
    test('[SidebarLinks] should render Sidebar with 500 reports stored', async () => {
        const scenario = async () => {
            await (0, react_native_1.waitFor)(async () => {
                // Query for the sidebar
                await react_native_1.screen.findByTestId('lhn-options-list');
            });
        };
        await (0, waitForBatchedUpdates_1.default)();
        react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
            [ONYXKEYS_1.default.BETAS]: [CONST_1.default.BETAS.DEFAULT_ROOMS],
            [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.GSD,
            [ONYXKEYS_1.default.IS_LOADING_REPORT_DATA]: false,
            ...mockedResponseMap,
        });
        await (0, reassure_1.measureRenders)(<LHNTestUtils.MockedSidebarLinks />, { scenario });
    });
    test('[SidebarLinks] should click on list item', async () => {
        const scenario = async () => {
            // Wait for the sidebar container to be rendered first
            await (0, react_native_1.waitFor)(async () => {
                await react_native_1.screen.findByTestId('lhn-options-list');
            });
            // Then wait for the specific list item to be available
            await (0, react_native_1.waitFor)(async () => {
                const button = await react_native_1.screen.findByTestId('1');
                await (0, wrapInActHelper_1.default)(() => {
                    react_native_1.fireEvent.press(button);
                });
            });
        };
        await react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
            [ONYXKEYS_1.default.BETAS]: [CONST_1.default.BETAS.DEFAULT_ROOMS],
            [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.GSD,
            [ONYXKEYS_1.default.IS_LOADING_REPORT_DATA]: false,
            ...mockedResponseMap,
        });
        // Wait for Onyx to process the data
        await (0, waitForBatchedUpdates_1.default)();
        await (0, reassure_1.measureRenders)(<LHNTestUtils.MockedSidebarLinks />, { scenario });
    });
});
