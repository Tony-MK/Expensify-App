"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWorkspaceCompanyCardFeedName = setWorkspaceCompanyCardFeedName;
exports.deleteWorkspaceCompanyCardFeed = deleteWorkspaceCompanyCardFeed;
exports.setWorkspaceCompanyCardTransactionLiability = setWorkspaceCompanyCardTransactionLiability;
exports.openPolicyCompanyCardsPage = openPolicyCompanyCardsPage;
exports.openPolicyCompanyCardsFeed = openPolicyCompanyCardsFeed;
exports.addNewCompanyCardsFeed = addNewCompanyCardsFeed;
exports.assignWorkspaceCompanyCard = assignWorkspaceCompanyCard;
exports.unassignWorkspaceCompanyCard = unassignWorkspaceCompanyCard;
exports.updateWorkspaceCompanyCard = updateWorkspaceCompanyCard;
exports.updateCompanyCardName = updateCompanyCardName;
exports.setCompanyCardExportAccount = setCompanyCardExportAccount;
exports.clearCompanyCardErrorField = clearCompanyCardErrorField;
exports.setAddNewCompanyCardStepAndData = setAddNewCompanyCardStepAndData;
exports.clearAddNewCardFlow = clearAddNewCardFlow;
exports.setAssignCardStepAndData = setAssignCardStepAndData;
exports.clearAssignCardStepAndData = clearAssignCardStepAndData;
exports.openAssignFeedCardPage = openAssignFeedCardPage;
exports.openPolicyAddCardFeedPage = openPolicyAddCardFeedPage;
exports.setTransactionStartDate = setTransactionStartDate;
exports.setFeedStatementPeriodEndDay = setFeedStatementPeriodEndDay;
exports.clearErrorField = clearErrorField;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const CardUtils = require("@libs/CardUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const NetworkStore = require("@libs/Network/NetworkStore");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const PolicyUtils = require("@libs/PolicyUtils");
const ReportUtils = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function setAssignCardStepAndData({ data, isEditing, currentStep }) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ASSIGN_CARD, { data, isEditing, currentStep });
}
function setTransactionStartDate(startDate) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ASSIGN_CARD, { startDate });
}
function clearAssignCardStepAndData() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ASSIGN_CARD, {});
}
function setAddNewCompanyCardStepAndData({ data, isEditing, step }) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, { data, isEditing, currentStep: step });
}
function clearAddNewCardFlow() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ADD_NEW_COMPANY_CARD, {
        currentStep: null,
        data: {},
    });
}
function addNewCompanyCardsFeed(policyID, cardFeed, feedDetails, cardFeeds, statementPeriodEnd, statementPeriodEndDay, lastSelectedFeed) {
    const authToken = NetworkStore.getAuthToken();
    const workspaceAccountID = PolicyUtils.getWorkspaceAccountID(policyID);
    if (!authToken || !policyID) {
        return;
    }
    const feedType = CardUtils.getFeedType(cardFeed, cardFeeds);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`,
            value: feedType,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${workspaceAccountID}`,
            value: {
                isLoading: true,
                settings: {
                    companyCards: {
                        [feedType]: {
                            statementPeriodEndDay: statementPeriodEndDay ?? statementPeriodEnd ?? null,
                            errors: null,
                        },
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`,
            value: lastSelectedFeed ?? null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${workspaceAccountID}`,
            value: {
                isLoading: true,
                settings: {
                    companyCards: {
                        [feedType]: null,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`,
            value: feedType,
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${workspaceAccountID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    const parameters = {
        policyID,
        authToken,
        feedType,
        feedDetails: Object.entries(feedDetails)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', '),
        statementPeriodEnd,
        statementPeriodEndDay,
    };
    API.write(types_1.WRITE_COMMANDS.REQUEST_FEED_SETUP, parameters, { optimisticData, failureData, successData, finallyData });
}
function setWorkspaceCompanyCardFeedName(policyID, domainOrWorkspaceAccountID, bankName, userDefinedName) {
    const authToken = NetworkStore.getAuthToken();
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
                value: {
                    settings: {
                        companyCardNicknames: {
                            [bankName]: userDefinedName,
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        authToken,
        policyID,
        domainAccountID: domainOrWorkspaceAccountID,
        bankName,
        userDefinedName,
    };
    API.write(types_1.WRITE_COMMANDS.SET_COMPANY_CARD_FEED_NAME, parameters, onyxData);
}
function setWorkspaceCompanyCardTransactionLiability(domainOrWorkspaceAccountID, policyID, bankName, liabilityType) {
    const authToken = NetworkStore.getAuthToken();
    const feedUpdates = {
        [bankName]: { liabilityType },
    };
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
                value: {
                    settings: { companyCards: feedUpdates },
                },
            },
        ],
    };
    const parameters = {
        authToken,
        policyID,
        bankName,
        liabilityType,
    };
    API.write(types_1.WRITE_COMMANDS.SET_COMPANY_CARD_TRANSACTION_LIABILITY, parameters, onyxData);
}
function deleteWorkspaceCompanyCardFeed(policyID, domainOrWorkspaceAccountID, bankName, cardIDs, feedToOpen) {
    const authToken = NetworkStore.getAuthToken();
    const isCustomFeed = CardUtils.isCustomFeed(bankName);
    const optimisticFeedUpdates = { [bankName]: { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE } };
    const successFeedUpdates = { [bankName]: null };
    const failureFeedUpdates = { [bankName]: { pendingAction: null, errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') } };
    const optimisticCardUpdates = Object.fromEntries(cardIDs.map((cardID) => [cardID, { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE }]));
    const successAndFailureCardUpdates = Object.fromEntries(cardIDs.map((cardID) => [cardID, { pendingAction: null }]));
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                settings: {
                    companyCards: optimisticFeedUpdates,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: optimisticCardUpdates,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: optimisticCardUpdates,
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                settings: {
                    ...(isCustomFeed ? { companyCards: successFeedUpdates } : { oAuthAccountDetails: successFeedUpdates, companyCards: successFeedUpdates }),
                    companyCardNicknames: {
                        [bankName]: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: successAndFailureCardUpdates,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: successAndFailureCardUpdates,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                settings: {
                    companyCards: failureFeedUpdates,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: successAndFailureCardUpdates,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: successAndFailureCardUpdates,
        },
    ];
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.LAST_SELECTED_FEED}${policyID}`,
        value: feedToOpen ?? null,
    });
    const parameters = {
        authToken,
        domainAccountID: domainOrWorkspaceAccountID,
        policyID,
        bankName,
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_COMPANY_CARD_FEED, parameters, { optimisticData, successData, failureData });
}
function assignWorkspaceCompanyCard(policyID, data) {
    if (!data) {
        return;
    }
    const { bankName = '', email = '', encryptedCardNumber = '', startDate = '', cardName = '' } = data;
    const assigneeDetails = PersonalDetailsUtils.getPersonalDetailByEmail(email);
    const optimisticCardAssignedReportAction = ReportUtils.buildOptimisticCardAssignedReportAction(assigneeDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    const parameters = {
        policyID,
        bankName,
        encryptedCardNumber,
        cardName,
        email,
        startDate,
        reportActionID: optimisticCardAssignedReportAction.reportActionID,
    };
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const policy = PolicyUtils.getPolicy(policyID);
    const policyExpenseChat = ReportUtils.getPolicyExpenseChat(policy?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, policyID);
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${policyExpenseChat?.reportID}`,
                value: {
                    [optimisticCardAssignedReportAction.reportActionID]: optimisticCardAssignedReportAction,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ASSIGN_CARD,
                value: { isAssigning: true },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${policyExpenseChat?.reportID}`,
                value: { [optimisticCardAssignedReportAction.reportActionID]: { pendingAction: null } },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ASSIGN_CARD,
                value: { isAssigned: true, isAssigning: false },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${policyExpenseChat?.reportID}`,
                value: {
                    [optimisticCardAssignedReportAction.reportActionID]: {
                        pendingAction: null,
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                    },
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ASSIGN_CARD,
                value: { isAssigning: false },
            },
        ],
    };
    API.write(types_1.WRITE_COMMANDS.ASSIGN_COMPANY_CARD, parameters, onyxData);
}
function unassignWorkspaceCompanyCard(domainOrWorkspaceAccountID, bankName, card) {
    const authToken = NetworkStore.getAuthToken();
    const cardID = card.cardID;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
                value: {
                    [cardID]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                    },
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.CARD_LIST,
                value: {
                    [cardID]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
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
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
                value: {
                    [cardID]: {
                        pendingAction: null,
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                    },
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.CARD_LIST,
                value: {
                    [cardID]: {
                        pendingAction: null,
                        errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                    },
                },
            },
        ],
    };
    const parameters = {
        authToken,
        cardID: Number(cardID),
    };
    API.write(types_1.WRITE_COMMANDS.UNASSIGN_COMPANY_CARD, parameters, onyxData);
}
function updateWorkspaceCompanyCard(domainOrWorkspaceAccountID, cardID, bankName, lastScrapeResult) {
    const authToken = NetworkStore.getAuthToken();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: {
                [cardID]: {
                    isLoadingLastUpdated: true,
                    lastScrapeResult: CONST_1.default.JSON_CODE.SUCCESS,
                    pendingFields: {
                        lastScrape: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                    errorFields: {
                        lastScrape: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: {
                [cardID]: {
                    lastScrapeResult: CONST_1.default.JSON_CODE.SUCCESS,
                    isLoadingLastUpdated: true,
                    pendingFields: {
                        lastScrape: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                    errorFields: {
                        lastScrape: null,
                    },
                },
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: {
                [cardID]: {
                    lastScrapeResult: CONST_1.default.JSON_CODE.SUCCESS,
                    isLoadingLastUpdated: false,
                    pendingFields: {
                        lastScrape: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: {
                [cardID]: {
                    lastScrapeResult: CONST_1.default.JSON_CODE.SUCCESS,
                    isLoadingLastUpdated: false,
                    pendingFields: {
                        lastScrape: null,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: {
                [cardID]: {
                    lastScrapeResult,
                    isLoadingLastUpdated: false,
                    pendingFields: {
                        lastScrape: null,
                    },
                    errorFields: {
                        lastScrape: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CARD_LIST,
            value: {
                [cardID]: {
                    lastScrapeResult,
                    isLoadingLastUpdated: false,
                    pendingFields: {
                        lastScrape: null,
                    },
                    errorFields: {
                        lastScrape: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                    },
                },
            },
        },
    ];
    const parameters = {
        authToken,
        cardID: Number(cardID),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_COMPANY_CARD, parameters, { optimisticData, finallyData, failureData });
}
function updateCompanyCardName(domainOrWorkspaceAccountID, cardID, newCardTitle, bankName, oldCardTitle) {
    const authToken = NetworkStore.getAuthToken();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        cardTitle: newCardTitle,
                        pendingFields: {
                            cardTitle: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        errorFields: {
                            cardTitle: null,
                        },
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_EXPENSIFY_COMPANY_CARDS_CUSTOM_NAMES,
            value: { [cardID]: newCardTitle },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        pendingFields: {
                            cardTitle: null,
                        },
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        pendingFields: {
                            cardTitle: null,
                        },
                        errorFields: {
                            cardTitle: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                        },
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_EXPENSIFY_COMPANY_CARDS_CUSTOM_NAMES,
            value: { [cardID]: oldCardTitle },
        },
    ];
    const parameters = {
        authToken,
        cardID: Number(cardID),
        cardName: newCardTitle,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_COMPANY_CARD_NAME, parameters, { optimisticData, finallyData, failureData });
}
function setCompanyCardExportAccount(policyID, domainOrWorkspaceAccountID, cardID, accountKey, newAccount, bank) {
    const authToken = NetworkStore.getAuthToken();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bank}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        pendingFields: {
                            [accountKey]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                        },
                        errorFields: {
                            [accountKey]: null,
                        },
                        [accountKey]: newAccount,
                    },
                },
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bank}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        pendingFields: {
                            [accountKey]: null,
                        },
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bank}`,
            value: {
                [cardID]: {
                    nameValuePairs: {
                        pendingFields: {
                            [accountKey]: newAccount,
                        },
                        errorFields: {
                            [accountKey]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                        },
                    },
                },
            },
        },
    ];
    const parameters = {
        authToken,
        cardID: Number(cardID),
        exportAccountDetails: JSON.stringify({ [accountKey]: newAccount, [`${accountKey}_policy_id`]: policyID }),
    };
    API.write(types_1.WRITE_COMMANDS.SET_CARD_EXPORT_ACCOUNT, parameters, { optimisticData, finallyData, failureData });
}
function clearCompanyCardErrorField(domainOrWorkspaceAccountID, cardID, bankName, fieldName, isRootLevel) {
    if (isRootLevel) {
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`, {
            [cardID]: {
                errorFields: { [fieldName]: null },
            },
        });
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${domainOrWorkspaceAccountID}_${bankName}`, {
        [cardID]: {
            nameValuePairs: {
                errorFields: { [fieldName]: null },
            },
        },
    });
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.CARD_LIST, {
        [cardID]: {
            nameValuePairs: {
                errorFields: {
                    [fieldName]: null,
                },
            },
        },
    });
}
function openPolicyCompanyCardsPage(policyID, domainOrWorkspaceAccountID) {
    const authToken = NetworkStore.getAuthToken();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    const params = {
        policyID,
        authToken,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_COMPANY_CARDS_PAGE, params, { optimisticData, successData, failureData });
}
function openPolicyCompanyCardsFeed(domainAccountID, policyID, feed) {
    const parameters = {
        domainAccountID,
        policyID,
        feed,
    };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_COMPANY_CARDS_FEED, parameters);
}
function openAssignFeedCardPage(policyID, feed, domainOrWorkspaceAccountID) {
    const parameters = {
        policyID,
        feed,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainOrWorkspaceAccountID}`,
            value: {
                isLoading: false,
            },
        },
    ];
    API.read(types_1.READ_COMMANDS.OPEN_ASSIGN_FEED_CARD_PAGE, parameters, { optimisticData, successData, failureData });
}
function openPolicyAddCardFeedPage(policyID) {
    if (!policyID) {
        return;
    }
    const parameters = {
        policyID,
    };
    API.write(types_1.WRITE_COMMANDS.OPEN_POLICY_ADD_CARD_FEED_PAGE, parameters);
}
function setFeedStatementPeriodEndDay(policyID, bankName, domainAccountID, newStatementPeriodEnd, newStatementPeriodEndDay, oldStatementPeriodEndDay) {
    const authToken = NetworkStore.getAuthToken();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainAccountID}`,
            value: {
                settings: {
                    companyCards: {
                        [bankName]: {
                            statementPeriodEndDay: newStatementPeriodEndDay ?? newStatementPeriodEnd ?? null,
                            pendingFields: {
                                statementPeriodEndDay: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                statementPeriodEndDay: null,
                            },
                        },
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainAccountID}`,
            value: {
                settings: {
                    companyCards: {
                        [bankName]: {
                            pendingFields: {
                                statementPeriodEndDay: null,
                            },
                        },
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainAccountID}`,
            value: {
                settings: {
                    companyCards: {
                        [bankName]: {
                            statementPeriodEndDay: oldStatementPeriodEndDay ?? null,
                            pendingFields: {
                                statementPeriodEndDay: null,
                            },
                            errorFields: {
                                statementPeriodEndDay: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                            },
                        },
                    },
                },
            },
        },
    ];
    const parameters = {
        authToken,
        policyID,
        bankName,
        domainAccountID,
        statementPeriodEnd: newStatementPeriodEnd,
        statementPeriodEndDay: newStatementPeriodEndDay,
    };
    API.write(types_1.WRITE_COMMANDS.SET_FEED_STATEMENT_PERIOD_END_DAY, parameters, { optimisticData, successData, failureData });
}
function clearErrorField(bankName, domainAccountID, fieldName) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.SHARED_NVP_PRIVATE_DOMAIN_MEMBER}${domainAccountID}`, {
        settings: {
            companyCards: {
                [bankName]: {
                    errorFields: {
                        [fieldName]: null,
                    },
                },
            },
        },
    });
}
