"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pusher_websocket_react_native_1 = require("@pusher/pusher-websocket-react-native");
const isObject_1 = require("lodash/isObject");
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EventType_1 = require("./EventType");
let shouldForceOffline = false;
// We have used `connectWithoutView` here because it is not connected to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (network) => {
        if (!network) {
            return;
        }
        shouldForceOffline = !!network.shouldForceOffline;
    },
});
let socket;
let pusherSocketID;
const socketEventCallbacks = [];
let resolveInitPromise;
let initPromise = new Promise((resolve) => {
    resolveInitPromise = resolve;
});
const eventsBoundToChannels = new Map();
let channels = {};
/**
 * Trigger each of the socket event callbacks with the event information
 */
function callSocketEventCallbacks(eventName, data) {
    socketEventCallbacks.forEach((cb) => cb(eventName, data));
}
/**
 * Initialize our pusher lib
 * @returns resolves when Pusher has connected
 */
function init(args) {
    return new Promise((resolve) => {
        if (socket) {
            resolve();
            return;
        }
        socket = pusher_websocket_react_native_1.Pusher.getInstance();
        socket.init({
            apiKey: args.appKey,
            cluster: args.cluster,
            onConnectionStateChange: (currentState, previousState) => {
                if (currentState === CONST_1.default.PUSHER.STATE.CONNECTED) {
                    socket?.getSocketId().then((id) => {
                        pusherSocketID = id;
                        callSocketEventCallbacks('connected');
                        resolve();
                    });
                }
                if (currentState === CONST_1.default.PUSHER.STATE.DISCONNECTED) {
                    callSocketEventCallbacks('disconnected');
                }
                callSocketEventCallbacks('state_change', { previous: previousState, current: currentState });
            },
            onError: (message) => callSocketEventCallbacks('error', { data: { message } }),
            onAuthorizer: (channelName, socketId) => (0, Session_1.authenticatePusher)(socketId, channelName),
        });
        socket.connect();
    }).then(resolveInitPromise);
}
/**
 * Returns a Pusher channel for a channel name
 */
function getChannel(channelName) {
    if (!socket) {
        return;
    }
    return socket.getChannel(channelName);
}
/**
 * Parses JSON data that may be single or double-encoded
 * This handles cases where the backend sometimes sends double-encoded JSON
 * Reference issue: https://github.com/Expensify/App/issues/60332
 */
function parseEventData(eventData) {
    if ((0, isObject_1.default)(eventData)) {
        return eventData;
    }
    if (typeof eventData !== 'string') {
        Log_1.default.alert('[Pusher] Event data is neither object nor string', { eventData });
        return null;
    }
    try {
        const firstParse = JSON.parse(eventData);
        // If result is still a string, it was double-encoded - parse again
        if (typeof firstParse === 'string') {
            return JSON.parse(firstParse);
        }
        return firstParse;
    }
    catch (error) {
        Log_1.default.alert('[Pusher] Failed to parse event data', {
            error: error instanceof Error ? error.message : 'Unknown error',
            eventData,
        });
        return null;
    }
}
/**
 * Binds an event callback to a channel + eventName
 */
function bindEventToChannel(channel, eventName, eventCallback = () => { }) {
    if (!eventName) {
        return;
    }
    const chunkedDataEvents = {};
    const callback = (eventData) => {
        if (shouldForceOffline) {
            Log_1.default.info('[Pusher] Ignoring a Push event because shouldForceOffline = true');
            return;
        }
        const data = parseEventData(eventData);
        if (!data) {
            // Error already logged in parseEventData
            return;
        }
        if (data.id === undefined || data.chunk === undefined || data.final === undefined) {
            eventCallback(data);
            return;
        }
        // If we are chunking the requests, we need to construct a rolling list of all packets that have come through
        // Pusher. If we've completed one of these full packets, we'll combine the data and act on the event that it's
        // assigned to.
        // If we haven't seen this eventID yet, initialize it into our rolling list of packets.
        if (!chunkedDataEvents[data.id]) {
            chunkedDataEvents[data.id] = { chunks: [], receivedFinal: false };
        }
        // Add it to the rolling list.
        const chunkedEvent = chunkedDataEvents[data.id];
        if (data.index !== undefined) {
            chunkedEvent.chunks[data.index] = data.chunk;
        }
        // If this is the last packet, mark that we've hit the end.
        if (data.final) {
            chunkedEvent.receivedFinal = true;
        }
        // Only call the event callback if we've received the last packet and we don't have any holes in the complete
        // packet.
        if (chunkedEvent.receivedFinal && chunkedEvent.chunks.length === Object.keys(chunkedEvent.chunks).length) {
            try {
                eventCallback(JSON.parse(chunkedEvent.chunks.join('')));
            }
            catch (err) {
                Log_1.default.alert('[Pusher] Unable to parse chunked JSON response from Pusher', {
                    error: err,
                    eventData: chunkedEvent.chunks.join(''),
                });
                // Using console.error is helpful here because it will print a usable stack trace to the console to debug where the error comes from
                console.error(err);
            }
            delete chunkedDataEvents[data.id];
        }
    };
    if (!eventsBoundToChannels.has(channel)) {
        eventsBoundToChannels.set(channel, new Map());
    }
    eventsBoundToChannels.get(channel)?.set(eventName, callback);
}
/**
 * Subscribe to a channel and an event
 */
