"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const IOURequestEditReportCommon_1 = require("@pages/iou/request/step/IOURequestEditReportCommon");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const FAKE_REPORT_ID = '1';
const FAKE_POLICY_ID = '1';
const FAKE_TRANSACTION_ID = '2';
const FAKE_EMAIL = 'fake@gmail.com';
const FAKE_ACCOUNT_ID = 1;
const FAKE_SECOND_ACCOUNT_ID = 2;
/**
 * Mock the OptionListContextProvider to provide test data for the component.
 * This ensures consistent test data and isolates the component from external dependencies.
 */
jest.mock('@components/OptionListContextProvider', () => ({
    useOptionsList: () => ({
        options: {
            reports: [
                {
                    reportID: FAKE_REPORT_ID,
                    text: 'Expense Report',
                    keyForList: FAKE_REPORT_ID,
                    brickRoadIndicator: 'error',
                },
            ],
        },
    }),
    OptionsListContextProvider: ({ children }) => children,
}));
/**
 * Helper function to render the IOURequestEditReportCommon component with required providers.
 * This encapsulates the component setup and makes tests more readable.
 */
const renderIOURequestEditReportCommon = ({ selectedReportID = '', selectedPolicyID }) => (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <IOURequestEditReportCommon_1.default selectedReportID={selectedReportID} selectedPolicyID={selectedPolicyID} selectReport={jest.fn()} backTo=""/>
        </ComposeProviders_1.default>);
describe('IOURequestEditReportCommon', () => {
    describe('RBR', () => {
        beforeAll(() => {
            // Initialize Onyx with test configuration
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
                initialKeyStates: {
                    [ONYXKEYS_1.default.SESSION]: { accountID: FAKE_ACCOUNT_ID, email: FAKE_EMAIL },
                },
            });
            (0, OnyxDerived_1.default)();
            return (0, waitForBatchedUpdates_1.default)();
        });
        beforeEach(() => {
            react_native_onyx_1.default.multiSet({
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${FAKE_POLICY_ID}`]: (0, policies_1.default)(Number(FAKE_POLICY_ID), CONST_1.default.POLICY.TYPE.TEAM),
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${FAKE_REPORT_ID}`]: {
                    reportID: FAKE_REPORT_ID,
                    reportName: 'Expense Report',
                    ownerAccountID: FAKE_ACCOUNT_ID,
                    policyID: FAKE_POLICY_ID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                },
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterEach(() => {
            react_native_onyx_1.default.clear();
            jest.clearAllMocks();
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should not show DotIndicator when the report has brickRoadIndicator', async () => {
            // Given a transaction report
            const mockTransactionReport = {
                reportID: FAKE_TRANSACTION_ID,
                reportName: 'Transaction Report',
                ownerAccountID: FAKE_ACCOUNT_ID,
                policyID: FAKE_POLICY_ID,
            };
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockTransactionReport.reportID}`, mockTransactionReport);
            await (0, waitForBatchedUpdates_1.default)();
            // When the component is rendered with the transaction reports
            renderIOURequestEditReportCommon({ selectedReportID: mockTransactionReport.reportID, selectedPolicyID: mockTransactionReport.policyID });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the expense report should be displayed
            const reportItem = react_native_1.screen.getByText('Expense Report');
            expect(reportItem).toBeTruthy();
            // Then do not show RBR
            const dotIndicators = react_native_1.screen.queryAllByTestId(CONST_1.default.DOT_INDICATOR_TEST_ID);
            expect(dotIndicators).toHaveLength(0);
        });
    });
    describe('NotFound', () => {
        beforeAll(() => {
            // Initialize Onyx with test configuration
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
                initialKeyStates: {
                    [ONYXKEYS_1.default.SESSION]: { accountID: FAKE_SECOND_ACCOUNT_ID, email: FAKE_EMAIL },
                },
            });
        });
        beforeEach(() => {
            react_native_onyx_1.default.multiSet({
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${FAKE_POLICY_ID}`]: {
                    ...(0, policies_1.default)(Number(FAKE_POLICY_ID), CONST_1.default.POLICY.TYPE.TEAM),
                    role: CONST_1.default.POLICY.ROLE.USER,
                },
                [`${ONYXKEYS_1.default.COLLECTION.REPORT}${FAKE_REPORT_ID}`]: {
                    reportID: FAKE_REPORT_ID,
                    reportName: 'Expense Report',
                    ownerAccountID: FAKE_ACCOUNT_ID,
                    policyID: FAKE_POLICY_ID,
                    type: CONST_1.default.REPORT.TYPE.EXPENSE,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                },
            });
            return (0, waitForBatchedUpdates_1.default)();
        });
        afterEach(() => {
            react_native_onyx_1.default.clear();
            jest.clearAllMocks();
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('should display not found page when the report is Open and the user is not the owner or admin', async () => {
            // Given a transaction report
            const mockTransactionReport = {
                reportID: FAKE_TRANSACTION_ID,
                reportName: 'Transaction Report',
                ownerAccountID: FAKE_ACCOUNT_ID,
                policyID: FAKE_POLICY_ID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            };
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${mockTransactionReport.reportID}`, mockTransactionReport);
            await (0, waitForBatchedUpdates_1.default)();
            // When the component is rendered with the transaction reports
            renderIOURequestEditReportCommon({ selectedReportID: mockTransactionReport.reportID, selectedPolicyID: mockTransactionReport.policyID });
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            // Then the not found page should be displayed
            // eslint-disable-next-line rulesdir/no-negated-variables
            const fullPageNotFoundView = react_native_1.screen.getByTestId('FullPageNotFoundView');
            expect(fullPageNotFoundView).toBeVisible();
        });
    });
});
