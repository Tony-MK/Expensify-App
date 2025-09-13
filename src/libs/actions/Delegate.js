"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYS_TO_PRESERVE_DELEGATE_ACCESS = void 0;
exports.connect = connect;
exports.disconnect = disconnect;
exports.clearDelegatorErrors = clearDelegatorErrors;
exports.addDelegate = addDelegate;
exports.requestValidationCode = requestValidationCode;
exports.clearDelegateErrorsByField = clearDelegateErrorsByField;
exports.restoreDelegateSession = restoreDelegateSession;
exports.isConnectedAsDelegate = isConnectedAsDelegate;
exports.updateDelegateRoleOptimistically = updateDelegateRoleOptimistically;
exports.clearDelegateRolePendingAction = clearDelegateRolePendingAction;
exports.updateDelegateRole = updateDelegateRole;
exports.removeDelegate = removeDelegate;
exports.openSecuritySettingsPage = openSecuritySettingsPage;
const react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const Log_1 = require("@libs/Log");
const NetworkStore = require("@libs/Network/NetworkStore");
const SequentialQueue = require("@libs/Network/SequentialQueue");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const App_1 = require("./App");
const Report_1 = require("./Report");
const updateSessionAuthTokens_1 = require("./Session/updateSessionAuthTokens");
const updateSessionUser_1 = require("./Session/updateSessionUser");
let delegatedAccess;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.ACCOUNT,
    callback: (val) => {
        delegatedAccess = val?.delegatedAccess ?? {};
    },
});
let credentials = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.CREDENTIALS,
    callback: (value) => (credentials = value ?? {}),
});
let stashedCredentials = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.STASHED_CREDENTIALS,
    callback: (value) => (stashedCredentials = value ?? {}),
});
let session = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => (session = value ?? {}),
});
let stashedSession = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.STASHED_SESSION,
    callback: (value) => (stashedSession = value ?? {}),
});
let activePolicyID;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
    callback: (newActivePolicyID) => {
        activePolicyID = newActivePolicyID;
    },
});
const KEYS_TO_PRESERVE_DELEGATE_ACCESS = [
    ONYXKEYS_1.default.NVP_TRY_FOCUS_MODE,
    ONYXKEYS_1.default.PREFERRED_THEME,
    ONYXKEYS_1.default.NVP_PREFERRED_LOCALE,
    ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING,
    ONYXKEYS_1.default.SESSION,
    ONYXKEYS_1.default.STASHED_SESSION,
    ONYXKEYS_1.default.HAS_LOADED_APP,
    ONYXKEYS_1.default.STASHED_CREDENTIALS,
    ONYXKEYS_1.default.HYBRID_APP,
    // We need to preserve the sidebar loaded state since we never unmount the sidebar when connecting as a delegate
    // This allows the report screen to load correctly when the delegate token expires and the delegate is returned to their original account.
    ONYXKEYS_1.default.IS_SIDEBAR_LOADED,
    ONYXKEYS_1.default.NETWORK,
    ONYXKEYS_1.default.SHOULD_USE_STAGING_SERVER,
    ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED,
];
exports.KEYS_TO_PRESERVE_DELEGATE_ACCESS = KEYS_TO_PRESERVE_DELEGATE_ACCESS;
/**
 * Connects the user as a delegate to another account.
 * Returns a Promise that resolves to true on success, false on failure, or undefined if not applicable.
 */
