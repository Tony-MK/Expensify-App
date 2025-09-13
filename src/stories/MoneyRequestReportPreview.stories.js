"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneTransaction = exports.HasErrors = exports.ManyTransactions = exports.DarkTheme = exports.Default = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const MoneyRequestReportPreviewContent_1 = require("@components/ReportActionItem/MoneyRequestReportPreview/MoneyRequestReportPreviewContent");
const TransactionPreviewContent_1 = require("@components/ReportActionItem/TransactionPreview/TransactionPreviewContent");
const ThemeProvider_1 = require("@components/ThemeProvider");
const ThemeStylesProvider_1 = require("@components/ThemeStylesProvider");
// eslint-disable-next-line no-restricted-imports
const getMoneyRequestReportPreviewStyle_1 = require("@styles/utils/getMoneyRequestReportPreviewStyle");
// eslint-disable-next-line no-restricted-imports
const sizing_1 = require("@styles/utils/sizing");
const CONST_1 = require("@src/CONST");
const SCREENS_1 = require("@src/SCREENS");
const actions_1 = require("../../__mocks__/reportData/actions");
const personalDetails_1 = require("../../__mocks__/reportData/personalDetails");
const reports_1 = require("../../__mocks__/reportData/reports");
const transactions_1 = require("../../__mocks__/reportData/transactions");
const violations_1 = require("../../__mocks__/reportData/violations");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const mockTransactionsMedium = Array.from({ length: 2 }).map((item, index) => {
    return { ...transactions_1.transactionR14932, transactionID: `${transactions_1.transactionR14932.transactionID}${index}` };
});
const mockTransactionsBig = Array.from({ length: 12 }).map((item, index) => {
    return { ...transactions_1.transactionR14932, transactionID: `${transactions_1.transactionR14932.transactionID}${index}` };
});
const mockRenderItem = ({ item }) => (<TransactionPreviewContent_1.default action={actions_1.actionR14932} isWhisper={false} isHovered={false} chatReport={reports_1.chatReportR14932} personalDetails={personalDetails_1.default} report={reports_1.iouReportR14932} transaction={item} transactionRawAmount={item.amount} violations={item.errors ? violations_1.violationsR14932 : []} offlineWithFeedbackOnClose={() => undefined} navigateToReviewFields={() => undefined} isBillSplit={false} areThereDuplicates={false} sessionAccountID={11111111} walletTermsErrors={undefined} routeName={SCREENS_1.default.TRANSACTION_DUPLICATE.REVIEW} shouldHideOnDelete={false} transactionPreviewWidth={303} containerStyles={[sizing_1.default.h100]}/>);
exports.default = {
    title: 'Components/MoneyRequestReportPreviewContent',
    component: MoneyRequestReportPreviewContent_1.default,
    argTypes: {
        /** The associated chatReport */
        chatReportID: {
            options: ['chatReportID', undefined],
            control: { type: 'radio' },
        },
        /** The active IOUReport, used for Onyx subscription */
        iouReportID: {
            options: ['iouReportID', undefined],
            control: { type: 'radio' },
        },
        /** The report's policyID, used for Onyx subscription */
        policyID: {
            options: ['policyID', undefined],
            control: { type: 'radio' },
        },
        /** Extra styles to pass to View wrapper */
        containerStyles: {
            options: [{ marginTop: 8 }],
            control: { type: 'radio' },
        },
        /** Popover context menu anchor, used for showing context menu */
        contextMenuAnchor: {
            options: [null],
            control: { type: 'radio' },
        },
        /** Callback for updating context menu active state, used for showing context menu */
        checkIfContextMenuActive: {
            options: [undefined, () => { }],
            control: { type: 'radio' },
        },
        /** Callback when the payment options popover is shown */
        onPaymentOptionsShow: {
            options: [undefined, () => { }],
            control: { type: 'radio' },
        },
        /** Callback when the payment options popover is closed */
        onPaymentOptionsHide: {
            options: [undefined, () => { }],
            control: { type: 'radio' },
        },
        /** Whether a message is a whisper */
        isWhisper: {
            options: [true, false, undefined],
            control: { type: 'radio' },
        },
        /** Whether the corresponding report action item is hovered */
        isHovered: {
            control: { type: 'boolean' },
        },
    },
    args: {
        action: actions_1.actionR14932,
        chatReport: reports_1.chatReportR14932,
        policy: undefined,
        iouReport: reports_1.iouReportR14932,
        transactions: mockTransactionsMedium,
        violations: violations_1.violationsR14932,
        invoiceReceiverPersonalDetail: undefined,
        invoiceReceiverPolicy: undefined,
        renderTransactionItem: mockRenderItem,
    },
    parameters: {
        useLightTheme: true,
    },
};
function Template(props, { parameters }) {
    const theme = parameters.useLightTheme ? CONST_1.default.THEME.LIGHT : CONST_1.default.THEME.DARK;
    const transactions = parameters.transactionsBig ? mockTransactionsBig : props.transactions;
    const reportPreviewStyle = (0, getMoneyRequestReportPreviewStyle_1.default)(false, transactions.length, 400, 400);
    return (<ThemeProvider_1.default theme={theme}>
            <ThemeStylesProvider_1.default>
                <react_native_1.View style={{ maxWidth: '100%' }}>
                    <MoneyRequestReportPreviewContent_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} reportPreviewStyles={reportPreviewStyle} containerStyles={[reportPreviewStyle.componentStyle, props.containerStyles]} transactions={transactions}/>
                </react_native_1.View>
            </ThemeStylesProvider_1.default>
        </ThemeProvider_1.default>);
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
const DarkTheme = Template.bind({});
exports.DarkTheme = DarkTheme;
const OneTransaction = Template.bind({});
exports.OneTransaction = OneTransaction;
const ManyTransactions = Template.bind({});
exports.ManyTransactions = ManyTransactions;
const HasErrors = Template.bind({});
exports.HasErrors = HasErrors;
DarkTheme.parameters = {
    useLightTheme: false,
};
OneTransaction.args = {
    transactions: [transactions_1.transactionR14932],
};
ManyTransactions.parameters = {
    transactionsBig: true,
};
HasErrors.args = {
    transactions: mockTransactionsMedium.map((t) => ({
        ...t,
        errors: violations_1.receiptErrorsR14932,
    })),
};
