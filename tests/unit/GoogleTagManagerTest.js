"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const IOU_1 = require("@libs/actions/IOU");
const PaymentMethods_1 = require("@libs/actions/PaymentMethods");
const Policy_1 = require("@libs/actions/Policy/Policy");
const GoogleTagManager_1 = require("@libs/GoogleTagManager");
const OnboardingModalNavigator_1 = require("@libs/Navigation/AppNavigator/Navigators/OnboardingModalNavigator");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@libs/GoogleTagManager');
// Mock the Overlay since it doesn't work in tests
jest.mock('@libs/Navigation/AppNavigator/Navigators/Overlay');
jest.mock('@src/components/ConfirmedRoute.tsx');
const FUND_LIST = {
    defaultCard: {
        isDefault: true,
        accountData: {
            cardYear: new Date().getFullYear(),
            cardMonth: new Date().getMonth() + 1,
            additionalData: {
                isBillingCard: true,
            },
        },
    },
};
describe('GoogleTagManagerTest', () => {
    const accountID = 123456;
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: {
                session: { accountID },
            },
        });
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('sign_up', () => {
        // When we render the OnboardingModal a few times
        const { rerender } = (0, react_native_1.render)(<native_1.NavigationContainer>
                <OnboardingModalNavigator_1.default />
            </native_1.NavigationContainer>);
        rerender(<native_1.NavigationContainer>
                <OnboardingModalNavigator_1.default />
            </native_1.NavigationContainer>);
        rerender(<native_1.NavigationContainer>
                <OnboardingModalNavigator_1.default />
            </native_1.NavigationContainer>);
        // Then we publish the sign_up event only once
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledTimes(1);
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledWith(CONST_1.default.ANALYTICS.EVENT.SIGN_UP, accountID);
    });
    test('workspace_created', async () => {
        // When we run the createWorkspace action a few times
        (0, Policy_1.createWorkspace)({});
        await (0, waitForBatchedUpdates_1.default)();
        (0, Policy_1.createWorkspace)({});
        await (0, waitForBatchedUpdates_1.default)();
        (0, Policy_1.createWorkspace)({});
        // Then we publish a workspace_created event only once
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledTimes(1);
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledWith(CONST_1.default.ANALYTICS.EVENT.WORKSPACE_CREATED, accountID);
    });
    test('workspace_created - categorizeTrackedExpense', () => {
        (0, IOU_1.trackExpense)({
            report: { reportID: '123' },
            isDraftPolicy: true,
            action: CONST_1.default.IOU.ACTION.CATEGORIZE,
            participantParams: {
                payeeEmail: undefined,
                payeeAccountID: 0,
                participant: { accountID },
            },
            transactionParams: {
                amount: 1000,
                currency: 'USD',
                created: '2024-10-30',
                merchant: 'merchant',
                comment: 'comment',
                category: 'category',
                tag: 'tag',
                taxCode: 'taxCode',
                actionableWhisperReportActionID: 'actionableWhisperReportActionID',
                linkedTrackedExpenseReportAction: { actionName: 'IOU', reportActionID: 'linkedTrackedExpenseReportAction', created: '2024-10-30' },
                linkedTrackedExpenseReportID: 'linkedTrackedExpenseReportID',
            },
        });
        // Then we publish a workspace_created event only once
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledTimes(1);
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledWith('workspace_created', accountID);
    });
    test('paid_adoption - addPaymentCard', () => {
        // When we add a payment card
        (0, PaymentMethods_1.addPaymentCard)(accountID, {
            expirationDate: '2077-10-30',
            addressZipCode: 'addressZipCode',
            cardNumber: 'cardNumber',
            nameOnCard: 'nameOnCard',
            securityCode: 'securityCode',
        });
        // Then we publish a paid_adoption event only once
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledTimes(1);
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledWith(CONST_1.default.ANALYTICS.EVENT.PAID_ADOPTION, accountID);
    });
    test('paid_adoption - addSubscriptionPaymentCard', () => {
        // When we add a payment card
        (0, PaymentMethods_1.addSubscriptionPaymentCard)(accountID, {
            cardNumber: 'cardNumber',
            cardYear: 'cardYear',
            cardMonth: 'cardMonth',
            cardCVV: 'cardCVV',
            addressName: 'addressName',
            addressZip: 'addressZip',
            currency: 'USD',
        });
        // Then we publish a paid_adoption event only once
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledTimes(1);
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledWith(CONST_1.default.ANALYTICS.EVENT.PAID_ADOPTION, accountID);
    });
    it('addSubscriptionPaymentCard when changing payment card, will not publish event paid_adoption', async () => {
        await react_native_onyx_1.default.multiSet({
            [ONYXKEYS_1.default.FUND_LIST]: FUND_LIST,
        });
        (0, PaymentMethods_1.addSubscriptionPaymentCard)(accountID, {
            cardNumber: 'cardNumber',
            cardYear: 'cardYear',
            cardMonth: 'cardMonth',
            cardCVV: 'cardCVV',
            addressName: 'addressName',
            addressZip: 'addressZip',
            currency: 'USD',
        });
        expect(!!(0, SubscriptionUtils_1.getCardForSubscriptionBilling)()).toBe(true);
        expect(GoogleTagManager_1.default.publishEvent).toBeCalledTimes(0);
    });
});
