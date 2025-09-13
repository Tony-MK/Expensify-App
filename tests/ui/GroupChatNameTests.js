"use strict";
/* eslint-disable testing-library/no-node-access */
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const Localize_1 = require("@libs/Localize");
const App_1 = require("@userActions/App");
const User_1 = require("@userActions/User");
const App_2 = require("@src/App");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PusherHelper_1 = require("../utils/PusherHelper");
const TestHelper = require("../utils/TestHelper");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
// We need a large timeout here as we are lazy loading React Navigation screens and this test is running against the entire mounted App
jest.setTimeout(50000);
jest.mock('../../src/components/ConfirmedRoute.tsx');
// Needed for: https://stackoverflow.com/questions/76903168/mocking-libraries-in-jest
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    __esModule: true,
    default: {
        ignoreLogs: jest.fn(),
        ignoreAllLogs: jest.fn(),
    },
}));
jest.mock('@libs/Navigation/AppNavigator/usePreloadFullScreenNavigators', () => jest.fn());
jest.mock('@react-navigation/native');
TestHelper.setupApp();
const REPORT_ID = '1';
const USER_A_ACCOUNT_ID = 1;
const USER_A_EMAIL = 'user_a@test.com';
const USER_B_ACCOUNT_ID = 2;
const USER_B_EMAIL = 'user_b@test.com';
const USER_C_ACCOUNT_ID = 3;
const USER_C_EMAIL = 'user_c@test.com';
const USER_D_ACCOUNT_ID = 4;
const USER_D_EMAIL = 'user_d@test.com';
const USER_E_ACCOUNT_ID = 5;
const USER_E_EMAIL = 'user_e@test.com';
const USER_F_ACCOUNT_ID = 6;
const USER_F_EMAIL = 'user_f@test.com';
const USER_G_ACCOUNT_ID = 7;
const USER_G_EMAIL = 'user_g@test.com';
const USER_H_ACCOUNT_ID = 8;
const USER_H_EMAIL = 'user_h@test.com';
/**
 * Sets up a test with a logged in user. Returns the <App/> test instance.
 */
function signInAndGetApp(reportName = '', participantAccountIDs) {
    // Render the App and sign in as a test user.
    (0, react_native_1.render)(<App_2.default />);
    const participants = {};
    participantAccountIDs?.forEach((id) => {
        participants[id] = {
            notificationPreference: 'always',
            hidden: false,
            role: id === 1 ? CONST_1.default.REPORT.ROLE.ADMIN : CONST_1.default.REPORT.ROLE.MEMBER,
        };
    });
    return (0, waitForBatchedUpdatesWithAct_1.default)()
        .then(async () => {
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const hintText = (0, Localize_1.translateLocal)('loginForm.loginForm');
        const loginForm = react_native_1.screen.queryAllByLabelText(hintText);
        expect(loginForm).toHaveLength(1);
    })
        .then(async () => TestHelper.signInWithTestUser(USER_A_ACCOUNT_ID, USER_A_EMAIL, undefined, undefined, 'A'))
        .then(() => {
        (0, User_1.subscribeToUserEvents)();
        return (0, waitForBatchedUpdates_1.default)();
    })
        .then(async () => {
        // Simulate setting an unread report and personal details
        await Promise.all([
            react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, {
                reportID: REPORT_ID,
                reportName,
                lastMessageText: 'Test',
                participants,
                lastActorAccountID: USER_B_ACCOUNT_ID,
                type: CONST_1.default.REPORT.TYPE.CHAT,
                chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
            }),
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                [USER_A_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_A_EMAIL, USER_A_ACCOUNT_ID, 'A'),
                [USER_B_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_B_EMAIL, USER_B_ACCOUNT_ID, 'B'),
                [USER_C_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_C_EMAIL, USER_C_ACCOUNT_ID, 'C'),
                [USER_D_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_D_EMAIL, USER_D_ACCOUNT_ID, 'D'),
                [USER_E_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_E_EMAIL, USER_E_ACCOUNT_ID, 'E'),
                [USER_F_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_F_EMAIL, USER_F_ACCOUNT_ID, 'F'),
                [USER_G_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_G_EMAIL, USER_G_ACCOUNT_ID, 'G'),
                [USER_H_ACCOUNT_ID]: TestHelper.buildPersonalDetails(USER_H_EMAIL, USER_H_ACCOUNT_ID, 'H'),
            }),
        ]);
        // We manually setting the sidebar as loaded since the onLayout event does not fire in tests
        (0, App_1.setSidebarLoaded)();
        return (0, waitForBatchedUpdatesWithAct_1.default)();
    });
}
/**
 * Tests for checking the group chat names at places like LHN, chat header, details page etc.
 * Note that limit of 5 names is only for the header.
 */
