"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePolicyConnection = removePolicyConnection;
exports.updateManyPolicyConnectionConfigs = updateManyPolicyConnectionConfigs;
exports.isAuthenticationError = isAuthenticationError;
exports.syncConnection = syncConnection;
exports.copyExistingPolicyConnection = copyExistingPolicyConnection;
exports.isConnectionUnverified = isConnectionUnverified;
exports.isConnectionInProgress = isConnectionInProgress;
exports.hasSynchronizationErrorMessage = hasSynchronizationErrorMessage;
exports.setConnectionError = setConnectionError;
const date_fns_1 = require("date-fns");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const PolicyUtils = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function removePolicyConnection(policy, connectionName) {
    const policyID = policy.id;
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    [connectionName]: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policyID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_CONTINUOUS_RECONCILIATION_CONNECTION}${workspaceAccountID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_USE_CONTINUOUS_RECONCILIATION}${workspaceAccountID}`,
            value: null,
        },
    ];
    const successData = [];
    const failureData = [];
    const supportedConnections = [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO, CONST_1.default.POLICY.CONNECTIONS.NAME.XERO];
    if (PolicyUtils.isCollectPolicy(policy) && supportedConnections.includes(connectionName)) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                areReportFieldsEnabled: false,
                pendingFields: {
                    areReportFieldsEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                },
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                pendingFields: {
                    areReportFieldsEnabled: null,
                },
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                areReportFieldsEnabled: policy?.areReportFieldsEnabled,
                pendingFields: {
                    areReportFieldsEnabled: null,
                },
            },
        });
    }
    const parameters = {
        policyID,
        connectionName,
    };
    API.write(types_1.WRITE_COMMANDS.REMOVE_POLICY_CONNECTION, parameters, { optimisticData, successData, failureData });
}
/**
 * This method returns read command and stage in progress for a given accounting integration.
 *
 * @param policyID - ID of the policy for which the sync is needed
 * @param connectionName - Name of the connection, QBO/Xero
 */
function getSyncConnectionParameters(connectionName) {
    switch (connectionName) {
        case CONST_1.default.POLICY.CONNECTIONS.NAME.QBO: {
            return { readCommand: types_1.READ_COMMANDS.SYNC_POLICY_TO_QUICKBOOKS_ONLINE, stageInProgress: CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.STARTING_IMPORT_QBO };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.XERO: {
            return { readCommand: types_1.READ_COMMANDS.SYNC_POLICY_TO_XERO, stageInProgress: CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.STARTING_IMPORT_XERO };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE: {
            return { readCommand: types_1.READ_COMMANDS.SYNC_POLICY_TO_NETSUITE, stageInProgress: CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.NETSUITE_SYNC_CONNECTION };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT: {
            return { readCommand: types_1.READ_COMMANDS.SYNC_POLICY_TO_SAGE_INTACCT, stageInProgress: CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.SAGE_INTACCT_SYNC_CHECK_CONNECTION };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.QBD: {
            return { readCommand: types_1.READ_COMMANDS.SYNC_POLICY_TO_QUICKBOOKS_DESKTOP, stageInProgress: CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.STARTING_IMPORT_QBD };
        }
        default:
            return undefined;
    }
}
/**
 * This method helps in syncing policy to the connected accounting integration.
 *
 * @param policy - Policy for which the sync is needed
 * @param connectionName - Name of the connection, QBO/Xero
 * @param forceDataRefresh - If true, it will trigger a full data refresh
 */
function syncConnection(policy, connectionName, forceDataRefresh = false) {
    if (!connectionName || !policy) {
        return;
    }
    const policyID = policy.id;
    const syncConnectionData = getSyncConnectionParameters(connectionName);
    if (!syncConnectionData) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policyID}`,
            value: {
                stageInProgress: syncConnectionData?.stageInProgress,
                connectionName,
                timestamp: new Date().toISOString(),
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policyID}`,
            value: null,
        },
    ];
    const parameters = {
        policyID,
        idempotencyKey: policyID,
    };
    if (connectionName === CONST_1.default.POLICY.CONNECTIONS.NAME.QBD) {
        parameters.forceDataRefresh = forceDataRefresh;
    }
    API.read(syncConnectionData.readCommand, parameters, {
        optimisticData,
        failureData,
    });
}
function updateManyPolicyConnectionConfigs(policyID, connectionName, configUpdate, configCurrentData) {
    if (!policyID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    [connectionName]: {
                        config: {
                            ...configUpdate,
                            pendingFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE])),
                            errorFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, null])),
                        },
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    [connectionName]: {
                        config: {
                            ...configCurrentData,
                            pendingFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, null])),
                            errorFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage')])),
                        },
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    [connectionName]: {
                        config: {
                            pendingFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, null])),
                            errorFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, null])),
                        },
                    },
                },
            },
        },
    ];
    const parameters = {
        policyID,
        connectionName,
        configUpdate: JSON.stringify(configUpdate),
        idempotencyKey: Object.keys(configUpdate).join(','),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_MANY_POLICY_CONNECTION_CONFIGS, parameters, { optimisticData, failureData, successData });
}
function hasSynchronizationErrorMessage(policy, connectionName, isSyncInProgress) {
    const connection = policy?.connections?.[connectionName];
    if (isSyncInProgress || (0, EmptyObject_1.isEmptyObject)(connection?.lastSync) || connection?.lastSync?.isSuccessful !== false || !connection?.lastSync?.errorDate) {
        return false;
    }
    return true;
}
function isAuthenticationError(policy, connectionName) {
    const connection = policy?.connections?.[connectionName];
    return connection?.lastSync?.isAuthenticationError === true;
}
function isConnectionUnverified(policy, connectionName) {
    // A verified connection is one that has been successfully synced at least once
    // We'll always err on the side of considering a connection as verified connected even if we can't find a lastSync property saying as such
    // i.e. this is a property that is explicitly set to false, not just missing
    if (connectionName === CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE) {
        return !(policy?.connections?.[CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE]?.verified ?? true);
    }
    // If the connection has no lastSync property, we'll consider it unverified
    if ((0, EmptyObject_1.isEmptyObject)(policy?.connections?.[connectionName]?.lastSync)) {
        return true;
    }
    return !(policy?.connections?.[connectionName]?.lastSync?.isConnected ?? true);
}
function setConnectionError(policyID, connectionName, errorMessage) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        connections: {
            [connectionName]: {
                lastSync: {
                    isSuccessful: false,
                    isConnected: false,
                    errorDate: new Date().toISOString(),
                    errorMessage,
                },
            },
        },
    });
}
function copyExistingPolicyConnection(connectedPolicyID, targetPolicyID, connectionName) {
    let stageInProgress;
    switch (connectionName) {
        case CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE:
            stageInProgress = CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.NETSUITE_SYNC_CONNECTION;
            break;
        case CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT:
            stageInProgress = CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.SAGE_INTACCT_SYNC_CHECK_CONNECTION;
            break;
        default:
            stageInProgress = null;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${targetPolicyID}`,
            value: {
                stageInProgress,
                connectionName,
                timestamp: new Date().toISOString(),
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.COPY_EXISTING_POLICY_CONNECTION, {
        policyID: connectedPolicyID,
        targetPolicyID,
        connectionName,
    }, { optimisticData });
}
function isConnectionInProgress(connectionSyncProgress, policy) {
    if (!policy || !connectionSyncProgress) {
        return false;
    }
    const qboConnection = policy?.connections?.quickbooksOnline;
    const lastSyncProgressDate = (0, date_fns_1.parseISO)(connectionSyncProgress?.timestamp ?? '');
    return ((!!connectionSyncProgress?.stageInProgress &&
        (connectionSyncProgress.stageInProgress !== CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.JOB_DONE || !policy?.connections?.[connectionSyncProgress.connectionName]) &&
        (0, date_fns_1.isValid)(lastSyncProgressDate) &&
        (0, date_fns_1.differenceInMinutes)(new Date(), lastSyncProgressDate) < CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_TIMEOUT_MINUTES) ||
        (!!qboConnection && !qboConnection?.data && !!qboConnection?.config?.credentials));
}
