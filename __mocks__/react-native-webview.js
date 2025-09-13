"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('react-native-webview', () => {
    const { View } = require('react-native');
    return {
        WebView: () => View,
    };
});