describe('Tests for group chat name', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = TestHelper.getGlobalFetchMock();
        // Unsubscribe to pusher channels
        PusherHelper_1.default.teardown();
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    const participantAccountIDs4 = [USER_A_ACCOUNT_ID, USER_B_ACCOUNT_ID, USER_C_ACCOUNT_ID, USER_D_ACCOUNT_ID];
    const participantAccountIDs8 = [...participantAccountIDs4, USER_E_ACCOUNT_ID, USER_F_ACCOUNT_ID, USER_G_ACCOUNT_ID, USER_H_ACCOUNT_ID];
    it('Should show correctly in LHN', () => signInAndGetApp('A, B, C, D', participantAccountIDs4).then(() => {
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
        return (0, react_native_1.waitFor)(() => expect(displayNameText?.props?.children?.[0]).toBe('A, B, C, D'));
    }));
    it('Should show correctly in LHN when report name is not present', () => signInAndGetApp('', participantAccountIDs4).then(() => {
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
        return (0, react_native_1.waitFor)(() => expect(displayNameText?.props?.children?.[0]).toBe('A, B, C, D'));
    }));
    it('Should show limited names with ellipsis in LHN when 8 participants are present', () => signInAndGetApp('', participantAccountIDs8).then(() => {
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
        return (0, react_native_1.waitFor)(() => expect(displayNameText?.props?.children?.[0]).toBe('A, B, C, D, E...'));
    }));
    it('Check if group name shows fine for report header', () => signInAndGetApp('', participantAccountIDs4)
        .then(() => {
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
        expect(displayNameText?.props?.children?.[0]).toBe('A, B, C, D');
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(waitForBatchedUpdates_1.default)
        .then(async () => {
        const name = 'A, B, C, D';
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(name);
        return (0, react_native_1.waitFor)(() => expect(displayNameTexts).toHaveLength(1));
    }));
    it('Should show only 5 names with ellipsis when there are 8 participants in the report header', () => signInAndGetApp('', participantAccountIDs8)
        .then(async () => {
        // Wait for sidebar to be rendered
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        // Check sidebar links
        await (0, react_native_1.waitFor)(() => {
            const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
            expect(sidebarLinks).toHaveLength(1);
        });
        // Check option rows
        await (0, react_native_1.waitFor)(() => {
            const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
            expect(optionRows).toHaveLength(1);
        });
        // Check display name
        await (0, react_native_1.waitFor)(() => {
            const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
            expect(displayNameText?.props?.children?.[0]).toBe('A, B, C, D, E...');
        });
    })
        .then(() => (0, TestHelper_1.navigateToSidebarOption)(0))
        .then(waitForBatchedUpdates_1.default)
        .then(async () => {
        const name = 'A, B, C, D, E...';
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(name);
        return (0, react_native_1.waitFor)(() => expect(displayNameTexts).toHaveLength(1));
    }));
    it('Should show exact name in header when report name is available with 4 participants', () => signInAndGetApp('Test chat', participantAccountIDs4)
        .then(() => {
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
        expect(displayNameText?.props?.children?.[0]).toBe('Test chat');
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(waitForBatchedUpdates_1.default)
        .then(async () => {
        const name = 'Test chat';
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(name);
        return (0, react_native_1.waitFor)(() => expect(displayNameTexts).toHaveLength(1));
    }));
    it('Should show exact name in header when report name is available with 8 participants', () => signInAndGetApp("Let's talk", participantAccountIDs8)
        .then(() => {
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
        expect(displayNameText?.props?.children?.[0]).toBe("Let's talk");
        return (0, TestHelper_1.navigateToSidebarOption)(0);
    })
        .then(waitForBatchedUpdates_1.default)
        .then(async () => {
        const name = "Let's talk";
        const displayNameTexts = react_native_1.screen.queryAllByLabelText(name);
        return (0, react_native_1.waitFor)(() => expect(displayNameTexts).toHaveLength(1));
    }));
    it('Should show last message preview in LHN', () => signInAndGetApp('A, B, C, D', participantAccountIDs4).then(() => {
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        const lastChatHintText = (0, Localize_1.translateLocal)('accessibilityHints.lastChatMessagePreview');
        const lastChatText = react_native_1.screen.queryByLabelText(lastChatHintText);
        return (0, react_native_1.waitFor)(() => expect(lastChatText?.props?.children).toBe('B: Test'));
    }));
    it('Should sort the names before displaying', () => signInAndGetApp('', [USER_E_ACCOUNT_ID, ...participantAccountIDs4]).then(() => {
        // Verify the sidebar links are rendered
        const sidebarLinksHintText = (0, Localize_1.translateLocal)('sidebarScreen.listOfChats');
        const sidebarLinks = react_native_1.screen.queryAllByLabelText(sidebarLinksHintText);
        expect(sidebarLinks).toHaveLength(1);
        // Verify there is only one option in the sidebar
        const optionRows = react_native_1.screen.queryAllByAccessibilityHint(TestHelper.getNavigateToChatHintRegex());
        expect(optionRows).toHaveLength(1);
        const displayNameHintText = (0, Localize_1.translateLocal)('accessibilityHints.chatUserDisplayNames');
        const displayNameText = react_native_1.screen.queryByLabelText(displayNameHintText);
        return (0, react_native_1.waitFor)(() => expect(displayNameText?.props?.children?.[0]).toBe('A, B, C, D, E'));
    }));
});
