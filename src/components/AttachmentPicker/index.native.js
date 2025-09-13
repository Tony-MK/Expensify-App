"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const picker_1 = require("@react-native-documents/picker");
const expensify_common_1 = require("expensify-common");
const expo_image_manipulator_1 = require("expo-image-manipulator");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_blob_util_1 = require("react-native-blob-util");
const react_native_image_picker_1 = require("react-native-image-picker");
const react_native_image_size_1 = require("react-native-image-size");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const Popover_1 = require("@components/Popover");
const useArrowKeyFocusManager_1 = require("@hooks/useArrowKeyFocusManager");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const CONST_1 = require("@src/CONST");
const launchCamera_1 = require("./launchCamera/launchCamera");
/**
 * Return imagePickerOptions based on the type
 */
const getImagePickerOptions = (type, fileLimit) => {
    // mediaType property is one of the ImagePicker configuration to restrict types'
    const mediaType = type === CONST_1.default.ATTACHMENT_PICKER_TYPE.IMAGE ? 'photo' : 'mixed';
    /**
     * See https://github.com/react-native-image-picker/react-native-image-picker/#options
     * for ImagePicker configuration options
     */
    return {
        mediaType,
        includeBase64: false,
        saveToPhotos: false,
        includeExtra: false,
        assetRepresentationMode: 'current',
        selectionLimit: fileLimit,
    };
};
/**
 * The data returned from `show` is different on web and mobile, so use this function to ensure the data we
 * send to the xhr will be handled properly.
 */
