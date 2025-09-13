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
var _a, _b, _c, _d, _e, _f;
var _g;
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_native_2 = require("react-native");
var react_native_onyx_1 = require("react-native-onyx");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var ReportActionAvatars_1 = require("@components/ReportActionAvatars");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var OnyxDerived_1 = require("@userActions/OnyxDerived");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
var actions_1 = require("../../__mocks__/reportData/actions");
var personalDetails_1 = require("../../__mocks__/reportData/personalDetails");
var policies_1 = require("../../__mocks__/reportData/policies");
var reports_1 = require("../../__mocks__/reportData/reports");
var transactions_1 = require("../../__mocks__/reportData/transactions");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
/* --- UI Mocks --- */
var parseSource = function (source) {
    var _a, _b;
    if (typeof source === 'string') {
        return source;
    }
    if (typeof source === 'object' && 'name' in source) {
        return source.name;
    }
    if (typeof source === 'object' && 'uri' in source) {
        return (_a = source.uri) !== null && _a !== void 0 ? _a : 'No Source';
    }
    if (typeof source === 'function') {
        // If the source is a function, we assume it's an SVG component
        return source.name;
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return (_b = source === null || source === void 0 ? void 0 : source.toString()) !== null && _b !== void 0 ? _b : 'No Source';
};
jest.mock('@src/components/Avatar', function () {
    return function (_a) {
        var source = _a.source, name = _a.name, avatarID = _a.avatarID, _b = _a.testID, testID = _b === void 0 ? 'Avatar' : _b;
        return (<react_native_2.View dataSet={{
                name: name,
                avatarID: avatarID,
                uri: parseSource(source !== null && source !== void 0 ? source : '') || 'No Source',
                parent: testID,
            }} testID="MockedAvatarData"/>);
    };
});
jest.mock('@src/components/Icon', function () {
    return function (_a) {
        var src = _a.src, _b = _a.testID, testID = _b === void 0 ? 'Avatar' : _b;
        return (<react_native_2.View dataSet={{
                uri: parseSource(src) || 'No Source',
                parent: testID,
            }} testID="MockedIconData"/>);
    };
});
/* --- Data Mocks --- */
var LOGGED_USER_ID = reports_1.iouReportR14932.ownerAccountID;
var SECOND_USER_ID = reports_1.iouReportR14932.managerID;
var policy = __assign(__assign({}, policies_1.policy420A), { name: 'XYZ', id: 'WORKSPACE_POLICY' });
var personalPolicy = __assign(__assign({}, policies_1.policy420A), { name: 'Test user expenses', id: 'PERSONAL_POLICY', type: CONST_1.default.POLICY.TYPE.PERSONAL });
var chatReport = __assign(__assign({}, reports_1.chatReportR14932), { reportID: 'CHAT_REPORT', policyID: policy.id });
var reportChatDM = __assign(__assign({}, reports_1.chatReportR14932), { chatType: undefined, reportID: 'CHAT_REPORT_DM', policyID: personalPolicy.id });
var reportPreviewAction = __assign(__assign({}, actions_1.actionR14932), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, reportActionID: 'REPORT_PREVIEW', childReportID: 'IOU_REPORT' });
var reportPreviewDMAction = __assign(__assign({}, actions_1.actionR14932), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, reportActionID: 'REPORT_PREVIEW_DM', childReportID: 'IOU_REPORT_DM' });
var reportPreviewSingleTransactionDMAction = __assign(__assign({}, actions_1.actionR14932), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW, reportActionID: 'REPORT_PREVIEW_SINGLE_ACTION_DM', childReportID: 'IOU_REPORT_SINGLE_EXPENSE_DM', childOwnerAccountID: LOGGED_USER_ID, childManagerAccountID: SECOND_USER_ID });
var tripPreviewAction = __assign(__assign({}, actions_1.actionR14932), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.TRIP_PREVIEW, reportActionID: 'TRIP_PREVIEW', childReportID: 'IOU_REPORT_TRIP' });
var commentAction = __assign(__assign({}, actions_1.actionR14932), { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT, reportActionID: 'ADD_COMMENT' });
var iouDMReport = __assign(__assign({}, reports_1.iouReportR14932), { reportID: 'IOU_REPORT_DM', chatReportID: reportChatDM.reportID, parentReportActionID: reportPreviewDMAction.reportActionID, policyID: personalPolicy.id });
var iouDMSingleExpenseReport = __assign(__assign({}, reports_1.iouReportR14932), { reportID: 'IOU_REPORT_SINGLE_EXPENSE_DM', chatReportID: reportChatDM.reportID, parentReportActionID: reportPreviewSingleTransactionDMAction.reportActionID, policyID: personalPolicy.id });
var iouReport = __assign(__assign({}, reports_1.iouReportR14932), { reportID: 'IOU_REPORT', chatReportID: chatReport.reportID, parentReportActionID: reportPreviewAction.reportActionID, policyID: policy.id });
var iouTripReport = __assign(__assign({}, reports_1.iouReportR14932), { reportID: 'IOU_REPORT_TRIP', chatReportID: chatReport.reportID, parentReportActionID: tripPreviewAction.reportActionID, policyID: policy.id });
var iouActionOne = __assign(__assign({}, actions_1.actionR14932), { originalMessage: __assign(__assign({}, (0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932)), { IOUTransactionID: 'TRANSACTION_NUMBER_ONE', IOUReportID: iouDMReport.reportID }) });
var iouActionTwo = __assign(__assign({}, actions_1.actionR14932), { originalMessage: __assign(__assign({}, (0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932)), { IOUTransactionID: 'TRANSACTION_NUMBER_TWO', IOUReportID: iouDMReport.reportID }) });
var iouActionThree = __assign(__assign({}, actions_1.actionR14932), { originalMessage: __assign(__assign({}, (0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932)), { IOUTransactionID: 'TRANSACTION_NUMBER_THREE', IOUReportID: iouDMSingleExpenseReport.reportID }) });
var transactions = [
    __assign(__assign({}, transactions_1.transactionR14932), { reportID: iouDMReport.reportID, transactionID: 'TRANSACTION_NUMBER_ONE' }),
    __assign(__assign({}, transactions_1.transactionR14932), { reportID: iouDMReport.reportID, transactionID: 'TRANSACTION_NUMBER_TWO' }),
    __assign(__assign({}, transactions_1.transactionR14932), { reportID: iouDMSingleExpenseReport.reportID, transactionID: 'TRANSACTION_NUMBER_THREE' }),
];
var reports = [iouReport, iouTripReport, chatReport, iouDMReport, iouDMSingleExpenseReport, reportChatDM];
var policies = [policy, personalPolicy];
var DEFAULT_WORKSPACE_AVATAR = (0, ReportUtils_1.getDefaultWorkspaceAvatar)((_g = policies.at(0)) === null || _g === void 0 ? void 0 : _g.name);
var USER_AVATAR = personalDetails_1.default[LOGGED_USER_ID].avatar;
var SECOND_USER_AVATAR = personalDetails_1.default[SECOND_USER_ID].avatar;
/* --- Onyx Mocks --- */
var transactionCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, transactions, function (transaction) { return transaction.transactionID; });
var reportActionCollectionDataSet = (_a = {},
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport.reportID)] = (_b = {},
        _b[reportPreviewAction.reportActionID] = reportPreviewAction,
        _b[tripPreviewAction.reportActionID] = tripPreviewAction,
        _b[commentAction.reportActionID] = commentAction,
        _b),
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportChatDM.reportID)] = (_c = {},
        _c[reportPreviewDMAction.reportActionID] = reportPreviewDMAction,
        _c[reportPreviewSingleTransactionDMAction.reportActionID] = reportPreviewSingleTransactionDMAction,
        _c),
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportPreviewDMAction.reportID)] = (_d = {},
        _d[iouActionOne.reportActionID] = iouActionOne,
        _d[iouActionTwo.reportActionID] = iouActionTwo,
        _d),
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportPreviewSingleTransactionDMAction.reportID)] = (_e = {},
        _e[iouActionThree.reportActionID] = iouActionThree,
        _e),
    _a);
var reportCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT, reports, function (report) { return report.reportID; });
var policiesCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, policies, function (item) { return item.id; });
var onyxState = __assign(__assign(__assign(__assign((_f = {}, _f[ONYXKEYS_1.default.SESSION] = { accountID: LOGGED_USER_ID, email: personalDetails_1.default[LOGGED_USER_ID].login }, _f[ONYXKEYS_1.default.PERSONAL_DETAILS_LIST] = personalDetails_1.default, _f), policiesCollectionDataSet), transactionCollectionDataSet), reportActionCollectionDataSet), reportCollectionDataSet);
/* --- Helpers --- */
function renderAvatar(props) {
    return (0, react_native_1.render)(<OnyxListItemProvider_1.default>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ReportActionAvatars_1.default {...props}/>
        </OnyxListItemProvider_1.default>);
}
function retrieveDataFromAvatarView(props) {
    return __awaiter(this, void 0, void 0, function () {
        var images, icons, reportAvatarFragments, imageData, iconData, fragmentsData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renderAvatar(props);
                    return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 1:
                    _a.sent();
                    images = react_native_1.screen.queryAllByTestId('MockedAvatarData');
                    icons = react_native_1.screen.queryAllByTestId('MockedIconData');
                    reportAvatarFragments = react_native_1.screen.queryAllByTestId('ReportActionAvatars-', {
                        exact: false,
                    });
                    imageData = images.map(function (img) { return img.props.dataSet; });
                    iconData = icons.map(function (icon) { return icon.props.dataSet; });
                    fragmentsData = reportAvatarFragments.map(function (fragment) { return fragment.props.testID; });
                    return [2 /*return*/, {
                            images: imageData,
                            icons: iconData,
                            fragments: fragmentsData,
                        }];
            }
        });
    });
}
function isSubscriptAvatarRendered(_a) {
    var images = _a.images, fragments = _a.fragments, workspaceIconAsPrimaryAvatar = _a.workspaceIconAsPrimaryAvatar, _b = _a.negate, negate = _b === void 0 ? false : _b;
    var isEveryAvatarFragmentASubscript = fragments.every(function (fragment) { return fragment.startsWith('ReportActionAvatars-Subscript'); }) && fragments.length !== 0;
    var isUserAvatarCorrect = images.some(function (image) { return image.uri === USER_AVATAR && image.parent === "ReportActionAvatars-Subscript-".concat(workspaceIconAsPrimaryAvatar ? 'SecondaryAvatar' : 'MainAvatar'); });
    var isWorkspaceAvatarCorrect = images.some(function (image) { return image.uri === DEFAULT_WORKSPACE_AVATAR.name && image.parent === "ReportActionAvatars-Subscript-".concat(workspaceIconAsPrimaryAvatar ? 'MainAvatar' : 'SecondaryAvatar'); });
    expect(isEveryAvatarFragmentASubscript).toBe(!negate);
    expect(isWorkspaceAvatarCorrect).toBe(!negate);
    expect(isUserAvatarCorrect).toBe(!negate);
}
function isMultipleAvatarRendered(_a) {
    var images = _a.images, fragments = _a.fragments, workspaceIconAsPrimaryAvatar = _a.workspaceIconAsPrimaryAvatar, _b = _a.negate, negate = _b === void 0 ? false : _b, secondUserAvatar = _a.secondUserAvatar, stacked = _a.stacked;
    var isEveryAvatarFragmentAMultiple = fragments.every(function (fragment) { return fragment.startsWith('ReportActionAvatars-MultipleAvatars'); }) && fragments.length !== 0;
    var isUserAvatarCorrect = images.some(function (image) {
        return image.uri === USER_AVATAR &&
            image.parent ===
                (stacked
                    ? 'ReportActionAvatars-MultipleAvatars-StackedHorizontally-Avatar'
                    : "ReportActionAvatars-MultipleAvatars-".concat(workspaceIconAsPrimaryAvatar ? 'SecondaryAvatar' : 'MainAvatar'));
    });
    var isWorkspaceAvatarCorrect = images.some(function (image) {
        return image.uri === (secondUserAvatar !== null && secondUserAvatar !== void 0 ? secondUserAvatar : DEFAULT_WORKSPACE_AVATAR.name) &&
            image.parent ===
                (stacked
                    ? 'ReportActionAvatars-MultipleAvatars-StackedHorizontally-Avatar'
                    : "ReportActionAvatars-MultipleAvatars-".concat(workspaceIconAsPrimaryAvatar ? 'MainAvatar' : 'SecondaryAvatar'));
    });
    expect(isEveryAvatarFragmentAMultiple).toBe(!negate);
    expect(isWorkspaceAvatarCorrect).toBe(!negate);
    expect(isUserAvatarCorrect).toBe(!negate);
}
function isSingleAvatarRendered(_a) {
    var images = _a.images, _b = _a.negate, negate = _b === void 0 ? false : _b, userAvatar = _a.userAvatar;
    var isUserAvatarCorrect = images.some(function (image) { return image.uri === (userAvatar !== null && userAvatar !== void 0 ? userAvatar : USER_AVATAR) && image.parent === 'ReportActionAvatars-SingleAvatar'; });
    expect(isUserAvatarCorrect).toBe(!negate);
}
describe('ReportActionAvatars', function () {
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: onyxState,
        });
        (0, OnyxDerived_1.default)();
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, react_native_onyx_1.default.clear()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('renders properly subscript avatars', function () {
        it('renders user primary avatar and workspace subscript next to report preview action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ reportID: iouReport.reportID })];
                    case 1:
                        retrievedData = _a.sent();
                        isSubscriptAvatarRendered(retrievedData);
                        return [2 /*return*/];
                }
            });
        }); });
        it('renders workspace avatar with user subscript avatar on chat report view', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ reportID: chatReport.reportID })];
                    case 1:
                        retrievedData = _a.sent();
                        isSubscriptAvatarRendered(__assign(__assign({}, retrievedData), { workspaceIconAsPrimaryAvatar: true }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('renders user primary avatar and workspace subscript next to the trip preview', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ reportID: iouTripReport.reportID })];
                    case 1:
                        retrievedData = _a.sent();
                        isSubscriptAvatarRendered(retrievedData);
                        return [2 /*return*/];
                }
            });
        }); });
        it('renders subscript avatar if the report preview action is provided instead of report ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ action: reportPreviewAction })];
                    case 1:
                        retrievedData = _a.sent();
                        isSubscriptAvatarRendered(retrievedData);
                        return [2 /*return*/];
                }
            });
        }); });
        it("doesn't render subscript for user message in workspace if they are text messages", function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ action: commentAction, reportID: iouReport.reportID })];
                    case 1:
                        retrievedData = _a.sent();
                        isSubscriptAvatarRendered(__assign(__assign({}, retrievedData), { negate: true }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('properly converts subscript avatars to multiple avatars if the avatars are stacked horizontally', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ reportID: iouReport.reportID, horizontalStacking: true })];
                    case 1:
                        retrievedData = _a.sent();
                        isSubscriptAvatarRendered(__assign(__assign({}, retrievedData), { negate: true }));
                        isMultipleAvatarRendered(__assign(__assign({}, retrievedData), { stacked: true }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('renders properly multiple and single avatars', function () {
        it('renders single avatar if only one account ID is passed even if reportID & action is passed as well', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({
                            reportID: iouReport.reportID,
                            action: reportPreviewAction,
                            accountIDs: [SECOND_USER_ID],
                        })];
                    case 1:
                        retrievedData = _a.sent();
                        isMultipleAvatarRendered(__assign(__assign({}, retrievedData), { negate: true }));
                        isSingleAvatarRendered(__assign(__assign({}, retrievedData), { userAvatar: SECOND_USER_AVATAR }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('renders multiple avatars if more than one account ID is passed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ accountIDs: [LOGGED_USER_ID, SECOND_USER_ID] })];
                    case 1:
                        retrievedData = _a.sent();
                        isMultipleAvatarRendered(__assign(__assign({}, retrievedData), { secondUserAvatar: SECOND_USER_AVATAR }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('renders diagonal avatar if both DM chat members sent expense to each other in one report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ reportID: iouDMReport.reportID })];
                    case 1:
                        retrievedData = _a.sent();
                        isMultipleAvatarRendered(__assign(__assign({}, retrievedData), { secondUserAvatar: SECOND_USER_AVATAR, workspaceIconAsPrimaryAvatar: true }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('renders single avatar if only one chat member sent an expense to the other', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ reportID: iouDMSingleExpenseReport.reportID })];
                    case 1:
                        retrievedData = _a.sent();
                        isSingleAvatarRendered(retrievedData);
                        return [2 /*return*/];
                }
            });
        }); });
        it('renders workspace avatar if policyID is passed as a prop', function () { return __awaiter(void 0, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, retrieveDataFromAvatarView({ policyID: policy.id })];
                    case 1:
                        retrievedData = _a.sent();
                        isSingleAvatarRendered(__assign(__assign({}, retrievedData), { userAvatar: (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy.name).name }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
