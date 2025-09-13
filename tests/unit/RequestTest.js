"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("@src/libs/Request");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
beforeAll(() => {
    global.fetch = TestHelper.getGlobalFetchMock();
});
beforeEach(() => {
    Request.clearMiddlewares();
});
const request = {
    command: 'MockCommand',
    data: { authToken: 'testToken' },
};
test('Request.use() can register a middleware and it will run', () => {
    const testMiddleware = jest.fn();
    Request.use(testMiddleware);
    Request.processWithMiddleware(request, true);
    return (0, waitForBatchedUpdates_1.default)().then(() => {
        const call = testMiddleware.mock.calls.at(0);
        if (!call) {
            return;
        }
        const [promise, returnedRequest, isFromSequentialQueue] = call;
        expect(testMiddleware).toHaveBeenCalled();
        expect(returnedRequest).toEqual(request);
        expect(isFromSequentialQueue).toBe(true);
        expect(promise).toBeInstanceOf(Promise);
    });
});
test('Request.use() can register two middlewares. They can pass a response to the next and throw errors', () => {
    // Given an initial middleware that returns a promise with a resolved value
    const testMiddleware = jest.fn().mockResolvedValue({
        jsonCode: 404,
    });
    // And another middleware that will throw when it sees this jsonCode
    const errorThrowingMiddleware = (promise) => promise.then((response) => new Promise((resolve, reject) => {
        if (typeof response === 'object' && response.jsonCode !== 404) {
            return;
        }
        reject(new Error('Oops'));
    }));
    Request.use(testMiddleware);
    Request.use(errorThrowingMiddleware);
    const catchHandler = jest.fn();
    Request.processWithMiddleware(request).catch(catchHandler);
    return (0, waitForBatchedUpdates_1.default)().then(() => {
        expect(catchHandler).toHaveBeenCalled();
        expect(catchHandler).toHaveBeenCalledWith(new Error('Oops'));
    });
});
