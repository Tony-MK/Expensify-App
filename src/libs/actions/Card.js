"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestReplacementExpensifyCard = requestReplacementExpensifyCard;
exports.activatePhysicalExpensifyCard = activatePhysicalExpensifyCard;
exports.clearCardListErrors = clearCardListErrors;
exports.clearReportVirtualCardFraudForm = clearReportVirtualCardFraudForm;
exports.clearIssueNewCardError = clearIssueNewCardError;
exports.reportVirtualExpensifyCardFraud = reportVirtualExpensifyCardFraud;
exports.revealVirtualCardDetails = revealVirtualCardDetails;
exports.updateSettlementFrequency = updateSettlementFrequency;
exports.setIssueNewCardStepAndData = setIssueNewCardStepAndData;
exports.clearIssueNewCardFlow = clearIssueNewCardFlow;
exports.updateExpensifyCardLimit = updateExpensifyCardLimit;
exports.updateExpensifyCardTitle = updateExpensifyCardTitle;
exports.updateSettlementAccount = updateSettlementAccount;
exports.startIssueNewCardFlow = startIssueNewCardFlow;
exports.configureExpensifyCardsForPolicy = configureExpensifyCardsForPolicy;
exports.issueExpensifyCard = issueExpensifyCard;
exports.openCardDetailsPage = openCardDetailsPage;
exports.clearActivatedCardPin = clearActivatedCardPin;
exports.toggleContinuousReconciliation = toggleContinuousReconciliation;
exports.updateExpensifyCardLimitType = updateExpensifyCardLimitType;
exports.updateSelectedFeed = updateSelectedFeed;
exports.updateSelectedExpensifyCardFeed = updateSelectedExpensifyCardFeed;
exports.deactivateCard = deactivateCard;
exports.getCardDefaultName = getCardDefaultName;
exports.queueExpensifyCardForBilling = queueExpensifyCardForBilling;
exports.clearIssueNewCardFormData = clearIssueNewCardFormData;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const NetworkStore = require("@libs/Network/NetworkStore");
const PolicyUtils = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function reportVirtualExpensifyCardFraud(card, validateCode) {
    const cardID = card?.cardID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.REPORT_VIRTUAL_CARD_FRAUD,
            value: {
                cardID,
                isLoading: true,
                errors: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.REPORT_VIRTUAL_CARD_FRAUD,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.REPORT_VIRTUAL_CARD_FRAUD,
            value: {
                isLoading: false,
            },
        },
    ];
    const parameters = {
        cardID,
        validateCode,
    };
    API.write(types_1.WRITE_COMMANDS.REPORT_VIRTUAL_EXPENSIFY_CARD_FRAUD, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Call the API to deactivate the card and request a new one
 * @param cardID - id of the card that is going to be replaced
 * @param reason - reason for replacement
 */
function requestReplacementExpensifyCard(cardID, reason, validateCode) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.REPORT_PHYSICAL_CARD_FORM,
            value: {
                isLoading: true,
                errors: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_ACTION_CODE,
            value: {
                validateCodeSent: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.REPORT_PHYSICAL_CARD_FORM,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.REPORT_PHYSICAL_CARD_FORM,
            value: {
                isLoading: false,
            },
        },
    ];
    const parameters = {
        cardID,
        reason,
        validateCode,
    };
    API.write(types_1.WRITE_COMMANDS.REQUEST_REPLACEMENT_EXPENSIFY_CARD, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Activates the physical Expensify card based on the last four digits of the card number
 */
function activatePhysicalExpensifyCard(cardLastFourDigits, cardID) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: {
                [cardID]: {
                    errors: null,
                    isLoading: true,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: {
                [cardID]: {
                    isLoading: false,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: {
                [cardID]: {
                    isLoading: false,
                },
            },
        },
    ];
    const parameters = {
        cardLastFourDigits,
        cardID,
    };
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.ACTIVATE_PHYSICAL_EXPENSIFY_CARD, parameters, {
        optimisticData,
        successData,
        failureData,
    }).then((response) => {
        if (!response) {
            return;
        }
        if (response.pin) {
            react_native_onyx_1.default.set(ONYXKEYS_1.default.ACTIVATED_CARD_PIN, response.pin);
        }
    });
}
/**
 * Clears errors for a specific cardID
 */
function clearCardListErrors(cardID) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.CARD_LIST, { [cardID]: { errors: null, isLoading: false } });
}
/**
 * Clears the PIN for an activated card
 */
