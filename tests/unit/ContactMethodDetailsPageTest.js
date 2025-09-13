"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
// eslint-disable-next-line no-restricted-syntax
const UserActions = require("@libs/actions/User");
const ContactMethodDetailsPage_1 = require("@pages/settings/Profile/Contacts/ContactMethodDetailsPage");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
jest.mock('@libs/Navigation/Navigation', () => ({
    goBack: jest.fn(),
}));
jest.mock('@components/DelegateNoAccessModalProvider');
jest.mock('@libs/actions/User', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const originalModule = jest.requireActual('@libs/actions/User');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
        ...originalModule,
        resetContactMethodValidateCodeSentState: jest.fn(),
    };
});
const fakeEmail = 'fake@gmail.com';
const mockRoute = {
    params: {
        backTo: '',
        contactMethod: fakeEmail,
    },
};
const mockLoginList = {
    [fakeEmail]: {
        partnerName: 'expensify.com',
        partnerUserID: fakeEmail,
        validatedDate: 'fake-validatedDate',
    },
};
describe('ContactMethodDetailsPage', () => {
    let mockFetch;
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
        global.fetch = (0, TestHelper_1.getGlobalFetchMock)();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    function ContactMethodDetailsPageRenderer() {
        return (<ContactMethodDetailsPage_1.default 
        // @ts-expect-error - Ignoring type errors for testing purposes
        route={mockRoute}/>);
    }
    it('should not call resetContactMethodValidateCodeSentState when we got a delete pending field', async () => {
        // Given a login list with a validated contact method
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.LOGIN_LIST, mockLoginList);
        await (0, waitForBatchedUpdates_1.default)();
        // Given the page is rendered
        (0, react_native_1.render)(<ContactMethodDetailsPageRenderer />);
        // When a deleteContactMethod called
        UserActions.deleteContactMethod(fakeEmail, mockLoginList);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // When the deletion is successful
        mockFetch?.succeed();
        await (0, waitForBatchedUpdates_1.default)();
        mockFetch?.resume();
        await (0, waitForBatchedUpdates_1.default)();
        // Then resetContactMethodValidateCodeSentState should not be called
        expect(UserActions.resetContactMethodValidateCodeSentState).not.toHaveBeenCalled();
    });
    it('should not call resetContactMethodValidateCodeSentState when the login data has no partnerUserID', async () => {
        // Given a login list with a contact method that has no partnerUserID
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.LOGIN_LIST, {
            [fakeEmail]: {
                partnerName: 'expensify.com',
                partnerUserID: '',
                validatedDate: '',
            },
        });
        await (0, waitForBatchedUpdates_1.default)();
        // Given the page is rendered
        (0, react_native_1.render)(<ContactMethodDetailsPageRenderer />);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        // Then resetContactMethodValidateCodeSentState should not be called
        expect(UserActions.resetContactMethodValidateCodeSentState).not.toHaveBeenCalled();
    });
});
