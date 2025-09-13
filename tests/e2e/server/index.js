"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const config_1 = require("../config");
const nativeCommands = require("../nativeCommands");
const Logger = require("../utils/logger");
const routes_1 = require("./routes");
const PORT = process.env.PORT ?? config_1.default.SERVER_PORT;
// Gets the request data as a string
const getReqData = (req) => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    return new Promise((resolve) => {
        req.on('end', () => {
            resolve(data);
        });
    });
};
// Expects a POST request with JSON data. Returns parsed JSON data.
const getPostJSONRequestData = (req, res) => {
    if (req.method !== 'POST') {
        res.statusCode = 400;
        res.end('Unsupported method');
        return;
    }
    return getReqData(req).then((data) => {
        try {
            return JSON.parse(data);
        }
        catch (e) {
            Logger.info('❌ Failed to parse request data', data);
            res.statusCode = 400;
            res.end('Invalid JSON');
        }
    });
};
const createListenerState = () => {
    const listeners = [];
    const addListener = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        };
    };
    const clearAllListeners = () => {
        listeners.splice(0, listeners.length);
    };
    return [listeners, addListener, clearAllListeners];
};
/**
 * Creates a new http server.
 * The server just has two endpoints:
 *
 *  - POST: /test_results, expects a {@link TestResult} as JSON body.
 *          Send test results while a test runs.
 *  - GET: /test_done, expected to be called when test run signals it's done
 *
 *  It returns an instance to which you can add listeners for the test results, and test done events.
 */
const createServerInstance = () => {
    const [testStartedListeners, addTestStartedListener] = createListenerState();
    const [testResultListeners, addTestResultListener] = createListenerState();
    const [testDoneListeners, addTestDoneListener, clearAllTestDoneListeners] = createListenerState();
    let isReadyToAcceptTestResults = true;
    const setReadyToAcceptTestResults = (isReady) => {
        isReadyToAcceptTestResults = isReady;
    };
    const forceTestCompletion = () => {
        testDoneListeners.forEach((listener) => {
            listener();
        });
    };
    let activeTestConfig;
    const networkCache = {};
    const setTestConfig = (testConfig) => {
        activeTestConfig = testConfig;
    };
    const getTestConfig = () => {
        if (!activeTestConfig) {
            throw new Error('No test config set');
        }
        return activeTestConfig;
    };
    const server = (0, http_1.createServer)((req, res) => {
        res.statusCode = 200;
        switch (req.url) {
            case routes_1.default.testConfig: {
                testStartedListeners.forEach((listener) => listener(activeTestConfig));
                if (!activeTestConfig) {
                    throw new Error('No test config set');
                }
                return res.end(JSON.stringify(activeTestConfig));
            }
            case routes_1.default.testResults: {
                if (!isReadyToAcceptTestResults) {
                    return res.end('ok');
                }
                getPostJSONRequestData(req, res)?.then((data) => {
                    if (!data) {
                        // The getPostJSONRequestData function already handled the response
                        return;
                    }
                    testResultListeners.forEach((listener) => {
                        listener(data);
                    });
                    res.end('ok');
                });
                break;
            }
            case routes_1.default.testDone: {
                forceTestCompletion();
                return res.end('ok');
            }
            case routes_1.default.testNativeCommand: {
                getPostJSONRequestData(req, res)
                    ?.then((data) => nativeCommands.executeFromPayload(data?.actionName, data?.payload))
                    .then((status) => {
                    if (status) {
                        res.end('ok');
                        return;
                    }
                    res.statusCode = 500;
                    res.end('Error executing command');
                })
                    .catch((error) => {
                    Logger.error('Error executing command', error);
                    res.statusCode = 500;
                    res.end('Error executing command');
                });
                break;
            }
            case routes_1.default.testGetNetworkCache: {
                getPostJSONRequestData(req, res)?.then((data) => {
                    const appInstanceId = data?.appInstanceId;
                    if (!appInstanceId) {
                        res.statusCode = 400;
                        res.end('Invalid request missing appInstanceId');
                        return;
                    }
                    const cachedData = networkCache[appInstanceId] ?? {};
                    res.end(JSON.stringify(cachedData));
                });
                break;
            }
            case routes_1.default.testUpdateNetworkCache: {
                getPostJSONRequestData(req, res)?.then((data) => {
                    const appInstanceId = data?.appInstanceId;
                    const cache = data?.cache;
                    if (!appInstanceId || !cache) {
                        res.statusCode = 400;
                        res.end('Invalid request missing appInstanceId or cache');
                        return;
                    }
                    networkCache[appInstanceId] = cache;
                    res.end('ok');
                });
                break;
            }
            default:
                res.statusCode = 404;
                res.end('Page not found!');
        }
    });
    return {
        setReadyToAcceptTestResults,
        get isReadyToAcceptTestResults() {
            return isReadyToAcceptTestResults;
        },
        setTestConfig,
        getTestConfig,
        addTestStartedListener,
        addTestResultListener,
        addTestDoneListener,
        clearAllTestDoneListeners,
        forceTestCompletion,
        start: () => new Promise((resolve) => {
            server.listen(PORT, resolve);
        }),
        stop: () => new Promise((resolve) => {
            server.close(resolve);
        }),
    };
};
exports.default = createServerInstance;
