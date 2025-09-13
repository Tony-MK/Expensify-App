"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkTheme = exports.LightTheme = void 0;
const react_1 = require("react");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ThemeProvider_1 = require("@components/ThemeProvider");
const ThemeStylesProvider_1 = require("@components/ThemeStylesProvider");
const TransactionItemRow_1 = require("@components/TransactionItemRow");
const CONST_1 = require("@src/CONST");
const Transaction_1 = require("./objects/Transaction");
const allAvailableColumns = [
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.RECEIPT,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TYPE,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DATE,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.FROM,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TO,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.CATEGORY,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAG,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TOTAL_AMOUNT,
    CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.ACTION,
];
const story = {
    title: 'Components/TransactionItemRow',
    component: TransactionItemRow_1.default,
    args: {
        transactionItem: Transaction_1.transactionWithOptionalSearchFields,
        shouldUseNarrowLayout: false,
        isSelected: false,
        shouldShowTooltip: true,
        shouldShowCheckbox: true,
        columns: allAvailableColumns,
    },
    argTypes: {
        transactionItem: {
            control: 'object',
        },
        shouldUseNarrowLayout: {
            control: 'boolean',
        },
        isSelected: {
            control: 'boolean',
        },
        shouldShowTooltip: {
            control: 'boolean',
        },
        shouldShowCheckbox: {
            control: 'boolean',
        },
        columns: {
            control: {
                type: 'check',
            },
            options: allAvailableColumns,
        },
    },
    parameters: {
        useLightTheme: true,
    },
};
function Template({ transactionItem, shouldUseNarrowLayout, isSelected, shouldShowTooltip, shouldShowCheckbox, columns }, { parameters }) {
    const theme = parameters.useLightTheme ? CONST_1.default.THEME.LIGHT : CONST_1.default.THEME.DARK;
    return (<ThemeProvider_1.default theme={theme}>
            <ScreenWrapper_1.default testID="testID">
                <ThemeStylesProvider_1.default>
                    <TransactionItemRow_1.default transactionItem={transactionItem} shouldUseNarrowLayout={shouldUseNarrowLayout} isSelected={isSelected} shouldShowTooltip={shouldShowTooltip} dateColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} amountColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} taxAmountColumnSize={CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.NORMAL} onCheckboxPress={() => { }} shouldShowCheckbox={shouldShowCheckbox} columns={columns} onButtonPress={() => { }}/>
                </ThemeStylesProvider_1.default>
            </ScreenWrapper_1.default>
        </ThemeProvider_1.default>);
}
const LightTheme = Template.bind({});
exports.LightTheme = LightTheme;
const DarkTheme = Template.bind({});
exports.DarkTheme = DarkTheme;
LightTheme.parameters = {
    useLightTheme: true,
};
DarkTheme.parameters = {
    useLightTheme: false,
};
exports.default = story;
