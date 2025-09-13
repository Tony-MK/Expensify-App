"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const CurrentUserPersonalDetailsProvider_1 = require("@components/CurrentUserPersonalDetailsProvider");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Localize_1 = require("@libs/Localize");
const IOURequestStepConfirmation_1 = require("@pages/iou/request/step/IOURequestStepConfirmation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const IOU = require("../../../src/libs/actions/IOU");
const TestHelper_1 = require("../../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../../utils/waitForBatchedUpdates");
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
jest.mock('@libs/actions/IOU', () => {
    const actualNav = jest.requireActual('@libs/actions/IOU');
    return {
        ...actualNav,
        startMoneyRequest: jest.fn(),
        startSplitBill: jest.fn(),
    };
});
jest.mock('@components/ProductTrainingContext', () => ({
    useProductTrainingContext: () => [false],
}));
jest.mock('@src/hooks/useResponsiveLayout');
jest.mock('@react-navigation/native', () => ({
    createNavigationContainerRef: jest.fn(),
    useIsFocused: () => true,
    useNavigation: () => ({ navigate: jest.fn(), addListener: jest.fn() }),
    useFocusEffect: jest.fn(),
    usePreventRemove: jest.fn(),
}));
const ACCOUNT_ID = 1;
const ACCOUNT_LOGIN = 'test@user.com';
const REPORT_ID = '1';
const PARTICIPANT_ACCOUNT_ID = 2;
const TRANSACTION_ID = '1';
const DEFAULT_SPLIT_TRANSACTION = {
    amount: 0,
    billable: false,
    comment: {
        attendees: [
            {
                accountID: ACCOUNT_ID,
                avatarUrl: '',
                displayName: '',
                email: ACCOUNT_LOGIN,
                login: ACCOUNT_LOGIN,
                reportID: REPORT_ID,
                selected: true,
                text: ACCOUNT_LOGIN,
            },
        ],
    },
    created: '2025-08-29',
    currency: 'USD',
    isFromGlobalCreate: false,
    merchant: '(none)',
    participants: [{ accountID: PARTICIPANT_ACCOUNT_ID, selected: true }],
    participantsAutoAssigned: true,
    reimbursable: true,
    reportID: REPORT_ID,
    splitPayerAccountIDs: [ACCOUNT_ID],
    transactionID: TRANSACTION_ID,
};
describe('IOURequestStepConfirmationPageTest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
    });
    it('should not restart the money request creation flow when sending invoice from global FAB', async () => {
        // Given an invoice creation flow started from global FAB menu
        const routeReportID = '1';
        const participantReportID = '2';
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${TRANSACTION_ID}`, {
            transactionID: TRANSACTION_ID,
            isFromGlobalCreate: true,
            participants: [
                {
                    accountID: 1,
                    reportID: participantReportID,
                    iouType: 'invoice',
                },
            ],
        });
        (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsProvider>
                    <LocaleContextProvider_1.LocaleContextProvider>
                        <IOURequestStepConfirmation_1.default route={{
                key: 'Money_Request_Step_Confirmation--30aPPAdjWan56sE5OpcG',
                name: 'Money_Request_Step_Confirmation',
                params: {
                    action: 'create',
                    iouType: 'invoice',
                    transactionID: TRANSACTION_ID,
                    reportID: routeReportID,
                },
            }} 
        // @ts-expect-error we don't need navigation param here.
        navigation={undefined}/>
                    </LocaleContextProvider_1.LocaleContextProvider>
                </CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsProvider>
            </OnyxListItemProvider_1.default>);
        await (0, waitForBatchedUpdates_1.default)();
        // Then startMoneyRequest should not be called from IOURequestConfirmationPage.
        expect(IOU.startMoneyRequest).not.toHaveBeenCalled();
    });
    it('should create a split expense for a scanned receipt', async () => {
        await (0, TestHelper_1.signInWithTestUser)(ACCOUNT_ID, ACCOUNT_LOGIN);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}1`, {
            ...DEFAULT_SPLIT_TRANSACTION,
            filename: 'receipt1.jpg',
            iouRequestType: 'scan',
            receipt: { source: 'path/to/receipt1.jpg', type: '' },
        });
        (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsProvider>
                    <LocaleContextProvider_1.LocaleContextProvider>
                        <IOURequestStepConfirmation_1.default route={{
                key: 'Money_Request_Step_Confirmation--30aPPAdjWan56sE5OpcG',
                name: 'Money_Request_Step_Confirmation',
                params: {
                    action: 'create',
                    iouType: 'split',
                    transactionID: TRANSACTION_ID,
                    reportID: REPORT_ID,
                },
            }} 
        // @ts-expect-error we don't need navigation param here.
        navigation={undefined}/>
                    </LocaleContextProvider_1.LocaleContextProvider>
                </CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsProvider>
            </OnyxListItemProvider_1.default>);
        react_native_1.fireEvent.press(await react_native_1.screen.findByText((0, Localize_1.translateLocal)('iou.splitExpense')));
        expect(IOU.startSplitBill).toHaveBeenCalledTimes(1);
    });
    it('should create a split expense for each scanned receipt', async () => {
        await (0, TestHelper_1.signInWithTestUser)(ACCOUNT_ID, ACCOUNT_LOGIN);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}1`, {
            ...DEFAULT_SPLIT_TRANSACTION,
            filename: 'receipt1.jpg',
            iouRequestType: 'scan',
            receipt: { source: 'path/to/receipt1.jpg', type: '' },
            transactionID: '1',
        });
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}2`, {
            ...DEFAULT_SPLIT_TRANSACTION,
            filename: 'receipt2.jpg',
            iouRequestType: 'scan',
            receipt: { source: 'path/to/receipt2.jpg', type: '' },
            transactionID: '2',
        });
        (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsProvider>
                    <LocaleContextProvider_1.LocaleContextProvider>
                        <IOURequestStepConfirmation_1.default route={{
                key: 'Money_Request_Step_Confirmation--30aPPAdjWan56sE5OpcG',
                name: 'Money_Request_Step_Confirmation',
                params: {
                    action: 'create',
                    iouType: 'split',
                    transactionID: TRANSACTION_ID,
                    reportID: REPORT_ID,
                },
            }} 
        // @ts-expect-error we don't need navigation param here.
        navigation={undefined}/>
                    </LocaleContextProvider_1.LocaleContextProvider>
                </CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsProvider>
            </OnyxListItemProvider_1.default>);
        react_native_1.fireEvent.press(await react_native_1.screen.findByText((0, Localize_1.translateLocal)('iou.createExpenses', { expensesNumber: 2 })));
        expect(IOU.startSplitBill).toHaveBeenCalledTimes(2);
    });
});