const getDataForUpload = (fileData) => {
    const fileName = fileData.name || 'chat_attachment';
    const fileResult = {
        name: (0, FileUtils_1.cleanFileName)(fileName),
        type: fileData.type,
        width: fileData.width,
        height: fileData.height,
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
/**
 * This component renders a function as a child and
 * returns a "show attachment picker" method that takes
 * a callback. This is the ios/android implementation
 * opening a modal with attachment options
 */
function AttachmentPicker({ type = CONST_1.default.ATTACHMENT_PICKER_TYPE.FILE, children, shouldHideCameraOption = false, shouldValidateImage = true, shouldHideGalleryOption = false, fileLimit = 1, onOpenPicker, }) {
    const styles = (0, useThemeStyles_1.default)();
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const StyleUtils = (0, useStyleUtils_1.default)();
    const theme = (0, useTheme_1.default)();
    const completeAttachmentSelection = (0, react_1.useRef)(() => { });
    const onModalHide = (0, react_1.useRef)(undefined);
    const onCanceled = (0, react_1.useRef)(() => { });
    const onClosed = (0, react_1.useRef)(() => { });
    const popoverRef = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    /**
     * A generic handling when we don't know the exact reason for an error
     */
    const showGeneralAlert = (0, react_1.useCallback)((message = translate('attachmentPicker.errorWhileSelectingAttachment')) => {
        react_native_1.Alert.alert(translate('attachmentPicker.attachmentError'), message);
    }, [translate]);
    /**
     * Common image picker handling
     *
     * @param {function} imagePickerFunc - RNImagePicker.launchCamera or RNImagePicker.launchImageLibrary
     */
    const showImagePicker = (0, react_1.useCallback)((imagePickerFunc) => new Promise((resolve, reject) => {
        imagePickerFunc(getImagePickerOptions(type, fileLimit), (response) => {
            if (response.didCancel) {
                // When the user cancelled resolve with no attachment
                return resolve();
            }
            if (response.errorCode) {
                switch (response.errorCode) {
                    case 'permission':
                        (0, FileUtils_1.showCameraPermissionsAlert)();
                        return resolve();
                    default:
                        showGeneralAlert();
                        break;
                }
                return reject(new Error(`Error during attachment selection: ${response.errorMessage}`));
            }
            const assets = response.assets;
            if (!assets || assets.length === 0) {
                return resolve();
            }
            const processedAssets = [];
            let processedCount = 0;
            const checkAllProcessed = () => {
                processedCount++;
                if (processedCount === assets.length) {
                    resolve(processedAssets.length > 0 ? processedAssets : undefined);
                }
            };
            assets.forEach((asset) => {
                if (!asset.uri) {
                    checkAllProcessed();
                    return;
                }
                if (asset.type?.startsWith('image')) {
                    (0, FileUtils_1.verifyFileFormat)({ fileUri: asset.uri, formatSignatures: CONST_1.default.HEIC_SIGNATURES })
                        .then((isHEIC) => {
                        // react-native-image-picker incorrectly changes file extension without transcoding the HEIC file, so we are doing it manually if we detect HEIC signature
                        if (isHEIC && asset.uri) {
                            expo_image_manipulator_1.ImageManipulator.manipulate(asset.uri)
                                .renderAsync()
                                .then((manipulatedImage) => manipulatedImage.saveAsync({ format: expo_image_manipulator_1.SaveFormat.JPEG }))
                                .then((manipulationResult) => {
                                const uri = manipulationResult.uri;
                                const convertedAsset = {
                                    uri,
                                    name: uri
                                        .substring(uri.lastIndexOf('/') + 1)
                                        .split('?')
                                        .at(0),
                                    type: 'image/jpeg',
                                    width: manipulationResult.width,
                                    height: manipulationResult.height,
                                };
                                processedAssets.push(convertedAsset);
                                checkAllProcessed();
                            })
                                .catch((error) => {
                                showGeneralAlert(error.message ?? 'An unknown error occurred');
                                checkAllProcessed();
                            });
                        }
                        else {
                            processedAssets.push(asset);
                            checkAllProcessed();
                        }
                    })
                        .catch((error) => {
                        showGeneralAlert(error.message ?? 'An unknown error occurred');
                        checkAllProcessed();
                    });
                }
                else {
                    processedAssets.push(asset);
                    checkAllProcessed();
                }
            });
        });
    }), [fileLimit, showGeneralAlert, type]);
    /**
     * Launch the DocumentPicker. Results are in the same format as ImagePicker
     */
    // eslint-disable-next-line @lwc/lwc/no-async-await
    const showDocumentPicker = (0, react_1.useCallback)(async () => {
        const pickedFiles = await (0, picker_1.pick)({
            type: [type === CONST_1.default.ATTACHMENT_PICKER_TYPE.IMAGE ? picker_1.types.images : picker_1.types.allFiles],
            allowMultiSelection: fileLimit !== 1,
        });
        const localCopies = await (0, picker_1.keepLocalCopy)({
            files: pickedFiles.map((file) => {
                return {
                    uri: file.uri,
                    fileName: file.name ?? '',
                };
            }),
            destination: 'cachesDirectory',
        });
        return pickedFiles.map((file) => {
            const localCopy = localCopies.find((copy) => copy.sourceUri === file.uri);
            if (!localCopy || localCopy.status !== 'success') {
                throw new Error("Couldn't create local file copy");
            }
            return {
                name: file.name,
                uri: localCopy.localUri,
                size: file.size,
                type: file.type,
            };
        });
    }, [fileLimit, type]);
    const menuItemData = (0, react_1.useMemo)(() => {
        const data = [
            {
                icon: Expensicons.Paperclip,
                textTranslationKey: 'attachmentPicker.chooseDocument',
                pickAttachment: showDocumentPicker,
            },
        ];
        if (!shouldHideGalleryOption) {
            data.unshift({
                icon: Expensicons.Gallery,
                textTranslationKey: 'attachmentPicker.chooseFromGallery',
                pickAttachment: () => showImagePicker(react_native_image_picker_1.launchImageLibrary),
            });
        }
        if (!shouldHideCameraOption) {
            data.unshift({
                icon: Expensicons.Camera,
                textTranslationKey: 'attachmentPicker.takePhoto',
                pickAttachment: () => showImagePicker(launchCamera_1.default),
            });
        }
        return data;
    }, [showDocumentPicker, shouldHideGalleryOption, shouldHideCameraOption, showImagePicker]);
    const [focusedIndex, setFocusedIndex] = (0, useArrowKeyFocusManager_1.default)({ initialFocusedIndex: -1, maxIndex: menuItemData.length - 1, isActive: isVisible });
    /**
     * An attachment error dialog when user selected malformed images
     */
    const showImageCorruptionAlert = (0, react_1.useCallback)(() => {
        react_native_1.Alert.alert(translate('attachmentPicker.attachmentError'), translate('attachmentPicker.errorWhileSelectingCorruptedAttachment'));
    }, [translate]);
    /**
     * Opens the attachment modal
     *
     * @param onPickedHandler A callback that will be called with the selected attachment
     * @param onCanceledHandler A callback that will be called without a selected attachment
     */
    const open = (onPickedHandler, onCanceledHandler = () => { }, onClosedHandler = () => { }) => {
        // eslint-disable-next-line react-compiler/react-compiler
        completeAttachmentSelection.current = onPickedHandler;
        onCanceled.current = onCanceledHandler;
        onClosed.current = onClosedHandler;
        setIsVisible(true);
    };
    /**
     * Closes the attachment modal
     */
    const close = () => {
        setIsVisible(false);
    };
    /**
     * Handles the image/document picker result and
     * sends the selected attachment to the caller (parent component)
     */
    const pickAttachment = (0, react_1.useCallback)((attachments = []) => {
        if (!attachments || attachments.length === 0) {
            onCanceled.current();
            return Promise.resolve();
        }
        const filesToProcess = attachments.map((fileData) => {
            if (!fileData) {
                return Promise.resolve(null);
            }
            /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
            const fileDataName = ('fileName' in fileData && fileData.fileName) || ('name' in fileData && fileData.name) || '';
            const fileDataUri = ('uri' in fileData && fileData.uri) || '';
            const fileDataObject = {
                name: fileDataName ?? '',
                uri: fileDataUri,
                size: ('size' in fileData && fileData.size) || ('fileSize' in fileData && fileData.fileSize) || null,
                type: fileData.type ?? '',
                width: ('width' in fileData && fileData.width) || undefined,
                height: ('height' in fileData && fileData.height) || undefined,
            };
            if (!shouldValidateImage && fileDataName && expensify_common_1.Str.isImage(fileDataName)) {
                return getDataForUpload(fileDataObject)
                    .then((file) => (0, FileUtils_1.resizeImageIfNeeded)(file))
                    .then((resizedFile) => react_native_image_size_1.default.getSize(resizedFile.uri ?? '').then(({ width, height }) => ({
                    ...resizedFile,
                    width,
                    height,
                })))
                    .catch(() => {
                    showImageCorruptionAlert();
                    return null;
                });
            }
            if (fileDataName && expensify_common_1.Str.isImage(fileDataName)) {
                return getDataForUpload(fileDataObject)
                    .then((file) => (0, FileUtils_1.resizeImageIfNeeded)(file))
                    .then((resizedFile) => react_native_image_size_1.default.getSize(resizedFile.uri ?? '').then(({ width, height }) => {
                    if (width <= 0 || height <= 0) {
                        showImageCorruptionAlert();
                        return null;
                    }
                    return {
                        ...resizedFile,
                        width,
                        height,
                    };
                }))
                    .catch(() => {
                    showImageCorruptionAlert();
                    return null;
                });
            }
            return getDataForUpload(fileDataObject).catch((error) => {
                showGeneralAlert(error.message);
                return null;
            });
        });
        return Promise.all(filesToProcess)
            .then((results) => {
            const validResults = results.filter((result) => result !== null);
            if (validResults.length > 0) {
                completeAttachmentSelection.current(validResults);
            }
            else {
                onCanceled.current();
            }
        })
            .catch((error) => {
            if (error instanceof Error) {
                showGeneralAlert(error.message);
            }
            else {
                showGeneralAlert('An unknown error occurred');
            }
        });
    }, [shouldValidateImage, showGeneralAlert, showImageCorruptionAlert]);
    /**
     * Setup native attachment selection to start after this popover closes
     *
     * @param {Object} item - an item from this.menuItemData
     * @param {Function} item.pickAttachment
     */
    const selectItem = (0, react_1.useCallback)((item) => {
        onOpenPicker?.();
        /* setTimeout delays execution to the frame after the modal closes
         * without this on iOS closing the modal closes the gallery/camera as well */
        onModalHide.current = () => {
            setTimeout(() => {
                item.pickAttachment()
                    .catch((error) => {
                    if (JSON.stringify(error).includes('OPERATION_CANCELED')) {
                        return;
                    }
                    showGeneralAlert(error.message);
                    throw error;
                })
                    .then((result) => pickAttachment(result))
                    .catch(console.error)
                    .finally(() => {
                    onClosed.current();
                    delete onModalHide.current;
                });
            }, 200);
        };
        close();
    }, [onOpenPicker, pickAttachment, showGeneralAlert]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ENTER, () => {
        if (focusedIndex === -1) {
            return;
        }
        const item = menuItemData.at(focusedIndex);
        if (item) {
            selectItem(item);
            setFocusedIndex(-1); // Reset the focusedIndex on selecting any menu
        }
    }, {
        isActive: isVisible,
    });
    /**
     * Call the `children` renderProp with the interface defined in propTypes
     */
    const renderChildren = () => children({
        openPicker: ({ onPicked, onCanceled: newOnCanceled, onClosed: newOnClosed }) => open(onPicked, newOnCanceled, newOnClosed),
    });
    return (<>
            <Popover_1.default onClose={() => {
            close();
            onCanceled.current();
        }} isVisible={isVisible} anchorRef={popoverRef} 
    // eslint-disable-next-line react-compiler/react-compiler
    onModalHide={() => onModalHide.current?.()}>
                <react_native_1.View style={!shouldUseNarrowLayout && styles.createMenuContainer}>
                    {menuItemData.map((item, menuIndex) => (<MenuItem_1.default key={item.textTranslationKey} icon={item.icon} title={translate(item.textTranslationKey)} onPress={() => selectItem(item)} focused={focusedIndex === menuIndex} wrapperStyle={StyleUtils.getItemBackgroundColorStyle(false, focusedIndex === menuIndex, false, theme.activeComponentBG, theme.hoverComponentBG)}/>))}
                </react_native_1.View>
            </Popover_1.default>
            {/* eslint-disable-next-line react-compiler/react-compiler */}
            {renderChildren()}
        </>);
}
AttachmentPicker.displayName = 'AttachmentPicker';
exports.default = AttachmentPicker;
