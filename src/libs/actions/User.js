"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAccount = closeAccount;
exports.dismissReferralBanner = dismissReferralBanner;
exports.dismissASAPSubmitExplanation = dismissASAPSubmitExplanation;
exports.resendValidateCode = resendValidateCode;
exports.requestContactMethodValidateCode = requestContactMethodValidateCode;
exports.updateNewsletterSubscription = updateNewsletterSubscription;
exports.deleteContactMethod = deleteContactMethod;
exports.clearContactMethodErrors = clearContactMethodErrors;
exports.clearContactMethod = clearContactMethod;
exports.addNewContactMethod = addNewContactMethod;
exports.validateSecondaryLogin = validateSecondaryLogin;
exports.isBlockedFromConcierge = isBlockedFromConcierge;
exports.subscribeToUserEvents = subscribeToUserEvents;
exports.updatePreferredSkinTone = updatePreferredSkinTone;
exports.setShouldUseStagingServer = setShouldUseStagingServer;
exports.togglePlatformMute = togglePlatformMute;
exports.joinScreenShare = joinScreenShare;
exports.clearScreenShareRequest = clearScreenShareRequest;
exports.generateStatementPDF = generateStatementPDF;
exports.updateChatPriorityMode = updateChatPriorityMode;
exports.setContactMethodAsDefault = setContactMethodAsDefault;
exports.updateTheme = updateTheme;
exports.resetContactMethodValidateCodeSentState = resetContactMethodValidateCodeSentState;
exports.updateCustomStatus = updateCustomStatus;
exports.clearCustomStatus = clearCustomStatus;
exports.updateDraftCustomStatus = updateDraftCustomStatus;
exports.clearDraftCustomStatus = clearDraftCustomStatus;
exports.requestRefund = requestRefund;
exports.setNameValuePair = setNameValuePair;
exports.clearUnvalidatedNewContactMethodAction = clearUnvalidatedNewContactMethodAction;
exports.clearPendingContactActionErrors = clearPendingContactActionErrors;
exports.requestValidateCodeAction = requestValidateCodeAction;
exports.addPendingContactMethod = addPendingContactMethod;
exports.clearValidateCodeActionError = clearValidateCodeActionError;
exports.setIsDebugModeEnabled = setIsDebugModeEnabled;
exports.setShouldBlockTransactionThreadReportCreation = setShouldBlockTransactionThreadReportCreation;
exports.resetValidateActionCodeSent = resetValidateActionCodeSent;
exports.lockAccount = lockAccount;
const react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
const date_fns_1 = require("date-fns");
const debounce_1 = require("lodash/debounce");
const react_native_onyx_1 = require("react-native-onyx");
const ActiveClientManager = require("@libs/ActiveClientManager");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NetworkStore_1 = require("@libs/Network/NetworkStore");
const SequentialQueue = require("@libs/Network/SequentialQueue");
const NumberUtils = require("@libs/NumberUtils");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const Pusher_1 = require("@libs/Pusher");
const PusherUtils_1 = require("@libs/PusherUtils");
const ReportActionsUtils = require("@libs/ReportActionsUtils");
const ReportUtils = require("@libs/ReportUtils");
const Sound_1 = require("@libs/Sound");
const Visibility_1 = require("@libs/Visibility");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const App_1 = require("./App");
const applyOnyxUpdatesReliably_1 = require("./applyOnyxUpdatesReliably");
const Link_1 = require("./Link");
const Report_1 = require("./Report");
const Session_1 = require("./Session");
const Timing_1 = require("./Timing");
let currentUserAccountID = -1;
let currentEmail = '';
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        currentUserAccountID = value?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
        currentEmail = value?.email ?? '';
    },
});
let myPersonalDetails;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => {
        if (!value || currentUserAccountID === -1) {
            return;
        }
        myPersonalDetails = value[currentUserAccountID] ?? undefined;
    },
});
let allPolicies;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY,
    waitForCollectionCallback: true,
    callback: (value) => (allPolicies = value),
});
/**
 * Attempt to close the user's account
 */
function closeAccount(reason) {
    // Note: successData does not need to set isLoading to false because if the CloseAccount
    // command succeeds, a Pusher response will clear all Onyx data.
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.CLOSE_ACCOUNT_FORM,
            value: { isLoading: true },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.CLOSE_ACCOUNT_FORM,
            value: { isLoading: false },
        },
    ];
    const parameters = { message: reason };
    API.write(types_1.WRITE_COMMANDS.CLOSE_ACCOUNT, parameters, {
        optimisticData,
        failureData,
    });
    // On HybridApp, we need to sign out from the oldDot app as well to keep state of both apps in sync
    if (CONFIG_1.default.IS_HYBRID_APP) {
        react_native_hybrid_app_1.default.signOutFromOldDot();
    }
}
/**
 * Resend a validation link to a given login
 */
