"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var expensify_common_1 = require("expensify-common");
var react_native_2 = require("react-native");
var react_native_onyx_1 = require("react-native-onyx");
// eslint-disable-next-line no-restricted-imports, no-restricted-syntax
var AppActions = require("@libs/actions/App");
var Session_1 = require("@libs/actions/Session");
// eslint-disable-next-line no-restricted-imports, no-restricted-syntax
var Session = require("@libs/actions/Session");
var NetworkStore_1 = require("@libs/Network/NetworkStore");
var App_1 = require("@src/App");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var reports_1 = require("../utils/collections/reports");
var TestHelper = require("../utils/TestHelper");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
var waitForNetworkPromises_1 = require("../utils/waitForNetworkPromises");
jest.mock('@libs/Navigation/AppNavigator/usePreloadFullScreenNavigators', function () { return jest.fn(); });
var TEST_USER_ACCOUNT_ID_1 = 123;
var TEST_USER_LOGIN_1 = 'test@test.com';
// cspell:disable-next-line
var TEST_AUTH_TOKEN_1 = 'asdfghjkl';
var TEST_USER_ACCOUNT_ID_2 = 456;
var TEST_USER_LOGIN_2 = 'test2@test.com';
// cspell:disable-next-line
var TEST_AUTH_TOKEN_2 = 'zxcvbnm';
jest.setTimeout(60000);
TestHelper.setupApp();
TestHelper.setupGlobalFetchMock();
var report = (0, reports_1.createRandomReport)(7);
function getInitialURL() {
    var params = new URLSearchParams();
    params.set('exitTo', "".concat(ROUTES_1.default.REPORT, "/").concat(report.reportID));
    params.set('email', TEST_USER_LOGIN_1);
    params.set('shortLivedAuthToken', TEST_AUTH_TOKEN_1);
    var deeplinkUrl = "".concat(CONST_1.default.DEEPLINK_BASE_URL, "/transition?").concat(params.toString());
    return deeplinkUrl;
}
describe('Deep linking', function () {
    var lastVisitedPath;
    var originalSignInWithShortLivedAuthToken;
    var originalOpenApp;
    beforeAll(function () {
        originalSignInWithShortLivedAuthToken = Session.signInWithShortLivedAuthToken;
        originalOpenApp = AppActions.openApp;
    });
    beforeEach(function () {
        react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.LAST_VISITED_PATH,
            callback: function (val) { return (lastVisitedPath = val); },
        });
        jest.spyOn(Session, 'signInWithShortLivedAuthToken').mockImplementation(function () {
            var _a;
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.CREDENTIALS, {
                login: TEST_USER_LOGIN_1,
                autoGeneratedLogin: expensify_common_1.Str.guid('expensify.cash-'),
                autoGeneratedPassword: expensify_common_1.Str.guid(),
            });
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, {
                validated: true,
                isUsingExpensifyCard: false,
            });
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, (_a = {},
                _a[TEST_USER_ACCOUNT_ID_1] = TestHelper.buildPersonalDetails(TEST_USER_LOGIN_1, TEST_USER_ACCOUNT_ID_1, 'Test'),
                _a));
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, {
                authToken: TEST_AUTH_TOKEN_1,
                accountID: TEST_USER_ACCOUNT_ID_1,
                email: TEST_USER_LOGIN_1,
                encryptedAuthToken: TEST_AUTH_TOKEN_1,
            });
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_PRIVATE_PUSH_NOTIFICATION_ID, 'randomID');
            return originalSignInWithShortLivedAuthToken(TEST_AUTH_TOKEN_1);
        });
        jest.spyOn(AppActions, 'openApp').mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, originalOpenApp()];
                    case 1:
                        originalResult = _a.sent();
                        return [4 /*yield*/, react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report.reportID), report)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, originalResult];
                }
            });
        }); });
    });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, react_native_onyx_1.default.clear()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, waitForNetworkPromises_1.default)()];
                case 2:
                    _a.sent();
                    jest.clearAllMocks();
                    lastVisitedPath = undefined;
                    react_native_2.Linking.setInitialURL('');
                    (0, NetworkStore_1.setLastShortAuthToken)(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not remember the report path of the last deep link login after signing out and in again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, unmount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect((0, Session_1.hasAuthToken)()).toBe(false);
                    url = getInitialURL();
                    // User signs in automatically when the app is rendered because of the deep link
                    react_native_2.Linking.setInitialURL(url);
                    unmount = (0, react_native_1.render)(<App_1.default />).unmount;
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    expect(lastVisitedPath).toBe("/".concat(ROUTES_1.default.REPORT, "/").concat(report.reportID));
                    expect((0, Session_1.hasAuthToken)()).toBe(true);
                    (0, Session_1.signOutAndRedirectToSignIn)();
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 2:
                    _a.sent();
                    expect((0, Session_1.hasAuthToken)()).toBe(false);
                    return [4 /*yield*/, TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID_2, TEST_USER_LOGIN_2, undefined, TEST_AUTH_TOKEN_2)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 4:
                    _a.sent();
                    expect(lastVisitedPath).toBeDefined();
                    expect(lastVisitedPath).not.toBe("/".concat(ROUTES_1.default.REPORT, "/").concat(report.reportID));
                    unmount();
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not reuse the last deep link and log in again when signing out', function () { return __awaiter(void 0, void 0, void 0, function () {
        var unmount1, url, unmount2, unmount3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect((0, Session_1.hasAuthToken)()).toBe(false);
                    unmount1 = (0, react_native_1.render)(<App_1.default />).unmount;
                    return [4 /*yield*/, TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID_2, TEST_USER_LOGIN_2, undefined, TEST_AUTH_TOKEN_2)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 2:
                    _a.sent();
                    expect((0, Session_1.hasAuthToken)()).toBe(true);
                    expect((0, NetworkStore_1.getCurrentUserEmail)()).toBe(TEST_USER_LOGIN_2);
                    // Unmount so we can prepare the deep link login
                    unmount1();
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 3:
                    _a.sent();
                    url = getInitialURL();
                    // User signs in automatically when the app is remounted because of the deep link.
                    // This overrides the previous sign-in.
                    react_native_2.Linking.setInitialURL(url);
                    unmount2 = (0, react_native_1.render)(<App_1.default />).unmount;
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 4:
                    _a.sent();
                    expect((0, NetworkStore_1.getCurrentUserEmail)()).toBe(TEST_USER_LOGIN_1);
                    (0, Session_1.signOutAndRedirectToSignIn)();
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 5:
                    _a.sent();
                    // In a failing scenario, remounting triggers the sign-in with the deep link again because it still remembers it.
                    // However, we've implemented a fix so that it does not reuse the last deep link.
                    unmount2();
                    unmount3 = (0, react_native_1.render)(<App_1.default />).unmount;
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 6:
                    _a.sent();
                    expect((0, Session_1.hasAuthToken)()).toBe(false);
                    unmount3();
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
