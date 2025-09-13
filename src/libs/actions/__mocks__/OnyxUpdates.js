"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUpdateInformation = exports.doesClientNeedToBeUpdated = exports.apply = void 0;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
jest.mock('@libs/actions/OnyxUpdateManager/utils/applyUpdates');
const OnyxUpdatesImplementation = jest.requireActual('@libs/actions/OnyxUpdates');
const { doesClientNeedToBeUpdated, saveUpdateInformation, INTERNAL_DO_NOT_USE_applyHTTPSOnyxUpdates: applyHTTPSOnyxUpdates } = OnyxUpdatesImplementation;
exports.doesClientNeedToBeUpdated = doesClientNeedToBeUpdated;
exports.saveUpdateInformation = saveUpdateInformation;
let lastUpdateIDAppliedToClient = 0;
// Use connectWithoutView because this is a mock for testing and does not involve any UI updates.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT,
    callback: (val) => (lastUpdateIDAppliedToClient = val),
});
const apply = jest.fn(({ lastUpdateID, request, response }) => {
    if (lastUpdateID && (lastUpdateIDAppliedToClient === undefined || Number(lastUpdateID) > lastUpdateIDAppliedToClient)) {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT, Number(lastUpdateID));
    }
    if (request && response) {
        return applyHTTPSOnyxUpdates(request, response, Number(lastUpdateID)).then(() => undefined);
    }
    return Promise.resolve();
});
exports.apply = apply;
