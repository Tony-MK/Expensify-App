"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserId = exports.setCrashlyticsCollectionEnabled = exports.recordError = exports.log = exports.getCrashlytics = void 0;
// <App> uses <ErrorBoundary> and we need to mock the imported crashlytics module
// due to an error that happens otherwise https://github.com/invertase/react-native-firebase/issues/2475
var getCrashlytics = jest.fn();
exports.getCrashlytics = getCrashlytics;
var log = jest.fn();
exports.log = log;
var recordError = jest.fn();
exports.recordError = recordError;
var setCrashlyticsCollectionEnabled = jest.fn();
exports.setCrashlyticsCollectionEnabled = setCrashlyticsCollectionEnabled;
var setUserId = jest.fn();
exports.setUserId = setUserId;
