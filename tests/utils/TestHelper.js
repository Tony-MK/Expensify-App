"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_CUSTOMER_ID = void 0;
exports.assertFormDataMatchesObject = assertFormDataMatchesObject;
exports.buildPersonalDetails = buildPersonalDetails;
exports.buildTestReportComment = buildTestReportComment;
exports.getFetchMockCalls = getFetchMockCalls;
exports.getGlobalFetchMock = getGlobalFetchMock;
exports.setPersonalDetails = setPersonalDetails;
exports.signInWithTestUser = signInWithTestUser;
exports.signOutTestUser = signOutTestUser;
exports.setupApp = setupApp;
exports.expectAPICommandToHaveBeenCalled = expectAPICommandToHaveBeenCalled;
exports.expectAPICommandToHaveBeenCalledWith = expectAPICommandToHaveBeenCalledWith;
exports.setupGlobalFetchMock = setupGlobalFetchMock;
exports.navigateToSidebarOption = navigateToSidebarOption;
exports.getOnyxData = getOnyxData;
exports.getNavigateToChatHintRegex = getNavigateToChatHintRegex;
exports.formatPhoneNumber = formatPhoneNumber;
exports.localeCompare = localeCompare;
const react_native_1 = require("@testing-library/react-native");
const expensify_common_1 = require("expensify-common");
const react_native_2 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
const Localize_1 = require("@libs/Localize");
const Pusher_1 = require("@libs/Pusher");
const PusherConnectionManager_1 = require("@libs/PusherConnectionManager");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const Session = require("@src/libs/actions/Session");
const HttpUtils_1 = require("@src/libs/HttpUtils");
const NumberUtils = require("@src/libs/NumberUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const setup_1 = require("@src/setup");
const waitForBatchedUpdates_1 = require("./waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("./waitForBatchedUpdatesWithAct");
function formatPhoneNumber(phoneNumber) {
    return (0, LocalePhoneNumber_1.formatPhoneNumberWithCountryCode)(phoneNumber, 1);
}
const STRIPE_CUSTOMER_ID = {
    paymentMethodID: '1',
    intentsID: '2',
    currency: 'USD',
    status: 'authentication_required',
};
exports.STRIPE_CUSTOMER_ID = STRIPE_CUSTOMER_ID;
function setupApp() {
    beforeAll(() => {
        react_native_2.Linking.setInitialURL('https://new.expensify.com/');
        (0, setup_1.default)();
        // Connect to Pusher
        PusherConnectionManager_1.default.init();
        Pusher_1.default.init({
            appKey: CONFIG_1.default.PUSHER.APP_KEY,
            cluster: CONFIG_1.default.PUSHER.CLUSTER,
            authEndpoint: `${CONFIG_1.default.EXPENSIFY.DEFAULT_API_ROOT}api/AuthenticatePusher?`,
        });
    });
}
function buildPersonalDetails(login, accountID, firstName = 'Test') {
    return {
        accountID,
        login,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_7.png',
        avatarThumbnail: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_7.png',
        displayName: `${firstName} User`,
        firstName,
        lastName: 'User',
        pronouns: '',
        timezone: CONST_1.default.DEFAULT_TIME_ZONE,
        phoneNumber: '',
    };
}
function getOnyxData(options) {
    return new Promise((resolve) => {
        const connectionID = react_native_onyx_1.default.connect({
            ...options,
            callback: (...params) => {
                react_native_onyx_1.default.disconnect(connectionID);
                options.callback?.(...params);
                resolve();
            },
        });
    });
}
/**
 * Simulate signing in and make sure all API calls in this flow succeed. Every time we add
 * a mockImplementationOnce() we are altering what Network.post() will return.
 */
// cspell:disable-next-line
function signInWithTestUser(accountID = 1, login = 'test@user.com', password = 'Password1', authToken = 'asdfqwerty', firstName = 'Test') {
    const originalXhr = HttpUtils_1.default.xhr;
    HttpUtils_1.default.xhr = jest.fn().mockImplementation(() => {
        const mockedResponse = {
            onyxData: [
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.CREDENTIALS,
                    value: {
                        login,
                    },
                },
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.ACCOUNT,
                    value: {
                        validated: true,
                    },
                },
                {
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                    value: {
                        [accountID]: buildPersonalDetails(login, accountID, firstName),
                    },
                },
            ],
            jsonCode: 200,
        };
        // Return a Promise that resolves with the mocked response
        return Promise.resolve(mockedResponse);
    });
    // Simulate user entering their login and populating the credentials.login
    Session.beginSignIn(login);
    return (0, waitForBatchedUpdates_1.default)()
        .then(() => {
        HttpUtils_1.default.xhr = jest.fn().mockImplementation(() => {
            const mockedResponse = {
                onyxData: [
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.SESSION,
                        value: {
                            authToken,
                            accountID,
                            email: login,
                            encryptedAuthToken: authToken,
                        },
                    },
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.CREDENTIALS,
                        value: {
                            autoGeneratedLogin: expensify_common_1.Str.guid('expensify.cash-'),
                            autoGeneratedPassword: expensify_common_1.Str.guid(),
                        },
                    },
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.ACCOUNT,
                        value: {
                            isUsingExpensifyCard: false,
                        },
                    },
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.BETAS,
                        value: ['all'],
                    },
                    {
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        key: ONYXKEYS_1.default.NVP_PRIVATE_PUSH_NOTIFICATION_ID,
                        value: 'randomID',
                    },
                ],
                jsonCode: 200,
            };
            // Return a Promise that resolves with the mocked response
            return Promise.resolve(mockedResponse);
        });
        Session.signIn(password);
        return (0, waitForBatchedUpdates_1.default)();
    })
        .then(() => {
        HttpUtils_1.default.xhr = originalXhr;
    });
}
function signOutTestUser() {
    const originalXhr = HttpUtils_1.default.xhr;
    HttpUtils_1.default.xhr = jest.fn().mockImplementation(() => {
        const mockedResponse = {
            jsonCode: 200,
        };
        // Return a Promise that resolves with the mocked response
        return Promise.resolve(mockedResponse);
    });
    Session.signOutAndRedirectToSignIn();
    return (0, waitForBatchedUpdates_1.default)().then(() => (HttpUtils_1.default.xhr = originalXhr));
}
/**
 * Use for situations where fetch() is required. This mock is stateful and has some additional methods to control its behavior:
 *
 * - pause() – stop resolving promises until you call resume()
 * - resume() - flush the queue of promises, and start resolving new promises immediately
 * - fail() - start returning a failure response
 * - success() - go back to returning a success response
 */
