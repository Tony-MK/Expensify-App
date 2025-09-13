"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_permissions_1 = require("react-native-permissions");
const ContactImport_1 = require("@libs/ContactImport");
const useContactPermissions_1 = require("@libs/ContactPermission/useContactPermissions");
const ContactUtils_1 = require("@libs/ContactUtils");
const useLocalize_1 = require("./useLocalize");
/**
 * Custom hook that handles importing device contacts,
 * managing permissions, and transforming contact data
 * into a format suitable for use in the app.
 */
function useContactImport() {
    const [contactPermissionState, setContactPermissionState] = (0, react_1.useState)(react_native_permissions_1.RESULTS.UNAVAILABLE);
    const [contacts, setContacts] = (0, react_1.useState)([]);
    const { localeCompare } = (0, useLocalize_1.default)();
    const importAndSaveContacts = (0, react_1.useCallback)(() => {
        (0, ContactImport_1.default)().then(({ contactList, permissionStatus }) => {
            setContactPermissionState(permissionStatus);
            const usersFromContact = (0, ContactUtils_1.default)(contactList, localeCompare);
            setContacts(usersFromContact);
        });
    }, [localeCompare]);
    (0, useContactPermissions_1.default)({
        importAndSaveContacts,
        setContacts,
        contactPermissionState,
        setContactPermissionState,
    });
    return {
        contacts,
        contactPermissionState,
        importAndSaveContacts,
        setContactPermissionState,
    };
}
exports.default = useContactImport;
