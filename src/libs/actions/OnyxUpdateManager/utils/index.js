"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyUpdates = void 0;
exports.detectGapsAndSplit = detectGapsAndSplit;
exports.validateAndApplyDeferredUpdates = validateAndApplyDeferredUpdates;
const react_native_onyx_1 = require("react-native-onyx");
const App_1 = require("@libs/actions/App");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const applyUpdates_1 = require("./applyUpdates");
Object.defineProperty(exports, "applyUpdates", { enumerable: true, get: function () { return applyUpdates_1.applyUpdates; } });
// eslint-disable-next-line import/no-cycle
const DeferredOnyxUpdates_1 = require("./DeferredOnyxUpdates");
let lastUpdateIDAppliedToClient = CONST_1.default.DEFAULT_NUMBER_ID;
// We have used `connectWithoutView` here because OnyxUpdates is not connected to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT,
    callback: (value) => (lastUpdateIDAppliedToClient = value ?? CONST_1.default.DEFAULT_NUMBER_ID),
});
/**
 * In order for the deferred updates to be applied correctly in order,
 * we need to check if there are any gaps between deferred updates.
 * If there are gaps, we need to split the deferred updates into two parts:
 * 1. The applicable updates that can be applied immediately
 * 2. The updates after the gaps that need to be fetched and applied first
 * @param updates The deferred updates to be checked for gaps
 * @param lastUpdateIDFromClient An optional lastUpdateID passed to use instead of the lastUpdateIDAppliedToClient
 * @returns
 */
function detectGapsAndSplit(lastUpdateIDFromClient) {
    // We only want to apply deferred updates that are newer than the last update that was applied to the client.
    // At this point, the missing updates from "GetMissingOnyxUpdates" have been applied already,
    // so we can safely filter out any outdated deferred updates.
    const pendingDeferredUpdates = (0, DeferredOnyxUpdates_1.getUpdates)({ minUpdateID: lastUpdateIDFromClient });
    // If there are no remaining deferred updates after filtering out outdated updates,
    // we don't need to iterate over the deferred updates and check for gaps.
    if (Object.values(pendingDeferredUpdates).length === 0) {
        return { applicableUpdates: {}, updatesAfterGaps: {}, latestMissingUpdateID: undefined };
    }
    const updateValues = Object.values(pendingDeferredUpdates);
    const applicableUpdates = {};
    let gapExists = false;
    let firstUpdateIDAfterGaps;
    let latestMissingUpdateID;
    for (const [index, update] of updateValues.entries()) {
        const isFirst = index === 0;
        const lastUpdateID = Number(update.lastUpdateID);
        const previousUpdateID = Number(update.previousUpdateID);
        // Whether the previous update (of the current update) is outdated, because there was a newer update applied to the client.
        const isPreviousUpdateAlreadyApplied = previousUpdateID <= lastUpdateIDFromClient;
        // If any update's previousUpdateID doesn't match the lastUpdateID of the previous update,
        // the deferred updates aren't chained and we detected a gap.
        // For the first update, we need to check that the previousUpdateID of the current update is the same as the lastUpdateIDAppliedToClient.
        // For any other updates, we need to check if the previousUpdateID of the current update is found in the deferred updates.
        // If an update is chained, we can add it to the applicable updates.
        const isChainedToPreviousUpdate = isFirst ? isPreviousUpdateAlreadyApplied : !!pendingDeferredUpdates[previousUpdateID];
        if (isChainedToPreviousUpdate) {
            // If we found a gap in the deferred updates, we will not add any more updates to the applicable updates.
            // Instead, if we find two chained updates, we can set "firstUpdateIDAfterGaps" to the first update after the gap.
            if (gapExists) {
                // If there was a gap, "firstUpdateIDAfterGaps" isn't set and we find two chained updates,
                // we need to set "firstUpdateIDAfterGaps" to the first update after the gap.
                if (!firstUpdateIDAfterGaps) {
                    firstUpdateIDAfterGaps = previousUpdateID;
                }
            }
            else {
                // If no gap exists yet, we can add the update to the applicable updates
                applicableUpdates[lastUpdateID] = update;
            }
        }
        else {
            // If a previous update has already been applied to the client we should not detect a gap.
            // This can cause a recursion loop, because "validateAndApplyDeferredUpdates" will refetch
            // missing updates up to the previous update, which will then be applied again.
            if (isPreviousUpdateAlreadyApplied) {
                continue;
            }
            // When we find a (new) gap, we initially need to set "gapExists" to true
            // and reset "firstUpdateIDAfterGaps" and continue searching the first update after all gaps.
            gapExists = true;
            firstUpdateIDAfterGaps = undefined;
            // We need to set update the latest missing update to the previous update of the current unchained update.
            latestMissingUpdateID = previousUpdateID;
        }
    }
    const updatesAfterGaps = {};
    if (gapExists) {
        // If there is a gap and we didn't detect two chained updates, "firstUpdateToBeAppliedAfterGap" will always be the the last deferred update.
        // We will fetch all missing updates up to the previous update and can always apply the last deferred update.
        const firstUpdateToBeAppliedAfterGap = firstUpdateIDAfterGaps ?? Number(updateValues.at(-1)?.lastUpdateID);
        // Add all deferred updates after the gap(s) to "updatesAfterGaps".
        // If "firstUpdateToBeAppliedAfterGap" is set to the last deferred update, the array will be empty.
        Object.entries(pendingDeferredUpdates).forEach(([lastUpdateID, update]) => {
            if (Number(lastUpdateID) < firstUpdateToBeAppliedAfterGap) {
                return;
            }
            updatesAfterGaps[Number(lastUpdateID)] = update;
        }, {});
    }
    return { applicableUpdates, updatesAfterGaps, latestMissingUpdateID };
}
/**
 * This function will check for gaps in the deferred updates and
 * apply the updates in order after the missing updates are fetched and applied
 */