function subscribe(channelName, eventName, eventCallback = () => { }, onResubscribe = () => { }) {
    return initPromise.then(() => new Promise((resolve, reject) => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            // We cannot call subscribe() before init(). Prevent any attempt to do this on dev.
            if (!socket) {
                throw new Error(`[Pusher] instance not found. Pusher.subscribe()
            most likely has been called before Pusher.init()`);
            }
            Log_1.default.info('[Pusher] Attempting to subscribe to channel', false, { channelName, eventName });
            if (!channels[channelName]) {
                channels[channelName] = CONST_1.default.PUSHER.CHANNEL_STATUS.SUBSCRIBING;
                socket.subscribe({
                    channelName,
                    onEvent: (event) => {
                        const callback = eventsBoundToChannels.get(event.channelName)?.get(event.eventName);
                        callback?.(event.data);
                    },
                    onSubscriptionSucceeded: () => {
                        channels[channelName] = CONST_1.default.PUSHER.CHANNEL_STATUS.SUBSCRIBED;
                        bindEventToChannel(channelName, eventName, eventCallback);
                        resolve();
                        // When subscribing for the first time we register a success callback that can be
                        // called multiple times when the subscription succeeds again in the future
                        // e.g. as a result of Pusher disconnecting and reconnecting. This callback does
                        // not fire on the first subscription_succeeded event.
                        onResubscribe();
                    },
                    onSubscriptionError: (name, message) => {
                        delete channels[channelName];
                        Log_1.default.hmmm('[Pusher] Issue authenticating with Pusher during subscribe attempt.', {
                            channelName,
                            message,
                        });
                        reject(message);
                    },
                });
            }
            else {
                bindEventToChannel(channelName, eventName, eventCallback);
                resolve();
            }
        });
    }));
}
/**
 * Unsubscribe from a channel and optionally a specific event
 */
function unsubscribe(channelName, eventName = '') {
    const channel = getChannel(channelName);
    if (!channel) {
        Log_1.default.hmmm('[Pusher] Attempted to unsubscribe or unbind from a channel, but Pusher-JS has no knowledge of it', { channelName, eventName });
        return;
    }
    if (eventName) {
        Log_1.default.info('[Pusher] Unbinding event', false, { eventName, channelName });
        eventsBoundToChannels.get(channelName)?.delete(eventName);
        if (eventsBoundToChannels.get(channelName)?.size === 0) {
            Log_1.default.info(`[Pusher] After unbinding ${eventName} from channel ${channelName}, no other events were bound to that channel. Unsubscribing...`, false);
            eventsBoundToChannels.delete(channelName);
            delete channels[channelName];
            socket?.unsubscribe({ channelName });
        }
    }
    else {
        Log_1.default.info('[Pusher] Unsubscribing from channel', false, { channelName });
        eventsBoundToChannels.delete(channelName);
        delete channels[channelName];
        socket?.unsubscribe({ channelName });
    }
}
/**
 * Are we already in the process of subscribing to this channel?
 */
function isAlreadySubscribing(channelName) {
    if (!socket) {
        return false;
    }
    return channels[channelName] === CONST_1.default.PUSHER.CHANNEL_STATUS.SUBSCRIBING;
}
/**
 * Are we already subscribed to this channel?
 */
function isSubscribed(channelName) {
    if (!socket) {
        return false;
    }
    return channels[channelName] === CONST_1.default.PUSHER.CHANNEL_STATUS.SUBSCRIBED;
}
/**
 * Sends an event over a specific event/channel in pusher.
 */
function sendEvent(channelName, eventName, payload) {
    // Check to see if we are subscribed to this channel before sending the event. Sending client events over channels
    // we are not subscribed too will throw errors and cause reconnection attempts. Subscriptions are not instant and
    // can happen later than we expect.
    if (!isSubscribed(channelName)) {
        return;
    }
    if (shouldForceOffline) {
        Log_1.default.info('[Pusher] Ignoring a Send event because shouldForceOffline = true');
        return;
    }
    socket?.trigger({ channelName, eventName, data: JSON.stringify(payload) });
}
/**
 * Register a method that will be triggered when a socket event happens (like disconnecting)
 */
function registerSocketEventCallback(cb) {
    socketEventCallbacks.push(cb);
}
/**
 * Disconnect from Pusher
 */
function disconnect() {
    if (!socket) {
        Log_1.default.info('[Pusher] Attempting to disconnect from Pusher before initialization has occurred, ignoring.');
        return;
    }
    socket.disconnect();
    socket = null;
    pusherSocketID = '';
    channels = {};
    eventsBoundToChannels.clear();
    initPromise = new Promise((resolve) => {
        resolveInitPromise = resolve;
    });
}
/**
 * Disconnect and Re-Connect Pusher
 */
function reconnect() {
    if (!socket) {
        Log_1.default.info('[Pusher] Unable to reconnect since Pusher instance does not yet exist.');
        return;
    }
    Log_1.default.info('[Pusher] Reconnecting to Pusher');
    socket.disconnect();
    socket.connect();
}
function getPusherSocketID() {
    return pusherSocketID;
}
if (window) {
    /**
     * Pusher socket for debugging purposes
     */
    window.getPusherInstance = () => socket;
}
const MobilePusher = {
    init,
    subscribe,
    unsubscribe,
    getChannel,
    isSubscribed,
    isAlreadySubscribing,
    sendEvent,
    disconnect,
    reconnect,
    registerSocketEventCallback,
    TYPE: EventType_1.default,
    getPusherSocketID,
};
exports.default = MobilePusher;
