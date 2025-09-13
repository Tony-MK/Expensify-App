"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_permissions_1 = require("react-native-permissions");
const useAppState_1 = require("@hooks/useAppState");
const index_1 = require("./index");
function useContactPermissions({ importAndSaveContacts, setContacts, contactPermissionState, setContactPermissionState }) {
    const checkPermissionAndUpdateContacts = (0, react_1.useCallback)(() => {
        return (0, index_1.getContactPermission)()
            .then((newStatus) => {
            const isNewStatusGranted = newStatus === react_native_permissions_1.RESULTS.GRANTED || newStatus === react_native_permissions_1.RESULTS.LIMITED; // Permission is enabled, or just became enabled
            if (isNewStatusGranted) {
                importAndSaveContacts();
            }
            else {
                if (newStatus !== contactPermissionState) {
                    setContactPermissionState(newStatus);
                }
                setContacts([]);
            }
        })
            .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to check contact permission:', error);
        });
    }, [contactPermissionState, importAndSaveContacts, setContacts, setContactPermissionState]);
    const handleAppStateChange = (0, react_1.useCallback)((nextAppState) => {
        if (nextAppState !== 'active') {
            return;
        }
        checkPermissionAndUpdateContacts();
    }, [checkPermissionAndUpdateContacts]);
    (0, useAppState_1.default)({ onAppStateChange: handleAppStateChange });
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        checkPermissionAndUpdateContacts();
    }, [checkPermissionAndUpdateContacts]));
}
exports.default = useContactPermissions;
