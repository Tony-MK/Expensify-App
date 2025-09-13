"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
const ReportActionsView_1 = require("@pages/home/report/ReportActionsView");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const mockUseIsFocused = jest.fn().mockReturnValue(false);
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        useIsFocused: () => mockUseIsFocused(),
        useRoute: jest.fn(),
        useNavigationState: jest.fn(),
        createNavigationContainerRef: () => ({
            getState: () => jest.fn(),
        }),
    };
});
jest.mock('@hooks/useNetwork', () => jest.fn());
jest.mock('@hooks/useOnyx', () => jest.fn());
jest.mock('@hooks/useResponsiveLayout', () => jest.fn());
jest.mock('@hooks/useTransactionsAndViolationsForReport', () => jest.fn());
const mockUseNetwork = useNetwork_1.default;
const mockUseOnyx = useOnyx_1.default;
const mockUseResponsiveLayout = useResponsiveLayout_1.default;
const mockUseTransactionsAndViolationsForReport = useTransactionsAndViolationsForReport_1.default;
jest.mock('@hooks/useCopySelectionHelper', () => jest.fn());
jest.mock('@hooks/useLoadReportActions', () => jest.fn(() => ({
    loadOlderChats: jest.fn(),
    loadNewerChats: jest.fn(),
})));
jest.mock('@hooks/usePrevious', () => jest.fn());
jest.mock('@pages/home/report/ReportActionsList', () => jest.fn(({ sortedReportActions }) => {
    if (sortedReportActions && sortedReportActions.length > 0) {
        return null; // Simulate normal content
    }
    return null;
}));
jest.mock('@pages/home/report/UserTypingEventListener', () => jest.fn(() => null));
jest.mock('@libs/actions/Report', () => ({
    updateLoadingInitialReportAction: jest.fn(),
}));
// Mock report data
const mockReport = {
    reportID: '123',
    reportName: 'Test Report',
    chatReportID: '456',
    ownerAccountID: 123,
    lastVisibleActionCreated: '2023-01-01',
    total: 0,
};
const mockReportActions = [
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
const renderReportActionsView = (props = {}) => {
    const defaultProps = {
        report: mockReport,
        reportActions: mockReportActions,
        parentReportAction: null,
        isLoadingInitialReportActions: false,
        hasNewerActions: false,
        hasOlderActions: false,
        ...props,
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (0, react_native_1.render)(<ReportActionsView_1.default {...defaultProps}/>);
};
describe('ReportActionsView', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
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
        mockUseOnyx.mockImplementation((key) => {
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
    afterEach(async () => {
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        await react_native_onyx_1.default.clear();
    });
    describe('Skeleton Loading States', () => {
        it('should show skeleton when shouldShowSkeletonForAppLoad is true (isLoadingApp is true and isOffline is false)', () => {
            mockUseNetwork.mockReturnValue({
                isOffline: false,
            });
            mockUseOnyx.mockImplementation((key) => {
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
        it('should not show skeleton when shouldShowSkeletonForAppLoad is false (isLoadingApp is false and isOffline is false)', () => {
            mockUseNetwork.mockReturnValue({
                isOffline: false,
            });
            mockUseOnyx.mockImplementation((key) => {
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
        it('should not show skeleton when shouldShowSkeletonForAppLoad is false (isLoadingApp is true and isOffline is true)', () => {
            mockUseNetwork.mockReturnValue({
                isOffline: true,
            });
            mockUseOnyx.mockImplementation((key) => {
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
        it('should not show skeleton when both isLoadingApp is false and isOffline is true', () => {
            mockUseNetwork.mockReturnValue({
                isOffline: true,
            });
            mockUseOnyx.mockImplementation((key) => {
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
