"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * This migration moves isOptimisticReport from the report object to reportMetadata
 */
function default_1() {
    return new Promise((resolve) => {
        const connection = react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.COLLECTION.REPORT,
            waitForCollectionCallback: true,
            callback: (reports) => {
                react_native_onyx_1.default.disconnect(connection);
                if (!reports || (0, EmptyObject_1.isEmptyObject)(reports)) {
                    Log_1.default.info('[Migrate Onyx] Skipping migration MoveIsOptimisticReportToMetadata because there are no reports');
                    return resolve();
                }
                const promises = [];
                Object.entries(reports).forEach(([reportID, report]) => {
                    if (report?.isOptimisticReport === undefined) {
                        return;
                    }
                    promises.push(Promise.all([
                        // @ts-expect-error isOptimisticReport is not a valid property of Report anymore
                        // eslint-disable-next-line rulesdir/prefer-actions-set-data
                        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { isOptimisticReport: null }),
                        // eslint-disable-next-line rulesdir/prefer-actions-set-data
                        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`, { isOptimisticReport: report.isOptimisticReport }),
                    ]).then(() => {
                        Log_1.default.info(`[Migrate Onyx] Successfully moved isOptimisticReport to reportMetadata for ${reportID}`);
                    }));
                });
                if (promises.length === 0) {
                    Log_1.default.info('[Migrate Onyx] Skipping migration MoveIsOptimisticReportToMetadata because there are no reports with isOptimisticReport');
                    return resolve();
                }
                Promise.all(promises).then(() => resolve());
            },
        });
    });
}
