"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var portal_1 = require("@gorhom/portal");
var NativeNavigation = require("@react-navigation/native");
var react_native_1 = require("@testing-library/react-native");
var react_1 = require("react");
var react_native_onyx_1 = require("react-native-onyx");
var ComposeProviders_1 = require("@components/ComposeProviders");
var HTMLEngineProvider_1 = require("@components/HTMLEngineProvider");
var LocaleContextProvider_1 = require("@components/LocaleContextProvider");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var OptionListContextProvider_1 = require("@components/OptionListContextProvider");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var Localize_1 = require("@libs/Localize");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var PureReportActionItem_1 = require("@pages/home/report/PureReportActionItem");
var CONST_1 = require("@src/CONST");
var ReportActionUtils = require("@src/libs/ReportActionsUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
var wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
jest.mock('@react-navigation/native');
var ACTOR_ACCOUNT_ID = 123456789;
var actorEmail = 'test@test.com';
var createReportAction = function (actionName, originalMessageExtras) {
    return ({
        reportActionID: '12345',
        actorAccountID: ACTOR_ACCOUNT_ID,
        created: '2025-07-12 09:03:17.653',
        actionName: actionName,
        automatic: true,
        shouldShow: true,
        avatar: '',
        person: [{ type: 'TEXT', style: 'strong', text: 'Concierge' }],
        message: [{ type: 'COMMENT', html: 'some message', text: 'some message' }],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        originalMessage: __assign({}, originalMessageExtras),
    });
};
describe('PureReportActionItem', function () {
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        jest.spyOn(NativeNavigation, 'useRoute').mockReturnValue({ key: '', name: '' });
        jest.spyOn(ReportActionUtils, 'getIOUActionForReportID').mockImplementation(ReportActionsUtils_1.getIOUActionForReportID);
    });
    beforeEach(function () {
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        return react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false }).then(function () {
            var _a;
            return react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST), (_a = {},
                _a[ACTOR_ACCOUNT_ID] = {
                    accountID: ACTOR_ACCOUNT_ID,
                    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_9.png',
                    displayName: actorEmail,
                    login: actorEmail,
                },
                _a));
        });
    });
    afterEach(function () {
        react_native_onyx_1.default.clear();
    });
    function renderItemWithAction(action) {
        return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, HTMLEngineProvider_1.default]}>
                <OptionListContextProvider_1.default>
                    <ScreenWrapper_1.default testID="test">
                        <portal_1.PortalProvider>
                            <PureReportActionItem_1.default allReports={undefined} policies={undefined} report={undefined} reportActions={[]} parentReportAction={undefined} action={action} displayAsGroup={false} isMostRecentIOUReportAction={false} shouldDisplayNewMarker={false} index={0} isFirstVisibleReportAction={false} taskReport={undefined} linkedReport={undefined} iouReportOfLinkedReport={undefined}/>
                        </portal_1.PortalProvider>
                    </ScreenWrapper_1.default>
                </OptionListContextProvider_1.default>
            </ComposeProviders_1.default>);
    }
    describe('Automatic actions', function () {
        var testCases = [
            {
                testTitle: 'APPROVED action via workspace rules',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED,
                originalMessageExtras: { automaticAction: true },
                translationKey: 'iou.automaticallyApproved',
            },
            {
                testTitle: 'FORWARDED action via workspace rules',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED,
                originalMessageExtras: { automaticAction: true },
                translationKey: 'iou.automaticallyForwarded',
            },
            {
                testTitle: 'SUBMITTED action via harvesting',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED,
                originalMessageExtras: { harvesting: true },
                translationKey: 'iou.automaticallySubmitted',
            },
            {
                testTitle: 'SUBMITTED_AND_CLOSED action via harvesting',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED,
                originalMessageExtras: { harvesting: true },
                translationKey: 'iou.automaticallySubmitted',
            },
        ];
        var parseTextWithTrailingLink = function (translatedText) {
            var match = translatedText.match(/^(.*?)(<a[^>]*>)(.*?)(<\/a>)$/);
            if (!match) {
                return null;
            }
            var textBeforeLink = match[1], linkText = match[3];
            return { textBeforeLink: textBeforeLink, linkText: linkText };
        };
        it.each(testCases)('$testTitle', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var action, parsedText, textBeforeLink, linkText;
            var actionName = _b.actionName, originalMessageExtras = _b.originalMessageExtras, translationKey = _b.translationKey;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        action = createReportAction(actionName, originalMessageExtras);
                        renderItemWithAction(action);
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _c.sent();
                        expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
                        parsedText = parseTextWithTrailingLink((0, Localize_1.translateLocal)(translationKey));
                        if (!parsedText) {
                            throw new Error('Text cannot be parsed, translation failed');
                        }
                        textBeforeLink = parsedText.textBeforeLink, linkText = parsedText.linkText;
                        expect(react_native_1.screen.getByText(textBeforeLink)).toBeOnTheScreen();
                        expect(react_native_1.screen.getByText(linkText)).toBeOnTheScreen();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Manual actions', function () {
        it('APPROVED action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED, { automaticAction: false });
                        renderItemWithAction(action);
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
                        expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.approvedMessage'))).toBeOnTheScreen();
                        return [2 /*return*/];
                }
            });
        }); });
        it('FORWARDED action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED, { automaticAction: false });
                        renderItemWithAction(action);
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
                        expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.forwarded'))).toBeOnTheScreen();
                        return [2 /*return*/];
                }
            });
        }); });
        it('SUBMITTED action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED, { harvesting: false });
                        renderItemWithAction(action);
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
                        expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.submitted', {}))).toBeOnTheScreen();
                        return [2 /*return*/];
                }
            });
        }); });
        it('SUBMITTED action with memo', function () { return __awaiter(void 0, void 0, void 0, function () {
            var memo, action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        memo = 'memo message';
                        action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED, { harvesting: false, message: memo });
                        renderItemWithAction(action);
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
                        expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.submitted', { memo: memo }))).toBeOnTheScreen();
                        return [2 /*return*/];
                }
            });
        }); });
        it('SUBMITTED_AND_CLOSED action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED, { harvesting: false });
                        renderItemWithAction(action);
                        return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                    case 1:
                        _a.sent();
                        expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
                        expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.submitted', {}))).toBeOnTheScreen();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
