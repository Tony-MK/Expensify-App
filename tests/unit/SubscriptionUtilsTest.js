"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_native_onyx_1 = require("react-native-onyx");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const TestHelper_1 = require("../utils/TestHelper");
const billingGraceEndPeriod = {
    value: 0,
};
const GRACE_PERIOD_DATE = new Date().getTime() + 1000 * 3600;
const GRACE_PERIOD_DATE_OVERDUE = new Date().getTime() - 1000;
const AMOUNT_OWED = 100;
const stripeCustomerId = TestHelper_1.STRIPE_CUSTOMER_ID;
const BILLING_STATUS_INSUFFICIENT_FUNDS = {
    action: 'action',
    periodMonth: 'periodMonth',
    periodYear: 'periodYear',
    declineReason: 'insufficient_funds',
};
const BILLING_STATUS_EXPIRED_CARD = {
    ...BILLING_STATUS_INSUFFICIENT_FUNDS,
    declineReason: 'expired_card',
};
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
react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
describe('SubscriptionUtils', () => {
    describe('calculateRemainingFreeTrialDays', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: null,
            });
        });
        it('should return 0 if the Onyx key is not set', () => {
            expect((0, SubscriptionUtils_1.calculateRemainingFreeTrialDays)()).toBe(0);
        });
        it('should return 0 if the current date is after the free trial end date', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL, (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 8), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING));
            expect((0, SubscriptionUtils_1.calculateRemainingFreeTrialDays)()).toBe(0);
        });
        it('should return 1 if the current date is on the same day of the free trial end date, but some minutes earlier', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL, (0, date_fns_1.format)((0, date_fns_1.addMinutes)(new Date(), 30), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING));
            expect((0, SubscriptionUtils_1.calculateRemainingFreeTrialDays)()).toBe(1);
        });
        it('should return the remaining days if the current date is before the free trial end date', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL, (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 5), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING));
            expect((0, SubscriptionUtils_1.calculateRemainingFreeTrialDays)()).toBe(5);
        });
    });
    describe('isUserOnFreeTrial', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: null,
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: null,
            });
        });
        it('should return false if the Onyx keys are not set', () => {
            expect((0, SubscriptionUtils_1.isUserOnFreeTrial)()).toBeFalsy();
        });
        it('should return false if the current date is before the free trial start date', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 2), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 4), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.isUserOnFreeTrial)()).toBeFalsy();
        });
        it('should return false if the current date is after the free trial end date', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 4), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 2), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.isUserOnFreeTrial)()).toBeFalsy();
        });
        it('should return true if the current date is on the same date of free trial start date', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 3), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.isUserOnFreeTrial)()).toBeTruthy();
        });
        it('should return true if the current date is on the same date of free trial end date, but some minutes earlier', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 2), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addMinutes)(new Date(), 30), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.isUserOnFreeTrial)()).toBeTruthy();
        });
        it('should return true if the current date is between the free trial start and end dates', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 1), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 3), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.isUserOnFreeTrial)()).toBeTruthy();
        });
    });
    describe('hasUserFreeTrialEnded', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: null,
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: null,
            });
        });
        it('should return false if the Onyx key is not set', () => {
            expect((0, SubscriptionUtils_1.hasUserFreeTrialEnded)()).toBeFalsy();
        });
        it('should return false if the current date is before the free trial end date', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL, (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 1), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING));
            expect((0, SubscriptionUtils_1.hasUserFreeTrialEnded)()).toBeFalsy();
        });
        it('should return true if the current date is after the free trial end date', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL, (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 2), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING));
            expect((0, SubscriptionUtils_1.hasUserFreeTrialEnded)()).toBeTruthy();
        });
    });
    describe('doesUserHavePaymentCardAdded', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_BILLING_FUND_ID]: null,
            });
        });
        it('should return false if the Onyx key is not set', () => {
            expect((0, SubscriptionUtils_1.doesUserHavePaymentCardAdded)()).toBeFalsy();
        });
        it('should return true if the Onyx key is set', async () => {
            await react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, 8010);
            expect((0, SubscriptionUtils_1.doesUserHavePaymentCardAdded)()).toBeTruthy();
        });
    });
    describe('shouldRestrictUserBillableActions', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: null,
                [ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_USER_BILLING_GRACE_PERIOD_END]: null,
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: null,
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: null,
                [ONYXKEYS_1.default.COLLECTION.POLICY]: null,
            });
        });
        it("should return false if the user isn't a workspace's owner or isn't a member of any past due billing workspace", () => {
            expect((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)('1')).toBeFalsy();
        });
        it('should return false if the user is a non-owner of a workspace that is not in the shared NVP collection', async () => {
            const policyID = '1001';
            const ownerAccountID = 2001;
            await react_native_onyx_1.default.multiSet({
                [`${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_USER_BILLING_GRACE_PERIOD_END}${ownerAccountID}`]: {
                    ...billingGraceEndPeriod,
                    value: (0, date_fns_1.getUnixTime)((0, date_fns_1.subDays)(new Date(), 3)), // past due
                },
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID: 2002, // owner not in the shared NVP collection
                },
            });
            expect((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyID)).toBeFalsy();
        });
        it("should return false if the user is a workspace's non-owner that is not past due billing", async () => {
            const policyID = '1001';
            const ownerAccountID = 2001;
            await react_native_onyx_1.default.multiSet({
                [`${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_USER_BILLING_GRACE_PERIOD_END}${ownerAccountID}`]: {
                    ...billingGraceEndPeriod,
                    value: (0, date_fns_1.getUnixTime)((0, date_fns_1.addDays)(new Date(), 3)), // not past due
                },
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID, // owner in the shared NVP collection
                },
            });
            expect((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyID)).toBeFalsy();
        });
        it("should return true if the user is a workspace's non-owner that is past due billing", async () => {
            const policyID = '1001';
            const ownerAccountID = 2001;
            await react_native_onyx_1.default.multiSet({
                [`${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_USER_BILLING_GRACE_PERIOD_END}${ownerAccountID}`]: {
                    ...billingGraceEndPeriod,
                    value: (0, date_fns_1.getUnixTime)((0, date_fns_1.subDays)(new Date(), 3)), // past due
                },
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID, // owner in the shared NVP collection
                },
            });
            expect((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyID)).toBeTruthy();
        });
        it("should return false if the user is the workspace's owner but is not past due billing", async () => {
            const accountID = 1;
            const policyID = '1001';
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { email: '', accountID },
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: (0, date_fns_1.getUnixTime)((0, date_fns_1.addDays)(new Date(), 3)), // not past due
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID: accountID,
                },
            });
            expect((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyID)).toBeFalsy();
        });
        it("should return false if the user is the workspace's owner that is past due billing but isn't owning any amount", async () => {
            const accountID = 1;
            const policyID = '1001';
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { email: '', accountID },
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: (0, date_fns_1.getUnixTime)((0, date_fns_1.subDays)(new Date(), 3)), // past due
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: 0,
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID: accountID,
                },
            });
            expect((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyID)).toBeFalsy();
        });
        it("should return true if the user is the workspace's owner that is past due billing and is owning some amount", async () => {
            const accountID = 1;
            const policyID = '1001';
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { email: '', accountID },
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: (0, date_fns_1.getUnixTime)((0, date_fns_1.subDays)(new Date(), 3)), // past due
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: 8010,
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID: accountID,
                },
            });
            expect((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyID)).toBeTruthy();
        });
        it("should return false if the user is past due billing but is not the workspace's owner", async () => {
            const accountID = 1;
            const policyID = '1001';
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { email: '', accountID },
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: (0, date_fns_1.getUnixTime)((0, date_fns_1.subDays)(new Date(), 3)), // past due
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: 8010,
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID: 2, // not the user
                },
            });
            expect((0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policyID)).toBeFalsy();
        });
    });
    describe('getSubscriptionStatus', () => {
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: null,
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: null,
                [ONYXKEYS_1.default.NVP_PRIVATE_BILLING_DISPUTE_PENDING]: null,
                [ONYXKEYS_1.default.NVP_PRIVATE_STRIPE_CUSTOMER_ID]: null,
                [ONYXKEYS_1.default.NVP_PRIVATE_BILLING_STATUS]: null,
                [ONYXKEYS_1.default.FUND_LIST]: null,
                [ONYXKEYS_1.default.SUBSCRIPTION_RETRY_BILLING_STATUS_SUCCESSFUL]: null,
                [ONYXKEYS_1.default.SUBSCRIPTION_RETRY_BILLING_STATUS_FAILED]: null,
            });
        });
        it('should return undefined by default', () => {
            const stripeCustomerIdForDefault = {};
            // @ts-expect-error - This is a test case
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerIdForDefault)).toBeUndefined();
        });
        it('should return POLICY_OWNER_WITH_AMOUNT_OWED status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: GRACE_PERIOD_DATE,
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: AMOUNT_OWED,
            });
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerId)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.POLICY_OWNER_WITH_AMOUNT_OWED,
                isError: true,
            });
        });
        it('should return POLICY_OWNER_WITH_AMOUNT_OWED_OVERDUE status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: GRACE_PERIOD_DATE_OVERDUE,
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: AMOUNT_OWED,
            });
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerId)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.POLICY_OWNER_WITH_AMOUNT_OWED_OVERDUE,
                isError: true,
            });
        });
        it('should return OWNER_OF_POLICY_UNDER_INVOICING_OVERDUE status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: GRACE_PERIOD_DATE_OVERDUE,
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: 0,
            });
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerId)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.OWNER_OF_POLICY_UNDER_INVOICING_OVERDUE,
                isError: true,
            });
        });
        it('should return OWNER_OF_POLICY_UNDER_INVOICING status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: GRACE_PERIOD_DATE,
            });
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerId)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.OWNER_OF_POLICY_UNDER_INVOICING,
                isError: true,
            });
        });
        it('should return BILLING_DISPUTE_PENDING status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_OWNER_BILLING_GRACE_PERIOD_END]: 0,
                [ONYXKEYS_1.default.NVP_PRIVATE_BILLING_DISPUTE_PENDING]: 1,
            });
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerId)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.BILLING_DISPUTE_PENDING,
                isError: true,
            });
        });
        it('should return CARD_AUTHENTICATION_REQUIRED status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: 0,
                [ONYXKEYS_1.default.NVP_PRIVATE_BILLING_DISPUTE_PENDING]: 0,
                [ONYXKEYS_1.default.NVP_PRIVATE_STRIPE_CUSTOMER_ID]: TestHelper_1.STRIPE_CUSTOMER_ID,
            });
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerId)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.CARD_AUTHENTICATION_REQUIRED,
                isError: true,
            });
        });
        it('should return INSUFFICIENT_FUNDS status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: AMOUNT_OWED,
                [ONYXKEYS_1.default.NVP_PRIVATE_STRIPE_CUSTOMER_ID]: {},
                [ONYXKEYS_1.default.NVP_PRIVATE_BILLING_STATUS]: BILLING_STATUS_INSUFFICIENT_FUNDS,
            });
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerId)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.INSUFFICIENT_FUNDS,
                isError: true,
            });
        });
        it('should return CARD_EXPIRED status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_BILLING_STATUS]: BILLING_STATUS_EXPIRED_CARD,
            });
            const stripeCustomerIdForCardExpired = {
                paymentMethodID: '1',
                intentsID: '2',
                currency: 'USD',
            };
            // @ts-expect-error - This is a test case
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerIdForCardExpired)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.CARD_EXPIRED,
                isError: true,
            });
        });
        it('should return CARD_EXPIRE_SOON status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_PRIVATE_AMOUNT_OWED]: 0,
                [ONYXKEYS_1.default.NVP_PRIVATE_BILLING_STATUS]: {},
                [ONYXKEYS_1.default.FUND_LIST]: FUND_LIST,
            });
            const stripeCustomerIdForCardExpireSoon = {
                paymentMethodID: '1',
                intentsID: '2',
                currency: 'USD',
            };
            // @ts-expect-error - This is a test case
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerIdForCardExpireSoon)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.CARD_EXPIRE_SOON,
            });
        });
        it('should return RETRY_BILLING_SUCCESS status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.FUND_LIST]: {},
                [ONYXKEYS_1.default.SUBSCRIPTION_RETRY_BILLING_STATUS_SUCCESSFUL]: true,
            });
            const stripeCustomerIdForRetryBillingSuccess = {
                paymentMethodID: '1',
                intentsID: '2',
                currency: 'USD',
            };
            // @ts-expect-error - This is a test case
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerIdForRetryBillingSuccess)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.RETRY_BILLING_SUCCESS,
                isError: false,
            });
        });
        it('should return RETRY_BILLING_ERROR status', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.FUND_LIST]: {},
                [ONYXKEYS_1.default.SUBSCRIPTION_RETRY_BILLING_STATUS_SUCCESSFUL]: false,
                [ONYXKEYS_1.default.SUBSCRIPTION_RETRY_BILLING_STATUS_FAILED]: true,
            });
            const stripeCustomerIdForRetryBillingError = {
                paymentMethodID: '1',
                intentsID: '2',
                currency: 'USD',
            };
            // @ts-expect-error - This is a test case
            expect((0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerIdForRetryBillingError)).toEqual({
                status: SubscriptionUtils_1.PAYMENT_STATUS.RETRY_BILLING_ERROR,
                isError: true,
            });
        });
    });
    describe('shouldShowDiscountBanner', () => {
        const ownerAccountID = 234;
        const policyID = '100012';
        afterEach(async () => {
            await react_native_onyx_1.default.clear();
        });
        it('should return false if the user is not on a free trial', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { accountID: ownerAccountID },
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID,
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                },
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: null,
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: null,
            });
            expect((0, SubscriptionUtils_1.shouldShowDiscountBanner)(true, 'corporate')).toBeFalsy();
        });
        it(`should return false if user has already added a payment method`, async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { accountID: ownerAccountID },
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID,
                    type: CONST_1.default.POLICY.TYPE.TEAM,
                },
                [ONYXKEYS_1.default.NVP_BILLING_FUND_ID]: 8010,
            });
            expect((0, SubscriptionUtils_1.shouldShowDiscountBanner)(true, 'corporate')).toBeFalsy();
        });
        it('should return false if the user is on Team plan', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { accountID: ownerAccountID },
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID,
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                },
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 1), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 10), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.shouldShowDiscountBanner)(true, 'team')).toBeFalsy();
        });
        it('should return true if the date is before the free trial end date or within the 8 days from the trial start date', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { accountID: ownerAccountID },
                [`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`]: {
                    ...(0, policies_1.default)(Number(policyID)),
                    ownerAccountID,
                    type: CONST_1.default.POLICY.TYPE.CORPORATE,
                },
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 1), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 10), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.shouldShowDiscountBanner)(true, 'corporate')).toBeTruthy();
        });
        it("should return false if user's trial is during the discount period but has no workspaces", async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { accountID: ownerAccountID },
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 1), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 10), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.shouldShowDiscountBanner)(true, 'corporate')).toBeFalsy();
        });
    });
    describe('getEarlyDiscountInfo', () => {
        const TEST_DATE = new Date();
        beforeEach(() => {
            jest.spyOn(Date, 'now').mockImplementation(() => TEST_DATE.getTime());
        });
        afterEach(async () => {
            jest.spyOn(Date, 'now').mockRestore();
            await react_native_onyx_1.default.clear();
        });
        it('should return the discount info if the user is on a free trial and trial was started less than 24 hours before', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addMinutes)((0, date_fns_1.subDays)(new Date(TEST_DATE), 1), 12), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(TEST_DATE), 10), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.getEarlyDiscountInfo)()).toEqual({
                discountType: 50,
                days: 0,
                hours: 0,
                minutes: 12,
                seconds: 0,
            });
        });
        it('should return the discount info if the user is on a free trial and trial was started more than 24 hours before', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(TEST_DATE), 2), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(TEST_DATE), 10), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING),
            });
            expect((0, SubscriptionUtils_1.getEarlyDiscountInfo)()).toEqual({
                discountType: 25,
                days: 6,
                hours: 0,
                minutes: 0,
                seconds: 0,
            });
        });
        it('should return null if the user is not on a free trial', async () => {
            await react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL]: null,
                [ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL]: null,
            });
            expect((0, SubscriptionUtils_1.getEarlyDiscountInfo)()).toBeNull();
        });
    });
});
