"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
/**
 * Reset user's USD reimbursement account. This will delete the bank account
 */
function resetUSDBankAccount(bankAccountID, session, policyID, achAccount, lastUsedPaymentMethod) {
    if (!bankAccountID) {
        throw new Error('Missing bankAccountID when attempting to reset free plan bank account');
    }
    if (!session?.email) {
        throw new Error('Missing credentials when attempting to reset free plan bank account');
    }
    const isLastUsedPaymentMethodBBA = lastUsedPaymentMethod?.expense?.name === CONST_1.default.IOU.PAYMENT_TYPE.VBBA;
    const isPreviousLastUsedPaymentMethodBBA = lastUsedPaymentMethod?.lastUsed?.name === CONST_1.default.IOU.PAYMENT_TYPE.VBBA;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    shouldShowResetModal: false,
                    isLoading: true,
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                    achData: null,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    achAccount: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.ONFIDO_TOKEN,
                value: '',
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.ONFIDO_APPLICANT_ID,
                value: '',
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.PLAID_DATA,
                value: CONST_1.default.PLAID.DEFAULT_DATA,
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.PLAID_LINK_TOKEN,
                value: '',
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: CONST_1.default.REIMBURSEMENT_ACCOUNT.DEFAULT_DATA,
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT,
                value: {
                    [ReimbursementAccountForm_1.default.BENEFICIAL_OWNER_INFO_STEP.OWNS_MORE_THAN_25_PERCENT]: false,
                    [ReimbursementAccountForm_1.default.BENEFICIAL_OWNER_INFO_STEP.HAS_OTHER_BENEFICIAL_OWNERS]: false,
                    [ReimbursementAccountForm_1.default.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNERS]: '',
                    [ReimbursementAccountForm_1.default.BANK_INFO_STEP.ACCOUNT_NUMBER]: '',
                    [ReimbursementAccountForm_1.default.BANK_INFO_STEP.ROUTING_NUMBER]: '',
                    [ReimbursementAccountForm_1.default.BANK_INFO_STEP.PLAID_ACCOUNT_ID]: '',
                    [ReimbursementAccountForm_1.default.BANK_INFO_STEP.PLAID_MASK]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.COMPANY_NAME]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.STREET]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.CITY]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.STATE]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.ZIP_CODE]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.COMPANY_PHONE]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.COMPANY_WEBSITE]: undefined,
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.COMPANY_TAX_ID]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.INCORPORATION_TYPE]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.INCORPORATION_DATE]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.INCORPORATION_STATE]: '',
                    [ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.HAS_NO_CONNECTION_TO_CANNABIS]: false,
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.FIRST_NAME]: '',
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.LAST_NAME]: '',
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.STREET]: '',
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.CITY]: '',
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.STATE]: '',
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.ZIP_CODE]: '',
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.IS_ONFIDO_SETUP_COMPLETE]: false,
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.DOB]: '',
                    [ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP.SSN_LAST_4]: '',
                    [ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION.ACCEPT_TERMS_AND_CONDITIONS]: false,
                    [ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION.CERTIFY_TRUE_INFORMATION]: false,
                    [ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION.IS_AUTHORIZED_TO_USE_BANK_ACCOUNT]: false,
                    [ReimbursementAccountForm_1.default.BANK_INFO_STEP.IS_SAVINGS]: false,
                    [ReimbursementAccountForm_1.default.BANK_INFO_STEP.BANK_NAME]: '',
                    [ReimbursementAccountForm_1.default.BANK_INFO_STEP.PLAID_ACCESS_TOKEN]: '',
                    [ReimbursementAccountForm_1.default.BANK_INFO_STEP.SELECTED_PLAID_ACCOUNT_ID]: '',
                    [ReimbursementAccountForm_1.default.AMOUNT1]: '',
                    [ReimbursementAccountForm_1.default.AMOUNT2]: '',
                    [ReimbursementAccountForm_1.default.AMOUNT3]: '',
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: { isLoading: false, pendingAction: null },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    achAccount,
                },
            },
        ],
    };
    if (isLastUsedPaymentMethodBBA && policyID) {
        onyxData.successData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
            value: {
                [policyID]: {
                    expense: {
                        name: isPreviousLastUsedPaymentMethodBBA ? '' : lastUsedPaymentMethod?.lastUsed.name,
                    },
                    lastUsed: {
                        name: isPreviousLastUsedPaymentMethodBBA ? '' : lastUsedPaymentMethod?.lastUsed.name,
                    },
                },
            },
        });
    }
    API.write(types_1.WRITE_COMMANDS.RESTART_BANK_ACCOUNT_SETUP, {
        bankAccountID,
        ownerEmail: session.email,
        policyID,
    }, onyxData);
}
exports.default = resetUSDBankAccount;
