"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jszip_1 = require("jszip");
const react_1 = require("react");
const react_native_blob_util_1 = require("react-native-blob-util");
const react_native_fs_1 = require("react-native-fs");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useOnyx_1 = require("@hooks/useOnyx");
const ExportOnyxState_1 = require("@libs/ExportOnyxState");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getDownloadFolderPathSuffixForIOS_1 = require("@libs/getDownloadFolderPathSuffixForIOS");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BaseRecordTroubleshootDataToolMenu_1 = require("./BaseRecordTroubleshootDataToolMenu");
function RecordTroubleshootDataToolMenu() {
    const { environment } = (0, useEnvironment_1.default)();
    const [file, setFile] = (0, react_1.useState)();
    const [shouldMaskOnyxState = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_MASK_ONYX_STATE, { canBeMissing: true });
    const zipRef = (0, react_1.useRef)(new jszip_1.default());
    const createFile = (logs) => {
        const newFileName = (0, FileUtils_1.appendTimeToFileName)('logs.txt');
        zipRef.current.file(newFileName, JSON.stringify(logs, null, 2));
        const dir = react_native_blob_util_1.default.fs.dirs.DocumentDir;
        const zipFileName = 'troubleshoot.zip';
        return ExportOnyxState_1.default.readFromOnyxDatabase()
            .then((value) => {
            const dataToShare = JSON.stringify(ExportOnyxState_1.default.maskOnyxState(value, shouldMaskOnyxState));
            return zipRef.current.file(CONST_1.default.DEFAULT_ONYX_DUMP_FILE_NAME, dataToShare);
        })
            .then(() => {
            return zipRef.current
                .generateAsync({ type: 'base64' })
                .then((base64zip) => {
                const zipPath = `${dir}/${zipFileName}`;
                return react_native_blob_util_1.default.fs.writeFile(zipPath, base64zip, 'base64').then(() => {
                    return react_native_blob_util_1.default.fs.stat(zipPath).then(({ size }) => ({
                        path: zipPath,
                        newFileName: zipFileName,
                        size,
                    }));
                });
            })
                .then((localZipFile) => {
                return setFile(localZipFile);
            })
                .catch((err) => {
                console.error('Failed to write ZIP file:', err);
            })
                .finally(() => {
                zipRef.current = new jszip_1.default(); // Reset the zipRef for future use
            });
        });
    };
    return (<BaseRecordTroubleshootDataToolMenu_1.default file={file} onEnableLogging={() => setFile(undefined)} onDisableLogging={createFile} pathToBeUsed={react_native_fs_1.default.DocumentDirectoryPath} showShareButton zipRef={zipRef} displayPath={`${CONST_1.default.NEW_EXPENSIFY_PATH}${(0, getDownloadFolderPathSuffixForIOS_1.default)(environment)}`}/>);
}
exports.default = RecordTroubleshootDataToolMenu;
