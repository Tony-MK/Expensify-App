"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImportOnyxState;
const react_1 = require("react");
const react_native_blob_util_1 = require("react-native-blob-util");
const useOnyx_1 = require("@hooks/useOnyx");
const App_1 = require("@libs/actions/App");
const Network_1 = require("@libs/actions/Network");
const PersistedRequests_1 = require("@libs/actions/PersistedRequests");
const ImportOnyxStateUtils_1 = require("@libs/ImportOnyxStateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const BaseImportOnyxState_1 = require("./BaseImportOnyxState");
function readOnyxFile(fileUri) {
    const filePath = decodeURIComponent(fileUri.replace('file://', ''));
    return react_native_blob_util_1.default.fs.exists(filePath).then((exists) => {
        if (!exists) {
            throw new Error('File does not exist');
        }
        return react_native_blob_util_1.default.fs.readFile(filePath, 'utf8');
    });
}
function ImportOnyxState({ setIsLoading }) {
    const [isErrorModalVisible, setIsErrorModalVisible] = (0, react_1.useState)(false);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const handleFileRead = (file) => {
        if (!file.uri) {
            return;
        }
        setIsLoading(true);
        readOnyxFile(file.uri)
            .then((fileContent) => {
            (0, PersistedRequests_1.rollbackOngoingRequest)();
            const transformedState = (0, ImportOnyxStateUtils_1.cleanAndTransformState)(fileContent);
            const currentUserSessionCopy = { ...session };
            (0, App_1.setPreservedUserSession)(currentUserSessionCopy);
            (0, Network_1.setShouldForceOffline)(true);
            return (0, ImportOnyxStateUtils_1.importState)(transformedState);
        })
            .then(() => {
            (0, App_1.setIsUsingImportedState)(true);
            Navigation_1.default.navigate(ROUTES_1.default.HOME);
        })
            .catch((error) => {
            console.error('Error importing state:', error);
            setIsErrorModalVisible(true);
        })
            .finally(() => {
            setIsLoading(false);
        });
    };
    return (<BaseImportOnyxState_1.default onFileRead={handleFileRead} isErrorModalVisible={isErrorModalVisible} setIsErrorModalVisible={setIsErrorModalVisible}/>);
}
