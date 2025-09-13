"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_permissions_1 = require("react-native-permissions");
var ContactImport_1 = require("@libs/ContactImport");
var useContactPermissions_1 = require("@libs/ContactPermission/useContactPermissions");
var ContactUtils_1 = require("@libs/ContactUtils");
var useLocalize_1 = require("./useLocalize");
/**
 * Custom hook that handles importing device contacts,
 * managing permissions, and transforming contact data
 * into a format suitable for use in the app.
 */
function useContactImport() {
    var _a = (0, react_1.useState)(react_native_permissions_1.RESULTS.UNAVAILABLE), contactPermissionState = _a[0], setContactPermissionState = _a[1];
    var _b = (0, react_1.useState)([]), contacts = _b[0], setContacts = _b[1];
    var localeCompare = (0, useLocalize_1.default)().localeCompare;
    var importAndSaveContacts = (0, react_1.useCallback)(function () {
        (0, ContactImport_1.default)().then(function (_a) {
            var contactList = _a.contactList, permissionStatus = _a.permissionStatus;
            setContactPermissionState(permissionStatus);
            var usersFromContact = (0, ContactUtils_1.default)(contactList, localeCompare);
            setContacts(usersFromContact);
        });
    }, [localeCompare]);
    (0, useContactPermissions_1.default)({
        importAndSaveContacts: importAndSaveContacts,
        setContacts: setContacts,
        contactPermissionState: contactPermissionState,
        setContactPermissionState: setContactPermissionState,
    });
    return {
        contacts: contacts,
        contactPermissionState: contactPermissionState,
        importAndSaveContacts: importAndSaveContacts,
        setContactPermissionState: setContactPermissionState,
    };
}
exports.default = useContactImport;
