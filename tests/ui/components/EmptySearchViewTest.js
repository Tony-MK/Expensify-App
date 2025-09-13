"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Localize_1 = require("@libs/Localize");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const EmptySearchView_1 = require("@pages/Search/EmptySearchView");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../../utils/waitForBatchedUpdates");
// Wrapper component with OnyxListItemProvider
function Wrapper({ children }) {
    return (<OnyxListItemProvider_1.default>
            <LocaleContextProvider_1.LocaleContextProvider>{children}</LocaleContextProvider_1.LocaleContextProvider>
        </OnyxListItemProvider_1.default>);
}
const CURRENT_USER_EMAIL = 'fake@gmail.com';
const CURRENT_USER_ACCOUNT_ID = 1;
const SESSION = {
    email: CURRENT_USER_EMAIL,
    accountID: CURRENT_USER_ACCOUNT_ID,
};
const POLICY_ID = '1';
const createPaidGroupPolicy = (isPolicyExpenseChatEnabled = true) => ({
    id: POLICY_ID,
    type: CONST_1.default.POLICY.TYPE.TEAM,
    isPolicyExpenseChatEnabled,
    role: CONST_1.default.POLICY.ROLE.ADMIN,
});
describe('EmptySearchView', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
    });
    describe('type is Expense', () => {
        const dataType = CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
        it('should display correct buttons and subtitle when user has not clicked on "Take a test drive"', async () => {
            // Given user hasn't clicked on "Take a test drive" yet
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { selfTourViewed: false });
            // Render component
            (0, react_native_1.render)(<Wrapper>
                    <EmptySearchView_1.default similarSearchHash={1} type={dataType} hasResults={false}/>
                </Wrapper>);
            await (0, waitForBatchedUpdates_1.default)();
            // Then it should display create expenses and take a test drive buttons
            expect(await react_native_1.screen.findByText((0, Localize_1.translateLocal)('iou.createExpense'))).toBeVisible();
            expect(await react_native_1.screen.findByText((0, Localize_1.translateLocal)('emptySearchView.takeATestDrive'))).toBeVisible();
            // And correct modal subtitle
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('search.searchResults.emptyExpenseResults.subtitle'))).toBeVisible();
        });
        it('should display correct buttons and subtitle when user already did "Take a test drive"', async () => {
            // Given user clicked on "Take a test drive"
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { selfTourViewed: true });
            // Render component
            (0, react_native_1.render)(<Wrapper>
                    <EmptySearchView_1.default similarSearchHash={1} type={dataType} hasResults={false}/>
                </Wrapper>);
            // Then it should display create expenses button
            expect(await react_native_1.screen.findByText((0, Localize_1.translateLocal)('iou.createExpense'))).toBeVisible();
            expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('emptySearchView.takeATestDrive'))).not.toBeOnTheScreen();
            // And correct modal subtitle
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('search.searchResults.emptyExpenseResults.subtitleWithOnlyCreateButton'))).toBeVisible();
        });
        describe('Submit suggestion', () => {
            beforeEach(async () => {
                await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, SESSION);
            });
            afterEach(() => {
                react_native_onyx_1.default.clear();
            });
            it('should display "Create Report" button when user has a paid group policy with expense chat enabled', async () => {
                // Given a paid group policy with expense chat enabled
                const paidGroupPolicy = createPaidGroupPolicy();
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${paidGroupPolicy.id}`, paidGroupPolicy);
                // Given a query string for expense search with draft status
                const queryString = (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                    type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                    groupBy: CONST_1.default.SEARCH.GROUP_BY.REPORTS,
                    action: CONST_1.default.SEARCH.ACTION_FILTERS.SUBMIT,
                    from: [CURRENT_USER_ACCOUNT_ID.toString()],
                });
                const queryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(queryString);
                // When rendering the EmptySearchView component
                (0, react_native_1.render)(<Wrapper>
                        <EmptySearchView_1.default similarSearchHash={queryJSON?.similarSearchHash ?? 1} type={dataType} hasResults={false} groupBy={CONST_1.default.SEARCH.GROUP_BY.REPORTS}/>
                    </Wrapper>);
                await (0, waitForBatchedUpdates_1.default)();
                // Then it should display the submit empty results title
                expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('search.searchResults.emptySubmitResults.title'))).toBeVisible();
                // And it should display the "Create Report" button
                expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('report.newReport.createReport'))).toBeVisible();
            });
            it('should hide "Create Report" button when user has a paid group policy with expense chat disabled', async () => {
                // Given a paid group policy with expense chat disabled
                const policy = createPaidGroupPolicy(false);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`, policy);
                // Given: A query string for expense search with draft status
                const queryString = (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({
                    type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                    groupBy: CONST_1.default.SEARCH.GROUP_BY.REPORTS,
                    action: CONST_1.default.SEARCH.ACTION_FILTERS.SUBMIT,
                    from: [CURRENT_USER_ACCOUNT_ID.toString()],
                });
                const queryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(queryString);
                // When rendering the EmptySearchView component
                (0, react_native_1.render)(<Wrapper>
                        <EmptySearchView_1.default similarSearchHash={queryJSON?.similarSearchHash ?? 1} type={dataType} hasResults={false} groupBy={CONST_1.default.SEARCH.GROUP_BY.REPORTS}/>
                    </Wrapper>);
                await (0, waitForBatchedUpdates_1.default)();
                // Then it should display the submit empty results title
                expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('search.searchResults.emptySubmitResults.title'))).toBeVisible();
                // And it should not display the "Create Report" button
                expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('report.newReport.createReport'))).not.toBeOnTheScreen();
            });
        });
    });
    describe('type is Invoice', () => {
        const dataType = CONST_1.default.SEARCH.DATA_TYPES.INVOICE;
        it('should display correct buttons and subtitle when user has not clicked on "Take a test drive"', async () => {
            // Given user hasn't clicked on "Take a test drive" yet
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { selfTourViewed: false });
            // Render component
            (0, react_native_1.render)(<Wrapper>
                    <EmptySearchView_1.default similarSearchHash={1} type={dataType} hasResults={false}/>
                </Wrapper>);
            // Then it should display send invoice and take a test drive buttons
            expect(await react_native_1.screen.findByText((0, Localize_1.translateLocal)('workspace.invoices.sendInvoice'))).toBeVisible();
            expect(await react_native_1.screen.findByText((0, Localize_1.translateLocal)('emptySearchView.takeATestDrive'))).toBeVisible();
            // And correct modal subtitle
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('search.searchResults.emptyInvoiceResults.subtitle'))).toBeVisible();
        });
        it('should display correct buttons and subtitle when user already did "Take a test drive"', async () => {
            // Given user clicked on "Take a test drive"
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { selfTourViewed: true });
            // Render component
            (0, react_native_1.render)(<Wrapper>
                    <EmptySearchView_1.default similarSearchHash={1} type={dataType} hasResults={false}/>
                </Wrapper>);
            // Then it should display Send invoice button
            expect(await react_native_1.screen.findByText((0, Localize_1.translateLocal)('workspace.invoices.sendInvoice'))).toBeVisible();
            expect(react_native_1.screen.queryByText((0, Localize_1.translateLocal)('emptySearchView.takeATestDrive'))).not.toBeOnTheScreen();
            // And correct modal subtitle
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('search.searchResults.emptyInvoiceResults.subtitleWithOnlyCreateButton'))).toBeVisible();
        });
    });
});