function validateAndApplyDeferredUpdates(clientLastUpdateID, previousParams) {
    const lastUpdateIDFromClient = clientLastUpdateID ?? lastUpdateIDAppliedToClient ?? CONST_1.default.DEFAULT_NUMBER_ID;
    Log_1.default.info('[DeferredUpdates] Processing deferred updates', false, { lastUpdateIDFromClient, previousParams });
    const { applicableUpdates, updatesAfterGaps, latestMissingUpdateID } = detectGapsAndSplit(lastUpdateIDFromClient);
    // If there are no applicably deferred updates and no missing deferred updates,
    // we don't need to apply or re-fetch any updates. We can just unpause the queue by resolving.
    if (Object.values(applicableUpdates).length === 0 && latestMissingUpdateID === undefined) {
        return Promise.resolve();
    }
    // If newer updates got applied, we don't need to refetch for missing updates
    // and will re-trigger the "validateAndApplyDeferredUpdates" process
    if (latestMissingUpdateID) {
        Log_1.default.info('[DeferredUpdates] Gap detected in deferred updates', false, { lastUpdateIDFromClient, latestMissingUpdateID });
        return new Promise((resolve, reject) => {
            (0, DeferredOnyxUpdates_1.clear)({ shouldUnpauseSequentialQueue: false, shouldResetGetMissingOnyxUpdatesPromise: false });
            (0, applyUpdates_1.applyUpdates)(applicableUpdates).then(() => {
                // After we have applied the applicable updates, there might have been new deferred updates added.
                // In the next (recursive) call of "validateAndApplyDeferredUpdates",
                // the initial "updatesAfterGaps" and all new deferred updates will be applied in order,
                // as long as there was no new gap detected. Otherwise, repeat the process.
                const newLastUpdateIDFromClient = clientLastUpdateID ?? lastUpdateIDAppliedToClient ?? CONST_1.default.DEFAULT_NUMBER_ID;
                (0, DeferredOnyxUpdates_1.enqueue)(updatesAfterGaps, { shouldPauseSequentialQueue: false });
                // If lastUpdateIDAppliedToClient got updated, we will just re-trigger the validation
                // and application of the current deferred updates.
                if (latestMissingUpdateID <= newLastUpdateIDFromClient) {
                    validateAndApplyDeferredUpdates(undefined, { newLastUpdateIDFromClient, latestMissingUpdateID })
                        .then(() => resolve(undefined))
                        .catch(reject);
                    return;
                }
                // Prevent info loops of calls to GetMissingOnyxMessages
                if (previousParams?.newLastUpdateIDFromClient === newLastUpdateIDFromClient && previousParams?.latestMissingUpdateID === latestMissingUpdateID) {
                    Log_1.default.info('[DeferredUpdates] Aborting call to GetMissingOnyxMessages, repeated params', false, { lastUpdateIDFromClient, latestMissingUpdateID, previousParams });
                    resolve(undefined);
                    return;
                }
                // Then we can fetch the missing updates and apply them
                (0, App_1.getMissingOnyxUpdates)(newLastUpdateIDFromClient, latestMissingUpdateID)
                    .then(() => validateAndApplyDeferredUpdates(undefined, { newLastUpdateIDFromClient, latestMissingUpdateID }))
                    .then(() => resolve(undefined))
                    .catch(reject);
            });
        });
    }
    // If there are no gaps in the deferred updates, we can apply all deferred updates in order
    return (0, applyUpdates_1.applyUpdates)(applicableUpdates).then(() => undefined);
}