function clearActivatedCardPin() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ACTIVATED_CARD_PIN, '');
}
function clearReportVirtualCardFraudForm() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.REPORT_VIRTUAL_CARD_FRAUD, { cardID: null, isLoading: false, errors: null });
}
/**
 * Makes an API call to get virtual card details (pan, cvv, expiration date, address)
 * This function purposefully uses `makeRequestWithSideEffects` method. For security reason
 * card details cannot be persisted in Onyx and have to be asked for each time a user want's to
 * reveal them.
 *
 * @param cardID - virtual card ID
 *
 * @returns promise with card details object
 */
function revealVirtualCardDetails(cardID, validateCode) {
    return new Promise((resolve, reject) => {
        const parameters = { cardID, validateCode };
        const optimisticData = [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ACCOUNT,
                value: { isLoading: true },
            },
        ];
        const successData = [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ACCOUNT,
                value: { isLoading: false },
            },
        ];
        const failureData = [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ACCOUNT,
                value: { isLoading: false },
            },
        ];
        // eslint-disable-next-line rulesdir/no-api-side-effects-method
        API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.REVEAL_EXPENSIFY_CARD_DETAILS, parameters, {
            optimisticData,
            successData,
            failureData,
        })
            .then((response) => {
            if (response?.jsonCode !== CONST_1.default.JSON_CODE.SUCCESS) {
                if (response?.jsonCode === CONST_1.default.JSON_CODE.INCORRECT_MAGIC_CODE) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject('validateCodeForm.error.incorrectMagicCode');
                    return;
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('cardPage.cardDetailsLoadingFailure');
                return;
            }
            resolve(response);
        })
            // eslint-disable-next-line prefer-promise-reject-errors
            .catch(() => reject('cardPage.cardDetailsLoadingFailure'));
    });
}
function updateSettlementFrequency(workspaceAccountID, settlementFrequency, currentFrequency) {
    const monthlySettlementDate = settlementFrequency === CONST_1.default.EXPENSIFY_CARD.FREQUENCY_SETTING.DAILY ? null : new Date();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                monthlySettlementDate,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                monthlySettlementDate,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                monthlySettlementDate: currentFrequency,
            },
        },
    ];
    const parameters = {
        workspaceAccountID,
        settlementFrequency,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_CARD_SETTLEMENT_FREQUENCY, parameters, { optimisticData, successData, failureData });
}
function updateSettlementAccount(domainName, workspaceAccountID, policyID, settlementBankAccountID, currentSettlementBankAccountID) {
    if (!settlementBankAccountID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                paymentBankAccountID: settlementBankAccountID,
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                paymentBankAccountID: settlementBankAccountID,
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                paymentBankAccountID: currentSettlementBankAccountID,
                isLoading: false,
                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
            },
        },
    ];
    const parameters = {
        domainName,
        settlementBankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_CARD_SETTLEMENT_ACCOUNT, parameters, { optimisticData, successData, failureData });
}
function getCardDefaultName(userName) {
    if (!userName) {
        return '';
    }
    return `${userName}'s Card`;
}
function setIssueNewCardStepAndData({ data, isEditing, step, policyID, isChangeAssigneeDisabled }) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, {
        data,
        isEditing,
        currentStep: step,
        errors: null,
        isChangeAssigneeDisabled,
    });
}
function clearIssueNewCardFlow(policyID) {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, {
        currentStep: null,
        data: {},
    });
}
function clearIssueNewCardFormData() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.ISSUE_NEW_EXPENSIFY_CARD_FORM, {});
}
function clearIssueNewCardError(policyID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, { errors: null });
}
function updateExpensifyCardLimit(workspaceAccountID, cardID, newLimit, newAvailableSpend, oldLimit, oldAvailableSpend) {
    const authToken = NetworkStore.getAuthToken();
    if (!authToken) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    availableSpend: newAvailableSpend,
                    nameValuePairs: {
                        unapprovedExpenseLimit: newLimit,
                        pendingFields: { unapprovedExpenseLimit: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    },
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    pendingFields: { availableSpend: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    isLoading: true,
                    errors: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        pendingFields: { unapprovedExpenseLimit: null },
                    },
                    pendingAction: null,
                    pendingFields: { availableSpend: null },
                    isLoading: false,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    availableSpend: oldAvailableSpend,
                    nameValuePairs: {
                        unapprovedExpenseLimit: oldLimit,
                        pendingFields: { unapprovedExpenseLimit: null },
                    },
                    pendingAction: null,
                    pendingFields: { availableSpend: null },
                    isLoading: false,
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        authToken,
        cardID,
        limit: newLimit,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_EXPENSIFY_CARD_LIMIT, parameters, { optimisticData, successData, failureData });
}
function updateExpensifyCardTitle(workspaceAccountID, cardID, newCardTitle, oldCardTitle) {
    const authToken = NetworkStore.getAuthToken();
    if (!authToken) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        cardTitle: newCardTitle,
                        pendingFields: { cardTitle: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    },
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    isLoading: true,
                    errors: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        pendingFields: { cardTitle: null },
                    },
                    pendingAction: null,
                    isLoading: false,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        cardTitle: oldCardTitle,
                        pendingFields: { cardTitle: null },
                    },
                    pendingAction: null,
                    isLoading: false,
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        authToken,
        cardID,
        cardTitle: newCardTitle,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_EXPENSIFY_CARD_TITLE, parameters, { optimisticData, successData, failureData });
}
function updateExpensifyCardLimitType(workspaceAccountID, cardID, newLimitType, oldLimitType) {
    const authToken = NetworkStore.getAuthToken();
    if (!authToken) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        limitType: newLimitType,
                        pendingFields: { limitType: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    },
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    pendingFields: { availableSpend: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                    isLoading: true,
                    errors: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    isLoading: false,
                    nameValuePairs: {
                        pendingFields: { limitType: null },
                    },
                    pendingAction: null,
                    pendingFields: { availableSpend: null },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        limitType: oldLimitType,
                        pendingFields: { limitType: null },
                    },
                    pendingFields: { availableSpend: null },
                    pendingAction: null,
                    isLoading: false,
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    const parameters = {
        authToken,
        cardID,
        limitType: newLimitType,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_EXPENSIFY_CARD_LIMIT_TYPE, parameters, { optimisticData, successData, failureData });
}
function deactivateCard(workspaceAccountID, card) {
    const authToken = NetworkStore.getAuthToken();
    const cardID = card?.cardID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const reportAction = (0, ReportActionsUtils_1.getReportActionFromExpensifyCard)(cardID);
    const reportID = (0, ReportUtils_1.findReportIDForAction)(reportAction) ?? reportAction?.reportID;
    if (!authToken) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: {
                [cardID]: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`,
            value: {
                [cardID]: {
                    ...card,
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: {
                [cardID]: {
                    ...card,
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                },
            },
        },
    ];
    if (reportAction?.reportActionID && reportID) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportAction.reportActionID]: {
                    ...reportAction,
                    originalMessage: {
                        cardID: null,
                    },
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportAction.reportID}`,
            value: {
                [reportAction.reportActionID]: reportAction,
            },
        });
    }
    const parameters = {
        authToken,
        cardID,
    };
    API.write(types_1.WRITE_COMMANDS.CARD_DEACTIVATE, parameters, { optimisticData, failureData });
}
function startIssueNewCardFlow(policyID) {
    const parameters = {
        policyID,
    };
    API.read(types_1.READ_COMMANDS.START_ISSUE_NEW_CARD_FLOW, parameters);
}
function configureExpensifyCardsForPolicy(policyID, bankAccountID) {
    if (!bankAccountID) {
        return;
    }
    const workspaceAccountID = PolicyUtils.getWorkspaceAccountID(policyID);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                isLoading: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_BANK_ACCOUNT_METADATA}${workspaceAccountID}`,
            value: {
                isLoading: true,
                isSuccess: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                isLoading: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_BANK_ACCOUNT_METADATA}${workspaceAccountID}`,
            value: {
                isLoading: false,
                isSuccess: true,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`,
            value: {
                isLoading: false,
                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_BANK_ACCOUNT_METADATA}${workspaceAccountID}`,
            value: {
                isLoading: false,
                isSuccess: false,
            },
        },
    ];
    const parameters = {
        policyID,
        bankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.CONFIGURE_EXPENSIFY_CARDS_FOR_POLICY, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
function issueExpensifyCard(domainAccountID, policyID, feedCountry, validateCode, data) {
    if (!data) {
        return;
    }
    const { assigneeEmail, limit, limitType, cardTitle, cardType } = data;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`,
            value: {
                isLoading: true,
                errors: null,
                isSuccessful: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`,
            value: {
                isLoading: false,
                isSuccessful: true,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`,
            value: {
                isLoading: false,
                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
            },
        },
    ];
    const parameters = {
        assigneeEmail,
        limit,
        limitType,
        cardTitle,
        validateCode,
        domainAccountID,
    };
    if (cardType === CONST_1.default.EXPENSIFY_CARD.CARD_TYPE.PHYSICAL) {
        API.write(types_1.WRITE_COMMANDS.CREATE_EXPENSIFY_CARD, { ...parameters, feedCountry }, {
            optimisticData,
            successData,
            failureData,
        });
        return;
    }
    // eslint-disable-next-line rulesdir/no-multiple-api-calls
    API.write(types_1.WRITE_COMMANDS.CREATE_ADMIN_ISSUED_VIRTUAL_CARD, { ...parameters, policyID }, {
        optimisticData,
        successData,
        failureData,
    });
}
function openCardDetailsPage(cardID) {
    const authToken = NetworkStore.getAuthToken();
    if (!authToken) {
        return;
    }
    const parameters = {
        authToken,
        cardID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_CARD_DETAILS_PAGE, parameters);
}
function toggleContinuousReconciliation(workspaceAccountID, shouldUseContinuousReconciliation, connectionName, oldConnectionName) {
    const parameters = shouldUseContinuousReconciliation
        ? {
            workspaceAccountID,
            shouldUseContinuousReconciliation,
            expensifyCardContinuousReconciliationConnection: connectionName,
        }
        : {
            workspaceAccountID,
            shouldUseContinuousReconciliation,
        };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_USE_CONTINUOUS_RECONCILIATION}${workspaceAccountID}`,
            value: shouldUseContinuousReconciliation,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_CONTINUOUS_RECONCILIATION_CONNECTION}${workspaceAccountID}`,
            value: connectionName,
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_USE_CONTINUOUS_RECONCILIATION}${workspaceAccountID}`,
            value: shouldUseContinuousReconciliation,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_CONTINUOUS_RECONCILIATION_CONNECTION}${workspaceAccountID}`,
            value: connectionName,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_USE_CONTINUOUS_RECONCILIATION}${workspaceAccountID}`,
            value: !shouldUseContinuousReconciliation,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_CONTINUOUS_RECONCILIATION_CONNECTION}${workspaceAccountID}`,
            value: oldConnectionName ?? null,
        },
    ];
    API.write(types_1.WRITE_COMMANDS.TOGGLE_CARD_CONTINUOUS_RECONCILIATION, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
function updateSelectedFeed(feed, policyID) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.update([
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`,
            value: feed,
        },
    ]);
}
function updateSelectedExpensifyCardFeed(feed, policyID) {
    if (!policyID) {
        return;
    }
    react_native_onyx_1.default.update([
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_EXPENSIFY_CARD_FEED}${policyID}`,
            value: feed,
        },
    ]);
}
function queueExpensifyCardForBilling(feedCountry, domainAccountID) {
    const parameters = {
        feedCountry,
        domainAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.QUEUE_EXPENSIFY_CARD_FOR_BILLING, parameters);
}
