"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const netinfo_1 = require("@react-native-community/netinfo");
const differenceInHours_1 = require("date-fns/differenceInHours");
const isBoolean_1 = require("lodash/isBoolean");
const throttle_1 = require("lodash/throttle");
const react_native_onyx_1 = require("react-native-onyx");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Network_1 = require("./actions/Network");
const AppStateMonitor_1 = require("./AppStateMonitor");
const Log_1 = require("./Log");
let isOffline = false;
// Holds all of the callbacks that need to be triggered when the network reconnects
let callbackID = 0;
const reconnectionCallbacks = {};
let isServerUp = true;
let wasServerDown = false;
/**
 * Loop over all reconnection callbacks and fire each one
 */
const triggerReconnectionCallbacks = (0, throttle_1.default)((reason) => {
    let delay = 0;
    if (wasServerDown && isServerUp) {
        delay = Math.floor(Math.random() * 61000);
        wasServerDown = false;
    }
    setTimeout(() => {
        Log_1.default.info(`[NetworkConnection] Firing reconnection callbacks because ${reason}`);
        Object.values(reconnectionCallbacks).forEach((callback) => {
            callback();
        });
    }, delay);
}, 5000, { trailing: false });
/**
 * Called when the offline status of the app changes and if the network is "reconnecting" (going from offline to online)
 * then all of the reconnection callbacks are triggered
 */
function setOfflineStatus(isCurrentlyOffline, reason = '') {
    trackConnectionChanges();
    (0, Network_1.setIsOffline)(isCurrentlyOffline, reason);
    // When reconnecting, ie, going from offline to online, all the reconnection callbacks
    // are triggered (this is usually Actions that need to re-download data from the server)
    if (isOffline && !isCurrentlyOffline) {
        triggerReconnectionCallbacks('offline status changed');
    }
    isOffline = isCurrentlyOffline;
}
// Update the offline status in response to changes in shouldForceOffline
let shouldForceOffline = false;
let isPoorConnectionSimulated;
let connectionChanges;
let isNetworkStatusInitialized = false;
// We do not depend on updates on the UI to determine the network status
// or the offline status, so we can use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (network) => {
        if (!network) {
            return;
        }
        isNetworkStatusInitialized = true;
        simulatePoorConnection(network);
        isPoorConnectionSimulated = !!network.shouldSimulatePoorConnection;
        connectionChanges = network.connectionChanges;
        const currentShouldForceOffline = !!network.shouldForceOffline;
        if (currentShouldForceOffline === shouldForceOffline) {
            return;
        }
        shouldForceOffline = currentShouldForceOffline;
        if (shouldForceOffline) {
            setOfflineStatus(true, 'shouldForceOffline was detected in the Onyx data');
            Log_1.default.info(`[NetworkStatus] Setting "offlineStatus" to "true" because user is under force offline`);
        }
        else {
            // If we are no longer forcing offline fetch the NetInfo to set isOffline appropriately
            netinfo_1.default.fetch().then((state) => {
                const isInternetUnreachable = (state.isInternetReachable ?? false) === false;
                setOfflineStatus(isInternetUnreachable || !isServerUp, 'NetInfo checked if the internet is reachable');
                Log_1.default.info(`[NetworkStatus] The force-offline mode was turned off. Getting the device network status from NetInfo. Network state: ${JSON.stringify(state)}. Setting the offline status to: ${isInternetUnreachable}.`);
            });
        }
    },
});
function simulatePoorConnection(network) {
    // Starts random network status change when shouldSimulatePoorConnection is turned into true
    // or after app restart if shouldSimulatePoorConnection is true already
    if (!isPoorConnectionSimulated && !!network.shouldSimulatePoorConnection) {
        clearTimeout(network.poorConnectionTimeoutID);
        setRandomNetworkStatus(true);
    }
    // Fetch the NetInfo state to set the correct offline status when shouldSimulatePoorConnection is turned into false
    if (isPoorConnectionSimulated && !network.shouldSimulatePoorConnection) {
        netinfo_1.default.fetch().then((state) => {
            const isInternetUnreachable = !state.isInternetReachable;
            const stringifiedState = JSON.stringify(state);
            setOfflineStatus(isInternetUnreachable || !isServerUp, 'NetInfo checked if the internet is reachable');
            Log_1.default.info(`[NetworkStatus] The poor connection simulation mode was turned off. Getting the device network status from NetInfo. Network state: ${stringifiedState}. Setting the offline status to: ${isInternetUnreachable}.`);
        });
    }
}
/** Sets online/offline connection randomly every 2-5 seconds */
function setRandomNetworkStatus(initialCall = false) {
    // The check to ensure no new timeouts are scheduled after poor connection simulation is stopped
    if (!isPoorConnectionSimulated && !initialCall) {
        return;
    }
    const statuses = [CONST_1.default.NETWORK.NETWORK_STATUS.OFFLINE, CONST_1.default.NETWORK.NETWORK_STATUS.ONLINE];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomInterval = Math.random() * (5000 - 2000) + 2000; // random interval between 2-5 seconds
    Log_1.default.info(`[NetworkConnection] Set connection status "${randomStatus}" for ${randomInterval} sec`);
    setOfflineStatus(randomStatus === CONST_1.default.NETWORK.NETWORK_STATUS.OFFLINE);
    const timeoutID = setTimeout(setRandomNetworkStatus, randomInterval);
    (0, Network_1.setPoorConnectionTimeoutID)(timeoutID);
}
/** Tracks how many times the connection has changed within the time period */
function trackConnectionChanges() {
    if (!connectionChanges?.startTime) {
        (0, Network_1.setConnectionChanges)({ startTime: new Date().getTime(), amount: 1 });
        return;
    }
    const diffInHours = (0, differenceInHours_1.differenceInHours)(new Date(), connectionChanges.startTime);
    const newAmount = (connectionChanges.amount ?? 0) + 1;
    if (diffInHours < 1) {
        (0, Network_1.setConnectionChanges)({ amount: newAmount });
        return;
    }
    Log_1.default.info(`[NetworkConnection] Connection has changed ${newAmount} time(s) for the last ${diffInHours} hour(s). Poor connection simulation is turned ${isPoorConnectionSimulated ? 'on' : 'off'}`);
    (0, Network_1.setConnectionChanges)({ startTime: new Date().getTime(), amount: 0 });
}
/**
 * Set up the event listener for NetInfo to tell whether the user has
 * internet connectivity or not. This is more reliable than the Pusher
 * `disconnected` event which takes about 10-15 seconds to emit.
 * @returns unsubscribe method
 */
