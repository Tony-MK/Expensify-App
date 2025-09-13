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
var react_native_1 = require("@testing-library/react-native");
var react_1 = require("react");
var react_native_onyx_1 = require("react-native-onyx");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
var ReportActionsView_1 = require("@pages/home/report/ReportActionsView");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
var mockUseIsFocused = jest.fn().mockReturnValue(false);
jest.mock('@react-navigation/native', function () {
    var actualNav = jest.requireActual('@react-navigation/native');
    return __assign(__assign({}, actualNav), { 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        useIsFocused: function () { return mockUseIsFocused(); }, useRoute: jest.fn(), useNavigationState: jest.fn(), createNavigationContainerRef: function () { return ({
            getState: function () { return jest.fn(); },
        }); } });
});
jest.mock('@hooks/useNetwork', function () { return jest.fn(); });
jest.mock('@hooks/useOnyx', function () { return jest.fn(); });
jest.mock('@hooks/useResponsiveLayout', function () { return jest.fn(); });
jest.mock('@hooks/useTransactionsAndViolationsForReport', function () { return jest.fn(); });
var mockUseNetwork = useNetwork_1.default;
var mockUseOnyx = useOnyx_1.default;
var mockUseResponsiveLayout = useResponsiveLayout_1.default;
var mockUseTransactionsAndViolationsForReport = useTransactionsAndViolationsForReport_1.default;
jest.mock('@hooks/useCopySelectionHelper', function () { return jest.fn(); });
jest.mock('@hooks/useLoadReportActions', function () {
    return jest.fn(function () { return ({
        loadOlderChats: jest.fn(),
        loadNewerChats: jest.fn(),
    }); });
});
jest.mock('@hooks/usePrevious', function () { return jest.fn(); });
jest.mock('@pages/home/report/ReportActionsList', function () {
    return jest.fn(function (_a) {
        var sortedReportActions = _a.sortedReportActions;
        if (sortedReportActions && sortedReportActions.length > 0) {
            return null; // Simulate normal content
        }
        return null;
    });
});
jest.mock('@pages/home/report/UserTypingEventListener', function () { return jest.fn(function () { return null; }); });
jest.mock('@libs/actions/Report', function () { return ({
    updateLoadingInitialReportAction: jest.fn(),
}); });
// Mock report data
var mockReport = {
    reportID: '123',
    reportName: 'Test Report',
    chatReportID: '456',
    ownerAccountID: 123,
    lastVisibleActionCreated: '2023-01-01',
    total: 0,
};
var mockReportActions = [
    {
        reportActionID: '1',
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
        created: '2023-01-01',
        actorAccountID: 123,
        message: [{ type: 'COMMENT', html: 'Test message', text: 'Test message' }],
        originalMessage: {},
        shouldShow: true,
        person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
        pendingAction: null,
        errors: {},
    },
    {
        reportActionID: '2',
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
        created: '2023-01-02',
        actorAccountID: 124,
        message: [{ type: 'COMMENT', html: 'Another message', text: 'Another message' }],
        originalMessage: {},
        shouldShow: true,
        person: [{ type: 'TEXT', style: 'strong', text: 'Another User' }],
        pendingAction: null,
        errors: {},
    },
];
var renderReportActionsView = function (props) {
    if (props === void 0) { props = {}; }
    var defaultProps = __assign({ report: mockReport, reportActions: mockReportActions, parentReportAction: null, isLoadingInitialReportActions: false, hasNewerActions: false, hasOlderActions: false }, props);
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (0, react_native_1.render)(<ReportActionsView_1.default {...defaultProps}/>);
};
describe('ReportActionsView', function () {
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(function () {
        jest.clearAllMocks();
        mockUseResponsiveLayout.mockReturnValue({
            shouldUseNarrowLayout: false,
            isSmallScreenWidth: false,
            isInNarrowPaneModal: false,
            isExtraSmallScreenHeight: false,
            isMediumScreenWidth: false,
            isLargeScreenWidth: true,
            isExtraLargeScreenWidth: false,
            isExtraSmallScreenWidth: false,
            isSmallScreen: false,
            onboardingIsMediumOrLargerScreenWidth: true,
        });
        mockUseTransactionsAndViolationsForReport.mockReturnValue({
            transactions: {},
            violations: {},
        });
        mockUseOnyx.mockImplementation(function (key) {
            if (key === ONYXKEYS_1.default.IS_LOADING_APP) {
                return [false, { status: 'loaded' }];
            }
            if (key === ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING) {
                return [false, { status: 'loaded' }];
            }
            if (key.includes('reportActions')) {
                return [[], { status: 'loaded' }];
            }
            if (key.includes('report')) {
                return [undefined, { status: 'loaded' }];
            }
            return [undefined, { status: 'loaded' }];
        });
    });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, waitForBatchedUpdatesWithAct_1.default)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_native_onyx_1.default.clear()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Skeleton Loading States', function () {
        it('should show skeleton when shouldShowSkeletonForAppLoad is true (isLoadingApp is true and isOffline is false)', function () {
            mockUseNetwork.mockReturnValue({
                isOffline: false,
            });
            mockUseOnyx.mockImplementation(function (key) {
                if (key === ONYXKEYS_1.default.IS_LOADING_APP) {
                    return [true, { status: 'loaded' }];
                }
                if (key === ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING) {
                    return [false, { status: 'loaded' }];
                }
                if (key.includes('reportActions')) {
                    return [[], { status: 'loaded' }];
                }
                if (key.includes('report')) {
                    return [undefined, { status: 'loaded' }];
                }
                return [undefined, { status: 'loaded' }];
            });
            // Empty report actions to trigger isMissingReportActions condition
            renderReportActionsView({
                reportActions: [],
            });
            expect(react_native_1.screen.getByTestId('ReportActionsSkeletonView')).toBeTruthy();
        });
        it('should not show skeleton when shouldShowSkeletonForAppLoad is false (isLoadingApp is false and isOffline is false)', function () {
            mockUseNetwork.mockReturnValue({
                isOffline: false,
            });
            mockUseOnyx.mockImplementation(function (key) {
                if (key === ONYXKEYS_1.default.IS_LOADING_APP) {
                    return [false, { status: 'loaded' }];
                }
                if (key === ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING) {
                    return [false, { status: 'loaded' }];
                }
                if (key.includes('reportActions')) {
                    return [[], { status: 'loaded' }];
                }
                if (key.includes('report')) {
                    return [undefined, { status: 'loaded' }];
                }
                return [undefined, { status: 'loaded' }];
            });
            renderReportActionsView();
            expect(react_native_1.screen.queryByTestId('ReportActionsSkeletonView')).toBeNull();
        });
        it('should not show skeleton when shouldShowSkeletonForAppLoad is false (isLoadingApp is true and isOffline is true)', function () {
            mockUseNetwork.mockReturnValue({
                isOffline: true,
            });
            mockUseOnyx.mockImplementation(function (key) {
                if (key === ONYXKEYS_1.default.IS_LOADING_APP) {
                    return [true, { status: 'loaded' }];
                }
                if (key === ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING) {
                    return [false, { status: 'loaded' }];
                }
                if (key.includes('reportActions')) {
                    return [[], { status: 'loaded' }];
                }
                if (key.includes('report')) {
                    return [undefined, { status: 'loaded' }];
                }
                return [undefined, { status: 'loaded' }];
            });
            renderReportActionsView();
            expect(react_native_1.screen.queryByTestId('ReportActionsSkeletonView')).toBeNull();
        });
        it('should not show skeleton when both isLoadingApp is false and isOffline is true', function () {
            mockUseNetwork.mockReturnValue({
                isOffline: true,
            });
            mockUseOnyx.mockImplementation(function (key) {
                if (key === ONYXKEYS_1.default.IS_LOADING_APP) {
                    return [false, { status: 'loaded' }];
                }
                if (key === ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING) {
                    return [false, { status: 'loaded' }];
                }
                if (key.includes('reportActions')) {
                    return [[], { status: 'loaded' }];
                }
                if (key.includes('report')) {
                    return [undefined, { status: 'loaded' }];
                }
                return [undefined, { status: 'loaded' }];
            });
            renderReportActionsView();
            expect(react_native_1.screen.queryByTestId('ReportActionsSkeletonView')).toBeNull();
        });
    });
});
