"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const DateUtils_1 = require("@libs/DateUtils");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const Localize = require("@src/libs/Localize");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const LHNTestUtils = require("../utils/LHNTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
// Be sure to include the mocked Permissions and Expensicons libraries or else the beta tests won't work
jest.mock('@src/libs/Permissions');
jest.mock('@src/components/Icon/Expensicons');
jest.mock('@src/hooks/useRootNavigationState');
const TEST_USER_ACCOUNT_ID = 1;
const TEST_USER_LOGIN = 'email1@test.com';
describe('Sidebar', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        (0, OnyxDerived_1.default)();
    });
    beforeEach(() => {
        // Wrap Onyx each onyx action with waitForBatchedUpdates
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, CONST_1.default.LOCALES.EN);
        // Initialize the network key for OfflineWithFeedback
        return TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN).then(() => react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false }));
    });
    // Clear out Onyx after each test so that each test starts with a clean slate
    afterEach(() => {
        react_native_onyx_1.default.clear();
    });
    describe('archived chats', () => {
        it('renders the archive reason as the preview message of the chat', () => {
            const report = {
                ...LHNTestUtils.getFakeReport([1, 2], 3, true),
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                lastMessageText: 'test',
            };
            const action = {
                ...LHNTestUtils.getFakeReportAction('email1@test.com', 3),
                actionName: 'CLOSED',
                originalMessage: {
                    reason: CONST_1.default.REPORT.ARCHIVE_REASON.DEFAULT,
                },
            };
            const reportNameValuePairs = {
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            // Given the user is in all betas
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks('0'))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => {
                const reportCollection = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
                };
                const reportAction = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`]: { [action.reportActionID]: action },
                };
                const reportNameValuePairsCollection = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`]: reportNameValuePairs,
                };
                return react_native_onyx_1.default.multiSet({
                    [ONYXKEYS_1.default.BETAS]: betas,
                    [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.GSD,
                    [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                    [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                    ...reportNameValuePairsCollection,
                    ...reportCollection,
                    ...reportAction,
                });
            })
                .then(() => {
                const hintText = Localize.translateLocal('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames.at(0)).toHaveTextContent('Report (archived)');
                const hintMessagePreviewText = Localize.translateLocal('accessibilityHints.lastChatMessagePreview');
                const messagePreviewTexts = react_native_1.screen.queryAllByLabelText(hintMessagePreviewText);
                expect(messagePreviewTexts.at(0)).toHaveTextContent('This chat room has been archived.');
            }));
        });
        it('renders the policy deleted archive reason as the preview message of the chat', () => {
            const report = {
                ...LHNTestUtils.getFakeReport([1, 2], 3, true),
                policyName: 'Vikings Policy',
                chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                private_isArchived: DateUtils_1.default.getDBTime(),
                lastMessageText: 'test',
            };
            const action = {
                ...LHNTestUtils.getFakeReportAction('email1@test.com', 3),
                actionName: 'CLOSED',
                originalMessage: {
                    policyName: 'Vikings Policy',
                    reason: 'policyDeleted',
                },
            };
            const reportNameValuePairs = {
                private_isArchived: DateUtils_1.default.getDBTime(),
            };
            // Given the user is in all betas
            const betas = [CONST_1.default.BETAS.DEFAULT_ROOMS];
            return ((0, waitForBatchedUpdates_1.default)()
                .then(() => LHNTestUtils.getDefaultRenderedSidebarLinks('0'))
                // When Onyx is updated with the data and the sidebar re-renders
                .then(() => {
                const reportCollection = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`]: report,
                };
                const reportAction = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`]: { [action.reportActionID]: action },
                };
                const reportNameValuePairsCollection = {
                    [`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`]: reportNameValuePairs,
                };
                return react_native_onyx_1.default.multiSet({
                    [ONYXKEYS_1.default.BETAS]: betas,
                    [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.GSD,
                    [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: LHNTestUtils.fakePersonalDetails,
                    [ONYXKEYS_1.default.IS_LOADING_APP]: false,
                    ...reportNameValuePairsCollection,
                    ...reportCollection,
                    ...reportAction,
                });
            })
                .then(() => {
                const hintText = Localize.translateLocal('accessibilityHints.chatUserDisplayNames');
                const displayNames = react_native_1.screen.queryAllByLabelText(hintText);
                expect(displayNames.at(0)).toHaveTextContent('Report (archived)');
                const hintMessagePreviewText = Localize.translateLocal('accessibilityHints.lastChatMessagePreview');
                const messagePreviewTexts = react_native_1.screen.queryAllByLabelText(hintMessagePreviewText);
                expect(messagePreviewTexts.at(0)).toHaveTextContent('This chat is no longer active because Vikings Policy is no longer an active workspace.');
            }));
        });
    });
});
