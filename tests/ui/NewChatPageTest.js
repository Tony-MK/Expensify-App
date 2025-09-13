"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NativeNavigation = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_2 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const HTMLEngineProvider_1 = require("@components/HTMLEngineProvider");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Localize_1 = require("@libs/Localize");
const NewChatPage_1 = require("@pages/NewChatPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const LHNTestUtils_1 = require("../utils/LHNTestUtils");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
jest.mock('@react-navigation/native');
jest.mock('@src/libs/Navigation/navigationRef');
jest.mock('react-native-permissions', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    RESULTS: {
        UNAVAILABLE: 'unavailable',
        GRANTED: 'granted',
        LIMITED: 'limited',
        DENIED: 'denied',
        BLOCKED: 'blocked',
    },
    check: jest.fn(() => Promise.resolve('unavailable')),
    request: jest.fn(() => Promise.resolve('unavailable')),
    PERMISSIONS: {
        IOS: {
            CONTACTS: 'ios.permission.CONTACTS',
        },
        ANDROID: {
            READ_CONTACTS: 'android.permission.READ_CONTACTS',
        },
    },
}));
const wrapper = ({ children }) => (<OnyxListItemProvider_1.default>
        <HTMLEngineProvider_1.default>
            <LocaleContextProvider_1.LocaleContextProvider>
                <OptionListContextProvider_1.default>
                    <ScreenWrapper_1.default testID="test">{children}</ScreenWrapper_1.default>
                </OptionListContextProvider_1.default>
            </LocaleContextProvider_1.LocaleContextProvider>
        </HTMLEngineProvider_1.default>
    </OnyxListItemProvider_1.default>);
describe('NewChatPage', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        jest.spyOn(NativeNavigation, 'useRoute').mockReturnValue({ key: '', name: '' });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await react_native_onyx_1.default.clear();
        await (0, waitForBatchedUpdates_1.default)();
    });
    it('should scroll to top when adding a user to the group selection', async () => {
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, LHNTestUtils_1.fakePersonalDetails);
        (0, react_native_1.render)(<NewChatPage_1.default />, { wrapper });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        (0, react_native_1.act)(() => {
            NativeNavigation.triggerTransitionEnd();
        });
        const spy = jest.spyOn(react_native_2.SectionList.prototype, 'scrollToLocation');
        const addButton = await (0, react_native_1.waitFor)(() => react_native_1.screen.getAllByText((0, Localize_1.translateLocal)('newChatPage.addToGroup')).at(0));
        if (addButton) {
            react_native_1.fireEvent.press(addButton);
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ itemIndex: 0 }));
        }
    });
    describe('should not display "Add to group" button on expensify emails', () => {
        const excludedGroupEmails = CONST_1.default.EXPENSIFY_EMAILS.filter((value) => value !== CONST_1.default.EMAIL.CONCIERGE && value !== CONST_1.default.EMAIL.NOTIFICATIONS).map((email) => [email]);
        it.each(excludedGroupEmails)('%s', async (email) => {
            // Given that a personal details list is initialized in Onyx
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': { accountID: 1, login: email },
            });
            // And NewChatPage is opened
            (0, react_native_1.render)(<NewChatPage_1.default />, { wrapper });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            (0, react_native_1.act)(() => {
                NativeNavigation.triggerTransitionEnd();
            });
            // And email is entered into the search input
            const input = react_native_1.screen.getByTestId('selection-list-text-input');
            react_native_1.fireEvent.changeText(input, email);
            // And waited for the user option to appear
            await (0, react_native_1.waitFor)(() => {
                expect(react_native_1.screen.getByLabelText(email)).toBeOnTheScreen();
            });
            // Then "Add to group" button should not appear
            const userOption = react_native_1.screen.getByLabelText(email);
            const addButton = (0, react_native_1.within)(userOption).queryByText((0, Localize_1.translateLocal)('newChatPage.addToGroup'));
            expect(addButton).not.toBeOnTheScreen();
        });
    });
});
