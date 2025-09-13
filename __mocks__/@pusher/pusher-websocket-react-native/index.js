"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pusher = void 0;
const CONST_1 = require("@src/CONST");
class MockedPusher {
    constructor() {
        this.channels = new Map();
        this.socketId = 'mock-socket-id';
        this.connectionState = CONST_1.default.PUSHER.STATE.DISCONNECTED;
    }
    static getInstance() {
        if (!MockedPusher.instance) {
            MockedPusher.instance = new MockedPusher();
        }
        return MockedPusher.instance;
    }
    init({ onConnectionStateChange }) {
        onConnectionStateChange(CONST_1.default.PUSHER.STATE.CONNECTED, CONST_1.default.PUSHER.STATE.DISCONNECTED);
        return Promise.resolve();
    }
    connect() {
        this.connectionState = CONST_1.default.PUSHER.STATE.CONNECTED;
        return Promise.resolve();
    }
    disconnect() {
        this.connectionState = CONST_1.default.PUSHER.STATE.DISCONNECTED;
        this.channels.clear();
        return Promise.resolve();
    }
    subscribe({ channelName, onEvent, onSubscriptionSucceeded }) {
        if (!this.channels.has(channelName)) {
            this.channels.set(channelName, { onEvent, onSubscriptionSucceeded });
            onSubscriptionSucceeded();
        }
        return Promise.resolve();
    }
    unsubscribe({ channelName }) {
        this.channels.delete(channelName);
    }
    trigger({ channelName, eventName, data }) {
        this.channels.get(channelName)?.onEvent({ channelName, eventName, data: data });
    }
    getChannel(channelName) {
        return this.channels.get(channelName);
    }
    getSocketId() {
        return Promise.resolve(this.socketId);
    }
}
exports.Pusher = MockedPusher;
MockedPusher.instance = null;