function resendValidateCode(login) {
    (0, Session_1.resendValidateCode)(login);
}
/**
 * Requests a new validate code be sent for the passed contact method
 *
 * @param contactMethod - the new contact method that the user is trying to verify
 */
function requestContactMethodValidateCode(contactMethod) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    validateCodeSent: false,
                    errorFields: {
                        validateCodeSent: null,
                        validateLogin: null,
                    },
                    pendingFields: {
                        validateCodeSent: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    validateCodeSent: true,
                    pendingFields: {
                        validateCodeSent: null,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    validateCodeSent: false,
                    errorFields: {
                        validateCodeSent: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('contacts.genericFailureMessages.requestContactMethodValidateCode'),
                    },
                    pendingFields: {
                        validateCodeSent: null,
                    },
                },
            },
        },
    ];
    const parameters = { email: contactMethod };
    API.write(types_1.WRITE_COMMANDS.REQUEST_CONTACT_METHOD_VALIDATE_CODE, parameters, { optimisticData, successData, failureData });
}
/**
 * Sets whether the user account is subscribed to Expensify news
 */
function updateNewsletterSubscription(isSubscribed) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: { isSubscribedToNewsletter: isSubscribed },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: { isSubscribedToNewsletter: !isSubscribed },
        },
    ];
    const parameters = { isSubscribed };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NEWSLETTER_SUBSCRIPTION, parameters, {
        optimisticData,
        failureData,
    });
}
/**
 * Delete a specific contact method
 * @param contactMethod - the contact method being deleted
 * @param loginList
 */
function deleteContactMethod(contactMethod, loginList, backTo) {
    const oldLoginData = loginList[contactMethod];
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    partnerUserID: '',
                    errorFields: null,
                    pendingFields: {
                        deletedLogin: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    ...oldLoginData,
                    errorFields: {
                        ...oldLoginData?.errorFields,
                        deletedLogin: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('contacts.genericFailureMessages.deleteContactMethod'),
                    },
                    pendingFields: {
                        deletedLogin: null,
                    },
                },
            },
        },
    ];
    const parameters = { partnerUserID: contactMethod };
    API.write(types_1.WRITE_COMMANDS.DELETE_CONTACT_METHOD, parameters, { optimisticData, successData, failureData });
    Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(backTo));
}
/**
 * Clears a contact method optimistically. this is used when the contact method fails to be added to the backend
 */
function clearContactMethod(contactMethod) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.LOGIN_LIST, {
        [contactMethod]: null,
    });
}
/**
 * Clears error for a specific field on validate action code.
 */
function clearValidateCodeActionError(fieldName) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, {
        errorFields: {
            [fieldName]: null,
        },
    });
}
/**
 * Reset validateCodeSent on validate action code.
 */
function resetValidateActionCodeSent() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, {
        validateCodeSent: false,
    });
}
/**
 * Clears any possible stored errors for a specific field on a contact method
 */
function clearContactMethodErrors(contactMethod, fieldName) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.LOGIN_LIST, {
        [contactMethod]: {
            errorFields: {
                [fieldName]: null,
            },
            pendingFields: {
                [fieldName]: null,
            },
        },
    });
}
/**
 * Resets the state indicating whether a validation code has been sent to a specific contact method.
 *
 * @param contactMethod - The identifier of the contact method to reset.
 */
function resetContactMethodValidateCodeSentState(contactMethod) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.LOGIN_LIST, {
        [contactMethod]: {
            validateCodeSent: false,
        },
    });
}
/**
 * Clears unvalidated new contact method action
 */
function clearUnvalidatedNewContactMethodAction() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PENDING_CONTACT_ACTION, null);
}
function clearPendingContactActionErrors() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PENDING_CONTACT_ACTION, {
        errorFields: null,
    });
}
/**
 * When user adds a new contact method, they need to verify the magic code first
 * So we add the temporary contact method to Onyx to use it later, after user verified magic code.
 */
function addPendingContactMethod(contactMethod) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PENDING_CONTACT_ACTION, {
        contactMethod,
    });
}
/**
 * Adds a secondary login to a user's account
 */
