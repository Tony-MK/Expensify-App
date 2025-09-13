"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const picker_1 = require("@react-native-documents/picker");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_blob_util_1 = require("react-native-blob-util");
const useLocalize_1 = require("@hooks/useLocalize");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
/**
 * The data returned from `show` is different on web and mobile,
 * use this function to ensure the data will be handled properly.
 */
const getDataForUpload = (fileData) => {
    const fileName = fileData.name ?? 'spreadsheet';
    const fileResult = {
        name: (0, FileUtils_1.cleanFileName)(fileName),
        type: fileData.type ?? undefined,
        uri: fileData.uri,
        size: fileData.size,
    };
    if (fileResult.size) {
        return Promise.resolve(fileResult);
    }
    return react_native_blob_util_1.default.fs.stat(fileData.uri.replace('file://', '')).then((stats) => {
        fileResult.size = stats.size;
        return fileResult;
    });
};
function FilePicker({ children }) {
    const completeFileSelection = (0, react_1.useRef)(() => { });
    const onCanceled = (0, react_1.useRef)(() => { });
    const { translate } = (0, useLocalize_1.default)();
    /**
     * A generic handling for file picker errors
     */
    const showGeneralAlert = (0, react_1.useCallback)((message = translate('filePicker.errorWhileSelectingFile')) => {
        react_native_1.Alert.alert(translate('filePicker.fileError'), message);
    }, [translate]);
    /**
     * Validates and completes file selection
     *
     * @param fileData The file data received from the picker
     */
    const validateAndCompleteFileSelection = (0, react_1.useCallback)((fileData) => {
        if (!fileData) {
            onCanceled.current();
            return;
        }
        return getDataForUpload(fileData)
            .then((result) => {
            completeFileSelection.current(result);
        })
            .catch((error) => {
            showGeneralAlert(error.message);
            throw error;
        });
    }, [showGeneralAlert]);
    /**
     * Handles the file picker result and sends the selected file to the caller
     *
     * @param files The array of DocumentPickerResponse
     */
    // eslint-disable-next-line @lwc/lwc/no-async-await
    const pickFile = async () => {
        const [file] = await (0, picker_1.pick)({
            type: [picker_1.types.allFiles],
        });
        const [localCopy] = await (0, picker_1.keepLocalCopy)({
            files: [
                {
                    uri: file.uri,
                    fileName: file.name ?? 'spreadsheet',
                },
            ],
            destination: 'cachesDirectory',
        });
        if (localCopy.status !== 'success') {
            throw new Error("Couldn't create local file copy");
        }
        return {
            name: (0, FileUtils_1.cleanFileName)(file.name ?? 'spreadsheet'),
            type: file.type,
            uri: localCopy.localUri,
            size: file.size,
        };
    };
    /**
     * Opens the file picker
     *
     * @param onPickedHandler A callback that will be called with the selected file
     * @param onCanceledHandler A callback that will be called if the file is canceled
     */
    // eslint-disable-next-line @lwc/lwc/no-async-await
    const open = (onPickedHandler, onCanceledHandler = () => { }) => {
        completeFileSelection.current = onPickedHandler;
        onCanceled.current = onCanceledHandler;
        pickFile()
            .catch((error) => {
            if (JSON.stringify(error).includes('OPERATION_CANCELED')) {
                onCanceled.current();
                return Promise.resolve();
            }
            showGeneralAlert(error.message);
            throw error;
        })
            .then(validateAndCompleteFileSelection)
            .catch(console.error);
    };
    /**
     * Call the `children` render prop with the interface defined in propTypes
     */
    const renderChildren = () => children({
        openPicker: ({ onPicked, onCanceled: newOnCanceled }) => open(onPicked, newOnCanceled),
    });
    // eslint-disable-next-line react-compiler/react-compiler
    return <>{renderChildren()}</>;
}
FilePicker.displayName = 'FilePicker';
exports.default = FilePicker;
