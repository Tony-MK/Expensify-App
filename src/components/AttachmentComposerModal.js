"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_native_reanimated_1 = require("react-native-reanimated");
var useFilesValidation_1 = require("@hooks/useFilesValidation");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var CONST_1 = require("@src/CONST");
var viewRef_1 = require("@src/types/utils/viewRef");
var AttachmentCarouselView_1 = require("./Attachments/AttachmentCarousel/AttachmentCarouselView");
var useCarouselArrows_1 = require("./Attachments/AttachmentCarousel/useCarouselArrows");
var useAttachmentErrors_1 = require("./Attachments/AttachmentView/useAttachmentErrors");
var Button_1 = require("./Button");
var HeaderGap_1 = require("./HeaderGap");
var HeaderWithBackButton_1 = require("./HeaderWithBackButton");
var Modal_1 = require("./Modal");
var SafeAreaConsumer_1 = require("./SafeAreaConsumer");
function AttachmentComposerModal(_a) {
    var onConfirm = _a.onConfirm, _b = _a.onModalShow, onModalShow = _b === void 0 ? function () { } : _b, _c = _a.onModalHide, onModalHide = _c === void 0 ? function () { } : _c, headerTitle = _a.headerTitle, children = _a.children, _d = _a.shouldDisableSendButton, shouldDisableSendButton = _d === void 0 ? false : _d, report = _a.report;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var _e = (0, useAttachmentErrors_1.default)(), setAttachmentError = _e.setAttachmentError, clearAttachmentErrors = _e.clearAttachmentErrors;
    var _f = (0, useCarouselArrows_1.default)(), shouldShowArrows = _f.shouldShowArrows, setShouldShowArrows = _f.setShouldShowArrows, autoHideArrows = _f.autoHideArrows, cancelAutoHideArrows = _f.cancelAutoHideArrows;
    var _g = (0, react_1.useState)(false), isModalOpen = _g[0], setIsModalOpen = _g[1];
    var _h = (0, react_1.useState)(CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE), modalType = _h[0], setModalType = _h[1];
    var _j = (0, react_1.useState)([]), validFilesToUpload = _j[0], setValidFilesToUpload = _j[1];
    var _k = (0, react_1.useState)([]), attachments = _k[0], setAttachments = _k[1];
    var _l = (0, react_1.useState)(0), page = _l[0], setPage = _l[1];
    var _m = (0, react_1.useState)(null), currentAttachment = _m[0], setCurrentAttachment = _m[1];
    /**
     * If our attachment is a PDF, return the unswipeable Modal type.
     */
    var getModalType = (0, react_1.useCallback)(function (sourceURL, fileObject) {
        var _a;
        var fileName = (_a = fileObject === null || fileObject === void 0 ? void 0 : fileObject.name) !== null && _a !== void 0 ? _a : translate('attachmentView.unknownFilename');
        return sourceURL && (sourceURL.includes('.pdf') || fileName.includes('.pdf')) ? CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE : CONST_1.default.MODAL.MODAL_TYPE.CENTERED;
    }, [translate]);
    /**
     * Execute the onConfirm callback and close the modal.
     */
    var submitAndClose = (0, react_1.useCallback)(function () {
        var _a;
        // If the modal has already been closed
        if (!isModalOpen) {
            return;
        }
        if (onConfirm) {
            if (validFilesToUpload.length) {
                onConfirm(validFilesToUpload);
            }
            else if (currentAttachment) {
                onConfirm((_a = currentAttachment.file) !== null && _a !== void 0 ? _a : currentAttachment);
            }
        }
        setIsModalOpen(false);
    }, [isModalOpen, onConfirm, validFilesToUpload, currentAttachment]);
    /**
     * Sanitizes file names and ensures proper URI references for file system compatibility
     */
    var cleanFileObjectName = (0, react_1.useCallback)(function (fileObject) {
        if (fileObject instanceof File) {
            var cleanName = (0, FileUtils_1.cleanFileName)(fileObject.name);
            if (fileObject.name !== cleanName) {
                var updatedFile = new File([fileObject], cleanName, { type: fileObject.type });
                var inputSource = URL.createObjectURL(updatedFile);
                updatedFile.uri = inputSource;
                return updatedFile;
            }
            if (!fileObject.uri) {
                var inputSource = URL.createObjectURL(fileObject);
                // eslint-disable-next-line no-param-reassign
                fileObject.uri = inputSource;
            }
        }
        return fileObject;
    }, []);
    var convertFileToAttachment = (0, react_1.useCallback)(function (fileObject, source) {
        return {
            source: source,
            file: fileObject,
        };
    }, []);
    (0, react_1.useEffect)(function () {
        var _a;
        if (!validFilesToUpload.length) {
            return;
        }
        if (validFilesToUpload.length > 0) {
            // Convert all files to attachments
            var newAttachments = validFilesToUpload.map(function (fileObject) {
                var _a;
                var source = (_a = fileObject.uri) !== null && _a !== void 0 ? _a : '';
                return convertFileToAttachment(fileObject, source);
            });
            var firstAttachment = (_a = newAttachments.at(0)) !== null && _a !== void 0 ? _a : null;
            setAttachments(newAttachments);
            setCurrentAttachment(firstAttachment);
            setPage(0);
            if (firstAttachment === null || firstAttachment === void 0 ? void 0 : firstAttachment.file) {
                var inputModalType = getModalType(firstAttachment.source, firstAttachment.file);
                setModalType(inputModalType);
            }
            setIsModalOpen(true);
        }
    }, [validFilesToUpload, convertFileToAttachment, getModalType]);
    var _o = (0, useFilesValidation_1.default)(setValidFilesToUpload, false), ErrorModal = _o.ErrorModal, validateFiles = _o.validateFiles, PDFValidationComponent = _o.PDFValidationComponent;
    var validateAndDisplayMultipleFilesToUpload = (0, react_1.useCallback)(function (data, items) {
        if (!(data === null || data === void 0 ? void 0 : data.length)) {
            return;
        }
        var validIndices = [];
        var fileObjects = data
            .map(function (item, index) {
            var fileObject = item;
            if ('getAsFile' in item && typeof item.getAsFile === 'function') {
                fileObject = item.getAsFile();
            }
            var cleanedFileObject = cleanFileObjectName(fileObject);
            if (cleanedFileObject !== null) {
                validIndices.push(index);
            }
            return cleanedFileObject;
        })
            .filter(function (fileObject) { return fileObject !== null; });
        if (!fileObjects.length) {
            return;
        }
        // Create a filtered items array that matches the fileObjects
        var filteredItems = items && validIndices.length > 0 ? validIndices.map(function (index) { var _a; return (_a = items.at(index)) !== null && _a !== void 0 ? _a : {}; }) : undefined;
        validateFiles(fileObjects, filteredItems);
    }, [cleanFileObjectName, validateFiles]);
    var closeModal = (0, react_1.useCallback)(function () {
        setIsModalOpen(false);
    }, []);
    var openModal = (0, react_1.useCallback)(function () {
        setIsModalOpen(true);
    }, []);
    var headerTitleNew = headerTitle !== null && headerTitle !== void 0 ? headerTitle : translate('reportActionCompose.sendAttachment');
    var submitRef = (0, react_1.useRef)(null);
    return (<>
            {PDFValidationComponent}
            <Modal_1.default type={modalType} onClose={closeModal} isVisible={isModalOpen} onModalShow={function () {
            onModalShow();
        }} onModalHide={function () {
            onModalHide();
            clearAttachmentErrors();
            setValidFilesToUpload([]);
            setAttachments([]);
            setCurrentAttachment(null);
            setPage(0);
        }} propagateSwipe initialFocus={function () {
            if (!submitRef.current) {
                return false;
            }
            return submitRef.current;
        }} shouldHandleNavigationBack>
                <react_native_gesture_handler_1.GestureHandlerRootView style={styles.flex1}>
                    {shouldUseNarrowLayout && <HeaderGap_1.default />}
                    <HeaderWithBackButton_1.default shouldMinimizeMenuButton title={headerTitleNew} shouldShowBorderBottom shouldShowCloseButton={!shouldUseNarrowLayout} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={closeModal} onCloseButtonPress={closeModal} shouldSetModalVisibility={false} shouldDisplayHelpButton={false}/>
                    {attachments.length > 0 && !!currentAttachment && (<AttachmentCarouselView_1.default attachments={attachments} source={currentAttachment.source} page={page} setPage={setPage} onClose={closeModal} autoHideArrows={autoHideArrows} cancelAutoHideArrow={cancelAutoHideArrows} setShouldShowArrows={setShouldShowArrows} onAttachmentError={setAttachmentError} shouldShowArrows={shouldShowArrows} report={report}/>)}
                    <react_native_reanimated_1.LayoutAnimationConfig skipEntering>
                        {(validFilesToUpload.length > 0 || !!currentAttachment) && (<SafeAreaConsumer_1.default>
                                {function (_a) {
                var safeAreaPaddingBottomStyle = _a.safeAreaPaddingBottomStyle;
                return (<react_native_reanimated_1.default.View style={safeAreaPaddingBottomStyle} entering={react_native_reanimated_1.FadeIn}>
                                        <Button_1.default ref={(0, viewRef_1.default)(submitRef)} success large style={[styles.buttonConfirm, shouldUseNarrowLayout ? {} : styles.attachmentButtonBigScreen]} textStyles={[styles.buttonConfirmText]} text={translate('common.send')} onPress={submitAndClose} isDisabled={shouldDisableSendButton} pressOnEnter/>
                                    </react_native_reanimated_1.default.View>);
            }}
                            </SafeAreaConsumer_1.default>)}
                    </react_native_reanimated_1.LayoutAnimationConfig>
                </react_native_gesture_handler_1.GestureHandlerRootView>
            </Modal_1.default>
            {children === null || children === void 0 ? void 0 : children({
            displayFilesInModal: validateAndDisplayMultipleFilesToUpload,
            show: openModal,
        })}
            {ErrorModal}
        </>);
}
AttachmentComposerModal.displayName = 'AttachmentComposerModal';
exports.default = (0, react_1.memo)(AttachmentComposerModal);