function getGlobalFetchMock() {
    let queue = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let responses = new Map();
    let isPaused = false;
    let shouldFail = false;
    const getResponse = (input, options) => shouldFail
        ? {
            ok: true,
            json: () => Promise.resolve({ jsonCode: 400 }),
        }
        : {
            ok: true,
            json: async () => {
                const commandMatch = typeof input === 'string' ? input.match(/https:\/\/www.expensify.com.dev\/api\/(\w+)\?/) : null;
                const command = commandMatch ? commandMatch[1] : null;
                const responseHandler = command ? responses.get(command) : null;
                if (responseHandler) {
                    const requestData = options?.body instanceof FormData ? Object.fromEntries(options.body) : {};
                    return Promise.resolve({ jsonCode: 200, ...responseHandler(requestData) });
                }
                return Promise.resolve({ jsonCode: 200 });
            },
        };
    const mockFetch = jest.fn().mockImplementation((input, options) => {
        if (!isPaused) {
            return Promise.resolve(getResponse(input, options));
        }
        return new Promise((resolve) => {
            queue.push({ resolve, input, options });
        });
    });
    const baseMockReset = mockFetch.mockReset.bind(mockFetch);
    mockFetch.mockReset = () => {
        baseMockReset();
        queue = [];
        responses = new Map();
        isPaused = false;
        shouldFail = false;
        return mockFetch;
    };
    mockFetch.pause = () => (isPaused = true);
    mockFetch.resume = () => {
        isPaused = false;
        queue.forEach(({ resolve, input }) => resolve(getResponse(input)));
        return (0, waitForBatchedUpdates_1.default)();
    };
    mockFetch.fail = () => (shouldFail = true);
    mockFetch.succeed = () => (shouldFail = false);
    mockFetch.mockAPICommand = (command, responseHandler) => {
        responses.set(command, responseHandler);
    };
    return mockFetch;
}
function setupGlobalFetchMock() {
    const mockFetch = getGlobalFetchMock();
    const originalFetch = global.fetch;
    global.fetch = mockFetch;
    afterAll(() => {
        global.fetch = originalFetch;
    });
    return mockFetch;
}
function getFetchMockCalls(commandName) {
    return global.fetch.mock.calls.filter((c) => c[0] === `https://www.expensify.com.dev/api/${commandName}?`);
}
/**
 * Assertion helper to validate that a command has been called a specific number of times.
 */
function expectAPICommandToHaveBeenCalled(commandName, expectedCalls) {
    expect(getFetchMockCalls(commandName)).toHaveLength(expectedCalls);
}
/**
 * Assertion helper to validate that a command has been called with specific parameters.
 */
function expectAPICommandToHaveBeenCalledWith(commandName, callIndex, expectedParams) {
    const call = getFetchMockCalls(commandName).at(callIndex);
    expect(call).toBeTruthy();
    const body = call?.at(1)?.body;
    const params = body instanceof FormData ? Object.fromEntries(body) : {};
    expect(params).toEqual(expect.objectContaining(expectedParams));
}
function setPersonalDetails(login, accountID) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, {
        [accountID]: buildPersonalDetails(login, accountID),
    });
    return (0, waitForBatchedUpdates_1.default)();
}
function buildTestReportComment(created, actorAccountID, actionID = null) {
    const reportActionID = actionID ?? NumberUtils.rand64().toString();
    return {
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
        person: [{ type: 'TEXT', style: 'strong', text: 'User B' }],
        created,
        message: [{ type: 'COMMENT', html: `Comment ${actionID}`, text: `Comment ${actionID}` }],
        reportActionID,
        actorAccountID,
    };
}
function assertFormDataMatchesObject(obj, formData) {
    expect(formData).not.toBeUndefined();
    if (formData) {
        expect(Array.from(formData.entries()).reduce((acc, [key, val]) => {
            acc[key] = val;
            return acc;
        }, {})).toEqual(expect.objectContaining(obj));
    }
}
function getNavigateToChatHintRegex() {
    const hintTextPrefix = (0, Localize_1.translateLocal)('accessibilityHints.navigatesToChat');
    return new RegExp(hintTextPrefix, 'i');
}
async function navigateToSidebarOption(index) {
    const optionRow = react_native_1.screen.queryAllByAccessibilityHint(getNavigateToChatHintRegex()).at(index);
    if (!optionRow) {
        return;
    }
    (0, react_native_1.fireEvent)(optionRow, 'press');
    await (0, waitForBatchedUpdatesWithAct_1.default)();
}
/**
 * @private
 * This is a custom collator only for testing purposes.
 */
const customCollator = new Intl.Collator('en', { usage: 'sort', sensitivity: 'variant', numeric: true, caseFirst: 'upper' });
function localeCompare(a, b) {
    return customCollator.compare(a, b);
}
