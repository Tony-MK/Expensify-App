"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const NativeNavigation = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const MoneyRequestReportPreview_1 = require("@components/ReportActionItem/MoneyRequestReportPreview");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const Localize_1 = require("@libs/Localize");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ReportActionUtils = require("@src/libs/ReportActionsUtils");
const ReportUtils = require("@src/libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const actions_1 = require("../../__mocks__/reportData/actions");
const reports_1 = require("../../__mocks__/reportData/reports");
const transactions_1 = require("../../__mocks__/reportData/transactions");
const violations_1 = require("../../__mocks__/reportData/violations");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const mockSecondTransactionID = `${transactions_1.transactionR14932.transactionID}2`;
jest.mock('@react-navigation/native');
jest.mock('@rnmapbox/maps', () => {
    return {
        default: jest.fn(),
        MarkerView: jest.fn(),
        setAccessToken: jest.fn(),
    };
});
jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: jest.fn(),
}));
jest.mock('@src/hooks/useReportWithTransactionsAndViolations', () => jest.fn(() => {
    return [reports_1.chatReportR14932, [transactions_1.transactionR14932, { ...transactions_1.transactionR14932, transactionID: mockSecondTransactionID }], { violations: violations_1.violationsR14932 }];
}));
const getIOUActionForReportID = (reportID, transactionID) => {
    if (!reportID || !transactionID) {
        return undefined;
    }
    return { ...actions_1.actionR14932, originalMessage: { ...actions_1.actionR14932, IOUTransactionID: transactionID } };
};
const hasViolations = (reportID, transactionViolations, shouldShowInReview) => (shouldShowInReview === undefined || shouldShowInReview) && Object.values(transactionViolations ?? {}).length > 0;
const renderPage = ({ isWhisper = false, isHovered = false, contextMenuAnchor = null }) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <OptionListContextProvider_1.default>
                <ScreenWrapper_1.default testID="test">
                    <portal_1.PortalProvider>
                        <MoneyRequestReportPreview_1.default allReports={{
            [`${ONYXKEYS_1.default.COLLECTION.REPORT}${reports_1.chatReportR14932.iouReportID}`]: reports_1.chatReportR14932,
        }} policies={{}} policyID={reports_1.chatReportR14932.policyID} action={actions_1.actionR14932} iouReportID={reports_1.iouReportR14932.reportID} chatReportID={reports_1.chatReportR14932.chatReportID} contextMenuAnchor={contextMenuAnchor} checkIfContextMenuActive={() => { }} onPaymentOptionsShow={() => { }} onPaymentOptionsHide={() => { }} isHovered={isHovered} isWhisper={isWhisper}/>
                    </portal_1.PortalProvider>
                </ScreenWrapper_1.default>
            </OptionListContextProvider_1.default>
        </ComposeProviders_1.default>);
};
const getTransactionDisplayAmountAndHeaderText = (transaction) => {
    const created = (0, TransactionUtils_1.getFormattedCreated)(transaction);
    const date = DateUtils_1.default.formatWithUTCTimeZone(created, DateUtils_1.default.doesDateBelongToAPastYear(created) ? CONST_1.default.DATE.MONTH_DAY_YEAR_ABBR_FORMAT : CONST_1.default.DATE.MONTH_DAY_ABBR_FORMAT);
    const isTransactionMadeWithCard = (0, TransactionUtils_1.isCardTransaction)(transaction);
    const cashOrCard = isTransactionMadeWithCard ? (0, Localize_1.translateLocal)('iou.card') : (0, Localize_1.translateLocal)('iou.cash');
    const transactionHeaderText = `${date} ${CONST_1.default.DOT_SEPARATOR} ${cashOrCard}`;
    const transactionDisplayAmount = (0, CurrencyUtils_1.convertToDisplayString)(transaction.amount, transaction.currency);
    return { transactionHeaderText, transactionDisplayAmount };
};
const setCurrentWidth = () => {
    (0, react_native_1.fireEvent)(react_native_1.screen.getByTestId('MoneyRequestReportPreviewContent-wrapper'), 'layout', {
        nativeEvent: { layout: { width: 600 } },
    });
    (0, react_native_1.fireEvent)(react_native_1.screen.getByTestId('carouselWidthSetter'), 'layout', {
        nativeEvent: { layout: { width: 500 } },
    });
};
const mockSecondTransaction = {
    ...transactions_1.transactionR14932,
    amount: transactions_1.transactionR14932.amount * 2,
    transactionID: mockSecondTransactionID,
};
const mockOnyxTransactions = {
    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactions_1.transactionR14932.transactionID}`]: transactions_1.transactionR14932,
    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mockSecondTransaction.transactionID}`]: mockSecondTransaction,
};
const mockOnyxViolations = {
    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactions_1.transactionR14932.transactionID}`]: violations_1.violationsR14932,
    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${mockSecondTransaction.transactionID}`]: violations_1.violationsR14932,
};
const arrayOfTransactions = Object.values(mockOnyxTransactions);
TestHelper.setupApp();
TestHelper.setupGlobalFetchMock();
describe('MoneyRequestReportPreview', () => {
    beforeAll(async () => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        jest.spyOn(NativeNavigation, 'useRoute').mockReturnValue({ key: '', name: '' });
        jest.spyOn(ReportActionUtils, 'getIOUActionForReportID').mockImplementation(getIOUActionForReportID);
        jest.spyOn(ReportUtils, 'hasViolations').mockImplementation(hasViolations);
        await TestHelper.signInWithTestUser();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('renders transaction details and associated report name correctly', async () => {
        renderPage({});
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        setCurrentWidth();
        await react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.TRANSACTION, mockOnyxTransactions).then(waitForBatchedUpdates_1.default);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const { reportName: moneyRequestReportPreviewName = '' } = reports_1.chatReportR14932;
        for (const transaction of arrayOfTransactions) {
            const { transactionDisplayAmount, transactionHeaderText } = getTransactionDisplayAmountAndHeaderText(transaction);
            expect(react_native_1.screen.getByText(moneyRequestReportPreviewName)).toBeOnTheScreen();
            expect(react_native_1.screen.getByText(transactionDisplayAmount)).toBeOnTheScreen();
            expect(react_native_1.screen.getAllByText(transactionHeaderText)).toHaveLength(arrayOfTransactions.length);
            expect(react_native_1.screen.getAllByText(transaction.merchant)).toHaveLength(arrayOfTransactions.length);
        }
    });
    it('renders RBR for every transaction with violations', async () => {
        renderPage({});
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        setCurrentWidth();
        await react_native_onyx_1.default.multiSet({ ...mockOnyxTransactions, ...mockOnyxViolations });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        expect(react_native_1.screen.getAllByText((0, Localize_1.translateLocal)('violations.reviewRequired'))).toHaveLength(2);
    });
    it('renders a skeleton if the transaction is empty', async () => {
        renderPage({});
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        setCurrentWidth();
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactions_1.transactionR14932.transactionID}`, {});
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mockSecondTransactionID}`, {});
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        expect(react_native_1.screen.getAllByTestId('TransactionPreviewSkeletonView')).toHaveLength(2);
    });
});
