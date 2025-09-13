"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const Log_1 = require("./Log");
const KeyReportActionsDraftByReportActionID_1 = require("./migrations/KeyReportActionsDraftByReportActionID");
const MoveIsOptimisticReportToMetadata_1 = require("./migrations/MoveIsOptimisticReportToMetadata");
const PendingMembersToMetadata_1 = require("./migrations/PendingMembersToMetadata");
const RenameCardIsVirtual_1 = require("./migrations/RenameCardIsVirtual");
const RenameReceiptFilename_1 = require("./migrations/RenameReceiptFilename");
function default_1() {
    const startTime = Date.now();
    Log_1.default.info('[Migrate Onyx] start');
    return new Promise((resolve) => {
        // Add all migrations to an array so they are executed in order
        const migrationPromises = [RenameCardIsVirtual_1.default, RenameReceiptFilename_1.default, KeyReportActionsDraftByReportActionID_1.default, MoveIsOptimisticReportToMetadata_1.default, PendingMembersToMetadata_1.default];
        // Reduce all promises down to a single promise. All promises run in a linear fashion, waiting for the
        // previous promise to finish before moving onto the next one.
        /* eslint-disable arrow-body-style */
        migrationPromises
            .reduce((previousPromise, migrationPromise) => {
            return previousPromise.then(() => {
                return migrationPromise();
            });
        }, Promise.resolve())
            // Once all migrations are done, resolve the main promise
            .then(() => {
            const timeElapsed = Date.now() - startTime;
            Log_1.default.info(`[Migrate Onyx] finished in ${timeElapsed}ms`);
            resolve();
        });
    });
}
