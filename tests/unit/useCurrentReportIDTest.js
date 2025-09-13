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
var react_1 = require("react");
var react_native_onyx_1 = require("react-native-onyx");
var useCurrentReportID_1 = require("@hooks/useCurrentReportID");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Mock Navigation
jest.mock('@libs/Navigation/Navigation', function () { return ({
    getTopmostReportId: jest.fn(),
}); });
// Mock ReportUtils
jest.mock('@libs/ReportUtils', function () { return ({
    getReportIDFromLink: jest.fn(),
    parseReportRouteParams: jest.fn(function () { return ({ reportID: undefined }); }),
}); });
describe('useCurrentReportID', function () {
    var mockGetTopmostReportId = jest.mocked(Navigation_1.default.getTopmostReportId);
    beforeAll(function () {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(function () {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_native_onyx_1.default.clear();
                    return [4 /*yield*/, (0, waitForBatchedUpdates_1.default)()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var onSetCurrentReportID = jest.fn();
    function TestWrapper(_a) {
        var children = _a.children;
        return <useCurrentReportID_1.CurrentReportIDContextProvider onSetCurrentReportID={onSetCurrentReportID}>{children}</useCurrentReportID_1.CurrentReportIDContextProvider>;
    }
    it('should prevent updates when currentReportID === reportID', function () {
        var _a;
        // Given the hook is rendered
        var result = (0, react_native_1.renderHook)(function () { return (0, useCurrentReportID_1.default)(); }, {
            wrapper: TestWrapper,
        }).result;
        // Given the navigation state is set
        var navigationState = {
            index: 0,
            routes: [
                {
                    key: '1',
                    name: 'Report',
                    params: { reportID: '123' },
                },
            ],
        };
        mockGetTopmostReportId.mockReturnValue('123');
        // When the updateCurrentReportID is called
        (0, react_native_1.act)(function () {
            var _a;
            (_a = result.current) === null || _a === void 0 ? void 0 : _a.updateCurrentReportID(navigationState);
        });
        // Then the currentReportID is updated
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.currentReportID).toBe('123');
        expect(onSetCurrentReportID).toHaveBeenCalledWith('123');
        onSetCurrentReportID.mockClear();
        // When the updateCurrentReportID is called with the same reportID
        (0, react_native_1.act)(function () {
            var _a;
            (_a = result.current) === null || _a === void 0 ? void 0 : _a.updateCurrentReportID(navigationState);
        });
        // Then the setState should not be called again
        expect(onSetCurrentReportID).not.toHaveBeenCalled();
    });
    it('should prevent updates when both currentReportID and reportID are empty/undefined', function () {
        var _a;
        // Given the hook is rendered
        var result = (0, react_native_1.renderHook)(function () { return (0, useCurrentReportID_1.default)(); }, {
            wrapper: TestWrapper,
        }).result;
        // Given the navigation state is set
        var navigationState = {
            index: 0,
            routes: [
                {
                    key: '1',
                    name: 'Home',
                    params: {},
                },
            ],
        };
        mockGetTopmostReportId.mockReturnValue(undefined);
        // When the updateCurrentReportID is called
        (0, react_native_1.act)(function () {
            var _a;
            (_a = result.current) === null || _a === void 0 ? void 0 : _a.updateCurrentReportID(navigationState);
        });
        // Then the currentReportID is updated
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.currentReportID).toBe('');
        // When the updateCurrentReportID is called with the same navigation state
        (0, react_native_1.act)(function () {
            var _a;
            (_a = result.current) === null || _a === void 0 ? void 0 : _a.updateCurrentReportID(navigationState);
        });
        // Then the setState should not be called again
        expect(onSetCurrentReportID).not.toHaveBeenCalled();
    });
    it('should update when reportID changes', function () {
        var _a, _b;
        // Given the hook is rendered
        var result = (0, react_native_1.renderHook)(function () { return (0, useCurrentReportID_1.default)(); }, {
            wrapper: useCurrentReportID_1.CurrentReportIDContextProvider,
        }).result;
        // Given the navigation state is set
        var state1 = {
            index: 0,
            routes: [
                {
                    key: '1',
                    name: 'Report',
                    params: { reportID: '123' },
                },
            ],
        };
        var state2 = {
            index: 0,
            routes: [
                {
                    key: '1',
                    name: 'Report',
                    params: { reportID: '456' },
                },
            ],
        };
        mockGetTopmostReportId.mockReturnValueOnce('123').mockReturnValueOnce('456');
        // When the updateCurrentReportID is called
        (0, react_native_1.act)(function () {
            var _a;
            (_a = result.current) === null || _a === void 0 ? void 0 : _a.updateCurrentReportID(state1);
        });
        // Then the currentReportID is updated
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.currentReportID).toBe('123');
        // When the updateCurrentReportID is called with a different reportID
        (0, react_native_1.act)(function () {
            var _a;
            (_a = result.current) === null || _a === void 0 ? void 0 : _a.updateCurrentReportID(state2);
        });
        // Then the currentReportID is updated
        expect((_b = result.current) === null || _b === void 0 ? void 0 : _b.currentReportID).toBe('456');
    });
    it('should prevent updates when navigating to Settings screens', function () {
        var _a;
        // Given the hook is rendered
        var result = (0, react_native_1.renderHook)(function () { return (0, useCurrentReportID_1.default)(); }, {
            wrapper: useCurrentReportID_1.CurrentReportIDContextProvider,
        }).result;
        // Given the navigation state is set
        var settingsState = {
            index: 0,
            routes: [
                {
                    key: '1',
                    name: 'Settings',
                    params: {
                        screen: 'Settings_Profile',
                    },
                },
            ],
        };
        mockGetTopmostReportId.mockReturnValue('123');
        // When the updateCurrentReportID is called
        (0, react_native_1.act)(function () {
            var _a;
            (_a = result.current) === null || _a === void 0 ? void 0 : _a.updateCurrentReportID(settingsState);
        });
        // Then the currentReportID should remain unchanged
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.currentReportID).toBe('');
    });
    it('should update context value when currentReportID changes', function () {
        var _a;
        // Given the hook is rendered
        var result = (0, react_native_1.renderHook)(function () { return (0, useCurrentReportID_1.default)(); }, {
            wrapper: useCurrentReportID_1.CurrentReportIDContextProvider,
        }).result;
        // Given the navigation state is set
        var reportState = {
            index: 0,
            routes: [
                {
                    key: '1',
                    name: 'Report',
                    params: { reportID: '123' },
                },
            ],
        };
        mockGetTopmostReportId.mockReturnValue('123');
        // Given the initial context value is set
        var initialContextValue = result.current;
        // When the updateCurrentReportID is called
        (0, react_native_1.act)(function () {
            var _a;
            (_a = result.current) === null || _a === void 0 ? void 0 : _a.updateCurrentReportID(reportState);
        });
        // Then the context value is updated
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.currentReportID).toBe('123');
        expect(result.current).not.toBe(initialContextValue);
    });
});
