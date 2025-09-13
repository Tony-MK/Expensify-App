"use strict";
/**
 * Multifaceted script, its main function is running the e2e tests.
 *
 * When running in a local environment it can take care of building the APKs required for e2e testing
 * When running on the CI (depending on the flags passed to it) it will skip building and just package/re-sign
 * the correct e2e JS bundle into an existing APK
 *
 * It will run only one set of tests per branch, for you to compare results to get a performance analysis
 * You need to run it twice, once with the base branch (--branch main) and another time with another branch
 * and a label to (--branch my_branch --label delta)
 *
 * This two runs will generate a main.json and a delta.json with the performance data, which then you can merge via
 * node tests/e2e/merge.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @lwc/lwc/no-async-await,no-restricted-syntax,no-await-in-loop */
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const compare_1 = require("./compare/compare");
const config_1 = require("./config");
const server_1 = require("./server");
const androidReversePort_1 = require("./utils/androidReversePort");
const closeANRPopup_1 = require("./utils/closeANRPopup");
const installApp_1 = require("./utils/installApp");
const killApp_1 = require("./utils/killApp");
const launchApp_1 = require("./utils/launchApp");
const Logger = require("./utils/logger");
const MeasureUtils = require("./utils/measure");
const sleep_1 = require("./utils/sleep");
const withFailTimeout_1 = require("./utils/withFailTimeout");
// VARIABLE CONFIGURATION
const args = process.argv.slice(2);
const getArg = (argName) => {
    const argIndex = args.indexOf(argName);
    if (argIndex === -1) {
        return undefined;
    }
    return args.at(argIndex + 1);
};
let config = config_1.default;
const setConfigPath = (configPathParam) => {
    let configPath = configPathParam;
    if (!configPath?.startsWith('.')) {
        configPath = `./${configPath}`;
    }
    const customConfig = require(configPath).default;
    config = Object.assign(config_1.default, customConfig);
};
if (args.includes('--config')) {
    const configPath = getArg('--config');
    setConfigPath(configPath);
}
// Important: set app path only after correct config file has been loaded
const mainAppPath = getArg('--mainAppPath') ?? config.MAIN_APP_PATH;
const deltaAppPath = getArg('--deltaAppPath') ?? config.DELTA_APP_PATH;
// Check if files exists:
if (!fs_1.default.existsSync(mainAppPath)) {
    throw new Error(`Main app path does not exist: ${mainAppPath}`);
}
if (!fs_1.default.existsSync(deltaAppPath)) {
    throw new Error(`Delta app path does not exist: ${deltaAppPath}`);
}
// On CI it is important to re-create the output dir, it has a different owner
// therefore this process cannot write to it
try {
    fs_1.default.rmSync(config.OUTPUT_DIR, { recursive: true, force: true });
    fs_1.default.mkdirSync(config.OUTPUT_DIR);
}
catch (error) {
    // Do nothing
    console.error(error);
}
// START OF TEST CODE
const runTests = async () => {
    Logger.info('Installing apps and reversing port');
    await (0, installApp_1.default)(config.MAIN_APP_PACKAGE, mainAppPath, undefined, config_1.default.FLAG);
    await (0, installApp_1.default)(config.DELTA_APP_PACKAGE, deltaAppPath, undefined, config_1.default.FLAG);
    await (0, androidReversePort_1.default)();
    // Start the HTTP server
    const server = (0, server_1.default)();
    await server.start();
    // Create a dict in which we will store the run durations for all tests
    const results = {};
    const metricForTest = {};
    const attachTestResult = (testResult) => {
        let result = 0;
        if (testResult?.metric !== undefined) {
            if (testResult.metric < 0) {
                return;
            }
            result = testResult.metric;
        }
        Logger.log(`[LISTENER] Test '${testResult?.name}' on '${testResult?.branch}' measured ${result}${testResult.unit}`);
        if (testResult?.branch && !results[testResult.branch]) {
            results[testResult.branch] = {};
        }
        if (testResult?.branch && testResult?.name) {
            results[testResult.branch][testResult.name] = (results[testResult.branch][testResult.name] ?? []).concat(result);
        }
        if (!metricForTest[testResult.name] && testResult.unit) {
            metricForTest[testResult.name] = testResult.unit;
        }
    };
    const skippedTests = [];
    const clearTestResults = (test) => {
        skippedTests.push(test.name);
        Object.keys(results).forEach((branch) => {
            Object.keys(results[branch]).forEach((metric) => {
                if (!metric.startsWith(test.name)) {
                    return;
                }
                delete results[branch][metric];
            });
        });
    };
    // Collect results while tests are being executed
    server.addTestResultListener((testResult) => {
        const { isCritical = true } = testResult;
        if (testResult?.error != null && isCritical) {
            throw new Error(`Test '${testResult.name}' failed with error: ${testResult.error}`);
        }
        if (testResult?.error != null && !isCritical) {
            // force test completion, since we don't want to have timeout error for non being execute test
            server.forceTestCompletion();
            Logger.warn(`Test '${testResult.name}' failed with error: ${testResult.error}`);
        }
        attachTestResult(testResult);
    });
    // Function to run a single test iteration
    async function runTestIteration(appPackage, iterationText, branch, launchArgs = {}) {
        Logger.info(iterationText);
        // Making sure the app is really killed (e.g. if a prior test run crashed)
        Logger.log('Killing', appPackage);
        await (0, killApp_1.default)('android', appPackage);
        Logger.log('Launching', appPackage);
        await (0, launchApp_1.default)('android', appPackage, config.ACTIVITY_PATH, launchArgs);
        const { promise, resetTimeout } = (0, withFailTimeout_1.default)(new Promise((resolve, reject) => {
            const removeListener = server.addTestDoneListener(() => {
                Logger.success(iterationText);
                const metrics = MeasureUtils.stop('done');
                const test = server.getTestConfig();
                if (server.isReadyToAcceptTestResults) {
                    attachTestResult({
                        name: `${test.name} (CPU)`,
                        branch,
                        metric: metrics.cpu,
                        unit: '%',
                    });
                    attachTestResult({
                        name: `${test.name} (FPS)`,
                        branch,
                        metric: metrics.fps,
                        unit: 'FPS',
                    });
                    attachTestResult({
                        name: `${test.name} (RAM)`,
                        branch,
                        metric: metrics.ram,
                        unit: 'MB',
                    });
                    attachTestResult({
                        name: `${test.name} (CPU/JS)`,
                        branch,
                        metric: metrics.jsThread,
                        unit: '%',
                    });
                    attachTestResult({
                        name: `${test.name} (CPU/UI)`,
                        branch,
                        metric: metrics.uiThread,
                        unit: '%',
                    });
                }
                removeListener();
                resolve();
            });
            MeasureUtils.start(appPackage, {
                onAttachFailed: async () => {
                    Logger.warn('The PID has changed, trying to restart the test...');
                    MeasureUtils.stop('retry');
                    resetTimeout();
                    removeListener();
                    // something went wrong, let's wait a little bit and try again
                    await (0, sleep_1.default)(5000);
                    try {
                        // simply restart the test
                        await runTestIteration(appPackage, iterationText, branch, launchArgs);
                        resolve();
                    }
                    catch (e) {
                        // okay, give up and throw the exception further
                        reject(e);
                    }
                },
            });
        }), iterationText);
        await promise;
        Logger.log('Killing', appPackage);
        await (0, killApp_1.default)('android', appPackage);
    }
    // Run the tests
    const tests = Object.keys(config.TESTS_CONFIG);
    for (let testIndex = 0; testIndex < tests.length; testIndex++) {
        const test = Object.values(config.TESTS_CONFIG).at(testIndex);
        // re-instal app for each new test suite
        await (0, installApp_1.default)(config.MAIN_APP_PACKAGE, mainAppPath, undefined, config_1.default.FLAG);
        await (0, installApp_1.default)(config.DELTA_APP_PACKAGE, deltaAppPath, undefined, config_1.default.FLAG);
        // check if we want to skip the test
        if (args.includes('--includes')) {
            const includes = args[args.indexOf('--includes') + 1];
            // assume that "includes" is a regexp
            if (!test?.name?.match(includes)) {
                continue;
            }
        }
        // Having the cool-down right at the beginning lowers the chances of heat
        // throttling from the previous run (which we have no control over and will be a
        // completely different AWS DF customer/app). It also gives the time to cool down between tests.
        Logger.info(`Cooling down for ${config.BOOT_COOL_DOWN / 1000}s`);
        await (0, sleep_1.default)(config.BOOT_COOL_DOWN);
        server.setTestConfig(test);
        server.setReadyToAcceptTestResults(false);
        try {
            const warmupText = `Warmup for test '${test?.name}' [${testIndex + 1}/${tests.length}]`;
            // For each warmup we allow the warmup to fail three times before we stop the warmup run:
            const errorCountWarmupRef = {
                errorCount: 0,
                allowedExceptions: 3,
            };
            // by default we do 2 warmups:
            // - first warmup to pass a login flow
            // - second warmup to pass an actual flow and cache network requests
            const iterations = 2;
            for (let i = 0; i < iterations; i++) {
                try {
                    // Warmup the main app:
                    await runTestIteration(config.MAIN_APP_PACKAGE, `[MAIN] ${warmupText}. Iteration ${i + 1}/${iterations}`, config.BRANCH_MAIN);
                    // Warmup the delta app:
                    await runTestIteration(config.DELTA_APP_PACKAGE, `[DELTA] ${warmupText}. Iteration ${i + 1}/${iterations}`, config.BRANCH_DELTA);
                }
                catch (e) {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    Logger.error(`Warmup failed with error: ${e}`);
                    await (0, closeANRPopup_1.default)();
                    MeasureUtils.stop('error-warmup');
                    server.clearAllTestDoneListeners();
                    errorCountWarmupRef.errorCount++;
                    i--; // repeat warmup again
                    if (errorCountWarmupRef.errorCount === errorCountWarmupRef.allowedExceptions) {
                        Logger.error("There was an error running the warmup and we've reached the maximum number of allowed exceptions. Stopping the test run.");
                        throw e;
                    }
                }
            }
            server.setReadyToAcceptTestResults(true);
            // For each test case we allow the test to fail three times before we stop the test run:
            const errorCountRef = {
                errorCount: 0,
                allowedExceptions: 3,
            };
            // We run each test multiple time to average out the results
            for (let testIteration = 0; testIteration < config.RUNS; testIteration++) {
                const onError = async (e) => {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    Logger.error(`Unexpected error during test execution: ${e}. `);
                    MeasureUtils.stop('error');
                    await (0, closeANRPopup_1.default)();
                    server.clearAllTestDoneListeners();
                    errorCountRef.errorCount += 1;
                    if (testIteration === 0 || errorCountRef.errorCount === errorCountRef.allowedExceptions) {
                        Logger.error("There was an error running the test and we've reached the maximum number of allowed exceptions. Stopping the test run.");
                        // If the error happened on the first test run, the test is broken
                        // and we should not continue running it. Or if we have reached the
                        // maximum number of allowed exceptions, we should stop the test run.
                        throw e;
                    }
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    Logger.warn(`There was an error running the test. Continuing the test run. Error: ${e}`);
                };
                const launchArgs = {
                    mockNetwork: true,
                };
                const iterationText = `Test '${test?.name}' [${testIndex + 1}/${tests.length}], iteration [${testIteration + 1}/${config.RUNS}]`;
                const mainIterationText = `[MAIN] ${iterationText}`;
                const deltaIterationText = `[DELTA] ${iterationText}`;
                try {
                    // Run the test on the main app:
                    await runTestIteration(config.MAIN_APP_PACKAGE, mainIterationText, config.BRANCH_MAIN, launchArgs);
                    // Run the test on the delta app:
                    await runTestIteration(config.DELTA_APP_PACKAGE, deltaIterationText, config.BRANCH_DELTA, launchArgs);
                }
                catch (e) {
                    await onError(e);
                }
            }
        }
        catch (exception) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            Logger.warn(`Test ${test?.name} can not be finished due to error: ${exception}`);
            clearTestResults(test);
        }
    }
    // Calculate statistics and write them to our work file
    Logger.info('Calculating statics and writing results');
    await (0, compare_1.default)(results.main, results.delta, {
        outputDir: config.OUTPUT_DIR,
        outputFormat: 'all',
        metricForTest,
        skippedTests,
    });
    Logger.info('Finished calculating statics and writing results, stopping the test server');
    await server.stop();
};
const run = async () => {
    Logger.info('Running e2e tests');
    try {
        await runTests();
        process.exit(0);
    }
    catch (e) {
        Logger.info('\n\nE2E test suite failed due to error:', e, '\nPrinting full logs:\n\n');
        // Write logcat, meminfo, emulator info to file as well:
        (0, child_process_1.execSync)(`adb logcat -d > ${config.OUTPUT_DIR}/logcat.txt`);
        (0, child_process_1.execSync)(`adb shell "cat /proc/meminfo" > ${config.OUTPUT_DIR}/meminfo.txt`);
        (0, child_process_1.execSync)(`adb shell "getprop" > ${config.OUTPUT_DIR}/emulator-properties.txt`);
        (0, child_process_1.execSync)(`cat ${config.LOG_FILE}`);
        try {
            (0, child_process_1.execSync)(`cat ~/.android/avd/${process.env.AVD_NAME ?? 'test'}.avd/config.ini > ${config.OUTPUT_DIR}/emulator-config.ini`);
        }
        catch (ignoredError) {
            // the error is ignored, as the file might not exist if the test
            // run wasn't started with an emulator
        }
        process.exit(1);
    }
};
run();
