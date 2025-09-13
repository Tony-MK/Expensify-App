"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-classes-per-file */
require("@shopify/flash-list/jestSetup");
require("react-native-gesture-handler/jestSetup");
const __mocks__1 = require("react-native-onyx/dist/storage/__mocks__");
require("setimmediate");
const setupMockFullstoryLib_1 = require("./setupMockFullstoryLib");
const setupMockImages_1 = require("./setupMockImages");
// Needed for tests to have the necessary environment variables set
if (!('GITHUB_REPOSITORY' in process.env)) {
    process.env.GITHUB_REPOSITORY_OWNER = 'Expensify';
    process.env.GITHUB_REPOSITORY = 'Expensify/App';
}
(0, setupMockImages_1.default)();
(0, setupMockFullstoryLib_1.default)();
// This mock is required as per setup instructions for react-navigation testing
// https://reactnavigation.org/docs/testing/#mocking-native-modules
jest.mock('react-native/src/private/animated/NativeAnimatedHelper');
// Mock react-native-onyx storage layer because the SQLite storage layer doesn't work in jest.
// Mocking this file in __mocks__ does not work because jest doesn't support mocking files that are not directly used in the testing project,
// and we only want to mock the storage layer, not the whole Onyx module.
jest.mock('react-native-onyx/dist/storage', () => __mocks__1.default);
// Mock NativeEventEmitter as it is needed to provide mocks of libraries which include it
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
// Needed for: https://stackoverflow.com/questions/76903168/mocking-libraries-in-jest
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: {
        ignoreLogs: jest.fn(),
        ignoreAllLogs: jest.fn(),
    },
}));
// Turn off the console logs for timing events. They are not relevant for unit tests and create a lot of noise
jest.spyOn(console, 'debug').mockImplementation((...params) => {
    if (params.at(0)?.startsWith('Timing:')) {
        return;
    }
    // Send the message to console.log but don't re-used console.debug or else this mock method is called in an infinite loop. Instead, just prefix the output with the word "DEBUG"
    // eslint-disable-next-line no-console
    console.log('DEBUG', ...params);
});
// This mock is required for mocking file systems when running tests
jest.mock('react-native-fs', () => ({
    unlink: jest.fn(() => new Promise((res) => {
        res();
    })),
    CachesDirectoryPath: jest.fn(),
}));
jest.mock('react-native-sound', () => {
    class SoundMock {
        constructor() {
            this.play = jest.fn();
        }
    }
    return SoundMock;
});
jest.mock('react-native-share', () => ({
    default: jest.fn(),
}));
jest.mock('react-native-reanimated', () => ({
    ...jest.requireActual('react-native-reanimated/mock'),
    createAnimatedPropAdapter: jest.fn,
    useReducedMotion: jest.fn,
    useScrollViewOffset: jest.fn(() => 0),
    useAnimatedRef: jest.fn(() => jest.fn()),
    LayoutAnimationConfig: jest.fn,
}));
jest.mock('react-native-keyboard-controller', () => require('react-native-keyboard-controller/jest'));
jest.mock('react-native-app-logs', () => require('react-native-app-logs/jest'));
jest.mock('@libs/runOnLiveMarkdownRuntime', () => {
    const runOnLiveMarkdownRuntime = (worklet) => worklet;
    return runOnLiveMarkdownRuntime;
});
jest.mock('@src/libs/actions/Timing', () => ({
    start: jest.fn(),
    end: jest.fn(),
    clearData: jest.fn(),
}));
jest.mock('../modules/background-task/src/NativeReactNativeBackgroundTask', () => ({
    defineTask: jest.fn(),
    onBackgroundTaskExecution: jest.fn(),
}));
jest.mock('../modules/hybrid-app/src/NativeReactNativeHybridApp', () => ({
    isHybridApp: jest.fn(),
    closeReactNativeApp: jest.fn(),
    completeOnboarding: jest.fn(),
    switchAccount: jest.fn(),
}));
jest.mock('@components/InvertedFlatList/BaseInvertedFlatList/RenderTaskQueue', () => class SyncRenderTaskQueue {
    constructor() {
        this.handler = () => { };
    }
    add(info) {
        this.handler(info);
    }
    setHandler(handler) {
        this.handler = handler;
    }
    cancel() { }
});
jest.mock('@libs/prepareRequestPayload/index.native.ts', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn((command, data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (value === undefined) {
                return;
            }
            formData.append(key, value);
        });
        return Promise.resolve(formData);
    }),
}));
// This keeps the error "@rnmapbox/maps native code not available." from causing the tests to fail
jest.mock('@components/ConfirmedRoute.tsx');
jest.mock('@src/hooks/useWorkletStateMachine/executeOnUIRuntimeSync', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn()), // Return a function that returns a function
}));
jest.mock('react-native-nitro-sqlite', () => ({
    open: jest.fn(),
}));
