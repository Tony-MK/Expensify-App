"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const HTMLEngineProvider_1 = require("@components/HTMLEngineProvider");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const TransactionItemRow_1 = require("@components/TransactionItemRow");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@components/Icon/Expensicons');
jest.mock('@libs/Navigation/Navigation');
jest.mock('@hooks/useAnimatedHighlightStyle');
const MOCK_TRANSACTION_ID = '1';
const MOCK_REPORT_ID = '1';
// Default props for TransactionItemRow component
const defaultProps = {
    shouldUseNarrowLayout: false,
    isSelected: false,
    shouldShowTooltip: false,
    dateColumnSize: CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
    amountColumnSize: CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
    taxAmountColumnSize: CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL,
    onCheckboxPress: jest.fn(),
    shouldShowCheckbox: false,
    columns: Object.values(CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS),
    onButtonPress: jest.fn(),
    isParentHovered: false,
};
// Helper function to render TransactionItemRow with providers
const renderTransactionItemRow = (transactionItem) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, HTMLEngineProvider_1.default]}>
            <TransactionItemRow_1.default transactionItem={transactionItem} violations={transactionItem.violations} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...defaultProps}/>
        </ComposeProviders_1.default>);
};
// Helper function to create base transaction
const createBaseTransaction = (overrides = {}) => ({
    ...(0, transaction_1.default)(1),
    pendingAction: null,
    transactionID: MOCK_TRANSACTION_ID,
    reportID: MOCK_REPORT_ID,
    ...overrides,
});
// Helper function to create base report action
const createBaseReportAction = (id, overrides = {}) => ({
    ...(0, reportActions_1.default)(id),
    pendingAction: null,
    ...overrides,
});
// Helper function to create IOU report action
const createIOUReportAction = () => createBaseReportAction(1, {
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
    childReportID: MOCK_REPORT_ID,
    originalMessage: {
        IOUReportID: MOCK_REPORT_ID,
        amount: -100,
        currency: 'USD',
        comment: '',
        IOUTransactionID: MOCK_TRANSACTION_ID,
    },
});
// Helper function to create error report action
const createErrorReportAction = () => createBaseReportAction(2, {
    errors: {
        ERROR: 'Unexpected error posting the comment. Please try again later.',
    },
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
});
describe('TransactionItemRowRBRWithOnyx', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, CONST_1.default.LOCALES.DEFAULT);
    });
    beforeEach(() => {
        jest.clearAllMocks();
        return react_native_onyx_1.default.clear([ONYXKEYS_1.default.NVP_PREFERRED_LOCALE]).then(waitForBatchedUpdates_1.default);
    });
    it('should display RBR message for transaction with single violation', async () => {
        // Given a transaction with a single violation
        const mockViolations = [
            {
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
        ];
        const mockTransaction = createBaseTransaction({ violations: mockViolations });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, mockViolations);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed
        expect(react_native_1.screen.getByText('Missing category.')).toBeOnTheScreen();
    });
    it('should display RBR message for transaction with multiple violations', async () => {
        // Given a transaction with two violations
        const mockViolations = [
            {
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
            {
                name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
        ];
        const mockTransaction = createBaseTransaction({ violations: mockViolations });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, mockViolations);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed with both violations
        expect(react_native_1.screen.getByText('Missing category. Potential duplicate.')).toBeOnTheScreen();
    });
    it('should display RBR message for transaction with report action errors', async () => {
        // Given a transaction with report action errors
        const mockTransaction = createBaseTransaction();
        const mockReportActionIOU = createIOUReportAction();
        const mockReportActionErrors = createErrorReportAction();
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${MOCK_TRANSACTION_ID}`, {
            [mockReportActionIOU.reportActionID]: mockReportActionIOU,
            [mockReportActionErrors.reportActionID]: mockReportActionErrors,
        });
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed for report action errors
        expect(react_native_1.screen.getByText('Unexpected error posting the comment. Please try again later.')).toBeOnTheScreen();
    });
    it('should display RBR message for transaction with missing merchant error', async () => {
        // Given a transaction with a missing merchant error
        const mockReport = {
            ...(0, reports_1.createRandomReport)(1),
            pendingAction: null,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        const mockTransaction = createBaseTransaction({
            modifiedMerchant: '',
            merchant: '',
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${MOCK_REPORT_ID}`, mockReport);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed with missing merchant error
        expect(react_native_1.screen.getByText('Missing merchant.')).toBeOnTheScreen();
    });
    it('should display RBR message for transaction with both violations and errors', async () => {
        // Given a transaction with violations and report action errors
        const mockViolations = [
            {
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
        ];
        const mockTransaction = createBaseTransaction({ violations: mockViolations });
        const mockReportActionIOU = createIOUReportAction();
        const mockReportActionErrors = createErrorReportAction();
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, mockViolations);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${MOCK_TRANSACTION_ID}`, {
            [mockReportActionIOU.reportActionID]: mockReportActionIOU,
            [mockReportActionErrors.reportActionID]: mockReportActionErrors,
        });
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed with both report action errors and violations
        expect(react_native_1.screen.getByText('Unexpected error posting the comment. Please try again later. Missing category.')).toBeOnTheScreen();
    });
    it('should display RBR message for transaction with violations, errors, and missing merchant error', async () => {
        // Given a transaction with violations, errors, and missing merchant error
        const mockViolations = [
            {
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
        ];
        const mockReport = {
            ...(0, reports_1.createRandomReport)(1),
            pendingAction: null,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        const mockTransaction = createBaseTransaction({
            violations: mockViolations,
            modifiedMerchant: '',
            merchant: '',
        });
        const mockReportActionIOU = createIOUReportAction();
        const mockReportActionErrors = createErrorReportAction();
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${MOCK_REPORT_ID}`, mockReport);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, mockViolations);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${MOCK_TRANSACTION_ID}`, {
            [mockReportActionIOU.reportActionID]: mockReportActionIOU,
            [mockReportActionErrors.reportActionID]: mockReportActionErrors,
        });
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed with transaction errors, missing merchant error, and violations
        expect(react_native_1.screen.getByText('Unexpected error posting the comment. Please try again later. Missing merchant. Missing category.')).toBeOnTheScreen();
    });
    it('should not display RBR message for transaction with no violations or errors', async () => {
        // Given a transaction with no violations or errors
        const mockTransaction = createBaseTransaction({ violations: [] });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, []);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should not be displayed
        expect(react_native_1.screen.queryByTestId('TransactionItemRowRBRWithOnyx')).not.toBeOnTheScreen();
    });
});
describe('TransactionItemRowRBR', () => {
    beforeAll(() => react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
        evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
    }));
    beforeEach(() => {
        jest.clearAllMocks();
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('should display RBR message for transaction with single violation', async () => {
        // Given a transaction with a single violation
        const mockViolations = [
            {
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
        ];
        const mockTransaction = createBaseTransaction({ violations: mockViolations });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, mockViolations);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed
        expect(react_native_1.screen.getByText('Missing category.')).toBeOnTheScreen();
    });
    it('should display RBR message for transaction with multiple violations', async () => {
        // Given a transaction with two violations
        const mockViolations = [
            {
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
            {
                name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
        ];
        const mockTransaction = createBaseTransaction({ violations: mockViolations });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, mockViolations);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed with both violations
        expect(react_native_1.screen.getByText('Missing category. Potential duplicate.')).toBeOnTheScreen();
    });
    it('should display RBR message for transaction with violations, and missing merchant error', async () => {
        // Given a transaction with violations, errors, and missing merchant errors
        const mockViolations = [
            {
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            },
        ];
        const mockReport = {
            ...(0, reports_1.createRandomReport)(1),
            pendingAction: null,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        const mockTransaction = createBaseTransaction({
            violations: mockViolations,
            modifiedMerchant: '',
            merchant: '',
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${MOCK_REPORT_ID}`, mockReport);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, mockViolations);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed with missing merchant error and violations
        expect(react_native_1.screen.getByText('Missing merchant. Missing category.')).toBeOnTheScreen();
    });
    it('should display RBR message for transaction with missing merchant error', async () => {
        // Given a transaction with a missing merchant error
        const mockReport = {
            ...(0, reports_1.createRandomReport)(1),
            pendingAction: null,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        const mockTransaction = createBaseTransaction({
            modifiedMerchant: '',
            merchant: '',
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${MOCK_REPORT_ID}`, mockReport);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should be displayed with missing merchant error
        expect(react_native_1.screen.getByText('Missing merchant.')).toBeOnTheScreen();
    });
    it('should not display RBR message for transaction with no violations or errors', async () => {
        // Given a transaction with no violations or errors
        const mockTransaction = createBaseTransaction({ violations: [] });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${MOCK_TRANSACTION_ID}`, mockTransaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${MOCK_TRANSACTION_ID}`, []);
        // When rendering the transaction item row
        renderTransactionItemRow(mockTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Then the RBR message should not be displayed
        expect(react_native_1.screen.queryByTestId('TransactionItemRowRBR')).not.toBeOnTheScreen();
    });
});
