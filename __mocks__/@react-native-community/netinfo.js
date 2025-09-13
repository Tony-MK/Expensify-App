"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultState = {
    type: 'cellular',
    isConnected: true,
    isInternetReachable: true,
    details: {
        isConnectionExpensive: true,
        cellularGeneration: '3g',
        carrier: 'T-Mobile',
    },
};
const netInfoMock = {
    configure: () => { },
    fetch: () => Promise.resolve(defaultState),
    refresh: () => Promise.resolve(defaultState),
    addEventListener: () => () => { },
    useNetInfo: () => defaultState,
};
exports.default = netInfoMock;
