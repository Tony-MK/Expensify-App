"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_blob_util_1 = require("react-native-blob-util");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ImportSpreadsheet_1 = require("@libs/actions/ImportSpreadsheet");
var Tag_1 = require("@libs/actions/Policy/Tag");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var CONST_1 = require("@src/CONST");
var Button_1 = require("./Button");
var ConfirmModal_1 = require("./ConfirmModal");
var Consumer_1 = require("./DragAndDrop/Consumer");
var Provider_1 = require("./DragAndDrop/Provider");
var FilePicker_1 = require("./FilePicker");
var HeaderWithBackButton_1 = require("./HeaderWithBackButton");
var Expensicons = require("./Icon/Expensicons");
var ImageSVG_1 = require("./ImageSVG");
var RenderHTML_1 = require("./RenderHTML");
var ScreenWrapper_1 = require("./ScreenWrapper");
var Text_1 = require("./Text");
function ImportSpreadsheet(_a) {
    var backTo = _a.backTo, goTo = _a.goTo, isImportingMultiLevelTags = _a.isImportingMultiLevelTags;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _b = (0, react_1.useState)(false), isReadingFile = _b[0], setIsReadingFile = _b[1];
    var _c = (0, react_1.useState)(0), fileTopPosition = _c[0], setFileTopPosition = _c[1];
    var _d = (0, react_1.useState)(false), isAttachmentInvalid = _d[0], setIsAttachmentInvalid = _d[1];
    var _e = (0, react_1.useState)(), attachmentInvalidReasonTitle = _e[0], setAttachmentInvalidReasonTitle = _e[1];
    var _f = (0, react_1.useState)(), attachmentInvalidReason = _f[0], setAttachmentValidReason = _f[1];
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use different copies depending on the screen size
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    var _g = (0, react_1.useState)(false), isDraggingOver = _g[0], setIsDraggingOver = _g[1];
    var panResponder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onPanResponderTerminationRequest: function () { return false; },
    })).current;
    var setUploadFileError = function (isInvalid, title, reason) {
        setIsAttachmentInvalid(isInvalid);
        setAttachmentInvalidReasonTitle(title);
        setAttachmentValidReason(reason);
    };
    var validateFile = function (file) {
        var _a, _b;
        var fileExtension = (0, FileUtils_1.splitExtensionFromFileName)((_a = file === null || file === void 0 ? void 0 : file.name) !== null && _a !== void 0 ? _a : '').fileExtension;
        if (!CONST_1.default.ALLOWED_SPREADSHEET_EXTENSIONS.includes(fileExtension.toLowerCase())) {
            setUploadFileError(true, 'attachmentPicker.wrongFileType', 'attachmentPicker.notAllowedExtension');
            return false;
        }
        if (((_b = file === null || file === void 0 ? void 0 : file.size) !== null && _b !== void 0 ? _b : 0) <= 0) {
            setUploadFileError(true, 'attachmentPicker.attachmentTooSmall', 'spreadsheet.sizeNotMet');
            return false;
        }
        return true;
    };
    var readFile = function (file) {
        var _a, _b;
        if (!validateFile(file)) {
            return;
        }
        var fileURI = (_a = file.uri) !== null && _a !== void 0 ? _a : URL.createObjectURL(file);
        if (!fileURI) {
            return;
        }
        if (react_native_1.Platform.OS === 'ios') {
            fileURI = fileURI.replace(/^.*\/Documents\//, "".concat(react_native_blob_util_1.default.fs.dirs.DocumentDir, "/"));
        }
        var fileExtension = (0, FileUtils_1.splitExtensionFromFileName)((_b = file === null || file === void 0 ? void 0 : file.name) !== null && _b !== void 0 ? _b : '').fileExtension;
        var shouldReadAsText = CONST_1.default.TEXT_SPREADSHEET_EXTENSIONS.includes(fileExtension);
        setIsReadingFile(true);
        Promise.resolve().then(function () { return require('xlsx'); }).then(function (XLSX) {
            var readWorkbook = function () {
                if (shouldReadAsText) {
                    return fetch(fileURI)
                        .then(function (data) {
                        return data.text();
                    })
                        .then(function (text) { return XLSX.read(text, { type: 'string' }); });
                }
                return fetch(fileURI)
                    .then(function (data) {
                    return data.arrayBuffer();
                })
                    .then(function (arrayBuffer) { return XLSX.read(new Uint8Array(arrayBuffer), { type: 'buffer' }); });
            };
            readWorkbook()
                .then(function (workbook) {
                var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                var data = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
                var formattedSpreadsheetData = data.map(function (row) { return row.map(function (cell) { return String(cell); }); });
                (0, ImportSpreadsheet_1.setSpreadsheetData)(formattedSpreadsheetData, fileURI, file.type, file.name, isImportingMultiLevelTags !== null && isImportingMultiLevelTags !== void 0 ? isImportingMultiLevelTags : false)
                    .then(function () {
                    Navigation_1.default.navigate(goTo);
                })
                    .catch(function () {
                    setUploadFileError(true, 'spreadsheet.importFailedTitle', 'spreadsheet.invalidFileMessage');
                });
            })
                .finally(function () {
                setIsReadingFile(false);
            });
        })
            .catch(function (error) {
            console.error('Failed to load XLSX library:', error);
            setUploadFileError(true, 'spreadsheet.importFailedTitle', 'spreadsheet.importSpreadsheetLibraryError');
            setIsReadingFile(false);
        });
    };
    var getTextForImportModal = function () {
        var text = '';
        if (isImportingMultiLevelTags) {
            text = isSmallScreenWidth ? translate('spreadsheet.chooseSpreadsheetMultiLevelTag') : translate('spreadsheet.dragAndDropMultiLevelTag');
        }
        else {
            text = isSmallScreenWidth ? translate('spreadsheet.chooseSpreadsheet') : translate('spreadsheet.dragAndDrop');
        }
        return text;
    };
    var acceptableFileTypes = isImportingMultiLevelTags
        ? CONST_1.default.MULTILEVEL_TAG_ALLOWED_SPREADSHEET_EXTENSIONS.map(function (extension) { return ".".concat(extension); }).join(',')
        : CONST_1.default.ALLOWED_SPREADSHEET_EXTENSIONS.map(function (extension) { return ".".concat(extension); }).join(',');
    var desktopView = (<>
            <react_native_1.View onLayout={function (_a) {
        var nativeEvent = _a.nativeEvent;
        return setFileTopPosition(react_native_1.PixelRatio.roundToNearestPixel(nativeEvent.layout.top));
    }}>
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
                {function (_a) {
            var openPicker = _a.openPicker;
            return (<Button_1.default success text={translate('common.chooseFile')} accessibilityLabel={translate('common.chooseFile')} style={[styles.pt9]} isLoading={isReadingFile} onPress={function () {
                    openPicker({
                        onPicked: function (file) {
                            readFile(file);
                        },
                    });
                }}/>);
        }}
            </FilePicker_1.default>
        </>);
    var hideInvalidAttachmentModal = function () {
        setIsAttachmentInvalid(false);
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} testID={ImportSpreadsheet.displayName} shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} headerGapStyles={isDraggingOver ? [styles.isDraggingOver] : []}>
            {function (_a) {
            var safeAreaPaddingBottomStyle = _a.safeAreaPaddingBottomStyle;
            return (<Provider_1.default setIsDraggingOver={setIsDraggingOver}>
                    <react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                        <HeaderWithBackButton_1.default title={translate('spreadsheet.importSpreadsheet')} onBackButtonPress={function () {
                    if (isImportingMultiLevelTags) {
                        (0, Tag_1.setImportedSpreadsheetIsImportingMultiLevelTags)(false);
                    }
                    Navigation_1.default.goBack(backTo);
                }}/>

                        <react_native_1.View style={[styles.flex1, styles.uploadFileView(isSmallScreenWidth)]}>
                            {!(isDraggingOver !== null && isDraggingOver !== void 0 ? isDraggingOver : isDraggingOver) && desktopView}

                            <Consumer_1.default onDrop={function (e) {
                    var _a;
                    var file = (_a = e === null || e === void 0 ? void 0 : e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0];
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
                </Provider_1.default>);
        }}
        </ScreenWrapper_1.default>);
}
ImportSpreadsheet.displayName = 'ImportSpreadsheet';
exports.default = ImportSpreadsheet;