function connect(email, isFromOldDot = false) {
    if (!delegatedAccess?.delegators && !isFromOldDot) {
        return;
    }
    react_native_onyx_1.default.set(ONYXKEYS_1.default.STASHED_CREDENTIALS, credentials);
    react_native_onyx_1.default.set(ONYXKEYS_1.default.STASHED_SESSION, session);
    const previousAccountID = (0, Report_1.getCurrentUserAccountID)();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: {
                        connect: {
                            [email]: null,
                        },
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: {
                        connect: {
                            [email]: null,
                        },
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
                delegatedAccess: {
                    errorFields: {
                        connect: {
                            [email]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('delegate.genericError'),
                        },
                    },
                },
            },
        },
    ];
    // We need to access the authToken directly from the response to update the session
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.CONNECT_AS_DELEGATE, { to: email }, { optimisticData, successData, failureData })
        .then((response) => {
        if (!response?.restrictedToken || !response?.encryptedAuthToken) {
            Log_1.default.alert('[Delegate] No auth token returned while connecting as a delegate');
            react_native_onyx_1.default.update(failureData);
            return;
        }
        if (!activePolicyID && CONFIG_1.default.IS_HYBRID_APP) {
            Log_1.default.alert('[Delegate] Unable to access activePolicyID');
            react_native_onyx_1.default.update(failureData);
            return;
        }
        const restrictedToken = response.restrictedToken;
        const policyID = activePolicyID;
        return SequentialQueue.waitForIdle()
            .then(() => react_native_onyx_1.default.clear(KEYS_TO_PRESERVE_DELEGATE_ACCESS))
            .then(() => {
            // Update authToken in Onyx and in our local variables so that API requests will use the new authToken
            (0, updateSessionAuthTokens_1.default)(response?.restrictedToken, response?.encryptedAuthToken);
            NetworkStore.setAuthToken(response?.restrictedToken ?? null);
            (0, App_1.confirmReadyToOpenApp)();
            return (0, App_1.openApp)().then(() => {
                if (!CONFIG_1.default.IS_HYBRID_APP || !policyID) {
                    return true;
                }
                react_native_hybrid_app_1.default.switchAccount({
                    newDotCurrentAccountEmail: email,
                    authToken: restrictedToken,
                    policyID,
                    accountID: String(previousAccountID),
                });
                return true;
            });
        });
    })
        .catch((error) => {
        Log_1.default.alert('[Delegate] Error connecting as delegate', { error });
        react_native_onyx_1.default.update(failureData);
        return false;
    });
}
function disconnect() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: { disconnect: null },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: undefined,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: { disconnect: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('delegate.genericError') },
                },
            },
        },
    ];
    // We need to access the authToken directly from the response to update the session
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.DISCONNECT_AS_DELEGATE, {}, { optimisticData, successData, failureData })
        .then((response) => {
        if (!response?.authToken || !response?.encryptedAuthToken) {
            Log_1.default.alert('[Delegate] No auth token returned while disconnecting as a delegate');
            restoreDelegateSession(stashedSession);
            return;
        }
        if (!response?.requesterID || !response?.requesterEmail) {
            Log_1.default.alert('[Delegate] No requester data returned while disconnecting as a delegate');
            restoreDelegateSession(stashedSession);
            return;
        }
        const requesterEmail = response.requesterEmail;
        const authToken = response.authToken;
        return SequentialQueue.waitForIdle()
            .then(() => react_native_onyx_1.default.clear(KEYS_TO_PRESERVE_DELEGATE_ACCESS))
            .then(() => {
            react_native_onyx_1.default.set(ONYXKEYS_1.default.CREDENTIALS, {
                ...stashedCredentials,
                accountID: response.requesterID,
            });
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
                ...stashedSession,
                accountID: response.requesterID,
                email: requesterEmail,
                authToken,
                encryptedAuthToken: response.encryptedAuthToken,
            });
            react_native_onyx_1.default.set(ONYXKEYS_1.default.STASHED_CREDENTIALS, {});
            react_native_onyx_1.default.set(ONYXKEYS_1.default.STASHED_SESSION, {});
            NetworkStore.setAuthToken(response?.authToken ?? null);
            (0, App_1.confirmReadyToOpenApp)();
            (0, App_1.openApp)().then(() => {
                if (!CONFIG_1.default.IS_HYBRID_APP) {
                    return;
                }
                react_native_hybrid_app_1.default.switchAccount({
                    newDotCurrentAccountEmail: requesterEmail,
                    authToken,
                    policyID: '',
                    accountID: '',
                });
            });
        });
    })
        .catch((error) => {
        Log_1.default.alert('[Delegate] Error disconnecting as a delegate', { error });
    });
}
function clearDelegatorErrors() {
    if (!delegatedAccess?.delegators) {
        return;
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, { delegatedAccess: { delegators: delegatedAccess.delegators.map((delegator) => ({ ...delegator, errorFields: undefined })) } });
}
function requestValidationCode() {
    API.write(types_1.WRITE_COMMANDS.RESEND_VALIDATE_CODE, null);
}
function addDelegate(email, role, validateCode) {
    const existingDelegate = delegatedAccess?.delegates?.find((delegate) => delegate.email === email);
    const optimisticDelegateData = () => {
        if (existingDelegate) {
            return (delegatedAccess.delegates?.map((delegate) => delegate.email !== email
                ? delegate
                : {
                    ...delegate,
                    isLoading: true,
                    pendingFields: { email: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD, role: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                }) ?? []);
        }
        return [
            ...(delegatedAccess.delegates ?? []),
            {
                email,
                role,
                isLoading: true,
                pendingFields: { email: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD, role: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        ];
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    delegates: optimisticDelegateData(),
                    errorFields: {
                        addDelegate: {
                            [email]: null,
                        },
                    },
                },
                isLoading: true,
            },
        },
    ];
    const successDelegateData = () => {
        if (existingDelegate) {
            return (delegatedAccess.delegates?.map((delegate) => delegate.email !== email
                ? delegate
                : {
                    ...delegate,
                    isLoading: false,
                    pendingAction: null,
                    pendingFields: { email: null, role: null },
                    optimisticAccountID: undefined,
                }) ?? []);
        }
        return [
            ...(delegatedAccess.delegates ?? []),
            {
                email,
                role,
                isLoading: false,
                pendingAction: null,
                pendingFields: { email: null, role: null },
                optimisticAccountID: undefined,
            },
        ];
    };
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    delegates: successDelegateData(),
                    errorFields: {
                        addDelegate: {
                            [email]: null,
                        },
                    },
                },
                isLoading: false,
            },
        },
    ];
    const failureDelegateData = () => {
        if (existingDelegate) {
            return (delegatedAccess.delegates?.map((delegate) => delegate.email !== email
                ? delegate
                : {
                    ...delegate,
                    isLoading: false,
                }) ?? []);
        }
        return [
            ...(delegatedAccess.delegates ?? []),
            {
                email,
                role,
                isLoading: false,
                pendingFields: { email: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD, role: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        ];
    };
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    delegates: failureDelegateData(),
                },
                isLoading: false,
            },
        },
    ];
    const optimisticResetActionCode = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: ONYXKEYS_1.default.VALIDATE_ACTION_CODE,
        value: {
            validateCodeSent: null,
        },
    };
    optimisticData.push(optimisticResetActionCode);
    const parameters = { delegateEmail: email, validateCode, role };
    API.write(types_1.WRITE_COMMANDS.ADD_DELEGATE, parameters, { optimisticData, successData, failureData });
}
function removeDelegate(email) {
    if (!email) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: {
                        removeDelegate: {
                            [email]: null,
                        },
                    },
                    delegates: delegatedAccess.delegates?.map((delegate) => delegate.email === email
                        ? {
                            ...delegate,
                            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                            pendingFields: { email: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE, role: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE },
                        }
                        : delegate),
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    delegates: delegatedAccess.delegates?.filter((delegate) => delegate.email !== email),
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: {
                        removeDelegate: {
                            [email]: null,
                        },
                    },
                    delegates: delegatedAccess.delegates?.map((delegate) => delegate.email === email
                        ? {
                            ...delegate,
                            pendingAction: null,
                            pendingFields: undefined,
                        }
                        : delegate),
                },
            },
        },
    ];
    const parameters = { delegateEmail: email };
    API.write(types_1.WRITE_COMMANDS.REMOVE_DELEGATE, parameters, { optimisticData, successData, failureData });
}
function clearDelegateErrorsByField(email, fieldName) {
    if (!delegatedAccess?.delegates) {
        return;
    }
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, {
        delegatedAccess: {
            errorFields: {
                [fieldName]: {
                    [email]: null,
                },
            },
        },
    });
}
function isConnectedAsDelegate() {
    return !!delegatedAccess?.delegate;
}
function updateDelegateRole(email, role, validateCode) {
    if (!delegatedAccess?.delegates) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: {
                        updateDelegateRole: {
                            [email]: null,
                        },
                    },
                    delegates: delegatedAccess.delegates.map((delegate) => delegate.email === email
                        ? {
                            ...delegate,
                            isLoading: true,
                            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            pendingFields: { role: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                        }
                        : delegate),
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: {
                        updateDelegateRole: {
                            [email]: null,
                        },
                    },
                    delegates: delegatedAccess.delegates.map((delegate) => delegate.email === email
                        ? {
                            ...delegate,
                            role,
                            isLoading: false,
                            pendingAction: null,
                            pendingFields: { role: null },
                        }
                        : delegate),
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    delegates: delegatedAccess.delegates.map((delegate) => delegate.email === email
                        ? {
                            ...delegate,
                            isLoading: false,
                            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            pendingFields: { role: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                        }
                        : delegate),
                },
            },
        },
    ];
    const parameters = { delegateEmail: email, validateCode, role };
    API.write(types_1.WRITE_COMMANDS.UPDATE_DELEGATE_ROLE, parameters, { optimisticData, successData, failureData });
}
function updateDelegateRoleOptimistically(email, role) {
    if (!delegatedAccess?.delegates) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    errorFields: {
                        updateDelegateRole: {
                            [email]: null,
                        },
                    },
                    delegates: delegatedAccess.delegates.map((delegate) => delegate.email === email
                        ? {
                            ...delegate,
                            role,
                            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            pendingFields: { role: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                        }
                        : delegate),
                },
            },
        },
    ];
    react_native_onyx_1.default.update(optimisticData);
}
function clearDelegateRolePendingAction(email) {
    if (!delegatedAccess?.delegates) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                delegatedAccess: {
                    delegates: delegatedAccess.delegates.map((delegate) => delegate.email === email
                        ? {
                            ...delegate,
                            pendingAction: null,
                            pendingFields: undefined,
                        }
                        : delegate),
                },
            },
        },
    ];
    react_native_onyx_1.default.update(optimisticData);
}
function restoreDelegateSession(authenticateResponse) {
    react_native_onyx_1.default.clear(KEYS_TO_PRESERVE_DELEGATE_ACCESS).then(() => {
        (0, updateSessionAuthTokens_1.default)(authenticateResponse?.authToken, authenticateResponse?.encryptedAuthToken);
        (0, updateSessionUser_1.default)(authenticateResponse?.accountID, authenticateResponse?.email);
        NetworkStore.setAuthToken(authenticateResponse.authToken ?? null);
        NetworkStore.setIsAuthenticating(false);
        (0, App_1.confirmReadyToOpenApp)();
        (0, App_1.openApp)();
    });
}
function openSecuritySettingsPage() {
    API.read(types_1.READ_COMMANDS.OPEN_SECURITY_SETTINGS_PAGE, null);
}
