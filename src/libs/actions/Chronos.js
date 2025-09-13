"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEvent = void 0;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const removeEvent = (reportID, reportActionID, eventID, events) => {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportActionID]: {
                    pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    originalMessage: {
                        events: events.filter((event) => event.id !== eventID),
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`,
            value: {
                [reportActionID]: {
                    originalMessage: { events },
                    pendingAction: null,
                },
            },
        },
    ];
    const parameters = {
        googleEventID: eventID,
        reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.CHRONOS_REMOVE_OOO_EVENT, parameters, { optimisticData, successData, failureData });
};
exports.removeEvent = removeEvent;
