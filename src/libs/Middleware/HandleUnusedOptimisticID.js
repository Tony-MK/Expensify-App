"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = require("lodash/clone");
const deepReplaceKeysAndValues_1 = require("@libs/deepReplaceKeysAndValues");
const PersistedRequests = require("@userActions/PersistedRequests");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * This middleware checks for the presence of a field called preexistingReportID in the response.
 * If present, that means that the client passed an optimistic reportID with the request that the server did not use.
 * This can happen because there was already a report matching the parameters provided that the client didn't know about.
 * (i.e: a DM chat report with the same set of participants)
 *
 * If that happens, this middleware checks for any serialized network requests that reference the unused optimistic ID.
 * If it finds any, it replaces the unused optimistic ID with the "real ID" from the server.
 * That way these serialized requests function as expected rather than returning a 404.
 */
const handleUnusedOptimisticID = (requestResponse, request, isFromSequentialQueue) => requestResponse.then((response) => {
    const responseOnyxData = response?.onyxData ?? [];
    responseOnyxData.forEach((onyxData) => {
        const key = onyxData.key;
        if (!key?.startsWith(ONYXKEYS_1.default.COLLECTION.REPORT)) {
            return;
        }
        if (!onyxData.value) {
            return;
        }
        const report = onyxData.value;
        const preexistingReportID = report.preexistingReportID;
        if (!preexistingReportID) {
            return;
        }
        const oldReportID = key.split(ONYXKEYS_1.default.COLLECTION.REPORT).at(-1) ?? request.data?.reportID ?? request.data?.optimisticReportID;
        if (isFromSequentialQueue) {
            const ongoingRequest = PersistedRequests.getOngoingRequest();
            const ongoingRequestReportIDParam = ongoingRequest?.data?.reportID ?? ongoingRequest?.data?.optimisticReportID;
            if (ongoingRequest && ongoingRequestReportIDParam === oldReportID) {
                const ongoingRequestClone = (0, clone_1.default)(ongoingRequest);
                ongoingRequestClone.data = (0, deepReplaceKeysAndValues_1.default)(ongoingRequest.data, oldReportID, preexistingReportID);
                PersistedRequests.updateOngoingRequest(ongoingRequestClone);
            }
        }
        PersistedRequests.getAll().forEach((persistedRequest, index) => {
            const persistedRequestClone = (0, clone_1.default)(persistedRequest);
            persistedRequestClone.data = (0, deepReplaceKeysAndValues_1.default)(persistedRequest.data, oldReportID, preexistingReportID);
            PersistedRequests.update(index, persistedRequestClone);
        });
    });
    return response;
});
exports.default = handleUnusedOptimisticID;
