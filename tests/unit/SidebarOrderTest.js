"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const Report_1 = require("@libs/actions/Report");
const DateUtils_1 = require("@libs/DateUtils");
const Localize_1 = require("@libs/Localize");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
// Be sure to include the mocked Permissions and Expensicons libraries or else the beta tests won't work
jest.mock('@libs/Permissions');
jest.mock('@components/Icon/Expensicons');
jest.mock('@src/hooks/useResponsiveLayout');
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigationState: () => true,
    useIsFocused: () => true,
    useRoute: () => ({ name: 'Home' }),
    useNavigation: () => undefined,
    useFocusEffect: () => undefined,
}));
describe('Sidebar', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        (0, OnyxDerived_1.default)();
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(() => {
        // Wrap Onyx each onyx action with waitForBatchedUpdates
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        // Initialize the network key for OfflineWithFeedback
        return TestHelper.signInWithTestUser(1, 'email1@test.com', undefined, undefined, 'One').then(() => react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false }));
    });
    // Clear out Onyx after each test so that each test starts with a clean slate
    afterEach(() => {
        react_native_onyx_1.default.clear();
    });
    describe('in default mode', () => {
        it('is rendered with empty state when no reports are available', () => {
            // Given all the default props are passed to SidebarLinks
            // When it is rendered
            LHNTestUtils.getDefaultRenderedSidebarLinks();
            // Then it should render with the empty state message and not show the reports list
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('common.emptyLHN.title'))).toBeOnTheScreen();
            expect(react_native_1.screen.queryByTestId('lhn-options-list')).not.toBeOnTheScreen();
        });
        it('is rendered with an empty list when personal details exist', () => (0, waitForBatchedUpdates_1.default)()
            // Given the sidebar is rendered with default props
            .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks())
            // When Onyx is updated with some personal details
            .then(() => react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
            [ONYXKEYS_1.default.IS_LOADING_APP]: false,
        }))
            // Then the component should be rendered with an empty list since it will get past the early return
            .then(() => {
            expect(react_native_1.screen.toJSON()).not.toBe(null);
            expect(react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex())).toHaveLength(0);
        }));
        it('contains one report when a report is in Onyx', () => {
            // Given a single report
            const report = LHNTestUtils.getFakeReport([1, 2]);
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks(report.reportID))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // Then the component should be rendered with an item for the report
                .then(() => {
                expect(react_native_1.screen.queryAllByText('Email Two')).toHaveLength(1);
            }));
        });
        it('orders items with most recently updated on top', () => {
            // Given three unread reports in the recently updated order of 3, 2, 1
            const report1 = LHNTestUtils.getFakeReport([1, 2], 3);
            const report2 = LHNTestUtils.getFakeReport([1, 3], 2);
            const report3 = LHNTestUtils.getFakeReport([1, 4], 1);
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks())
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // Then the component should be rendered with the mostly recently updated report first
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Three');
                expect(displayNames.at(2)).toHaveTextContent('Email Two');
            }));
        });
        it('changes the order when adding a draft to the active report', () => {
            // Given three reports in the recently updated order of 3, 2, 1
            // And the first report has a draft
            // And the currently viewed report is the first report
            const report1 = {
                ...LHNTestUtils.getFakeReport([1, 2], 3),
            };
            const report2 = LHNTestUtils.getFakeReport([1, 3], 2);
            const report3 = LHNTestUtils.getFakeReport([1, 4], 1);
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const currentReportId = report1.reportID;
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks(currentReportId))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report1.reportID}`]: 'report1 draft',
                ...reportCollectionDataSet,
            }))
                // Then there should be a pencil icon and report one should be the first one because putting a draft on the active report should change its location
                // in the ordered list
                .then(() => {
                const pencilIcon = react_native_1.screen.queryAllByTestId('Pencil Icon');
                expect(pencilIcon).toHaveLength(1);
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Two'); // this has `hasDraft` flag enabled so it will be on top
                expect(displayNames.at(1)).toHaveTextContent('Email Four');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
            }));
        });
        it('reorders the reports to always have the most recently updated one on top', () => {
            // Given three reports in the recently updated order of 3, 2, 1
            const report1 = LHNTestUtils.getFakeReport([1, 2], 3);
            const report2 = LHNTestUtils.getFakeReport([1, 3], 2);
            const report3 = LHNTestUtils.getFakeReport([1, 4], 1);
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks())
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // When a new comment is added to report 1 (eg. it's lastVisibleActionCreated is updated)
                .then(() => react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`, {
                lastVisibleActionCreated: DateUtils_1.default.getDBTime(),
            }))
                // Then the order of the reports should be 1 > 3 > 2
                //                                         ^--- (1 goes to the front and pushes other two down)
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Two');
                expect(displayNames.at(1)).toHaveTextContent('Email Four');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
            }));
        });
        it('reorders the reports to have a newly created task report on top', () => {
            // Given three reports in the recently updated order of 3, 2, 1
            const report1 = LHNTestUtils.getFakeReport([1, 2], 4);
            const report2 = LHNTestUtils.getFakeReport([1, 3], 3);
            const report3 = LHNTestUtils.getFakeReport([1, 4], 2);
            const taskReportName = 'Buy Grocery';
            const taskReport = {
                ...LHNTestUtils.getFakeReport([1, 2], 1),
                type: CONST_1.default.REPORT.TYPE.TASK,
                reportName: taskReportName,
                managerID: 2,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            };
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport.reportID}`]: taskReport,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks(taskReport.reportID))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // Then the order of the reports should be 4 > 3 > 2 > 1
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(4);
                expect(displayNames.at(0)).toHaveTextContent(taskReportName);
                expect(displayNames.at(1)).toHaveTextContent('Email Four');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
                expect(displayNames.at(3)).toHaveTextContent('Email Two');
            }));
        });
        it('reorders the reports to have a newly created iou report on top', () => {
            // Given three reports in the recently updated order of 3, 2, 1
            const report1 = LHNTestUtils.getFakeReport([1, 2], 4);
            const report2 = LHNTestUtils.getFakeReport([1, 3], 3);
            const report3 = {
                ...LHNTestUtils.getFakeReport([1, 4], 2),
                hasOutstandingChildRequest: true,
                // This has to be added after the IOU report is generated
                iouReportID: undefined,
            };
            const iouReport = {
                ...LHNTestUtils.getFakeReport([1, 4], 1),
                type: CONST_1.default.REPORT.TYPE.IOU,
                ownerAccountID: 1,
                managerID: 4,
                hasOutstandingChildRequest: false,
                total: 10000,
                currency: 'USD',
                chatReportID: report3.reportID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                participants: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    1: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    4: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            };
            report3.iouReportID = iouReport.reportID;
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks(iouReport.reportID))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // Then the order of the reports should be 4 > 3 > 2 > 1
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(4);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Four owes $100.00');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
                expect(displayNames.at(3)).toHaveTextContent('Email Two');
            }));
        });
        it('reorders the reports to have a newly created expense report on top', () => {
            // Given three reports in the recently updated order of 3, 2, 1
            const report1 = LHNTestUtils.getFakeReport([1, 2], 4);
            const report2 = LHNTestUtils.getFakeReport([1, 3], 3);
            const fakeReport = LHNTestUtils.getFakeReportWithPolicy([1, 4], 2);
            const fakePolicy = LHNTestUtils.getFakePolicy(fakeReport.policyID);
            const report3 = {
                ...fakeReport,
                hasOutstandingChildRequest: true,
                // This has to be added after the IOU report is generated
                iouReportID: undefined,
            };
            const expenseReport = {
                ...LHNTestUtils.getFakeReport([1, 4], 1),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                ownerAccountID: 1,
                managerID: 4,
                policyName: fakePolicy.name,
                policyID: fakeReport.policyID,
                reportName: 'Report Name',
                total: -10000,
                currency: 'USD',
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                chatReportID: report3.reportID,
                parentReportID: report3.reportID,
                participants: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    1: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    4: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            };
            report3.iouReportID = expenseReport.reportID;
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseReport.reportID}`]: expenseReport,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks(expenseReport.reportID))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakeReport.policyID}`]: fakePolicy,
                ...reportCollectionDataSet,
            }))
                // Then the order of the reports should be 4 > 3 > 2 > 1
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(4);
                expect(displayNames.at(0)).toHaveTextContent(`Email One's expenses`);
                expect(displayNames.at(1)).toHaveTextContent('Report Name');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
                expect(displayNames.at(3)).toHaveTextContent('Email Two');
            }));
        });
        it('reorders the reports to keep draft reports on top', () => {
            // Given three reports in the recently updated order of 3, 2, 1
            // And the second report has a draft
            // And the currently viewed report is the second report
            const report1 = LHNTestUtils.getFakeReport([1, 2], 3);
            const report2 = {
                ...LHNTestUtils.getFakeReport([1, 3], 2),
            };
            const report3 = LHNTestUtils.getFakeReport([1, 4], 1);
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const currentReportId = report2.reportID;
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks(currentReportId))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                [ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT + report2.reportID]: 'This is a draft',
                ...reportCollectionDataSet,
            }))
                // When the currently active chat is switched to report 1 (the one on the bottom)
                .then(() => {
                // The changing of a route itself will re-render the component in the App, but since we are not performing this test
                // inside the navigator and it has no access to the routes we need to trigger an update to the SidebarLinks manually.
                LHNTestUtils.getDefaultRenderedSidebarLinks(report1.reportID);
                return (0, waitForBatchedUpdates_1.default)();
            })
                // Then the order of the reports should be 2 > 3 > 1
                //                                         ^--- (2 goes to the front and pushes 3 down)
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Three');
                expect(displayNames.at(1)).toHaveTextContent('Email Four');
                expect(displayNames.at(2)).toHaveTextContent('Email Two');
            }));
        });
        it('removes the pencil icon when draft is removed', () => {
            // Given a single report
            // And the report has a draft
            const report = {
                ...LHNTestUtils.getFakeReport([1, 2]),
            };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks())
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report.reportID}`]: 'This is a draft',
                ...reportCollectionDataSet,
            }))
                // Then there should be a pencil icon showing
                .then(() => {
                expect(react_native_1.screen.queryAllByTestId('Pencil Icon')).toHaveLength(1);
            })
                // When the draft is removed
                .then(() => react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report.reportID}`, null))
                // Then the pencil icon goes away
                .then(() => {
                expect(react_native_1.screen.queryAllByTestId('Pencil Icon')).toHaveLength(0);
            }));
        });
        it('removes the pin icon when chat is unpinned', () => {
            // Given a single report
            // And the report is pinned
            const report = {
                ...LHNTestUtils.getFakeReport([1, 2]),
                isPinned: true,
            };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks())
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // Then there should be a pencil icon showing
                .then(() => {
                expect(react_native_1.screen.queryAllByTestId('Pin Icon')).toHaveLength(1);
            })
                // When the draft is removed
                .then(() => react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, { isPinned: false }))
                // Then the pencil icon goes away
                .then(() => {
                expect(react_native_1.screen.queryAllByTestId('Pin Icon')).toHaveLength(0);
            }));
        });
        it('sorts chats by pinned / GBR > draft > rest', () => {
            // Given three reports in the recently updated order of 4, 3, 2, 1
            // with a report that has a draft, a report that is pinned, and
            //    an outstanding IOU report that belong to the current user
            const report1 = {
                ...LHNTestUtils.getFakeReport([1, 2], 4),
                isPinned: true,
            };
            const report2 = {
                ...LHNTestUtils.getFakeReport([1, 3], 3),
            };
            const report3 = {
                ...LHNTestUtils.getFakeReport([1, 4], 2),
                hasOutstandingChildRequest: true,
                // This has to be added after the IOU report is generated
                iouReportID: undefined,
            };
            const report4 = LHNTestUtils.getFakeReport([1, 5], 1);
            (0, Report_1.addComment)(report4.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const iouReport = {
                ...LHNTestUtils.getFakeReport([1, 4]),
                type: CONST_1.default.REPORT.TYPE.IOU,
                ownerAccountID: 1,
                managerID: 4,
                hasOutstandingChildRequest: false,
                total: 10000,
                currency: 'USD',
                chatReportID: report3.reportID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                participants: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    1: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    4: {
                        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
                    },
                },
            };
            report3.iouReportID = iouReport.reportID;
            const currentReportId = report2.reportID;
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report4.reportID}`]: report4,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${iouReport.reportID}`]: iouReport,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks(currentReportId))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report2.reportID}`]: 'Report2 draft comment',
                ...reportCollectionDataSet,
            }))
                // Then the reports are ordered by Pinned / GBR > Draft > Rest
                // there is a pencil icon
                // there is a pinned icon
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(4);
                expect(react_native_1.screen.queryAllByTestId('Pin Icon')).toHaveLength(1);
                expect(react_native_1.screen.queryAllByTestId('Pencil Icon')).toHaveLength(1);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Two');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
                expect(displayNames.at(3)).toHaveTextContent('Email Five');
            }));
        });
        it('alphabetizes all the chats that are pinned', () => {
            // Given three reports in the recently updated order of 3, 2, 1
            // and they are all pinned
            const report1 = {
                ...LHNTestUtils.getFakeReport([1, 2], 3),
                isPinned: true,
            };
            const report2 = {
                ...LHNTestUtils.getFakeReport([1, 3], 2),
                isPinned: true,
            };
            const report3 = {
                ...LHNTestUtils.getFakeReport([1, 4], 1),
                isPinned: true,
            };
            const report4 = {
                ...LHNTestUtils.getFakeReport([1, 5], 0),
                isPinned: true,
            };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks('0'))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // Then the reports are in alphabetical order
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Three');
                expect(displayNames.at(2)).toHaveTextContent('Email Two');
            })
                // When a new report is added
                .then(() => react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report4.reportID}`, report4))
                // Then they are still in alphabetical order
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(4);
                expect(displayNames.at(0)).toHaveTextContent('Email Five');
                expect(displayNames.at(1)).toHaveTextContent('Email Four');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
                expect(displayNames.at(3)).toHaveTextContent('Email Two');
            }));
        });
        it('alphabetizes all the chats that have drafts', () => {
            // Given three reports in the recently updated order of 3, 2, 1
            // and they all have drafts
            const report1 = {
                ...LHNTestUtils.getFakeReport([1, 2], 3),
            };
            const report2 = {
                ...LHNTestUtils.getFakeReport([1, 3], 2),
            };
            const report3 = {
                ...LHNTestUtils.getFakeReport([1, 4], 1),
            };
            const report4 = {
                ...LHNTestUtils.getFakeReport([1, 5], 0),
            };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            const reportDraftCommentCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report1.reportID}`]: 'report1 draft',
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report2.reportID}`]: 'report2 draft',
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report3.reportID}`]: 'report3 draft',
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks('0'))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportDraftCommentCollectionDataSet,
                ...reportCollectionDataSet,
            }))
                // Then the reports are in alphabetical order
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Three');
                expect(displayNames.at(2)).toHaveTextContent('Email Two');
            })
                // When a new report is added
                .then(() => react_native_onyx_1.default.multiSet({
                ...reportDraftCommentCollectionDataSet,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${report4.reportID}`]: 'report4 draft',
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report4.reportID}`]: report4,
                ...reportCollectionDataSet,
            }))
                // Then they are still in alphabetical order
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(4);
                expect(displayNames.at(0)).toHaveTextContent('Email Five');
                expect(displayNames.at(1)).toHaveTextContent('Email Four');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
                expect(displayNames.at(3)).toHaveTextContent('Email Two');
            }));
        });
        it('puts archived chats last', () => {
            // Given three reports, with the first report being archived
            const report1 = {
                ...LHNTestUtils.getFakeReport([1, 2]),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
            };
            const report2 = LHNTestUtils.getFakeReport([1, 3]);
            const report3 = LHNTestUtils.getFakeReport([1, 4]);
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            // Given the user is in all betas
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            const reportNameValuePairsCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report1.reportID}`]: {
                    private_isArchived: DateUtils_1.default.getDBTime(),
                },
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks('0'))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.BETAS]: betas,
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportNameValuePairsCollectionDataSet,
                ...reportCollectionDataSet,
            }))
                // Then the first report is in last position
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Three');
                expect(displayNames.at(2)).toHaveTextContent('Report (archived)');
            }));
        });
        it('orders nonArchived reports by displayName if created timestamps are the same', () => {
            // Given three nonArchived reports created at the same time
            const report1 = LHNTestUtils.getFakeReport([1, 2]);
            const report2 = LHNTestUtils.getFakeReport([1, 3]);
            const report3 = LHNTestUtils.getFakeReport([1, 4]);
            // Each report has at least one ADD_COMMENT action so should be rendered in the LNH
            (0, Report_1.addComment)(report1.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report2.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            (0, Report_1.addComment)(report3.reportID, 'Hi, this is a comment', CONST_1.default.DEFAULT_TIME_ZONE);
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks('0'))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // Then the reports are ordered alphabetically since their lastVisibleActionCreated are the same
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Three');
                expect(displayNames.at(2)).toHaveTextContent('Email Two');
            }));
        });
    });
    describe('in #focus mode', () => {
        it('alphabetizes chats', () => {
            const report1 = { ...LHNTestUtils.getFakeReport([1, 2], 3, true), lastMessageText: 'test' };
            const report2 = { ...LHNTestUtils.getFakeReport([1, 3], 2, true), lastMessageText: 'test' };
            const report3 = { ...LHNTestUtils.getFakeReport([1, 4], 1, true), lastMessageText: 'test' };
            const report4 = { ...LHNTestUtils.getFakeReport([1, 5], 0, true), lastMessageText: 'test' };
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils.fakePersonalDetails))
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks('0'))
                // Given the sidebar is rendered in #focus mode (hides read chats)
                // with all reports having unread comments
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.GSD,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportCollectionDataSet,
            }))
                // Then the reports are in alphabetical order
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Three');
                expect(displayNames.at(2)).toHaveTextContent('Email Two');
            })
                // When a new report is added
                .then(() => react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report4.reportID}`, report4))
                // Then they are still in alphabetical order
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(4);
                expect(displayNames.at(0)).toHaveTextContent('Email Five');
                expect(displayNames.at(1)).toHaveTextContent('Email Four');
                expect(displayNames.at(2)).toHaveTextContent('Email Three');
                expect(displayNames.at(3)).toHaveTextContent('Email Two');
            }));
        });
        it('puts archived chats last', () => {
            // Given three unread reports, with the first report being archived
            const report1 = {
                ...LHNTestUtils.getFakeReport([1, 2], 3, true),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                lastMessageText: 'test',
            };
            const report2 = {
                ...LHNTestUtils.getFakeReport([1, 3], 2, true),
                lastMessageText: 'test',
            };
            const report3 = { ...LHNTestUtils.getFakeReport([1, 4], 1, true), lastMessageText: 'test' };
            // Given the user is in all betas
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            const reportCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report1.reportID}`]: report1,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report2.reportID}`]: report2,
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report3.reportID}`]: report3,
            };
            const reportNameValuePairsCollectionDataSet = {
                [`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report1.reportID}`]: {
                    private_isArchived: DateUtils_1.default.getDBTime(),
                },
            };
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks('0'))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.BETAS]: betas,
                [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.GSD,
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                ...reportNameValuePairsCollectionDataSet,
                ...reportCollectionDataSet,
            }))
                // Then the first report is in last position
                .then(() => {
                const hintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames).toHaveLength(3);
                expect(displayNames.at(0)).toHaveTextContent('Email Four');
                expect(displayNames.at(1)).toHaveTextContent('Email Three');
                expect(displayNames.at(2)).toHaveTextContent('Report (archived)');
            }));
        });
    });
});
