"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const utils_1 = require("@src/pages/settings/Subscription/CardSection/utils");
const TestHelper_1 = require("../utils/TestHelper");
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- this param is required for the mock
function translateMock(path, ...phraseParameters) {
    return path;
}
const AMOUNT_OWED = 100;
const GRACE_PERIOD_DATE = 1750819200;
const stripeCustomerId = TestHelper_1.STRIPE_CUSTOMER_ID;
const ACCOUNT_DATA = {
    cardNumber: '1234',
    cardMonth: 12,
    cardYear: 2024,
};
const mockGetSubscriptionStatus = jest.fn();
jest.mock('@libs/SubscriptionUtils', () => ({
    ...jest.requireActual('@libs/SubscriptionUtils'),
    getAmountOwed: () => AMOUNT_OWED,
    getOverdueGracePeriodDate: () => GRACE_PERIOD_DATE,
    getSubscriptionStatus: () => mockGetSubscriptionStatus(),
}));
describe('getNextBillingDate', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        // Month is zero indexed, so this is July 5th 2024
        jest.setSystemTime(new Date(2024, 6, 5));
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    it('should return the next billing date when initial date is valid', () => {
        const expectedNextBillingDate = 'August 1, 2024';
        expect(utils_1.default.getNextBillingDate()).toEqual(expectedNextBillingDate);
    });
    it('should handle end-of-month edge cases correctly', () => {
        const nextBillingDate = utils_1.default.getNextBillingDate();
        const expectedNextBillingDate = 'August 1, 2024';
        expect(nextBillingDate).toBe(expectedNextBillingDate);
    });
    it('should handle date when it at the current month', () => {
        const nextBillingDate = utils_1.default.getNextBillingDate();
        const expectedNextBillingDate = 'August 1, 2024';
        expect(nextBillingDate).toBe(expectedNextBillingDate);
    });
    it('should return the next billing date when initial date is invalid', () => {
        const expectedNextBillingDate = 'August 1, 2024';
        expect(utils_1.default.getNextBillingDate()).toEqual(expectedNextBillingDate);
    });
});
describe('CardSectionUtils', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    beforeAll(() => {
        mockGetSubscriptionStatus.mockReturnValue('');
        jest.useFakeTimers();
        // Month is zero indexed, so this is July 5th 2024
        jest.setSystemTime(new Date(2024, 6, 5));
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    it('should return undefined by default', () => {
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toBeUndefined();
    });
    it('should return POLICY_OWNER_WITH_AMOUNT_OWED variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.POLICY_OWNER_WITH_AMOUNT_OWED,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.policyOwnerAmountOwed.title',
            subtitle: 'subscription.billingBanner.policyOwnerAmountOwed.subtitle',
            isError: true,
            isRetryAvailable: true,
        });
    });
    it('should return POLICY_OWNER_WITH_AMOUNT_OWED_OVERDUE variant with isRetryAvailable true when accountData is provided', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.POLICY_OWNER_WITH_AMOUNT_OWED_OVERDUE,
        });
        const mockPurchase = {
            message: {
                billingType: 'failed_2018',
                billableAmount: 1000,
            },
            currency: 'USD',
            created: '2023-01-01',
            amount: 1000,
            purchaseID: 12345,
        };
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA, purchase: mockPurchase })).toEqual({
            title: 'subscription.billingBanner.policyOwnerAmountOwedOverdue.title',
            subtitle: 'subscription.billingBanner.policyOwnerAmountOwedOverdue.subtitle',
            isError: true,
            isRetryAvailable: true,
        });
    });
    it('should return POLICY_OWNER_WITH_AMOUNT_OWED_OVERDUE variant with isRetryAvailable undefined when accountData is null', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.POLICY_OWNER_WITH_AMOUNT_OWED_OVERDUE,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: undefined })).toEqual({
            title: 'subscription.billingBanner.policyOwnerAmountOwedOverdue.title',
            subtitle: 'subscription.billingBanner.policyOwnerAmountOwedOverdue.subtitle',
            isError: true,
            isRetryAvailable: undefined,
        });
    });
    it('should return OWNER_OF_POLICY_UNDER_INVOICING variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.OWNER_OF_POLICY_UNDER_INVOICING,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.policyOwnerUnderInvoicing.title',
            subtitle: 'subscription.billingBanner.policyOwnerUnderInvoicing.subtitle',
            isError: true,
            isAddButtonDark: true,
        });
    });
    it('should return OWNER_OF_POLICY_UNDER_INVOICING_OVERDUE variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.OWNER_OF_POLICY_UNDER_INVOICING_OVERDUE,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.policyOwnerUnderInvoicingOverdue.title',
            subtitle: 'subscription.billingBanner.policyOwnerUnderInvoicingOverdue.subtitle',
            isError: true,
            isAddButtonDark: true,
        });
    });
    it('should return BILLING_DISPUTE_PENDING variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.BILLING_DISPUTE_PENDING,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.billingDisputePending.title',
            subtitle: 'subscription.billingBanner.billingDisputePending.subtitle',
            isError: true,
            isRetryAvailable: false,
        });
    });
    it('should return CARD_AUTHENTICATION_REQUIRED variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.CARD_AUTHENTICATION_REQUIRED,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.cardAuthenticationRequired.title',
            subtitle: 'subscription.billingBanner.cardAuthenticationRequired.subtitle',
            isError: true,
            isAuthenticationRequired: true,
        });
    });
    it('should return INSUFFICIENT_FUNDS variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.INSUFFICIENT_FUNDS,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.insufficientFunds.title',
            subtitle: 'subscription.billingBanner.insufficientFunds.subtitle',
            isError: true,
            isRetryAvailable: true,
        });
    });
    it('should return CARD_EXPIRED variant with correct isRetryAvailableStatus for expired and unexpired card', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.CARD_EXPIRED,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: { ...ACCOUNT_DATA, cardYear: 2023 } })).toEqual({
            title: 'subscription.billingBanner.cardExpired.title',
            subtitle: 'subscription.billingBanner.cardExpired.subtitle',
            isError: true,
            isRetryAvailable: false,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.cardExpired.title',
            subtitle: 'subscription.billingBanner.cardExpired.subtitle',
            isError: true,
            isRetryAvailable: true,
        });
    });
    it('should return CARD_EXPIRE_SOON variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.CARD_EXPIRE_SOON,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.cardExpireSoon.title',
            subtitle: 'subscription.billingBanner.cardExpireSoon.subtitle',
            isError: false,
            icon: Illustrations.CreditCardEyes,
        });
    });
    it('should return RETRY_BILLING_SUCCESS variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.RETRY_BILLING_SUCCESS,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.retryBillingSuccess.title',
            subtitle: 'subscription.billingBanner.retryBillingSuccess.subtitle',
            isError: false,
            rightIcon: Expensicons.Close,
        });
    });
    it('should return RETRY_BILLING_ERROR variant', () => {
        mockGetSubscriptionStatus.mockReturnValue({
            status: SubscriptionUtils_1.PAYMENT_STATUS.RETRY_BILLING_ERROR,
        });
        expect(utils_1.default.getBillingStatus({ translate: translateMock, stripeCustomerId, accountData: ACCOUNT_DATA })).toEqual({
            title: 'subscription.billingBanner.retryBillingError.title',
            subtitle: 'subscription.billingBanner.retryBillingError.subtitle',
            isError: true,
            isRetryAvailable: false,
        });
    });
});
