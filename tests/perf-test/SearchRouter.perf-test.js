"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const reassure_1 = require("reassure");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SearchAutocompleteInput_1 = require("@components/Search/SearchAutocompleteInput");
const SearchRouter_1 = require("@components/Search/SearchRouter/SearchRouter");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ComposeProviders_1 = require("@src/components/ComposeProviders");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const createCollection_1 = require("../utils/collections/createCollection");
const personalDetails_1 = require("../utils/collections/personalDetails");
const reports_1 = require("../utils/collections/reports");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
jest.mock('lodash/debounce', () => jest.fn((fn) => {
    // eslint-disable-next-line no-param-reassign
    fn.cancel = jest.fn();
    return fn;
}));
jest.mock('@src/libs/Log');
jest.mock('@src/libs/API', () => ({
    write: jest.fn(),
    makeRequestWithSideEffects: jest.fn(),
    read: jest.fn(),
}));
jest.mock('@src/libs/Navigation/Navigation', () => ({
    dismissModalWithReport: jest.fn(),
    getTopmostReportId: jest.fn(),
    isNavigationReady: jest.fn(() => Promise.resolve()),
    isDisplayedInModal: jest.fn(() => false),
}));
jest.mock('@src/hooks/useRootNavigationState');
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useFocusEffect: jest.fn(),
        useIsFocused: () => true,
        useRoute: () => jest.fn(),
        usePreventRemove: () => jest.fn(),
        useNavigation: () => ({
            navigate: jest.fn(),
            addListener: () => jest.fn(),
        }),
        createNavigationContainerRef: () => ({
            addListener: () => jest.fn(),
            removeListener: () => jest.fn(),
            isReady: () => jest.fn(),
            getCurrentRoute: () => jest.fn(),
            getState: () => jest.fn(),
        }),
        useNavigationState: () => ({
            routes: [],
        }),
    };
});
jest.mock('@src/components/ConfirmedRoute.tsx');
const getMockedReports = (length = 100) => (0, createCollection_1.default)((item) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, (index) => (0, reports_1.createRandomReport)(index), length);
const getMockedPersonalDetails = (length = 100) => (0, createCollection_1.default)((item) => item.accountID, (index) => (0, personalDetails_1.default)(index), length);
const mockedReports = getMockedReports(600);
const mockedBetas = Object.values(CONST_1.default.BETAS);
const mockedPersonalDetails = getMockedPersonalDetails(100);
const mockedOptions = (0, OptionsListUtils_1.createOptionList)(mockedPersonalDetails, mockedReports);
beforeAll(() => react_native_onyx_1.default.init({
    keys: ONYXKEYS_1.default,
    evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT],
}));
// Initialize the network key for OfflineWithFeedback
beforeEach(() => {
    global.fetch = TestHelper.getGlobalFetchMock();
    (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false });
});
// Clear out Onyx after each test so that each test starts with a clean state
afterEach(() => {
    react_native_onyx_1.default.clear();
});
const mockOnClose = jest.fn();
function SearchAutocompleteInputWrapper() {
    const [value, setValue] = react_1.default.useState('');
    return (<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <SearchAutocompleteInput_1.default value={value} onSearchQueryChange={(searchTerm) => setValue(searchTerm)} isFullWidth={false} substitutionMap={CONST_1.default.EMPTY_OBJECT}/>
        </ComposeProviders_1.default>);
}
function SearchRouterWrapperWithCachedOptions() {
    return (<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            <OptionListContextProvider_1.OptionsListContext.Provider value={(0, react_1.useMemo)(() => ({ options: mockedOptions, initializeOptions: () => { }, resetOptions: () => { }, areOptionsInitialized: true }), [])}>
                <SearchRouter_1.default onRouterClose={mockOnClose}/>
            </OptionListContextProvider_1.OptionsListContext.Provider>
        </ComposeProviders_1.default>);
}
test('[SearchRouter] should render list with cached options', async () => {
    const scenario = async () => {
        await react_native_1.screen.findByTestId('SearchRouter');
    };
    return (0, waitForBatchedUpdates_1.default)()
        .then(() => react_native_onyx_1.default.multiSet({
        ...mockedReports,
        [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: mockedPersonalDetails,
        [ONYXKEYS_1.default.BETAS]: mockedBetas,
        [ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS]: true,
    }))
        .then(() => (0, reassure_1.measureRenders)(<SearchRouterWrapperWithCachedOptions />, { scenario }));
});
test('[SearchRouter] should react to text input changes', async () => {
    const scenario = async () => {
        const input = await react_native_1.screen.findByTestId('search-autocomplete-text-input');
        react_native_1.fireEvent.changeText(input, 'Email Four');
        react_native_1.fireEvent.changeText(input, 'Report');
        react_native_1.fireEvent.changeText(input, 'Email Five');
    };
    return (0, waitForBatchedUpdates_1.default)()
        .then(() => react_native_onyx_1.default.multiSet({
        ...mockedReports,
        [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: mockedPersonalDetails,
        [ONYXKEYS_1.default.BETAS]: mockedBetas,
        [ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS]: true,
    }))
        .then(() => (0, reassure_1.measureRenders)(<SearchAutocompleteInputWrapper />, { scenario }));
});