function addNewContactMethod(contactMethod, validateCode = '') {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    partnerUserID: contactMethod,
                    validatedDate: '',
                    errorFields: {
                        addedLogin: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: { isLoading: true },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PENDING_CONTACT_ACTION,
            value: {
                contactMethod: null,
                validateCodeSent: null,
                actionVerified: true,
                errorFields: {
                    actionVerified: null,
                },
            },
        },
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
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_ACTION_CODE,
            value: { validateCodeSent: null },
        },
    ];
    const parameters = { partnerUserID: contactMethod, validateCode };
    API.write(types_1.WRITE_COMMANDS.ADD_NEW_CONTACT_METHOD, parameters, { optimisticData, successData, failureData });
}
/**
 * Requests a magic code to verify current user
 */
function requestValidateCodeAction() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_ACTION_CODE,
            value: {
                isLoading: true,
                pendingFields: {
                    actionVerified: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                errorFields: {
                    actionVerified: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_ACTION_CODE,
            value: {
                validateCodeSent: true,
                isLoading: false,
                errorFields: {
                    actionVerified: null,
                },
                pendingFields: {
                    actionVerified: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_ACTION_CODE,
            value: {
                validateCodeSent: null,
                isLoading: false,
                errorFields: {
                    actionVerified: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('contacts.genericFailureMessages.requestContactMethodValidateCode'),
                },
                pendingFields: {
                    actionVerified: null,
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.RESEND_VALIDATE_CODE, null, { optimisticData, successData, failureData });
}
/**
 * Validates a secondary login / contact method
 */
function validateSecondaryLogin(loginList, contactMethod, validateCode, formatPhoneNumber, shouldResetActionCode) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    errorFields: {
                        validateLogin: null,
                        validateCodeSent: null,
                    },
                    pendingFields: {
                        validateLogin: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                ...CONST_1.default.DEFAULT_ACCOUNT_DATA,
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    validatedDate: DateUtils_1.default.getDBTime(),
                    pendingFields: {
                        validateLogin: null,
                    },
                    errorFields: {
                        validateCodeSent: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                validated: true,
            },
        },
    ];
    // If the primary login isn't validated yet, set the secondary login as the primary login
    if (!loginList?.[currentEmail].validatedDate) {
        successData.push(...[
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ACCOUNT,
                value: {
                    primaryLogin: contactMethod,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.SESSION,
                value: {
                    email: contactMethod,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                value: {
                    [currentUserAccountID]: {
                        login: contactMethod,
                        displayName: PersonalDetailsUtils.createDisplayName(contactMethod, myPersonalDetails, formatPhoneNumber),
                    },
                },
            },
        ]);
        Object.values(allPolicies ?? {}).forEach((policy) => {
            if (!policy) {
                return;
            }
            let optimisticPolicyDataValue;
            if (policy.employeeList) {
                const currentEmployee = policy.employeeList[currentEmail];
                optimisticPolicyDataValue = {
                    employeeList: {
                        [currentEmail]: null,
                        [contactMethod]: currentEmployee,
                    },
                };
            }
            if (policy.ownerAccountID === currentUserAccountID) {
                optimisticPolicyDataValue = {
                    ...optimisticPolicyDataValue,
                    owner: contactMethod,
                };
            }
            if (optimisticPolicyDataValue) {
                successData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                    value: optimisticPolicyDataValue,
                });
            }
        });
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [contactMethod]: {
                    errorFields: {
                        validateLogin: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('contacts.genericFailureMessages.validateSecondaryLogin'),
                        validateCodeSent: null,
                    },
                    pendingFields: {
                        validateLogin: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: { isLoading: false },
        },
    ];
    // Sometimes we will also need to reset the validateCodeSent of ONYXKEYS.VALIDATE_ACTION_CODE in order to receive the magic code next time we open the ValidateCodeActionModal.
    if (shouldResetActionCode) {
        const optimisticResetActionCode = {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.VALIDATE_ACTION_CODE,
            value: {
                validateCodeSent: null,
            },
        };
        successData.push(optimisticResetActionCode);
        failureData.push(optimisticResetActionCode);
    }
    const parameters = { partnerUserID: contactMethod, validateCode };
    API.write(types_1.WRITE_COMMANDS.VALIDATE_SECONDARY_LOGIN, parameters, { optimisticData, successData, failureData });
}
/**
 * Checks the blockedFromConcierge object to see if it has an expiresAt key,
 * and if so whether the expiresAt date of a user's ban is before right now
 *
 */
function isBlockedFromConcierge(blockedFromConciergeNVP) {
    if ((0, EmptyObject_1.isEmptyObject)(blockedFromConciergeNVP)) {
        return false;
    }
    if (!blockedFromConciergeNVP?.expiresAt) {
        return false;
    }
    return (0, date_fns_1.isBefore)(new Date(), new Date(blockedFromConciergeNVP.expiresAt));
}
function triggerNotifications(onyxUpdates) {
    onyxUpdates.forEach((update) => {
        if (!update.shouldNotify && !update.shouldShowPushNotification) {
            return;
        }
        const reportID = update.key.replace(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, '');
        const reportActions = Object.values(update.value ?? {});
        reportActions.forEach((action) => action && (0, Report_1.showReportActionNotification)(reportID, action));
    });
}
const isChannelMuted = (reportId) => new Promise((resolve) => {
    const connection = react_native_onyx_1.default.connect({
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportId}`,
        callback: (report) => {
            react_native_onyx_1.default.disconnect(connection);
            const notificationPreference = report?.participants?.[currentUserAccountID]?.notificationPreference;
            resolve(!notificationPreference || notificationPreference === CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.MUTE || ReportUtils.isHiddenForCurrentUser(notificationPreference));
        },
    });
});
function playSoundForMessageType(pushJSON) {
    const reportActionsOnly = pushJSON.filter((update) => update.key?.includes('reportActions_'));
    // "reportActions_5134363522480668" -> "5134363522480668"
    const reportID = reportActionsOnly
        .map((value) => value.key.split('_').at(1))
        .find((reportKey) => reportKey === Navigation_1.default.getTopmostReportId() && Visibility_1.default.isVisible() && Visibility_1.default.hasFocus());
    if (!reportID) {
        return;
    }
    isChannelMuted(reportID).then((isSoundMuted) => {
        if (isSoundMuted) {
            return;
        }
        try {
            const flatten = reportActionsOnly.flatMap((update) => {
                const value = update.value;
                if (!value) {
                    return [];
                }
                return Object.values(value);
            });
            for (const data of flatten) {
                // Someone completes a task
                if (data.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.TASK_COMPLETED) {
                    return (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
                }
            }
            const types = flatten.map((data) => ReportActionsUtils.getOriginalMessage(data)).filter(Boolean);
            for (const message of types) {
                if (!message) {
                    return;
                }
                // Pay someone flow
                if ('IOUDetails' in message) {
                    return (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
                }
                // mention user
                if ('html' in message && typeof message.html === 'string' && message.html.includes(`<mention-user>@${currentEmail}</mention-user>`)) {
                    return (0, Sound_1.default)(Sound_1.SOUNDS.ATTENTION);
                }
                // mention @here
                if ('html' in message && typeof message.html === 'string' && message.html.includes('<mention-here>')) {
                    return (0, Sound_1.default)(Sound_1.SOUNDS.ATTENTION);
                }
                // assign a task
                if ('taskReportID' in message) {
                    return (0, Sound_1.default)(Sound_1.SOUNDS.ATTENTION);
                }
                // Submit expense flow
                if ('IOUTransactionID' in message) {
                    return (0, Sound_1.default)(Sound_1.SOUNDS.ATTENTION);
                }
                // Someone reimburses an expense
                if ('IOUReportID' in message) {
                    return (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
                }
                // plain message
                if ('html' in message) {
                    return (0, Sound_1.default)(Sound_1.SOUNDS.RECEIVE);
                }
            }
        }
        catch (e) {
            let errorMessage = String(e);
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            Log_1.default.client(`Unexpected error occurred while parsing the data to play a sound: ${errorMessage}`);
        }
    });
}
let pongHasBeenMissed = false;
let lastPingSentTimestamp = Date.now();
let lastPongReceivedTimestamp = Date.now();
function subscribeToPusherPong() {
    // If there is no user accountID yet (because the app isn't fully setup yet), the channel can't be subscribed to so return early
    if (currentUserAccountID === -1) {
        return;
    }
    PusherUtils_1.default.subscribeToPrivateUserChannelEvent(Pusher_1.default.TYPE.PONG, currentUserAccountID.toString(), (pushJSON) => {
        Log_1.default.info(`[Pusher PINGPONG] Received a PONG event from the server`, false, pushJSON);
        lastPongReceivedTimestamp = Date.now();
        // Calculate the latency between the client and the server
        const pongEvent = pushJSON;
        const latency = Date.now() - Number(pongEvent.pingTimestamp);
        Log_1.default.info(`[Pusher PINGPONG] The event took ${latency} ms`);
        Timing_1.default.end(CONST_1.default.TIMING.PUSHER_PING_PONG);
        // When any PONG event comes in, reset this flag so that checkForLatePongReplies will resume looking for missed PONGs
        pongHasBeenMissed = false;
    });
}
// Specify how long between each PING event to the server
const PING_INTERVAL_LENGTH_IN_SECONDS = 30;
// Specify how long between each check for missing PONG events
const CHECK_LATE_PONG_INTERVAL_LENGTH_IN_SECONDS = 60;
// Specify how long before a PING event is considered to be missing a PONG event in order to put the application in offline mode
const NO_EVENT_RECEIVED_TO_BE_OFFLINE_THRESHOLD_IN_SECONDS = 2 * PING_INTERVAL_LENGTH_IN_SECONDS;
function pingPusher() {
    if ((0, NetworkStore_1.isOffline)()) {
        Log_1.default.info('[Pusher PINGPONG] Skipping PING because the client is offline');
        return;
    }
    // Send a PING event to the server with a specific ID and timestamp
    // The server will respond with a PONG event with the same ID and timestamp
    // Then we can calculate the latency between the client and the server (or if the server never replies)
    const pingID = NumberUtils.rand64();
    const pingTimestamp = Date.now();
    // In local development, there can end up being multiple intervals running because when JS code is replaced with hot module replacement, the old interval is not cleared
    // and keeps running. This little bit of logic will attempt to keep multiple pings from happening.
    if (pingTimestamp - lastPingSentTimestamp < PING_INTERVAL_LENGTH_IN_SECONDS * 1000) {
        return;
    }
    lastPingSentTimestamp = pingTimestamp;
    const parameters = { pingID, pingTimestamp };
    API.writeWithNoDuplicatesConflictAction(types_1.WRITE_COMMANDS.PUSHER_PING, parameters);
    Log_1.default.info(`[Pusher PINGPONG] Sending a PING to the server: ${pingID} timestamp: ${pingTimestamp}`);
    Timing_1.default.start(CONST_1.default.TIMING.PUSHER_PING_PONG);
}
function checkForLatePongReplies() {
    if ((0, NetworkStore_1.isOffline)()) {
        Log_1.default.info('[Pusher PINGPONG] Skipping checkForLatePongReplies because the client is offline');
        return;
    }
    if (pongHasBeenMissed) {
        Log_1.default.info(`[Pusher PINGPONG] Skipped checking for late PONG events because a PONG has already been missed`);
        return;
    }
    Log_1.default.info(`[Pusher PINGPONG] Checking for late PONG events`);
    const timeSinceLastPongReceived = Date.now() - lastPongReceivedTimestamp;
    // If the time since the last pong was received is more than 2 * PING_INTERVAL_LENGTH_IN_SECONDS, then record it in the logs
    if (timeSinceLastPongReceived > NO_EVENT_RECEIVED_TO_BE_OFFLINE_THRESHOLD_IN_SECONDS * 1000) {
        Log_1.default.info(`[Pusher PINGPONG] The server has not replied to the PING event in ${timeSinceLastPongReceived} ms so going offline`);
        // When going offline, reset the pingpong state so that when the network reconnects, the client will start fresh
        lastPingSentTimestamp = Date.now();
        pongHasBeenMissed = true;
    }
    else {
        Log_1.default.info(`[Pusher PINGPONG] Last PONG event was ${timeSinceLastPongReceived} ms ago so not going offline`);
    }
}
let pingPusherIntervalID;
let checkForLatePongRepliesIntervalID;
function initializePusherPingPong() {
    // Only run the ping pong from the leader client
    if (!ActiveClientManager.isClientTheLeader()) {
        Log_1.default.info("[Pusher PINGPONG] Not starting PING PONG because this instance isn't the leader client");
        return;
    }
    Log_1.default.info(`[Pusher PINGPONG] Starting Pusher PING PONG and pinging every ${PING_INTERVAL_LENGTH_IN_SECONDS} seconds`);
    // Subscribe to the pong event from Pusher. Unfortunately, there is no way of knowing when the client is actually subscribed
    // so there could be a little delay before the client is actually listening to this event.
    subscribeToPusherPong();
    // If things are initializing again (which is fine because it will reinitialize each time Pusher authenticates), clear the old intervals
    if (pingPusherIntervalID) {
        clearInterval(pingPusherIntervalID);
    }
    // Send a ping to pusher on a regular interval
    pingPusherIntervalID = setInterval(pingPusher, PING_INTERVAL_LENGTH_IN_SECONDS * 1000);
    // Delay the start of this by double the length of PING_INTERVAL_LENGTH_IN_SECONDS to give a chance for the first
    // events to be sent and received
    setTimeout(() => {
        // If things are initializing again (which is fine because it will reinitialize each time Pusher authenticates), clear the old intervals
        if (checkForLatePongRepliesIntervalID) {
            clearInterval(checkForLatePongRepliesIntervalID);
        }
        // Check for any missing pong events on a regular interval
        checkForLatePongRepliesIntervalID = setInterval(checkForLatePongReplies, CHECK_LATE_PONG_INTERVAL_LENGTH_IN_SECONDS * 1000);
    }, PING_INTERVAL_LENGTH_IN_SECONDS * 2);
}
/**
 * Handles the newest events from Pusher where a single mega multipleEvents contains
 * an array of singular events all in one event
 */
function subscribeToUserEvents() {
    // If we don't have the user's accountID yet (because the app isn't fully setup yet) we can't subscribe so return early
    if (currentUserAccountID === -1) {
        return;
    }
    // Handles the mega multipleEvents from Pusher which contains an array of single events.
    // Each single event is passed to PusherUtils in order to trigger the callbacks for that event
    PusherUtils_1.default.subscribeToPrivateUserChannelEvent(Pusher_1.default.TYPE.MULTIPLE_EVENTS, currentUserAccountID.toString(), (pushJSON) => {
        const pushEventData = pushJSON;
        // If this is not the main client, we shouldn't process any data received from pusher.
        if (!ActiveClientManager.isClientTheLeader()) {
            Log_1.default.info('[Pusher] Received updates, but ignoring it since this is not the active client');
            return;
        }
        // The data for the update is an object, containing updateIDs from the server and an array of onyx updates (this array is the same format as the original format above)
        // Example: {lastUpdateID: 1, previousUpdateID: 0, updates: [{onyxMethod: 'whatever', key: 'foo', value: 'bar'}]}
        const updates = {
            type: CONST_1.default.ONYX_UPDATE_TYPES.PUSHER,
            lastUpdateID: Number(pushEventData.lastUpdateID ?? CONST_1.default.DEFAULT_NUMBER_ID),
            updates: pushEventData.updates ?? [],
            previousUpdateID: Number(pushJSON.previousUpdateID ?? CONST_1.default.DEFAULT_NUMBER_ID),
        };
        Log_1.default.info('[subscribeToUserEvents] Applying Onyx updates');
        (0, applyOnyxUpdatesReliably_1.default)(updates);
    });
    // Debounce the playSoundForMessageType function to avoid playing sounds too often, for example when a user comeback after offline and a lot of messages come in
    // See https://github.com/Expensify/App/issues/57961 for more details
    const debouncedPlaySoundForMessageType = (0, debounce_1.default)((pushJSONMessage) => {
        playSoundForMessageType(pushJSONMessage);
    }, CONST_1.default.TIMING.PLAY_SOUND_MESSAGE_DEBOUNCE_TIME, { trailing: true });
    // Handles Onyx updates coming from Pusher through the mega multipleEvents.
    PusherUtils_1.default.subscribeToMultiEvent(Pusher_1.default.TYPE.MULTIPLE_EVENT_TYPE.ONYX_API_UPDATE, (pushJSON) => {
        debouncedPlaySoundForMessageType(pushJSON);
        return SequentialQueue.getCurrentRequest().then(() => {
            // If we don't have the currentUserAccountID (user is logged out) or this is not the
            // main client we don't want to update Onyx with data from Pusher
            if (currentUserAccountID === -1) {
                return;
            }
            if (!ActiveClientManager.isClientTheLeader()) {
                Log_1.default.info('[Pusher] Received updates, but ignoring it since this is not the active client');
                return;
            }
            const onyxUpdatePromise = react_native_onyx_1.default.update(pushJSON).then(() => {
                triggerNotifications(pushJSON);
            });
            // Return a promise when Onyx is done updating so that the OnyxUpdatesManager can properly apply all
            // the onyx updates in order
            return onyxUpdatePromise;
        });
    });
    // We have an event to reconnect the App. It is triggered when we detect that the user passed updateID
    // is not in the DB
    PusherUtils_1.default.subscribeToMultiEvent(Pusher_1.default.TYPE.MULTIPLE_EVENT_TYPE.RECONNECT_APP, () => {
        (0, App_1.reconnectApp)();
        return Promise.resolve();
    });
    initializePusherPingPong();
}
/**
 * Sync preferredSkinTone with Onyx and Server
 */
function updatePreferredSkinTone(skinTone) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.PREFERRED_EMOJI_SKIN_TONE,
            value: skinTone,
        },
    ];
    const parameters = { value: skinTone };
    API.write(types_1.WRITE_COMMANDS.UPDATE_PREFERRED_EMOJI_SKIN_TONE, parameters, { optimisticData });
}
/**
 * Sync user chat priority mode with Onyx and Server
 * @param mode
 * @param [automatic] if we changed the mode automatically
 */
function updateChatPriorityMode(mode, automatic = false) {
    const autoSwitchedToFocusMode = mode === CONST_1.default.PRIORITY_MODE.GSD && automatic;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PRIORITY_MODE,
            value: mode,
        },
    ];
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: ONYXKEYS_1.default.NVP_TRY_FOCUS_MODE,
        value: true,
    });
    const parameters = {
        value: mode,
        automatic,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_CHAT_PRIORITY_MODE, parameters, { optimisticData });
    if (!autoSwitchedToFocusMode) {
        Navigation_1.default.goBack();
    }
}
function setShouldUseStagingServer(shouldUseStagingServer) {
    if (CONFIG_1.default.IS_HYBRID_APP) {
        react_native_hybrid_app_1.default.shouldUseStaging(shouldUseStagingServer);
    }
    react_native_onyx_1.default.set(ONYXKEYS_1.default.SHOULD_USE_STAGING_SERVER, shouldUseStagingServer);
}
function togglePlatformMute(platform, mutedPlatforms) {
    const newMutedPlatforms = mutedPlatforms?.[platform]
        ? { ...mutedPlatforms, [platform]: undefined } // Remove platform if it's muted
        : { ...mutedPlatforms, [platform]: true }; // Add platform if it's not muted
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_MUTED_PLATFORMS,
            value: newMutedPlatforms,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.NVP_MUTED_PLATFORMS,
            value: mutedPlatforms,
        },
    ];
    const parameters = { platformToMute: platform };
    API.write(types_1.WRITE_COMMANDS.TOGGLE_PLATFORM_MUTE, parameters, {
        optimisticData,
        failureData,
    });
}
/**
 * Clear the data about a screen share request from Onyx.
 */
function clearScreenShareRequest() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.SCREEN_SHARE_REQUEST, null);
}
/**
 * Open an OldDot tab linking to a screen share request.
 * @param accessToken Access token required to join a screen share room, generated by the backend
 * @param roomName Name of the screen share room to join
 */
function joinScreenShare(accessToken, roomName) {
    (0, Link_1.openOldDotLink)(`inbox?action=screenShare&accessToken=${accessToken}&name=${roomName}`);
    clearScreenShareRequest();
}
/**
 * Downloads the statement PDF for the provided period
 * @param period YYYYMM format
 */
function generateStatementPDF(period) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_STATEMENT,
            value: {
                isGenerating: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_STATEMENT,
            value: {
                isGenerating: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_STATEMENT,
            value: {
                isGenerating: false,
            },
        },
    ];
    const parameters = { period };
    API.read(types_1.READ_COMMANDS.GET_STATEMENT_PDF, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Sets a contact method / secondary login as the user's "Default" contact method.
 */
function setContactMethodAsDefault(newDefaultContactMethod, formatPhoneNumber, backTo) {
    const oldDefaultContactMethod = currentEmail;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                primaryLogin: newDefaultContactMethod,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.SESSION,
            value: {
                email: newDefaultContactMethod,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [newDefaultContactMethod]: {
                    pendingFields: {
                        defaultLogin: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                    errorFields: {
                        defaultLogin: null,
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    login: newDefaultContactMethod,
                    displayName: PersonalDetailsUtils.createDisplayName(newDefaultContactMethod, myPersonalDetails, formatPhoneNumber),
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [newDefaultContactMethod]: {
                    pendingFields: {
                        defaultLogin: null,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                primaryLogin: oldDefaultContactMethod,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.SESSION,
            value: {
                email: oldDefaultContactMethod,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LOGIN_LIST,
            value: {
                [newDefaultContactMethod]: {
                    pendingFields: {
                        defaultLogin: null,
                    },
                    errorFields: {
                        defaultLogin: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('contacts.genericFailureMessages.setDefaultContactMethod'),
                    },
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: { ...myPersonalDetails },
            },
        },
    ];
    Object.values(allPolicies ?? {}).forEach((policy) => {
        if (!policy) {
            return;
        }
        let optimisticPolicyDataValue;
        let failurePolicyDataValue;
        if (policy.employeeList) {
            const currentEmployee = policy.employeeList[oldDefaultContactMethod];
            optimisticPolicyDataValue = {
                employeeList: {
                    [oldDefaultContactMethod]: null,
                    [newDefaultContactMethod]: currentEmployee,
                },
            };
            failurePolicyDataValue = {
                employeeList: {
                    [oldDefaultContactMethod]: currentEmployee,
                    [newDefaultContactMethod]: null,
                },
            };
        }
        if (policy.ownerAccountID === currentUserAccountID) {
            optimisticPolicyDataValue = {
                ...optimisticPolicyDataValue,
                owner: newDefaultContactMethod,
            };
            failurePolicyDataValue = {
                ...failurePolicyDataValue,
                owner: policy.owner,
            };
        }
        if (optimisticPolicyDataValue && failurePolicyDataValue) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                value: optimisticPolicyDataValue,
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                value: failurePolicyDataValue,
            });
        }
    });
    const parameters = {
        partnerUserID: newDefaultContactMethod,
    };
    API.write(types_1.WRITE_COMMANDS.SET_CONTACT_METHOD_AS_DEFAULT, parameters, {
        optimisticData,
        successData,
        failureData,
    });
    Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(backTo));
}
function updateTheme(theme) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.PREFERRED_THEME,
            value: theme,
        },
    ];
    const parameters = {
        value: theme,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_THEME, parameters, { optimisticData });
    Navigation_1.default.goBack();
}
/**
 * Sets a custom status
 */
function updateCustomStatus(status) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    status,
                },
            },
        },
    ];
    const parameters = { text: status.text, emojiCode: status.emojiCode, clearAfter: status.clearAfter };
    API.write(types_1.WRITE_COMMANDS.UPDATE_STATUS, parameters, {
        optimisticData,
    });
}
/**
 * Clears the custom status
 */
function clearCustomStatus() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: {
                [currentUserAccountID]: {
                    status: null, // Clearing the field
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.CLEAR_STATUS, null, { optimisticData });
}
/**
 * Sets a custom status
 *
 * @param status.text
 * @param status.emojiCode
 * @param status.clearAfter - ISO 8601 format string, which represents the time when the status should be cleared
 */
function updateDraftCustomStatus(status) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.CUSTOM_STATUS_DRAFT, status);
}
/**
 * Clear the custom draft status
 */
function clearDraftCustomStatus() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.CUSTOM_STATUS_DRAFT, { text: '', emojiCode: '', clearAfter: '' });
}
function dismissReferralBanner(type) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_DISMISSED_REFERRAL_BANNERS,
            value: {
                [type]: true,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DISMISS_REFERRAL_BANNER, { type }, {
        optimisticData,
    });
}
function setNameValuePair(name, value, revertedValue) {
    const parameters = {
        name,
        value,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: name,
            value,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: name,
            value: revertedValue,
        },
    ];
    API.write(types_1.WRITE_COMMANDS.SET_NAME_VALUE_PAIR, parameters, {
        optimisticData,
        failureData,
    });
}
/**
 * Dismiss the Auto-Submit explanation modal
 * @param shouldDismiss Whether the user selected "Don't show again"
 */
function dismissASAPSubmitExplanation(shouldDismiss) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_DISMISSED_ASAP_SUBMIT_EXPLANATION, shouldDismiss);
}
function requestRefund() {
    API.write(types_1.WRITE_COMMANDS.REQUEST_REFUND, null);
}
function setIsDebugModeEnabled(isDebugModeEnabled) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, isDebugModeEnabled);
}
function setShouldBlockTransactionThreadReportCreation(shouldBlockTransactionThreadReportCreation) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, { shouldBlockTransactionThreadReportCreation });
}
function lockAccount() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: true,
                lockAccount: {
                    errors: null,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                lockAccount: {
                    errors: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('failedToLockAccountPage.failedToLockAccountDescription'),
            },
        },
    ];
    const params = {
        accountID: currentUserAccountID,
    };
    // We need to know if this command fails so that we can navigate the user to a failure page.
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.LOCK_ACCOUNT, params, { optimisticData, successData, failureData });
}
