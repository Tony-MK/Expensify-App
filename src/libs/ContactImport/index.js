"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_permissions_1 = require("react-native-permissions");
const contactImport = () => {
    return Promise.resolve({
        contactList: [],
        permissionStatus: react_native_permissions_1.RESULTS.UNAVAILABLE,
    });
};
exports.default = contactImport;
