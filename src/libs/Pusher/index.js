"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isObject_1 = require("lodash/isObject");
const with_encryption_1 = require("pusher-js/with-encryption");
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EventType_1 = require("./EventType");
let shouldForceOffline = false;
// shouldForceOffline is only used to ignore pusher events when the client has been forced offline.
// Since it's not connected to any UI, it's OK to use connectWithoutView.
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
let customAuthorizer;
let resolveInitPromise;
let initPromise = new Promise((resolve) => {
    resolveInitPromise = resolve;
});
const eventsBoundToChannels = new Map();
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
        // Use this for debugging
        // Pusher.log = (message) => {
        //     if (window.console && window.console.log) {
        //         window.console.log(message);
        //     }
        // };
        const options = {
            cluster: args.cluster,
            authEndpoint: args.authEndpoint,
        };
        if (customAuthorizer) {
            options.authorizer = customAuthorizer;
        }
        socket = new with_encryption_1.default(args.appKey, options);
        // Listen for connection errors and log them
        socket?.connection.bind('error', (error) => {
            callSocketEventCallbacks('error', error);
        });
        socket?.connection.bind('connected', () => {
            pusherSocketID = socket?.connection.socket_id;
            callSocketEventCallbacks('connected');
            resolve();
        });
        socket?.connection.bind('disconnected', () => {
            callSocketEventCallbacks('disconnected');
        });
        socket?.connection.bind('state_change', (states) => {
            callSocketEventCallbacks('state_change', states);
        });
    }).then(resolveInitPromise);
}
/**
 * Returns a Pusher channel for a channel name
 */
function getChannel(channelName) {
    if (!socket) {
        return;
    }
    return socket.channel(channelName);
}
/**
 * Binds an event callback to a channel + eventName
 */
function bindEventToChannel(channel, eventName, eventCallback = () => { }) {
    if (!eventName || !channel) {
        return;
    }
    const chunkedDataEvents = {};
    const callback = (eventData) => {
        if (shouldForceOffline) {
            Log_1.default.info('[Pusher] Ignoring a Push event because shouldForceOffline = true');
            return;
        }
        let data;
        try {
            data = (0, isObject_1.default)(eventData) ? eventData : JSON.parse(eventData);
        }
        catch (err) {
            Log_1.default.alert('[Pusher] Unable to parse single JSON event data from Pusher', { error: err, eventData });
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
    channel.bind(eventName, callback);
    if (!eventsBoundToChannels.has(channel)) {
        eventsBoundToChannels.set(channel, new Set());
    }
    eventsBoundToChannels.get(channel)?.add(eventName);
}
/**
 * Subscribe to a channel and an event
 * @param [onResubscribe] Callback to be called when reconnection happen
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
            let channel = getChannel(channelName);
            if (!channel?.subscribed) {
                channel = socket.subscribe(channelName);
                let isBound = false;
                channel.bind('pusher:subscription_succeeded', () => {
                    // Check so that we do not bind another event with each reconnect attempt
                    if (!isBound) {
                        bindEventToChannel(channel, eventName, eventCallback);
                        resolve();
                        isBound = true;
                        return;
                    }
                    // When subscribing for the first time we register a success callback that can be
                    // called multiple times when the subscription succeeds again in the future
                    // e.g. as a result of Pusher disconnecting and reconnecting. This callback does
                    // not fire on the first subscription_succeeded event.
                    onResubscribe();
                });
                channel.bind('pusher:subscription_error', (data = {}) => {
                    const { type, error, status } = data;
                    Log_1.default.hmmm('[Pusher] Issue authenticating with Pusher during subscribe attempt.', {
                        channelName,
                        status,
                        type,
                        error,
                    });
                    reject(error);
                });
            }
            else {
                bindEventToChannel(channel, eventName, eventCallback);
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
        channel.unbind(eventName);
        eventsBoundToChannels.get(channel)?.delete(eventName);
        if (eventsBoundToChannels.get(channel)?.size === 0) {
            Log_1.default.info(`[Pusher] After unbinding ${eventName} from channel ${channelName}, no other events were bound to that channel. Unsubscribing...`, false);
            eventsBoundToChannels.delete(channel);
            socket?.unsubscribe(channelName);
        }
    }
    else {
        if (!channel.subscribed) {
            Log_1.default.info('Pusher] Attempted to unsubscribe from channel, but we are not subscribed to begin with', false, { channelName });
            return;
        }
        Log_1.default.info('[Pusher] Unsubscribing from channel', false, { channelName });
        channel.unbind();
        socket?.unsubscribe(channelName);
    }
}
/**
 * Are we already in the process of subscribing to this channel?
 */
function isAlreadySubscribing(channelName) {
    if (!socket) {
        return false;
    }
    const channel = getChannel(channelName);
    return channel ? channel.subscriptionPending : false;
}
/**
 * Are we already subscribed to this channel?
 */
function isSubscribed(channelName) {
    if (!socket) {
        return false;
    }
    const channel = getChannel(channelName);
    return channel ? channel.subscribed : false;
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
    socket?.send_event(eventName, payload, channelName);
}
/**
 * Register a method that will be triggered when a socket event happens (like disconnecting)
 */
function registerSocketEventCallback(cb) {
    socketEventCallbacks.push(cb);
}
/**
 * A custom authorizer allows us to take a more fine-grained approach to
 * authenticating Pusher. e.g. we can handle failed attempts to authorize
 * with an expired authToken and retry the attempt.
 */
function registerCustomAuthorizer(authorizer) {
    customAuthorizer = authorizer;
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
const WebPusher = {
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
    registerCustomAuthorizer,
    TYPE: EventType_1.default,
    getPusherSocketID,
};
exports.default = WebPusher;
