"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTempShareFile = addTempShareFile;
exports.saveUnknownUserDetails = saveUnknownUserDetails;
exports.clearShareData = clearShareData;
exports.addValidatedShareFile = addValidatedShareFile;
exports.clearUnknownUserDetails = clearUnknownUserDetails;
var react_native_onyx_1 = require("react-native-onyx");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
Function for clearing old saved data before at the start of share-extension flow
 */
function clearShareData() {
    var _a;
    react_native_onyx_1.default.multiSet((_a = {},
        _a[ONYXKEYS_1.default.SHARE_TEMP_FILE] = null,
        _a[ONYXKEYS_1.default.SHARE_UNKNOWN_USER_DETAILS] = null,
        _a));
}
/**
Function storing natively shared file's properties for processing across share-extension screens

function addTempShareFile(file: ShareTempFile) {
 * @param file shared file's object with additional props
 */
function addTempShareFile(file) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SHARE_TEMP_FILE, file);
}
/**
 * Stores a previously validated file object in Onyx for further use.
 *
 * @param file Array of validated file objects to be saved
 */
function addValidatedShareFile(file) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.VALIDATED_FILE_OBJECT, file.at(0));
}
/**
Function storing selected user's details for the duration of share-extension flow, if account doesn't exist

 * @param user selected user's details
 */
function saveUnknownUserDetails(user) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SHARE_UNKNOWN_USER_DETAILS, user);
}
/**
 * Function to clear the unknown user details
 */
function clearUnknownUserDetails() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SHARE_UNKNOWN_USER_DETAILS, null);
}
