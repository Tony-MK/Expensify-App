"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pusher_1 = require("@libs/Pusher");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const PusherConnectionManager_1 = require("@src/libs/PusherConnectionManager");
const CHANNEL_NAME = `${CONST_1.default.PUSHER.PRIVATE_USER_CHANNEL_PREFIX}1${CONFIG_1.default.PUSHER.SUFFIX}`;
function setup() {
    // When using the Pusher mock the act of calling Pusher.isSubscribed will create a
    // channel already in a subscribed state. These methods are normally used to prevent
    // duplicated subscriptions, but we don't need them for this test so forcing them to
    // return false will make the testing less complex.
    jest.spyOn(Pusher_1.default, 'isSubscribed').mockReturnValue(false);
    jest.spyOn(Pusher_1.default, 'isAlreadySubscribing').mockReturnValue(false);
    // Connect to Pusher
    PusherConnectionManager_1.default.init();
    Pusher_1.default.init({
        appKey: CONFIG_1.default.PUSHER.APP_KEY,
        cluster: CONFIG_1.default.PUSHER.CLUSTER,
        authEndpoint: `${CONFIG_1.default.EXPENSIFY.DEFAULT_API_ROOT}api/AuthenticatePusher?`,
    });
    const pusher = window.getPusherInstance();
    if (pusher && 'connection' in pusher) {
        pusher.connection?.emit('connected');
    }
}
function emitOnyxUpdate(args) {
    Pusher_1.default.sendEvent(CHANNEL_NAME, Pusher_1.default.TYPE.MULTIPLE_EVENTS, {
        type: 'pusher',
        lastUpdateID: 0,
        previousUpdateID: 0,
        updates: [
            {
                eventType: Pusher_1.default.TYPE.MULTIPLE_EVENT_TYPE.ONYX_API_UPDATE,
                data: args,
            },
        ],
    });
}
function teardown() {
    // Unsubscribe from account channel after each test since we subscribe in the function
    // subscribeToUserEvents and we don't want duplicate event subscriptions.
    Pusher_1.default.unsubscribe(CHANNEL_NAME);
}
exports.default = {
    setup,
    emitOnyxUpdate,
    teardown,
};
