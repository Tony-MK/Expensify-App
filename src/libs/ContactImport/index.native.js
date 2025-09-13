"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nitro_utils_1 = require("@expensify/nitro-utils");
const react_native_permissions_1 = require("react-native-permissions");
const ContactPermission_1 = require("@libs/ContactPermission");
function contactImport() {
    let permissionStatus = react_native_permissions_1.RESULTS.UNAVAILABLE;
    return (0, ContactPermission_1.getContactPermission)()
        .then((response) => {
        permissionStatus = response;
        if (response !== react_native_permissions_1.RESULTS.GRANTED && response !== react_native_permissions_1.RESULTS.LIMITED) {
            return [];
        }
        return nitro_utils_1.ContactsNitroModule.getAll([nitro_utils_1.CONTACT_FIELDS.FIRST_NAME, nitro_utils_1.CONTACT_FIELDS.LAST_NAME, nitro_utils_1.CONTACT_FIELDS.PHONE_NUMBERS, nitro_utils_1.CONTACT_FIELDS.EMAIL_ADDRESSES, nitro_utils_1.CONTACT_FIELDS.IMAGE_DATA]);
    })
        .then((deviceContacts) => ({
        contactList: Array.isArray(deviceContacts) ? deviceContacts : [],
        permissionStatus,
    }))
        .catch((error) => {
        console.error('Error importing contacts:', error);
        return {
            contactList: [],
            permissionStatus,
        };
    });
}
exports.default = contactImport;
