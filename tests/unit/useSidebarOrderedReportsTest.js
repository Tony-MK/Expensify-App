"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
const SidebarUtils_1 = require("@libs/SidebarUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Mock dependencies
jest.mock('@libs/SidebarUtils', () => ({
    sortReportsToDisplayInLHN: jest.fn(),
    getReportsToDisplayInLHN: jest.fn(),
    updateReportsToDisplayInLHN: jest.fn(),
}));
jest.mock('@libs/Navigation/Navigation', () => ({
    getTopmostReportId: jest.fn(),
}));
jest.mock('@libs/ReportUtils', () => ({
    parseReportRouteParams: jest.fn(() => ({ reportID: undefined })),
    getReportIDFromLink: jest.fn(() => ''),
}));
const mockSidebarUtils = SidebarUtils_1.default;
describe('useSidebarOrderedReports', () => {
    beforeAll(async () => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        // Set up basic session data
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
            accountID: 12345,
            email: 'test@example.com',
            authTokenType: CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS,
        });
        return (0, waitForBatchedUpdates_1.default)();
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        // Set up basic session data for each test
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
            accountID: 12345,
            email: 'test@example.com',
            authTokenType: CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS,
        });
        // Set up required Onyx data that the hook depends on
        await react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.NVP_PRIORITY_MODE]: CONST_1.default.PRIORITY_MODE.DEFAULT,
            [ONYXKEYS_1.default.COLLECTION.REPORT]: {},
            [ONYXKEYS_1.default.COLLECTION.POLICY]: {},
            [ONYXKEYS_1.default.COLLECTION.TRANSACTION]: {},
            [ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS]: {},
            [ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS]: {},
            [ONYXKEYS_1.default.BETAS]: [],
            [ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES]: { reports: {} },
        });
        // Default mock implementations
        mockSidebarUtils.getReportsToDisplayInLHN.mockImplementation(() => ({}));
        mockSidebarUtils.updateReportsToDisplayInLHN.mockImplementation((prev) => prev);
        mockSidebarUtils.sortReportsToDisplayInLHN.mockReturnValue([]);
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterAll(async () => {
        react_native_onyx_1.default.clear();
        await (0, waitForBatchedUpdates_1.default)();
    });
    const createMockReports = (reports) => {
        const mockReports = {};
        Object.entries(reports).forEach(([key, report]) => {
            const reportId = key.replace('report', '');
            mockReports[reportId] = {
                reportID: reportId,
                reportName: `Report ${reportId}`,
                lastVisibleActionCreated: '2024-01-01 10:00:00',
                type: CONST_1.default.REPORT.TYPE.CHAT,
                ...report,
            };
        });
        return mockReports;
    };
    let currentReportIDForTestsValue;
    function TestWrapper({ children }) {
        return (<OnyxListItemProvider_1.default>
                <useCurrentReportID_1.CurrentReportIDContextProvider>
                    <useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider currentReportIDForTests={currentReportIDForTestsValue}>{children}</useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider>
                </useCurrentReportID_1.CurrentReportIDContextProvider>
            </OnyxListItemProvider_1.default>);
    }
    it('should prevent unnecessary re-renders when reports have same content but different references', () => {
        // Given reports with same content but different object references
        const reportsContent = {
            report1: { reportName: 'Chat 1', lastVisibleActionCreated: '2024-01-01 10:00:00' },
            report2: { reportName: 'Chat 2', lastVisibleActionCreated: '2024-01-01 11:00:00' },
        };
        // When the initial reports are set
        const initialReports = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(initialReports);
        mockSidebarUtils.updateReportsToDisplayInLHN.mockImplementation((prev) => ({ ...prev }));
        currentReportIDForTestsValue = '1';
        // When the hook is rendered
        const { rerender } = (0, react_native_1.renderHook)(() => (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(), {
            wrapper: TestWrapper,
        });
        // Then the mock calls are cleared
        mockSidebarUtils.sortReportsToDisplayInLHN.mockClear();
        // When the reports are updated
        const newReportsWithSameContent = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(newReportsWithSameContent);
        rerender({});
        // Then sortReportsToDisplayInLHN should not be called again since deep comparison shows no change
        expect(mockSidebarUtils.sortReportsToDisplayInLHN).not.toHaveBeenCalled();
    });
    it('should trigger re-render when reports content actually changes', async () => {
        // Given the initial reports are set
        const initialReports = createMockReports({
            report1: { reportName: 'Chat 1' },
            report2: { reportName: 'Chat 2' },
        });
        // When the reports are updated
        const updatedReports = createMockReports({
            report1: { reportName: 'Chat 1 Updated' }, // Content changed
            report2: { reportName: 'Chat 2' },
            report3: { reportName: 'Chat 3' }, // New report added
        });
        // Then the initial reports are set
        await react_native_onyx_1.default.multiSet({
            [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: initialReports['1'],
            [`${ONYXKEYS_1.default.COLLECTION.REPORT}2`]: initialReports['2'],
        });
        // When the mock is updated
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(initialReports);
        // When the hook is rendered
        const { rerender } = (0, react_native_1.renderHook)(() => (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(), {
            wrapper: TestWrapper,
        });
        await (0, waitForBatchedUpdates_1.default)();
        // Then the mock calls are cleared
        mockSidebarUtils.sortReportsToDisplayInLHN.mockClear();
        // When the mock is updated
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(updatedReports);
        // When the priority mode is changed
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PRIORITY_MODE, CONST_1.default.PRIORITY_MODE.GSD);
        rerender({});
        await (0, waitForBatchedUpdates_1.default)();
        // Then sortReportsToDisplayInLHN should be called with the updated reports
        expect(mockSidebarUtils.sortReportsToDisplayInLHN).toHaveBeenCalledWith(updatedReports, expect.any(String), // priorityMode
        expect.any(Function), // localeCompare
        expect.any(Object), // reportNameValuePairs
        expect.any(Object));
    });
    it('should handle empty reports correctly with deep comparison', async () => {
        // Given the initial reports are set
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue({});
        // When the hook is rendered
        const { rerender } = (0, react_native_1.renderHook)(() => (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(), {
            wrapper: TestWrapper,
        });
        await (0, waitForBatchedUpdates_1.default)();
        // Then the mock calls are cleared
        mockSidebarUtils.sortReportsToDisplayInLHN.mockClear();
        // When the mock is updated
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue({});
        rerender({});
        await (0, waitForBatchedUpdates_1.default)();
        // Then sortReportsToDisplayInLHN should not be called again since reports are empty
        expect(mockSidebarUtils.sortReportsToDisplayInLHN).not.toHaveBeenCalled();
    });
    it('should maintain referential stability across multiple renders with same content', () => {
        // Given the initial reports are set
        const reportsContent = {
            report1: { reportName: 'Stable Chat' },
        };
        // When the initial reports are set
        const initialReports = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(initialReports);
        mockSidebarUtils.sortReportsToDisplayInLHN.mockReturnValue(['1']);
        currentReportIDForTestsValue = '1';
        const { rerender } = (0, react_native_1.renderHook)(() => (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(), {
            wrapper: TestWrapper,
        });
        // When the mock is updated
        const newReportsWithSameContent = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(newReportsWithSameContent);
        rerender({});
        currentReportIDForTestsValue = '2';
        // When the mock is updated
        const thirdReportsWithSameContent = createMockReports(reportsContent);
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(thirdReportsWithSameContent);
        rerender({});
        currentReportIDForTestsValue = '3';
        // Then sortReportsToDisplayInLHN should be called only once (initial render)
        expect(mockSidebarUtils.sortReportsToDisplayInLHN).toHaveBeenCalledTimes(1);
    });
    it('should handle priority mode changes correctly with deep comparison', async () => {
        // Given the initial reports are set
        const reports = createMockReports({
            report1: { reportName: 'Chat A' },
            report2: { reportName: 'Chat B' },
        });
        mockSidebarUtils.getReportsToDisplayInLHN.mockReturnValue(reports);
        currentReportIDForTestsValue = '1';
        // When the hook is rendered
        const { rerender } = (0, react_native_1.renderHook)(() => (0, useSidebarOrderedReports_1.useSidebarOrderedReports)(), {
            wrapper: TestWrapper,
        });
        await (0, waitForBatchedUpdates_1.default)();
        // Then the mock calls are cleared
        mockSidebarUtils.sortReportsToDisplayInLHN.mockClear();
        currentReportIDForTestsValue = '2';
        // When the priority mode is changed
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PRIORITY_MODE, CONST_1.default.PRIORITY_MODE.GSD);
        rerender({});
        await (0, waitForBatchedUpdates_1.default)();
        // Then sortReportsToDisplayInLHN should be called when priority mode changes
        expect(mockSidebarUtils.sortReportsToDisplayInLHN).toHaveBeenCalled();
    });
});
