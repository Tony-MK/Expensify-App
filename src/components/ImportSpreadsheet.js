"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_blob_util_1 = require("react-native-blob-util");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ImportSpreadsheet_1 = require("@libs/actions/ImportSpreadsheet");
const Tag_1 = require("@libs/actions/Policy/Tag");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const Button_1 = require("./Button");
const ConfirmModal_1 = require("./ConfirmModal");
const Consumer_1 = require("./DragAndDrop/Consumer");
const Provider_1 = require("./DragAndDrop/Provider");
const FilePicker_1 = require("./FilePicker");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const Expensicons = require("./Icon/Expensicons");
const ImageSVG_1 = require("./ImageSVG");
const RenderHTML_1 = require("./RenderHTML");
const ScreenWrapper_1 = require("./ScreenWrapper");
const Text_1 = require("./Text");
function ImportSpreadsheet({ backTo, goTo, isImportingMultiLevelTags }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isReadingFile, setIsReadingFile] = (0, react_1.useState)(false);
    const [fileTopPosition, setFileTopPosition] = (0, react_1.useState)(0);
    const [isAttachmentInvalid, setIsAttachmentInvalid] = (0, react_1.useState)(false);
    const [attachmentInvalidReasonTitle, setAttachmentInvalidReasonTitle] = (0, react_1.useState)();
    const [attachmentInvalidReason, setAttachmentValidReason] = (0, react_1.useState)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use different copies depending on the screen size
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [isDraggingOver, setIsDraggingOver] = (0, react_1.useState)(false);
    const panResponder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onPanResponderTerminationRequest: () => false,
    })).current;
    const setUploadFileError = (isInvalid, title, reason) => {
        setIsAttachmentInvalid(isInvalid);
        setAttachmentInvalidReasonTitle(title);
        setAttachmentValidReason(reason);
    };
    const validateFile = (file) => {
        const { fileExtension } = (0, FileUtils_1.splitExtensionFromFileName)(file?.name ?? '');
        if (!CONST_1.default.ALLOWED_SPREADSHEET_EXTENSIONS.includes(fileExtension.toLowerCase())) {
            setUploadFileError(true, 'attachmentPicker.wrongFileType', 'attachmentPicker.notAllowedExtension');
            return false;
        }
        if ((file?.size ?? 0) <= 0) {
            setUploadFileError(true, 'attachmentPicker.attachmentTooSmall', 'spreadsheet.sizeNotMet');
            return false;
        }
        return true;
    };
    const readFile = (file) => {
        if (!validateFile(file)) {
            return;
        }
        let fileURI = file.uri ?? URL.createObjectURL(file);
        if (!fileURI) {
            return;
        }
        if (react_native_1.Platform.OS === 'ios') {
            fileURI = fileURI.replace(/^.*\/Documents\//, `${react_native_blob_util_1.default.fs.dirs.DocumentDir}/`);
        }
        const { fileExtension } = (0, FileUtils_1.splitExtensionFromFileName)(file?.name ?? '');
        const shouldReadAsText = CONST_1.default.TEXT_SPREADSHEET_EXTENSIONS.includes(fileExtension);
        setIsReadingFile(true);
        Promise.resolve().then(() => require('xlsx')).then((XLSX) => {
            const readWorkbook = () => {
                if (shouldReadAsText) {
                    return fetch(fileURI)
                        .then((data) => {
                        return data.text();
                    })
                        .then((text) => XLSX.read(text, { type: 'string' }));
                }
                return fetch(fileURI)
                    .then((data) => {
                    return data.arrayBuffer();
                })
                    .then((arrayBuffer) => XLSX.read(new Uint8Array(arrayBuffer), { type: 'buffer' }));
            };
            readWorkbook()
                .then((workbook) => {
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
                const formattedSpreadsheetData = data.map((row) => row.map((cell) => String(cell)));
                (0, ImportSpreadsheet_1.setSpreadsheetData)(formattedSpreadsheetData, fileURI, file.type, file.name, isImportingMultiLevelTags ?? false)
                    .then(() => {
                    Navigation_1.default.navigate(goTo);
                })
                    .catch(() => {
                    setUploadFileError(true, 'spreadsheet.importFailedTitle', 'spreadsheet.invalidFileMessage');
                });
            })
                .finally(() => {
                setIsReadingFile(false);
            });
        })
            .catch((error) => {
            console.error('Failed to load XLSX library:', error);
            setUploadFileError(true, 'spreadsheet.importFailedTitle', 'spreadsheet.importSpreadsheetLibraryError');
            setIsReadingFile(false);
        });
    };
    const getTextForImportModal = () => {
        let text = '';
        if (isImportingMultiLevelTags) {
            text = isSmallScreenWidth ? translate('spreadsheet.chooseSpreadsheetMultiLevelTag') : translate('spreadsheet.dragAndDropMultiLevelTag');
        }
        else {
            text = isSmallScreenWidth ? translate('spreadsheet.chooseSpreadsheet') : translate('spreadsheet.dragAndDrop');
        }
        return text;
    };
    const acceptableFileTypes = isImportingMultiLevelTags
        ? CONST_1.default.MULTILEVEL_TAG_ALLOWED_SPREADSHEET_EXTENSIONS.map((extension) => `.${extension}`).join(',')
        : CONST_1.default.ALLOWED_SPREADSHEET_EXTENSIONS.map((extension) => `.${extension}`).join(',');
    const desktopView = (<>
            <react_native_1.View onLayout={({ nativeEvent }) => setFileTopPosition(react_native_1.PixelRatio.roundToNearestPixel(nativeEvent.layout.top))}>
                <ImageSVG_1.default src={Expensicons.SpreadsheetComputer} contentFit="contain" style={styles.mb4} width={CONST_1.default.IMPORT_SPREADSHEET.ICON_WIDTH} height={CONST_1.default.IMPORT_SPREADSHEET.ICON_HEIGHT}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.uploadFileViewTextContainer, styles.userSelectNone]} 
    // eslint-disable-next-line react-compiler/react-compiler, react/jsx-props-no-spreading
    {...panResponder.panHandlers}>
                <Text_1.default style={[styles.textFileUpload, styles.mb1]}>{isImportingMultiLevelTags ? translate('spreadsheet.import') : translate('spreadsheet.upload')}</Text_1.default>
                <react_native_1.View style={[styles.flexRow]}>
                    <RenderHTML_1.default html={getTextForImportModal()}/>
                </react_native_1.View>
            </react_native_1.View>
            <FilePicker_1.default acceptableFileTypes={acceptableFileTypes}>
                {({ openPicker }) => (<Button_1.default success text={translate('common.chooseFile')} accessibilityLabel={translate('common.chooseFile')} style={[styles.pt9]} isLoading={isReadingFile} onPress={() => {
                openPicker({
                    onPicked: (file) => {
                        readFile(file);
                    },
                });
            }}/>)}
            </FilePicker_1.default>
        </>);
    const hideInvalidAttachmentModal = () => {
        setIsAttachmentInvalid(false);
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} testID={ImportSpreadsheet.displayName} shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} headerGapStyles={isDraggingOver ? [styles.isDraggingOver] : []}>
            {({ safeAreaPaddingBottomStyle }) => (<Provider_1.default setIsDraggingOver={setIsDraggingOver}>
                    <react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                        <HeaderWithBackButton_1.default title={translate('spreadsheet.importSpreadsheet')} onBackButtonPress={() => {
                if (isImportingMultiLevelTags) {
                    (0, Tag_1.setImportedSpreadsheetIsImportingMultiLevelTags)(false);
                }
                Navigation_1.default.goBack(backTo);
            }}/>

                        <react_native_1.View style={[styles.flex1, styles.uploadFileView(isSmallScreenWidth)]}>
                            {!(isDraggingOver ?? isDraggingOver) && desktopView}

                            <Consumer_1.default onDrop={(e) => {
                const file = e?.dataTransfer?.files[0];
                if (file) {
                    readFile(file);
                }
            }}>
                                <react_native_1.View style={[styles.fileDropOverlay, styles.w100, styles.h100, styles.justifyContentCenter, styles.alignItemsCenter]}>
                                    <react_native_1.View style={styles.fileUploadImageWrapper(fileTopPosition)}>
                                        <ImageSVG_1.default src={Expensicons.SpreadsheetComputer} contentFit="contain" style={styles.mb4} width={CONST_1.default.IMPORT_SPREADSHEET.ICON_WIDTH} height={CONST_1.default.IMPORT_SPREADSHEET.ICON_HEIGHT}/>
                                        <Text_1.default style={[styles.textFileUpload]}>{translate('common.dropTitle')}</Text_1.default>
                                        <Text_1.default style={[styles.subTextFileUpload, styles.themeTextColor]}>{translate('common.dropMessage')}</Text_1.default>
                                    </react_native_1.View>
                                </react_native_1.View>
                            </Consumer_1.default>
                            <ConfirmModal_1.default title={attachmentInvalidReasonTitle ? translate(attachmentInvalidReasonTitle) : ''} onConfirm={hideInvalidAttachmentModal} onCancel={hideInvalidAttachmentModal} isVisible={isAttachmentInvalid} prompt={attachmentInvalidReason ? translate(attachmentInvalidReason) : ''} confirmText={translate('common.close')} shouldShowCancelButton={false} shouldHandleNavigationBack/>
                        </react_native_1.View>
                    </react_native_1.View>
                </Provider_1.default>)}
        </ScreenWrapper_1.default>);
}
ImportSpreadsheet.displayName = 'ImportSpreadsheet';
exports.default = ImportSpreadsheet;
