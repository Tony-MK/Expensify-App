"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const AttachmentModalContext_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContext");
const ComposeProviders_1 = require("@src/components/ComposeProviders");
const LocaleContextProvider_1 = require("@src/components/LocaleContextProvider");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReportActionsList_1 = require("@src/pages/home/report/ReportActionsList");
const ReportScreenContext_1 = require("@src/pages/home/ReportScreenContext");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const ReportTestUtils = require("../utils/ReportTestUtils");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
const mockedNavigate = jest.fn();
jest.mock('@components/withCurrentUserPersonalDetails', () => {
    // Lazy loading of LHNTestUtils
    const lazyLoadLHNTestUtils = () => require('../utils/LHNTestUtils');
    return (Component) => {
        function WrappedComponent(props) {
            const currentUserAccountID = 5;
            const LHNTestUtils = lazyLoadLHNTestUtils(); // Load LHNTestUtils here
            return (<Component 
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props} currentUserPersonalDetails={LHNTestUtils.fakePersonalDetails[currentUserAccountID]}/>);
        }
        WrappedComponent.displayName = 'WrappedComponent';
        return WrappedComponent;
    };
});
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useRoute: () => mockedNavigate,
        useIsFocused: () => true,
    };
});
jest.mock('@src/components/ConfirmedRoute.tsx');
beforeAll(() => react_native_onyx_1.default.init({
    keys: ONYXKEYS_1.default,
    evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
}));
const mockOnLayout = jest.fn();
const mockOnScroll = jest.fn();
const mockLoadChats = jest.fn();
const mockRef = { current: null, flatListRef: null, scrollPosition: null, setScrollPosition: () => { } };
const TEST_USER_ACCOUNT_ID = 1;
const TEST_USER_LOGIN = 'test@test.com';
const signUpWithTestUser = () => {
    TestHelper.signInWithTestUser(TEST_USER_ACCOUNT_ID, TEST_USER_LOGIN);
};
const report = (0, reports_1.createRandomReport)(1);
const parentReportAction = (0, reportActions_1.default)(1);
beforeEach(() => {
    // Initialize the network key for OfflineWithFeedback
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
    (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
    signUpWithTestUser();
});
afterEach(() => {
    react_native_onyx_1.default.clear();
});
function ReportActionsListWrapper() {
    const reportActions = ReportTestUtils.getMockedSortedReportActions(500);
    return (<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, AttachmentModalContext_1.AttachmentModalContextProvider]}>
            <ReportScreenContext_1.ReactionListContext.Provider value={mockRef}>
                <ReportScreenContext_1.ActionListContext.Provider value={mockRef}>
                    <ReportActionsList_1.default parentReportAction={parentReportAction} parentReportActionForTransactionThread={undefined} sortedReportActions={reportActions} sortedVisibleReportActions={reportActions} report={report} onLayout={mockOnLayout} onScroll={mockOnScroll} listID={1} loadOlderChats={mockLoadChats} loadNewerChats={mockLoadChats} transactionThreadReport={report}/>
                </ReportScreenContext_1.ActionListContext.Provider>
            </ReportScreenContext_1.ReactionListContext.Provider>
        </ComposeProviders_1.default>);
}
test('[ReportActionsList] should render ReportActionsList with 500 reportActions stored', async () => {
    const scenario = async () => {
        await react_native_1.screen.findByTestId('report-actions-list');
    };
    await (0, waitForBatchedUpdates_1.default)();
    await (0, reassure_1.measureRenders)(<ReportActionsListWrapper />, { scenario });
});
