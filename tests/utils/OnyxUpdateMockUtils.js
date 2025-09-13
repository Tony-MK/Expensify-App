"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const createUpdate = (lastUpdateID, successData = [], previousUpdateID) => ({
    type: CONST_1.default.ONYX_UPDATE_TYPES.HTTPS,
    lastUpdateID,
    previousUpdateID: previousUpdateID ?? lastUpdateID - 1,
    request: {
        command: 'TestCommand',
        data: { apiRequestType: 'TestType' },
        successData,
        failureData: [],
        finallyData: [],
        optimisticData: [],
    },
    response: {
        jsonCode: 200,
        lastUpdateID,
        previousUpdateID: previousUpdateID ?? lastUpdateID - 1,
        onyxData: successData,
    },
});
const createPendingUpdate = (lastUpdateID) => ({
    type: CONST_1.default.ONYX_UPDATE_TYPES.AIRSHIP,
    lastUpdateID,
    shouldFetchPendingUpdates: true,
    updates: [],
});
const OnyxUpdateMockUtils = {
    createUpdate,
    createPendingUpdate,
};
exports.default = OnyxUpdateMockUtils;
