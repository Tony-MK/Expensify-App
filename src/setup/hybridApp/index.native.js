"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
var react_native_1 = require("react-native");
var CONFIG_1 = require("@src/CONFIG");
if (CONFIG_1.default.IS_HYBRID_APP) {
    // On HybridApp we need to shadow official implementation of Linking.getInitialURL on NewDot side with our custom implementation.
    // Main benefit from this approach is that our deeplink-related code can be implemented the same way for both standalone NewDot and HybridApp.
    // It's not possible to use the official implementation from the Linking module because the way OldDot handles deeplinks is significantly different from a standard React Native app.
    react_native_1.Linking.getInitialURL = function () { return react_native_hybrid_app_1.default.getInitialURL(); };
}