function subscribeToNetInfo(accountID) {
    // Note: We are disabling the configuration for NetInfo when using the local web API since requests can get stuck in a 'Pending' state and are not reliable indicators for "offline".
    // If you need to test the "recheck" feature then switch to the production API proxy server.
    if (!CONFIG_1.default.IS_USING_LOCAL_WEB) {
        // Calling NetInfo.configure (re)checks current state. We use it to force a recheck whenever we (re)subscribe
        netinfo_1.default.configure({
            // By default, NetInfo uses `/` for `reachabilityUrl`
            // When App is served locally (or from Electron) this address is always reachable - even offline
            // Using the API url ensures reachability is tested over internet
            reachabilityUrl: `${CONFIG_1.default.EXPENSIFY.DEFAULT_API_ROOT}api/Ping?accountID=${accountID ?? 'unknown'}`,
            reachabilityMethod: 'GET',
            reachabilityTest: (response) => {
                if (!response.ok) {
                    return Promise.resolve(false);
                }
                return response
                    .json()
                    .then((json) => {
                    if (json.jsonCode !== 200 && isServerUp) {
                        Log_1.default.info('[NetworkConnection] Received non-200 response from reachability test. Setting isServerUp status to false.');
                        isServerUp = false;
                        wasServerDown = true;
                    }
                    else if (json.jsonCode === 200 && !isServerUp) {
                        Log_1.default.info('[NetworkConnection] Received 200 response from reachability test. Setting isServerUp status to true.');
                        isServerUp = true;
                    }
                    return Promise.resolve(json.jsonCode === 200);
                })
                    .catch(() => {
                    isServerUp = false;
                    wasServerDown = true;
                    return Promise.resolve(false);
                });
            },
            // If a check is taking longer than this time we're considered offline
            reachabilityRequestTimeout: CONST_1.default.NETWORK.MAX_PENDING_TIME_MS,
        });
    }
    // Subscribe to the state change event via NetInfo so we can update
    // whether a user has internet connectivity or not.
    const unsubscribeNetInfo = netinfo_1.default.addEventListener((state) => {
        if (!isNetworkStatusInitialized) {
            return;
        }
        Log_1.default.info('[NetworkConnection] NetInfo state change', false, { ...state });
        if (shouldForceOffline) {
            Log_1.default.info('[NetworkConnection] Not setting offline status because shouldForceOffline = true');
            return;
        }
        setOfflineStatus(state.isInternetReachable === false || !isServerUp, 'NetInfo received a state change event');
        Log_1.default.info(`[NetworkStatus] NetInfo.addEventListener event coming, setting "offlineStatus" to ${!!state.isInternetReachable} with network state: ${JSON.stringify(state)}`);
        let networkStatus;
        if (!(0, isBoolean_1.default)(state.isInternetReachable)) {
            networkStatus = CONST_1.default.NETWORK.NETWORK_STATUS.UNKNOWN;
        }
        else {
            networkStatus = state.isInternetReachable ? CONST_1.default.NETWORK.NETWORK_STATUS.ONLINE : CONST_1.default.NETWORK.NETWORK_STATUS.OFFLINE;
        }
        (0, Network_1.setNetWorkStatus)(networkStatus);
    });
    // Periodically recheck the network connection
    // More info: https://github.com/Expensify/App/issues/42988
    const recheckIntervalID = setInterval(() => {
        if (!isOffline) {
            return;
        }
        recheckNetworkConnection();
        Log_1.default.info(`[NetworkStatus] Rechecking the network connection with "isOffline" set to "true" to double-check internet reachability.`);
    }, CONST_1.default.NETWORK.RECHECK_INTERVAL_MS);
    return () => {
        clearInterval(recheckIntervalID);
        unsubscribeNetInfo();
    };
}
function listenForReconnect() {
    Log_1.default.info('[NetworkConnection] listenForReconnect called');
    AppStateMonitor_1.default.addBecameActiveListener(() => {
        triggerReconnectionCallbacks('app became active');
    });
}
/**
 * Register callback to fire when we reconnect
 * @returns unsubscribe method
 */
function onReconnect(callback) {
    const currentID = callbackID;
    callbackID++;
    reconnectionCallbacks[currentID] = callback;
    return () => delete reconnectionCallbacks[currentID];
}
/**
 * Delete all queued reconnection callbacks
 */
function clearReconnectionCallbacks() {
    Object.keys(reconnectionCallbacks).forEach((key) => delete reconnectionCallbacks[key]);
}
/**
 * Refresh NetInfo state.
 */
function recheckNetworkConnection() {
    Log_1.default.info('[NetworkConnection] recheck NetInfo');
    netinfo_1.default.refresh();
}
exports.default = {
    clearReconnectionCallbacks,
    setOfflineStatus,
    listenForReconnect,
    onReconnect,
    triggerReconnectionCallbacks,
    recheckNetworkConnection,
    subscribeToNetInfo,
};
