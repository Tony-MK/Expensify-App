"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = applyOnyxUpdatesReliably;
const Log_1 = require("@libs/Log");
const SequentialQueue = require("@libs/Network/SequentialQueue");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("./OnyxUpdateManager");
const OnyxUpdates_1 = require("./OnyxUpdates");
/**
 * Checks for and handles gaps of onyx updates between the client and the given server updates before applying them
 *
 * This is in it's own lib to fix a dependency cycle from OnyxUpdateManager
 *
 * @param updates
 * @param shouldRunSync
 * @returns
 */
function applyOnyxUpdatesReliably(updates, { shouldRunSync = false, clientLastUpdateID } = {}) {
    const fetchMissingUpdates = () => {
        Log_1.default.info('[applyOnyxUpdatesReliably] Fetching missing updates');
        // If we got here, that means we are missing some updates on our local storage. To
        // guarantee that we're not fetching more updates before our local data is up to date,
        // let's stop the sequential queue from running until we're done catching up.
        SequentialQueue.pause();
        if (shouldRunSync) {
            return (0, OnyxUpdateManager_1.handleMissingOnyxUpdates)(updates, clientLastUpdateID);
        }
        return Promise.resolve((0, OnyxUpdates_1.saveUpdateInformation)(updates));
    };
    // If a pendingLastUpdateID is was provided, it means that the backend didn't send updates because the payload was too big.
    // In this case, we need to fetch the missing updates up to the pendingLastUpdateID.
    if (updates.shouldFetchPendingUpdates) {
        return fetchMissingUpdates();
    }
    const previousUpdateID = Number(updates.previousUpdateID) ?? CONST_1.default.DEFAULT_NUMBER_ID;
    if (!(0, OnyxUpdates_1.doesClientNeedToBeUpdated)({ previousUpdateID, clientLastUpdateID })) {
        return (0, OnyxUpdates_1.apply)(updates).then();
    }
    return fetchMissingUpdates();
}
