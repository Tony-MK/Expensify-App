"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * This migration updates reportActionsDrafts data to be keyed by reportActionID.
 *
 * Before: reportActionsDrafts_reportID_reportActionID: value
 * After: reportActionsDrafts_reportID: {[reportActionID]: value}
 */
function default_1() {
    return new Promise((resolve) => {
        const connection = react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS,
            waitForCollectionCallback: true,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            callback: (allReportActionsDrafts) => {
                react_native_onyx_1.default.disconnect(connection);
                if (!allReportActionsDrafts) {
                    Log_1.default.info('[Migrate Onyx] Skipped migration KeyReportActionsDraftByReportActionID because there were no reportActionsDrafts');
                    return resolve();
                }
                const newReportActionsDrafts = {};
                Object.entries(allReportActionsDrafts).forEach(([onyxKey, reportActionDraft]) => {
                    if (typeof reportActionDraft !== 'string') {
                        return;
                    }
                    newReportActionsDrafts[onyxKey] = null;
                    if ((0, EmptyObject_1.isEmptyObject)(reportActionDraft)) {
                        return;
                    }
                    const reportActionID = onyxKey.split('_').pop();
                    const newOnyxKey = onyxKey.replace(`_${reportActionID}`, '');
                    if (!reportActionID) {
                        return;
                    }
                    // If newReportActionsDrafts[newOnyxKey] isn't set, fall back on the migrated draft if there is one
                    const currentActionsDrafts = newReportActionsDrafts[newOnyxKey] ?? allReportActionsDrafts[newOnyxKey];
                    newReportActionsDrafts[newOnyxKey] = {
                        ...currentActionsDrafts,
                        [reportActionID]: reportActionDraft,
                    };
                });
                if ((0, EmptyObject_1.isEmptyObject)(newReportActionsDrafts)) {
                    Log_1.default.info('[Migrate Onyx] Skipped migration KeyReportActionsDraftByReportActionID because there are no actions drafts to migrate');
                    return resolve();
                }
                Log_1.default.info(`[Migrate Onyx] Re-keying reportActionsDrafts by reportActionID for ${Object.keys(newReportActionsDrafts).length} actions drafts`);
                // eslint-disable-next-line rulesdir/prefer-actions-set-data
                return react_native_onyx_1.default.multiSet(newReportActionsDrafts).then(resolve);
            },
        });
    });
}
