"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletedKeepButtonSplitRBRCategoriesAndTag = exports.KeepButtonSplitRBRCategoriesAndTag = exports.KeepButtonIOURbrCategoriesAndTag = exports.KeepButtonRBRCategoriesAndTag = exports.KeepButtonCategoriesAndTag = exports.CategoriesAndTag = exports.NoMerchant = exports.Default = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const TransactionPreviewContent_1 = require("@components/ReportActionItem/TransactionPreview/TransactionPreviewContent");
const ThemeProvider_1 = require("@components/ThemeProvider");
const ThemeStylesProvider_1 = require("@components/ThemeStylesProvider");
const CONST_1 = require("@src/CONST");
const SCREENS_1 = require("@src/SCREENS");
const actions_1 = require("../../__mocks__/reportData/actions");
const personalDetails_1 = require("../../__mocks__/reportData/personalDetails");
const reports_1 = require("../../__mocks__/reportData/reports");
const transactions_1 = require("../../__mocks__/reportData/transactions");
const violations_1 = require("../../__mocks__/reportData/violations");
const veryLongString = 'W'.repeat(1000);
const veryBigNumber = Number('9'.repeat(12));
const modifiedTransaction = ({ category, tag, merchant = '', amount = 1000, hold = false }) => ({
    ...transactions_1.transactionR14932,
    category,
    tag,
    merchant,
    amount,
    comment: {
        hold: hold ? 'true' : undefined,
    },
});
const iouReportWithModifiedType = (type) => ({ ...reports_1.iouReportR14932, type });
const actionWithModifiedPendingAction = (pendingAction) => ({ ...actions_1.actionR14932, pendingAction });
const disabledProperties = [
    'onPreviewPressed',
    'navigateToReviewFields',
    'offlineWithFeedbackOnClose',
    'containerStyles',
    'showContextMenu',
    'routeName',
    'sessionAccountID',
    'isHovered',
    'isWhisper',
    'walletTermsErrors',
    'personalDetails',
    'chatReport',
].reduce((disabledArgTypes, property) => {
    // eslint-disable-next-line no-param-reassign
    disabledArgTypes[property] = {
        table: {
            disable: true,
        },
    };
    return disabledArgTypes;
}, {});
const generateArgTypes = (mapping) => ({
    control: 'select',
    options: Object.keys(mapping),
    mapping,
});
/* eslint-disable @typescript-eslint/naming-convention */
const transactionsMap = {
    'No Merchant': modifiedTransaction({}),
    Food: modifiedTransaction({ category: 'Food', tag: 'Yum', merchant: 'Burgers' }),
    Grocery: modifiedTransaction({ category: 'Shopping', tag: 'Tesco', merchant: 'Supermarket' }),
    Cars: modifiedTransaction({ category: 'Porsche', tag: 'Car shop', merchant: 'Merchant' }),
    'Too Long': modifiedTransaction({ category: veryLongString, tag: veryLongString, merchant: veryLongString, amount: veryBigNumber }),
};
const violationsMap = {
    None: [],
    Duplicate: [violations_1.violationsR14932.at(0)],
    'Missing Category': [violations_1.violationsR14932.at(1)],
    'Field Required': [violations_1.violationsR14932.at(2)],
};
const actionMap = {
    'Pending delete': actionWithModifiedPendingAction(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE),
    'No pending action': actions_1.actionR14932,
};
const iouReportMap = {
    IOU: iouReportWithModifiedType(CONST_1.default.REPORT.TYPE.IOU),
    'Normal report': reports_1.iouReportR14932,
};
const story = {
    title: 'Components/TransactionPreview',
    component: TransactionPreviewContent_1.default,
    args: {
        action: actions_1.actionR14932,
        isWhisper: false,
        isHovered: false,
        chatReport: reports_1.chatReportR14932,
        personalDetails: personalDetails_1.default,
        report: reports_1.iouReportR14932,
        transaction: transactions_1.transactionR14932,
        violations: [],
        offlineWithFeedbackOnClose() { },
        navigateToReviewFields: () => undefined,
        containerStyles: [],
        isBillSplit: false,
        areThereDuplicates: false,
        sessionAccountID: 11111111,
        walletTermsErrors: undefined,
        routeName: SCREENS_1.default.TRANSACTION_DUPLICATE.REVIEW,
        shouldHideOnDelete: false,
        transactionPreviewWidth: 303,
    },
    argTypes: {
        ...disabledProperties,
        report: generateArgTypes(iouReportMap),
        transaction: generateArgTypes(transactionsMap),
        violations: generateArgTypes(violationsMap),
        action: generateArgTypes(actionMap),
    },
};
function Template(props) {
    return (<ThemeProvider_1.default theme={CONST_1.default.THEME.LIGHT}>
            <ThemeStylesProvider_1.default>
                <react_native_1.View style={{ flexDirection: 'row' }}>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <TransactionPreviewContent_1.default {...props}/>
                </react_native_1.View>
            </ThemeStylesProvider_1.default>
        </ThemeProvider_1.default>);
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
const NoMerchant = Template.bind({});
exports.NoMerchant = NoMerchant;
const CategoriesAndTag = Template.bind({});
exports.CategoriesAndTag = CategoriesAndTag;
const KeepButtonCategoriesAndTag = Template.bind({});
exports.KeepButtonCategoriesAndTag = KeepButtonCategoriesAndTag;
const KeepButtonRBRCategoriesAndTag = Template.bind({});
exports.KeepButtonRBRCategoriesAndTag = KeepButtonRBRCategoriesAndTag;
const KeepButtonSplitRBRCategoriesAndTag = Template.bind({});
exports.KeepButtonSplitRBRCategoriesAndTag = KeepButtonSplitRBRCategoriesAndTag;
const DeletedKeepButtonSplitRBRCategoriesAndTag = Template.bind({});
exports.DeletedKeepButtonSplitRBRCategoriesAndTag = DeletedKeepButtonSplitRBRCategoriesAndTag;
const KeepButtonIOURbrCategoriesAndTag = Template.bind({});
exports.KeepButtonIOURbrCategoriesAndTag = KeepButtonIOURbrCategoriesAndTag;
const storiesTransactionData = { category: 'Grocery stores', tag: 'Food', merchant: 'Acme' };
NoMerchant.args = {
    ...Default.args,
    transaction: modifiedTransaction({}),
};
CategoriesAndTag.args = {
    ...Default.args,
    transaction: modifiedTransaction(storiesTransactionData),
};
KeepButtonCategoriesAndTag.args = {
    ...CategoriesAndTag.args,
    areThereDuplicates: true,
};
KeepButtonRBRCategoriesAndTag.args = {
    ...KeepButtonCategoriesAndTag.args,
    violations: violations_1.violationsR14932,
    transaction: modifiedTransaction({ ...storiesTransactionData, hold: true }),
};
KeepButtonSplitRBRCategoriesAndTag.args = {
    ...KeepButtonRBRCategoriesAndTag.args,
    isBillSplit: true,
};
KeepButtonIOURbrCategoriesAndTag.args = {
    ...KeepButtonRBRCategoriesAndTag.args,
    report: iouReportWithModifiedType(CONST_1.default.REPORT.TYPE.IOU),
};
DeletedKeepButtonSplitRBRCategoriesAndTag.args = {
    ...KeepButtonSplitRBRCategoriesAndTag.args,
    action: actionWithModifiedPendingAction(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE),
};
exports.default = story;
