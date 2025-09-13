"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PlaybackContext_1 = require("@components/VideoPlayerContexts/PlaybackContext");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const types_1 = require("@libs/API/types");
const Localize_1 = require("@libs/Localize");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const SequentialQueue_1 = require("@libs/Network/SequentialQueue");
const AttachmentModalScreen_1 = require("@pages/media/AttachmentModalScreen");
const AttachmentModalContext_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContext");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
const Stack = (0, createPlatformStackNavigator_1.default)();
(0, TestHelper_1.setupGlobalFetchMock)();
jest.mock('@rnmapbox/maps', () => {
    return {
        default: jest.fn(),
        MarkerView: jest.fn(),
        setAccessToken: jest.fn(),
    };
});
jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: jest.fn(),
}));
jest.mock('@src/components/Attachments/AttachmentCarousel/Pager/usePageScrollHandler', () => jest.fn());
const renderPage = (initialRouteName, initialParams) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, AttachmentModalContext_1.AttachmentModalContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider, portal_1.PortalProvider, PlaybackContext_1.PlaybackContextProvider]}>
            <native_1.NavigationContainer>
                <Stack.Navigator initialRouteName={initialRouteName}>
                    <Stack.Screen name={SCREENS_1.default.ATTACHMENTS} component={AttachmentModalScreen_1.default} initialParams={initialParams}/>
                </Stack.Navigator>
            </native_1.NavigationContainer>
        </ComposeProviders_1.default>);
};
// // Given report attachment data results consisting of involved user login, user account id, report & report action and attachment id
const TEST_USER_LOGIN = 'test@test.com';
const TEST_USER_ACCOUNT_ID = 1;
const reportAttachmentID = '7487537791562875';
const reportActionAttachmentID = '7006877151048865417';
const reportAttachmentOnyx = {
    reportName: 'Chat Report',
    currency: 'USD',
    description: '',
    errorFields: {},
    hasOutstandingChildRequest: false,
    hasOutstandingChildTask: false,
    isCancelledIOU: false,
    isOwnPolicyExpenseChat: false,
    isPinned: false,
    isWaitingOnBankAccount: false,
    lastActionType: 'ADDCOMMENT',
    lastActorAccountID: TEST_USER_ACCOUNT_ID,
    lastMessageHtml: '<img src="https://staging.expensify.com/chat-attachments/7006877151048865417/w_d060af4fb7ac4a815e6ed99df9ef8dd216fdd8c7.png.1024.jpg" data-expensify-source="https://staging.expensify.com/chat-attachments/7006877151048865417/w_d060af4fb7ac4a815e6ed99df9ef8dd216fdd8c7.png" data-name="Screenshot_2025-02-05_at_13.03.32.png" data-expensify-height="408" data-expensify-width="980" />',
    lastMessageText: '[Attachment]',
    lastReadSequenceNumber: 0,
    lastReadTime: '2025-02-05 07:32:45.788',
    lastVisibleActionCreated: '2025-02-05 07:29:21.593',
    lastVisibleActionLastModified: '2025-02-05 07:29:21.593',
    managerID: 0,
    nonReimbursableTotal: 0,
    oldPolicyName: '',
    ownerAccountID: 0,
    participants: {
        [TEST_USER_ACCOUNT_ID]: {
            notificationPreference: 'always',
        },
    },
    permissions: ['read', 'write'],
    policyID: '_FAKE_',
    reportID: '7487537791562875',
    stateNum: 0,
    statusNum: 0,
    total: 0,
    type: 'chat',
    unheldNonReimbursableTotal: 0,
    unheldTotal: 0,
    welcomeMessage: '',
    writeCapability: 'all',
};
const reportActionsAttachmentOnyx = {
    [reportActionAttachmentID]: {
        person: [
            {
                type: 'TEXT',
                style: 'strong',
                text: TEST_USER_LOGIN,
            },
        ],
        actorAccountID: TEST_USER_ACCOUNT_ID,
        message: [
            {
                type: 'COMMENT',
                html: '<img src="https://staging.expensify.com/chat-attachments/7006877151048865417/w_d060af4fb7ac4a815e6ed99df9ef8dd216fdd8c7.png.1024.jpg" data-expensify-source="https://staging.expensify.com/chat-attachments/7006877151048865417/w_d060af4fb7ac4a815e6ed99df9ef8dd216fdd8c7.png" data-name="Screenshot_2025-02-05_at_13.03.32.png" data-expensify-height="408" data-expensify-width="980" />',
                text: '[Attachment]',
                isEdited: false,
                whisperedTo: [],
                isDeletedParentAction: false,
                deleted: '',
            },
        ],
        originalMessage: {
            html: '<img src="https://staging.expensify.com/chat-attachments/7006877151048865417/w_d060af4fb7ac4a815e6ed99df9ef8dd216fdd8c7.png.1024.jpg" data-expensify-source="https://staging.expensify.com/chat-attachments/7006877151048865417/w_d060af4fb7ac4a815e6ed99df9ef8dd216fdd8c7.png" data-name="Screenshot_2025-02-05_at_13.03.32.png" data-expensify-height="408" data-expensify-width="980" />',
            lastModified: '2025-02-05 07:29:21.593',
        },
        avatar: 'https://d1wpcgnaa73g0y.cloudfront.net/c751290e0b771edfe5a0f1eeaf6aea98baf7c70c.png',
        created: '2025-02-05 07:29:21.593',
        timestamp: 1738740561,
        reportActionTimestamp: 1738740561593,
        automatic: false,
        actionName: 'ADDCOMMENT',
        shouldShow: true,
        reportActionID: '7006877151048865417',
        lastModified: '2025-02-05 07:29:21.593',
        whisperedToAccountIDs: [],
    },
};
describe('ReportAttachments', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: {
                [ONYXKEYS_1.default.SESSION]: { accountID: TEST_USER_ACCOUNT_ID, email: TEST_USER_LOGIN },
                [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: { [TEST_USER_ACCOUNT_ID]: { accountID: TEST_USER_ACCOUNT_ID, login: TEST_USER_LOGIN } },
            },
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
    });
    beforeEach(async () => {
        global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.IS_LOADING_APP, false);
        // Given a test user is signed in with Onyx setup and some initial data
        await (0, TestHelper_1.signInWithTestUser)(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN);
        await (0, waitForBatchedUpdates_1.default)();
    });
    afterEach(async () => {
        await (0, SequentialQueue_1.waitForIdle)();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.clear();
        });
        jest.clearAllMocks();
    });
    it('should display the attachment if the source link is origin url', async () => {
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportAttachmentID}`, reportAttachmentOnyx);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportAttachmentID}`, reportActionsAttachmentOnyx);
        // Given the report attachments params
        const params = {
            source: 'https://staging.expensify.com/chat-attachments/7006877151048865417/w_d060af4fb7ac4a815e6ed99df9ef8dd216fdd8c7.png',
            type: 'r',
            reportID: '7487537791562875',
            isAuthTokenRequired: true,
            originalFileName: 'Screenshot_2025-02-05_at_13.03.32.png',
            accountID: TEST_USER_ACCOUNT_ID,
        };
        // And ReportAttachments is opened
        renderPage(SCREENS_1.default.ATTACHMENTS, params);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Then the not here page and the loading spinner should not appear.
        expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('notFound.notHere'))).toBeNull();
        expect(react_native_1.screen.queryByTestId('attachment-loading-spinner')).toBeNull();
    });
    it('should fetch the report id, if the report has not yet been opened by the user', async () => {
        // Given the report attachments params
        const params = {
            source: 'https://staging.expensify.com/chat-attachments/7006877151048865417/w_d060af4fb7ac4a815e6ed99df9ef8dd216fdd8c7.png',
            type: 'r',
            reportID: '7487537791562875',
            isAuthTokenRequired: true,
            originalFileName: 'Screenshot_2025-02-05_at_13.03.32.png',
            accountID: TEST_USER_ACCOUNT_ID,
        };
        // And ReportAttachments is opened
        renderPage(SCREENS_1.default.ATTACHMENTS, params);
        await (0, waitForBatchedUpdates_1.default)();
        const openReportRequest = (0, TestHelper_1.getFetchMockCalls)(types_1.WRITE_COMMANDS.OPEN_REPORT).find((request) => {
            const body = request[1]?.body;
            const requestParams = body instanceof FormData ? Object.fromEntries(body) : {};
            return requestParams?.reportID === params.reportID;
        });
        // Then the report should fetched by OpenReport API command
        expect(openReportRequest).toBeDefined();
    });
});
