"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jszip_1 = require("jszip");
const react_1 = require("react");
const react_native_blob_util_1 = require("react-native-blob-util");
const react_native_fs_1 = require("react-native-fs");
const useOnyx_1 = require("@hooks/useOnyx");
const ExportOnyxState_1 = require("@libs/ExportOnyxState");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BaseRecordTroubleshootDataToolMenu_1 = require("./BaseRecordTroubleshootDataToolMenu");
function RecordTroubleshootDataToolMenu() {
    const [file, setFile] = (0, react_1.useState)();
    const [shouldMaskOnyxState = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_MASK_ONYX_STATE, { canBeMissing: true });
    const zipRef = (0, react_1.useRef)(new jszip_1.default());
    const createAndSaveFile = (logs) => {
        const newFileName = (0, FileUtils_1.appendTimeToFileName)('logs.txt');
        const zipFileName = 'troubleshoot.zip';
        const tempZipPath = `${react_native_blob_util_1.default.fs.dirs.CacheDir}/${zipFileName}`;
        zipRef.current.file(newFileName, JSON.stringify(logs, null, 2));
        return ExportOnyxState_1.default.readFromOnyxDatabase()
            .then((value) => {
            const dataToShare = JSON.stringify(ExportOnyxState_1.default.maskOnyxState(value, shouldMaskOnyxState));
            zipRef.current.file(CONST_1.default.DEFAULT_ONYX_DUMP_FILE_NAME, dataToShare);
            return zipRef.current.generateAsync({ type: 'base64' });
        })
            .then((base64zip) => {
            return react_native_blob_util_1.default.fs.writeFile(tempZipPath, base64zip, 'base64').then(() => {
                return react_native_blob_util_1.default.MediaCollection.copyToMediaStore({
                    name: zipFileName,
                    // parentFolder: 'Download',
                    parentFolder: '',
                    mimeType: 'application/zip',
                }, 'Download', tempZipPath);
            });
        })
            .then((path) => {
            return react_native_blob_util_1.default.fs.stat(path).then(({ size }) => {
                setFile({
                    path,
                    newFileName: zipFileName,
                    size,
                });
            });
        })
            .catch((error) => {
            console.error('Failed to write ZIP file:', error);
        })
            .finally(() => {
            zipRef.current = new jszip_1.default(); // Reset the zipRef for future use
        });
    };
    return (<BaseRecordTroubleshootDataToolMenu_1.default file={file} onEnableLogging={() => setFile(undefined)} onDisableLogging={createAndSaveFile} pathToBeUsed={react_native_fs_1.default.DownloadDirectoryPath} showShareButton zipRef={zipRef} displayPath={CONST_1.default.DOWNLOADS_PATH}/>);
}
exports.default = RecordTroubleshootDataToolMenu;
