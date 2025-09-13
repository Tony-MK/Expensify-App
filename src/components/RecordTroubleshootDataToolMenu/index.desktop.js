"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jszip_1 = require("jszip");
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const ExportOnyxState_1 = require("@libs/ExportOnyxState");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BaseRecordTroubleshootDataToolMenu_1 = require("./BaseRecordTroubleshootDataToolMenu");
function RecordTroubleshootDataToolMenu() {
    const [file, setFile] = (0, react_1.useState)(undefined);
    const [shouldMaskOnyxState = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_MASK_ONYX_STATE, { canBeMissing: true });
    const zipRef = (0, react_1.useRef)(new jszip_1.default());
    const onDisableLogging = (logs) => {
        const data = JSON.stringify(logs, null, 2);
        const newFileName = (0, FileUtils_1.appendTimeToFileName)('logs.txt');
        zipRef.current.file(newFileName, data);
        return ExportOnyxState_1.default.readFromOnyxDatabase()
            .then((value) => {
            const dataToShare = JSON.stringify(ExportOnyxState_1.default.maskOnyxState(value, shouldMaskOnyxState));
            zipRef.current.file(CONST_1.default.DEFAULT_ONYX_DUMP_FILE_NAME, dataToShare);
        })
            .then(() => {
            setFile({
                path: './logs',
                newFileName: 'logs',
                size: data.length,
            });
        });
    };
    const hideShareButton = () => {
        setFile(undefined);
    };
    const onDownloadZip = () => {
        if (!zipRef.current?.files) {
            return;
        }
        zipRef.current.generateAsync({ type: 'blob' }).then((zipBlob) => {
            const zipUrl = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = zipUrl;
            link.download = 'troubleshoot.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            zipRef.current = new jszip_1.default();
        });
    };
    return (<BaseRecordTroubleshootDataToolMenu_1.default zipRef={zipRef} file={file} onDisableLogging={onDisableLogging} onEnableLogging={hideShareButton} pathToBeUsed="" onDownloadZip={onDownloadZip} showDownloadButton/>);
}
RecordTroubleshootDataToolMenu.displayName = 'RecordTroubleshootDataToolMenu';
exports.default = RecordTroubleshootDataToolMenu;
