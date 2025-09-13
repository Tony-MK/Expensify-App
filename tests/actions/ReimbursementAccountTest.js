"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const resetUSDBankAccount_1 = require("@src/libs/actions/ReimbursementAccount/resetUSDBankAccount");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const TEST_EMAIL = 'test@test.com';
const TEST_ACCOUNT_ID = 1;
const bankAccountID = 1;
const policyID = '1234567890';
const session = { email: TEST_EMAIL, accountID: TEST_ACCOUNT_ID };
describe('ReimbursementAccount', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    let mockFetch;
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    describe('resetUSDBankAccount', () => {
        afterEach(() => {
            mockFetch?.resume?.();
        });
        it('should reset the USDBankAccount', async () => {
            fetch?.pause?.();
            const achAccount = {
                bankAccountID,
                addressName: 'Test Address',
                bankName: 'Test Bank',
                reimburser: TEST_EMAIL,
                accountNumber: '1234567890',
                routingNumber: '123456789',
            };
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { achAccount });
            (0, resetUSDBankAccount_1.default)(bankAccountID, session, policyID, achAccount);
            return (0, waitForBatchedUpdates_1.default)().then(() => new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.achAccount).toBeUndefined();
                        resolve();
                    },
                });
            }));
        });
    });
});
