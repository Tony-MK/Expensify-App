"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SearchContext_1 = require("@components/Search/SearchContext");
const ReportListItemHeader_1 = require("@components/SelectionList/Search/ReportListItemHeader");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@components/ConfirmedRoute.tsx');
jest.mock('@libs/Navigation/Navigation');
jest.mock('@components/AvatarWithDisplayName.tsx');
// Mock search context
const mockSearchContext = {
    currentSearchHash: 12345,
    selectedReports: {},
    selectedTransactionIDs: [],
    selectedTransactions: {},
    isOnSearch: false,
    shouldTurnOffSelectionMode: false,
    setSelectedReports: jest.fn(),
    clearSelectedTransactions: jest.fn(),
    setLastSearchType: jest.fn(),
    setCurrentSearchHashAndKey: jest.fn(),
    setSelectedTransactions: jest.fn(),
    setShouldShowFiltersBarLoading: jest.fn(),
    shouldShowSelectAllMatchingItems: jest.fn(),
    selectAllMatchingItems: jest.fn(),
};
const mockPersonalDetails = {
    john: {
        accountID: 1,
        displayName: 'John Doe',
        login: 'john.doe@example.com',
        avatar: 'https://example.com/avatar1.jpg',
    },
    jane: {
        accountID: 2,
        displayName: 'Jane Smith',
        login: 'jane.smith@example.com',
        avatar: 'https://example.com/avatar2.jpg',
    },
    fake: {
        accountID: 0,
        displayName: '',
        login: '',
        avatar: '',
    },
};
const mockPolicy = (0, policies_1.default)(1);
const createReportListItem = (type, from, to, options = {}) => ({
    shouldAnimateInHighlight: false,
    action: 'view',
    chatReportID: '123',
    created: '2024-01-01',
    currency: 'USD',
    isOneTransactionReport: false,
    isPolicyExpenseChat: false,
    isWaitingOnBankAccount: false,
    nonReimbursableTotal: 0,
    policyID: mockPolicy.id,
    private_isArchived: '',
    reportID: '789',
    reportName: 'Test Report',
    stateNum: 1,
    statusNum: 1,
    total: 100,
    type,
    unheldTotal: 100,
    keyForList: '789',
    // @ts-expect-error - Intentionally allowing undefined for testing edge cases
    from: from ? mockPersonalDetails[from] : undefined,
    // @ts-expect-error - Intentionally allowing undefined for testing edge cases
    to: to ? mockPersonalDetails[to] : undefined,
    transactions: [],
    ...options,
});
// Helper function to wrap component with context
const renderReportListItemHeader = (reportItem) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            {/* @ts-expect-error - Disable TypeScript errors to simplify the test */}
            <SearchContext_1.Context.Provider value={mockSearchContext}>
                <ReportListItemHeader_1.default report={reportItem} onSelectRow={jest.fn()} onCheckboxPress={jest.fn()} isDisabled={false} canSelectMultiple={false}/>
            </SearchContext_1.Context.Provider>
        </ComposeProviders_1.default>);
};
describe('ReportListItemHeader', () => {
    beforeAll(() => react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
        evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
    }));
    afterEach(async () => {
        await react_native_onyx_1.default.clear();
        jest.clearAllMocks();
    });
    describe('UserInfoCellsWithArrow', () => {
        describe('when report type is IOU', () => {
            it('should display both submitter and recipient if both are present', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.IOU, 'john', 'jane');
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.getByText('John Doe')).toBeOnTheScreen();
                expect(react_native_1.screen.getByText('Jane Smith')).toBeOnTheScreen();
            });
            it('should not display submitter and recipient if only submitter is present', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.IOU, 'john', undefined);
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.queryByText('John Doe')).not.toBeOnTheScreen();
                expect(react_native_1.screen.queryByTestId('ArrowRightLong Icon')).not.toBeOnTheScreen();
            });
            it('should display submitter and receiver, even if submitter and recipient are the same', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.IOU, 'john', 'john');
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.getAllByText('John Doe')).toHaveLength(2);
                expect(react_native_1.screen.getByTestId('ArrowRightLong Icon')).toBeOnTheScreen();
            });
            it('should not render anything if neither submitter nor recipient is present', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.IOU, undefined, undefined);
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.queryByTestId('ArrowRightLong Icon')).not.toBeOnTheScreen();
            });
            it('should only display submitter if recipient is invalid', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.IOU, 'john', 'fake');
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.getByText('John Doe')).toBeOnTheScreen();
                expect(react_native_1.screen.queryByTestId('ArrowRightLong Icon')).not.toBeOnTheScreen();
            });
        });
        describe('when report type is EXPENSE', () => {
            it('should display both submitter and recipient if they are different', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.EXPENSE, 'john', 'jane');
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.getByText('John Doe')).toBeOnTheScreen();
                expect(react_native_1.screen.getByText('Jane Smith')).toBeOnTheScreen();
            });
            it('should display submitter if only submitter is present', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.EXPENSE, 'john', undefined);
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.getByText('John Doe')).toBeOnTheScreen();
                expect(react_native_1.screen.queryByTestId('ArrowRightLong Icon')).not.toBeOnTheScreen();
            });
            it('should display submitter and receiver, even if submitter and recipient are the same', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.EXPENSE, 'john', 'john');
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.getAllByText('John Doe')).toHaveLength(2);
                expect(react_native_1.screen.getByTestId('ArrowRightLong Icon')).toBeOnTheScreen();
            });
            it('should not render anything if no participants are present', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.EXPENSE, undefined, undefined);
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.queryByTestId('ArrowRightLong Icon')).not.toBeOnTheScreen();
            });
            it('should only display submitter if recipient is invalid', async () => {
                const reportItem = createReportListItem(CONST_1.default.REPORT.TYPE.EXPENSE, 'john', 'fake');
                renderReportListItemHeader(reportItem);
                await (0, waitForBatchedUpdates_1.default)();
                expect(react_native_1.screen.getByText('John Doe')).toBeOnTheScreen();
                expect(react_native_1.screen.queryByTestId('ArrowRightLong Icon')).not.toBeOnTheScreen();
            });
        });
    });
});
