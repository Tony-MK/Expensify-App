"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const HttpUtils_1 = require("@src/libs/HttpUtils");
const HandleUnusedOptimisticID_1 = require("@src/libs/Middleware/HandleUnusedOptimisticID");
const MainQueue = require("@src/libs/Network/MainQueue");
const NetworkStore = require("@src/libs/Network/NetworkStore");
const SequentialQueue = require("@src/libs/Network/SequentialQueue");
const Request = require("@src/libs/Request");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const TestHelper = require("../utils/TestHelper");
const waitForNetworkPromises_1 = require("../utils/waitForNetworkPromises");
react_native_onyx_1.default.init({
    keys: ONYXKEYS_1.default,
});
beforeAll(() => {
    global.fetch = TestHelper.getGlobalFetchMock();
});
beforeEach(async () => {
    SequentialQueue.pause();
    MainQueue.clear();
    HttpUtils_1.default.cancelPendingRequests();
    NetworkStore.checkRequiredData();
    await (0, waitForNetworkPromises_1.default)();
    jest.clearAllMocks();
    Request.clearMiddlewares();
});
describe('Middleware', () => {
    describe('HandleUnusedOptimisticID', () => {
        test('Normal request', async () => {
            Request.use(HandleUnusedOptimisticID_1.default);
            const requests = [
                {
                    command: 'OpenReport',
                    data: { authToken: 'testToken', reportID: '1234' },
                },
                {
                    command: 'AddComment',
                    data: { authToken: 'testToken', reportID: '1234', reportActionID: '5678' },
                },
            ];
            for (const request of requests) {
                SequentialQueue.push(request);
            }
            SequentialQueue.unpause();
            await (0, waitForNetworkPromises_1.default)();
            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(global.fetch).toHaveBeenLastCalledWith('https://www.expensify.com.dev/api/AddComment?', expect.anything());
            TestHelper.assertFormDataMatchesObject({
                reportID: '1234',
            }, global.fetch.mock.calls.at(1).at(1)?.body);
            expect(global.fetch).toHaveBeenNthCalledWith(1, 'https://www.expensify.com.dev/api/OpenReport?', expect.anything());
            TestHelper.assertFormDataMatchesObject({
                reportID: '1234',
            }, global.fetch.mock.calls.at(0).at(1)?.body);
        });
        test('Request with preexistingReportID', async () => {
            Request.use(HandleUnusedOptimisticID_1.default);
            const requests = [
                {
                    command: 'OpenReport',
                    data: { authToken: 'testToken', reportID: '1234' },
                },
                {
                    command: 'AddComment',
                    data: { authToken: 'testToken', reportID: '1234', reportActionID: '5678' },
                },
            ];
            for (const request of requests) {
                SequentialQueue.push(request);
            }
            // eslint-disable-next-line @typescript-eslint/require-await
            global.fetch.mockImplementationOnce(async () => ({
                ok: true,
                // eslint-disable-next-line @typescript-eslint/require-await
                json: async () => ({
                    jsonCode: 200,
                    onyxData: [
                        {
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}1234`,
                            value: {
                                preexistingReportID: '5555',
                            },
                        },
                    ],
                }),
            }));
            SequentialQueue.unpause();
            await (0, waitForNetworkPromises_1.default)();
            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(global.fetch).toHaveBeenLastCalledWith('https://www.expensify.com.dev/api/AddComment?', expect.anything());
            TestHelper.assertFormDataMatchesObject({
                reportID: '5555',
            }, global.fetch.mock.calls.at(1).at(1)?.body);
            expect(global.fetch).toHaveBeenNthCalledWith(1, 'https://www.expensify.com.dev/api/OpenReport?', expect.anything());
            TestHelper.assertFormDataMatchesObject({ reportID: '1234' }, global.fetch.mock.calls.at(0).at(1)?.body);
        });
        test('Request with preexistingReportID and no reportID in params', async () => {
            Request.use(HandleUnusedOptimisticID_1.default);
            const requests = [
                {
                    command: 'RequestMoney',
                    data: { authToken: 'testToken' },
                },
                {
                    command: 'AddComment',
                    data: { authToken: 'testToken', reportID: '1234', reportActionID: '5678' },
                },
                {
                    command: 'OpenReport',
                    data: { authToken: 'testToken', reportID: '2345', reportActionID: undefined, parentReportActionID: undefined },
                },
            ];
            for (const request of requests) {
                SequentialQueue.push(request);
            }
            // eslint-disable-next-line @typescript-eslint/require-await
            global.fetch.mockImplementationOnce(async () => ({
                ok: true,
                // eslint-disable-next-line @typescript-eslint/require-await
                json: async () => ({
                    jsonCode: 200,
                    onyxData: [
                        {
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}1234`,
                            value: {
                                preexistingReportID: '5555',
                            },
                        },
                    ],
                }),
            }));
            SequentialQueue.unpause();
            await (0, waitForNetworkPromises_1.default)();
            expect(global.fetch).toHaveBeenCalledTimes(3);
            expect(global.fetch).toHaveBeenLastCalledWith('https://www.expensify.com.dev/api/OpenReport?', expect.anything());
            TestHelper.assertFormDataMatchesObject({
                reportID: '5555',
            }, global.fetch.mock.calls.at(1).at(1)?.body);
            const formData = global.fetch.mock.calls.at(2).at(1)?.body;
            expect(formData).not.toBeUndefined();
            if (formData) {
                const formDataObject = Array.from(formData.entries()).reduce((acc, [key, val]) => {
                    acc[key] = val;
                    return acc;
                }, {});
                expect(formDataObject.reportActionID).toBeUndefined();
                expect(formDataObject.parentReportActionID).toBeUndefined();
            }
        });
        test('Request with preexistingReportID and optimisticReportID param', async () => {
            Request.use(HandleUnusedOptimisticID_1.default);
            const requests = [
                {
                    command: 'MoveIOUReportToExistingPolicy',
                    data: { authToken: 'testToken', optimisticReportID: '1234' },
                },
            ];
            for (const request of requests) {
                SequentialQueue.push(request);
            }
            // eslint-disable-next-line @typescript-eslint/require-await
            global.fetch.mockImplementationOnce(async () => ({
                ok: true,
                // eslint-disable-next-line @typescript-eslint/require-await
                json: async () => ({
                    jsonCode: 200,
                    onyxData: [
                        {
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}1234`,
                            value: {
                                preexistingReportID: '5555',
                            },
                        },
                    ],
                }),
            }));
            SequentialQueue.unpause();
            await (0, waitForNetworkPromises_1.default)();
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenNthCalledWith(1, 'https://www.expensify.com.dev/api/MoveIOUReportToExistingPolicy?', expect.anything());
            TestHelper.assertFormDataMatchesObject({ optimisticReportID: '1234' }, global.fetch.mock.calls.at(0).at(1)?.body);
        });
    });
});
