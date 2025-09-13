"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Mock Navigation
jest.mock('@libs/Navigation/Navigation', () => ({
    getTopmostReportId: jest.fn(),
}));
// Mock ReportUtils
jest.mock('@libs/ReportUtils', () => ({
    getReportIDFromLink: jest.fn(),
    parseReportRouteParams: jest.fn(() => ({ reportID: undefined })),
}));
describe('useCurrentReportID', () => {
    const mockGetTopmostReportId = jest.mocked(Navigation_1.default.getTopmostReportId);
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterAll(async () => {
        react_native_onyx_1.default.clear();
        await (0, waitForBatchedUpdates_1.default)();
    });
    const onSetCurrentReportID = jest.fn();
    function TestWrapper({ children }) {
        return <useCurrentReportID_1.CurrentReportIDContextProvider onSetCurrentReportID={onSetCurrentReportID}>{children}</useCurrentReportID_1.CurrentReportIDContextProvider>;
    }
    it('should prevent updates when currentReportID === reportID', () => {
        // Given the hook is rendered
        const { result } = (0, react_native_1.renderHook)(() => (0, useCurrentReportID_1.default)(), {
            wrapper: TestWrapper,
        });
        // Given the navigation state is set
        const navigationState = {
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
        (0, react_native_1.act)(() => {
            result.current?.updateCurrentReportID(navigationState);
        });
        // Then the currentReportID is updated
        expect(result.current?.currentReportID).toBe('123');
        expect(onSetCurrentReportID).toHaveBeenCalledWith('123');
        onSetCurrentReportID.mockClear();
        // When the updateCurrentReportID is called with the same reportID
        (0, react_native_1.act)(() => {
            result.current?.updateCurrentReportID(navigationState);
        });
        // Then the setState should not be called again
        expect(onSetCurrentReportID).not.toHaveBeenCalled();
    });
    it('should prevent updates when both currentReportID and reportID are empty/undefined', () => {
        // Given the hook is rendered
        const { result } = (0, react_native_1.renderHook)(() => (0, useCurrentReportID_1.default)(), {
            wrapper: TestWrapper,
        });
        // Given the navigation state is set
        const navigationState = {
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
        (0, react_native_1.act)(() => {
            result.current?.updateCurrentReportID(navigationState);
        });
        // Then the currentReportID is updated
        expect(result.current?.currentReportID).toBe('');
        // When the updateCurrentReportID is called with the same navigation state
        (0, react_native_1.act)(() => {
            result.current?.updateCurrentReportID(navigationState);
        });
        // Then the setState should not be called again
        expect(onSetCurrentReportID).not.toHaveBeenCalled();
    });
    it('should update when reportID changes', () => {
        // Given the hook is rendered
        const { result } = (0, react_native_1.renderHook)(() => (0, useCurrentReportID_1.default)(), {
            wrapper: useCurrentReportID_1.CurrentReportIDContextProvider,
        });
        // Given the navigation state is set
        const state1 = {
            index: 0,
            routes: [
                {
                    key: '1',
                    name: 'Report',
                    params: { reportID: '123' },
                },
            ],
        };
        const state2 = {
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
        (0, react_native_1.act)(() => {
            result.current?.updateCurrentReportID(state1);
        });
        // Then the currentReportID is updated
        expect(result.current?.currentReportID).toBe('123');
        // When the updateCurrentReportID is called with a different reportID
        (0, react_native_1.act)(() => {
            result.current?.updateCurrentReportID(state2);
        });
        // Then the currentReportID is updated
        expect(result.current?.currentReportID).toBe('456');
    });
    it('should prevent updates when navigating to Settings screens', () => {
        // Given the hook is rendered
        const { result } = (0, react_native_1.renderHook)(() => (0, useCurrentReportID_1.default)(), {
            wrapper: useCurrentReportID_1.CurrentReportIDContextProvider,
        });
        // Given the navigation state is set
        const settingsState = {
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
        (0, react_native_1.act)(() => {
            result.current?.updateCurrentReportID(settingsState);
        });
        // Then the currentReportID should remain unchanged
        expect(result.current?.currentReportID).toBe('');
    });
    it('should update context value when currentReportID changes', () => {
        // Given the hook is rendered
        const { result } = (0, react_native_1.renderHook)(() => (0, useCurrentReportID_1.default)(), {
            wrapper: useCurrentReportID_1.CurrentReportIDContextProvider,
        });
        // Given the navigation state is set
        const reportState = {
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
        const initialContextValue = result.current;
        // When the updateCurrentReportID is called
        (0, react_native_1.act)(() => {
            result.current?.updateCurrentReportID(reportState);
        });
        // Then the context value is updated
        expect(result.current?.currentReportID).toBe('123');
        expect(result.current).not.toBe(initialContextValue);
    });
});
