"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setShouldRecordTroubleshootData = setShouldRecordTroubleshootData;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Set whether or not to record troubleshoot data
 * @param shouldRecord Whether or not to record troubleshoot data
 */
function setShouldRecordTroubleshootData(shouldRecord) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.SHOULD_RECORD_TROUBLESHOOT_DATA, shouldRecord);
}
